import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { MfaVerifyDto } from './dto/mfa.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { Public } from './decorators/public.decorator';
import { CurrentUser, type AuthenticatedUser } from './decorators/current-user.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Login with email + password (and optional TOTP code for staff MFA)',
    description:
      'For CLIENT users: returns JWT access + refresh tokens.\n' +
      'For Staff users: enforces mandatory TOTP MFA. If MFA is not enrolled, returns MFA_SETUP_REQUIRED; if MFA code is missing, returns MFA_REQUIRED.',
  })
  @ApiResponse({ status: 200, description: 'Login successful or MFA challenge returned' })
  @ApiResponse({ status: 401, description: 'Invalid credentials or invalid MFA code' })
  @ApiResponse({ status: 429, description: 'Account temporarily locked due to 5 failed attempts' })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Rotate refresh token and receive a fresh access + refresh token pair' })
  @ApiResponse({ status: 200, description: 'New token pair issued' })
  @ApiResponse({ status: 401, description: 'Invalid or expired refresh token' })
  async refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.rotateRefreshToken(dto.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('mfa/generate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Generate a new TOTP secret and QR code for MFA setup' })
  async generateMfa(@CurrentUser() user: AuthenticatedUser) {
    return this.authService.generateMfaSecret(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('mfa/verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify TOTP code and activate MFA on account' })
  async verifyMfa(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: MfaVerifyDto,
  ) {
    return this.authService.verifyAndEnableMfa(user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('me')
  @ApiOperation({ summary: 'Get current authenticated user profile' })
  getProfile(@CurrentUser() user: AuthenticatedUser) {
    return user;
  }
}
