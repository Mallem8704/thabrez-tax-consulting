import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bullmq';

import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ClientsModule } from './clients/clients.module';
import { CasesModule } from './cases/cases.module';
import { DocumentsModule } from './documents/documents.module';
import { DeadlinesModule } from './deadlines/deadlines.module';
import { InvoicesModule } from './invoices/invoices.module';
import { MessagesModule } from './messages/messages.module';
import { LeadsModule } from './leads/leads.module';
import { BlogModule } from './blog/blog.module';
import { ResourcesModule } from './resources/resources.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AuditModule } from './audit/audit.module';
import { AuditInterceptor } from './common/interceptors/audit.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // ── Global rate limiting: 60 requests / 60 seconds per IP ───────────────
    // Public endpoints (leads, auth/login) get additional per-service limits
    // via the custom LeadRateLimiterService and LoginLockoutService.
    ThrottlerModule.forRoot([
      {
        ttl: 60_000, // 60-second rolling window
        limit: 60,   // max 60 requests per IP per window
      },
    ]),
    ScheduleModule.forRoot(),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const redisUrl = config.get<string>('REDIS_URL') || 'redis://localhost:6379';
        let host = 'localhost';
        let port = 6379;
        let password: string | undefined;

        try {
          const parsed = new URL(redisUrl);
          host = parsed.hostname || 'localhost';
          port = Number(parsed.port) || 6379;
          if (parsed.password) password = parsed.password;
        } catch {
          // default localhost fallback
        }

        return {
          connection: {
            host,
            port,
            ...(password ? { password } : {}),
          },
        };
      },
    }),
    PrismaModule,
    AuditModule,
    NotificationsModule,
    HealthModule,
    AuthModule,
    UsersModule,
    ClientsModule,
    CasesModule,
    DocumentsModule,
    DeadlinesModule,
    InvoicesModule,
    MessagesModule,
    LeadsModule,
    BlogModule,
    ResourcesModule,
  ],
  providers: [
    // Global rate limiter — 60 requests per 60 seconds per IP
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor,
    },
  ],
})
export class AppModule {}
