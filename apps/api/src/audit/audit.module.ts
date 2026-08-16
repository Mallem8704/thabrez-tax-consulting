import { Module } from '@nestjs/common';
import { AuditService } from './audit.service';

/**
 * AuditModule — provides AuditService used by AuditInterceptor and other services.
 * Exports AuditService so the global interceptor can inject it.
 */
@Module({
  providers: [AuditService],
  exports: [AuditService],
})
export class AuditModule {}
