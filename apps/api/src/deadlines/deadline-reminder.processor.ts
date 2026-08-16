import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { NotificationsService } from '../notifications/notifications.service';
import { AuditService } from '../audit/audit.service';
import type { DeadlineReminderJobData } from './deadline-scheduler.service';

@Processor('deadline-reminders')
export class DeadlineReminderProcessor extends WorkerHost {
  private readonly logger = new Logger(DeadlineReminderProcessor.name);

  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly auditService: AuditService,
  ) {
    super();
  }

  async process(job: Job<DeadlineReminderJobData>): Promise<void> {
    const { deadlineId, clientId, clientName, email, phone, serviceType, dueDate, daysRemaining, milestone } =
      job.data;

    this.logger.log(
      `[DeadlineWorker] Processing reminder for deadline=${deadlineId}, client=${email}, milestone=${milestone}d`,
    );

    const portalUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000/portal';

    // 1. Dispatch Email + SMS/WhatsApp
    await this.notificationsService.sendDeadlineReminder(
      {
        to: email,
        clientName,
        serviceType,
        dueDate,
        daysRemaining,
        portalUrl,
      },
      phone,
    );

    // 2. Log immutable audit entry
    await this.auditService.log({
      actorId: 'WORKER_BULLMQ',
      action: 'DEADLINE_REMINDER_SENT',
      entity: 'Deadline',
      entityId: deadlineId,
      metadata: {
        clientId,
        email,
        phone,
        milestone,
        daysRemaining,
      },
    });
  }
}
