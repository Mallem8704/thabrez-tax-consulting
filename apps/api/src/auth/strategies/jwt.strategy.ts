import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import type { AuthenticatedUser } from '../decorators/current-user.decorator';

export interface JwtPayload {
  sub: string;
  email: string | null;
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('NEXTAUTH_SECRET') || 'default-thabrez-secret-key-change-in-prod',
    });
  }

  async validate(payload: JwtPayload): Promise<AuthenticatedUser> {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: { clientProfile: { select: { id: true } } },
    });

    if (!user) {
      throw new UnauthorizedException('User session is invalid or user no longer exists');
    }

    return {
      id: user.id,
      email: user.email,
      phone: user.phone,
      role: user.role,
      clientProfileId: user.clientProfile?.id ?? null,
    };
  }
}
