import { Module } from '@nestjs/common';
import { LeadsController } from './leads.controller';
import { LeadsService } from './leads.service';
import { TurnstileService } from './turnstile.service';
import { LeadRateLimiterService } from './lead-rate-limiter.service';

@Module({
  controllers: [LeadsController],
  providers: [LeadsService, TurnstileService, LeadRateLimiterService],
  exports: [LeadsService, TurnstileService, LeadRateLimiterService],
})
export class LeadsModule {}
