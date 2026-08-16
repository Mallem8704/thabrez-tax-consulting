import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { DeadlinesController } from './deadlines.controller';
import { DeadlinesService } from './deadlines.service';
import { DeadlineSchedulerService } from './deadline-scheduler.service';
import { DeadlineReminderProcessor } from './deadline-reminder.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'deadline-reminders',
    }),
  ],
  controllers: [DeadlinesController],
  providers: [
    DeadlinesService,
    DeadlineSchedulerService,
    DeadlineReminderProcessor,
  ],
  exports: [DeadlinesService, DeadlineSchedulerService],
})
export class DeadlinesModule {}
