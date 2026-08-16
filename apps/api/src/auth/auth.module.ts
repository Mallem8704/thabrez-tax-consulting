import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginLockoutService } from './lockout.service';
import { ClientIsolationService } from './client-isolation.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { ClientOwnershipGuard } from './guards/client-ownership.guard';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret:
          configService.get<string>('NEXTAUTH_SECRET') ||
          'default-thabrez-secret-key-change-in-prod',
        signOptions: {
          expiresIn: '15m',
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LoginLockoutService,
    ClientIsolationService,
    JwtStrategy,
    JwtAuthGuard,
    RolesGuard,
    ClientOwnershipGuard,
  ],
  exports: [
    AuthService,
    LoginLockoutService,
    ClientIsolationService,
    JwtStrategy,
    JwtAuthGuard,
    RolesGuard,
    ClientOwnershipGuard,
  ],
})
export class AuthModule {}
