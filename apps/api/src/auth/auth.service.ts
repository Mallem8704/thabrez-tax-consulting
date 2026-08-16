import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserRole } from '@thabrez/db';
import bcrypt from 'bcryptjs';
import { authenticator } from 'otplib';
import * as qrcode from 'qrcode';

import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { LoginLockoutService } from './lockout.service';
import { LoginDto } from './dto/login.dto';
import { MfaVerifyDto } from './dto/mfa.dto';
import type { AuthenticatedUser } from './decorators/current-user.decorator';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export type LoginResponse =
  | {
      status: 'SUCCESS';
      tokens: AuthTokens;
      user: {
        id: string;
        email: string | null;
        phone: string | null;
        role: UserRole;
        mfaEnabled: boolean;
      };
    }
  | {
      status: 'MFA_REQUIRED';
      message: string;
      userId: string;
    }
  | {
      status: 'MFA_SETUP_REQUIRED';
      message: string;
      userId: string;
      mfaEnrollmentToken: string;
    };

const STAFF_ROLES = new Set<UserRole>([
  UserRole.ASSOCIATE,
  UserRole.SENIOR_CA,
  UserRole.ADMIN,
  UserRole.FRONT_DESK,
]);

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly lockoutService: LoginLockoutService,
    private readonly auditService: AuditService,
  ) {}

  /**
   * Main login flow:
   * 1. Check account lockout status (5 attempts / 10m -> 15m lock)
   * 2. Verify email & password
   * 3. For CLIENT -> Issue JWT access & refresh tokens immediately
   * 4. For STAFF -> Enforce mandatory TOTP MFA:
   *    - If MFA not enrolled -> Return MFA_SETUP_REQUIRED with temporary enrollment token
   *    - If MFA enrolled but code missing -> Return MFA_REQUIRED challenge
   *    - If MFA code provided -> Verify TOTP, issue tokens upon success
   */
  async login(dto: LoginDto): Promise<LoginResponse> {
    const email = dto.email.toLowerCase().trim();

    // 1. Rate-limiting & Lockout check
    const lockout = this.lockoutService.checkLockout(email);
    if (lockout.isLocked) {
      const minutesRemaining = Math.ceil(lockout.remainingLockMs / (60 * 1000));
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: `Account is temporarily locked due to multiple failed login attempts. Please try again in ${minutesRemaining} minute(s).`,
          lockedUntil: lockout.lockedUntil?.toISOString(),
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // 2. Fetch user
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { clientProfile: { select: { id: true } } },
    });

    if (!user || !user.passwordHash) {
      await this.lockoutService.recordFailedAttempt(email);
      throw new UnauthorizedException('Invalid email or password');
    }

    // Verify password hash
    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      const lockResult = await this.lockoutService.recordFailedAttempt(email, {
        id: user.id,
        email: user.email ?? email,
      });

      if (lockResult.isLocked) {
        throw new HttpException(
          {
            statusCode: HttpStatus.TOO_MANY_REQUESTS,
            message:
              'Account has been locked for 15 minutes due to 5 consecutive failed login attempts.',
            lockedUntil: lockResult.lockedUntil?.toISOString(),
          },
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }

      throw new UnauthorizedException(
        `Invalid email or password. ${lockResult.remainingAttempts} attempt(s) remaining before temporary lockout.`,
      );
    }

    const isStaff = STAFF_ROLES.has(user.role);

    // 3. Staff Mandatory MFA Handling
    if (isStaff) {
      // Staff must have MFA configured
      if (!user.mfaEnabled || !user.mfaSecret) {
        // Issue a short-lived temporary token for MFA enrollment
        const mfaEnrollmentToken = this.jwtService.sign(
          { sub: user.id, purpose: 'MFA_ENROLLMENT', role: user.role },
          { expiresIn: '15m' },
        );

        return {
          status: 'MFA_SETUP_REQUIRED',
          message:
            'MFA enrollment is mandatory for staff accounts. Please complete TOTP setup to continue.',
          userId: user.id,
          mfaEnrollmentToken,
        };
      }

      // If TOTP code was not supplied in login payload
      if (!dto.totpCode) {
        return {
          status: 'MFA_REQUIRED',
          message: 'Please provide your 6-digit TOTP authentication code.',
          userId: user.id,
        };
      }

      // Verify supplied TOTP code
      const isTotpValid = authenticator.check(dto.totpCode, user.mfaSecret);
      if (!isTotpValid) {
        const lockResult = await this.lockoutService.recordFailedAttempt(email, {
          id: user.id,
          email: user.email ?? email,
        });

        throw new UnauthorizedException(
          `Invalid MFA verification code. ${lockResult.remainingAttempts} attempt(s) remaining before lockout.`,
        );
      }
    }

    // 4. Successful login -> reset failed attempts and generate tokens
    this.lockoutService.reset(email);

    const tokens = this.generateTokens({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    // Record login in audit log
    await this.auditService.log({
      actorId: user.id,
      action: 'USER_LOGIN',
      entity: 'User',
      entityId: user.id,
      metadata: { role: user.role, mfaVerified: isStaff && user.mfaEnabled },
    });

    return {
      status: 'SUCCESS',
      tokens,
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        role: user.role,
        mfaEnabled: user.mfaEnabled,
      },
    };
  }

  /**
   * Generates a new TOTP secret and QR code for MFA enrollment.
   */
  async generateMfaSecret(userId: string): Promise<{
    secret: string;
    qrCode: string;
    otpauthUrl: string;
  }> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException(`User ${userId} not found`);

    const secret = authenticator.generateSecret();
    const serviceName = 'Thabrez Tax Consulting';
    const accountName = user.email || user.phone || `user_${user.id}`;
    const otpauthUrl = authenticator.keyuri(accountName, serviceName, secret);

    const qrCode = await qrcode.toDataURL(otpauthUrl);

    return {
      secret,
      qrCode,
      otpauthUrl,
    };
  }

  /**
   * Verifies the TOTP code and activates MFA on the user account.
   */
  async verifyAndEnableMfa(
    userId: string,
    dto: MfaVerifyDto,
  ): Promise<{ success: boolean; message: string }> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException(`User ${userId} not found`);

    const isValid = authenticator.check(dto.code, dto.secret);
    if (!isValid) {
      throw new BadRequestException(
        'Invalid verification code. Please make sure the clock on your authenticator device is synchronized.',
      );
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        mfaSecret: dto.secret,
        mfaEnabled: true,
      },
    });

    await this.auditService.log({
      actorId: userId,
      action: 'MFA_ENABLED',
      entity: 'User',
      entityId: userId,
      metadata: { timestamp: new Date().toISOString() },
    });

    return {
      success: true,
      message: 'MFA has been successfully verified and activated.',
    };
  }

  /**
   * Refresh Token Rotation:
   * Validates existing refresh token and issues a fresh pair of access + refresh tokens.
   */
  async rotateRefreshToken(refreshToken: string): Promise<AuthTokens> {
    try {
      const payload = this.jwtService.verify<{ sub: string; role: UserRole }>(refreshToken);
      const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });

      if (!user) {
        throw new UnauthorizedException('Invalid refresh token: user not found');
      }

      // Check lockout status
      const lockout = this.lockoutService.checkLockout(user.email ?? user.id);
      if (lockout.isLocked) {
        throw new UnauthorizedException('Account is locked');
      }

      // Issue new token pair (rotating the refresh token)
      return this.generateTokens({
        sub: user.id,
        email: user.email,
        role: user.role,
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  /**
   * Helper to sign JWT access token (15m) and refresh token (7d).
   */
  private generateTokens(payload: { sub: string; email: string | null; role: UserRole }): AuthTokens {
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(
      { sub: payload.sub, role: payload.role },
      { expiresIn: '7d' },
    );

    return {
      accessToken,
      refreshToken,
      expiresIn: 15 * 60, // 15 minutes in seconds
    };
  }
}
