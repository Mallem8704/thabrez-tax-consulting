import { Module, Global } from '@nestjs/common';
import { AuditService } from './audit.service';

/**
 * AuditModule — provides AuditService globally to all modules and interceptors.
 * Marked @Global() so any service can inject AuditService directly.
 */
@Global()
@Module({
  providers: [AuditService],
  exports: [AuditService],
})
export class AuditModule {}
