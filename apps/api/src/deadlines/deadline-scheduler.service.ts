import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';

export interface DeadlineReminderJobData {
  deadlineId: string;
  clientId: string;
  clientName: string;
  email: string;
  phone?: string | null;
  serviceType: string;
  dueDate: string;
  daysRemaining: number;
  milestone: number;
}

@Injectable()
export class DeadlineSchedulerService {
  private readonly logger = new Logger(DeadlineSchedulerService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
    @InjectQueue('deadline-reminders') private readonly deadlineQueue: Queue,
  ) {}

  /**
   * Daily scheduled job running at 8:00 AM IST (2:30 AM UTC).
   * 1. Marks passed pending deadlines as OVERDUE.
   * 2. Scans upcoming deadlines (within 7 days) and enqueues reminder notifications
   *    at 7-day, 3-day, and 1-day milestones without duplicate sends.
   */
  @Cron('0 8 * * *', { timeZone: 'Asia/Kolkata' })
  async handleDailyDeadlineCron(): Promise<{ overdueCount: number; remindersScheduled: number }> {
    this.logger.log('[Cron] Executing daily deadline compliance scan...');
    const overdueCount = await this.checkOverdueDeadlines();
    const remindersScheduled = await this.scanAndScheduleReminders();
    this.logger.log(
      `[Cron] Scan finished. Overdue marked: ${overdueCount}, Reminders scheduled: ${remindersScheduled}`,
    );
    return { overdueCount, remindersScheduled };
  }

  /**
   * Scan for expired deadlines and auto-mark as OVERDUE.
   */
  async checkOverdueDeadlines(referenceDate: Date = new Date()): Promise<number> {
    const overdueDeadlines = await this.prisma.deadline.findMany({
      where: {
        status: { in: ['PENDING', 'REMINDED'] },
        dueDate: { lt: referenceDate },
      },
      select: { id: true, type: true, clientId: true },
    });

    if (overdueDeadlines.length === 0) return 0;

    await this.prisma.deadline.updateMany({
      where: {
        id: { in: overdueDeadlines.map((d) => d.id) },
      },
      data: {
        status: 'OVERDUE',
      },
    });

    for (const d of overdueDeadlines) {
      await this.auditService.log({
        actorId: 'SYSTEM_CRON',
        action: 'DEADLINE_MARKED_OVERDUE',
        entity: 'Deadline',
        entityId: d.id,
        metadata: { serviceType: d.type, clientId: d.clientId },
      });
    }

    return overdueDeadlines.length;
  }

  /**
   * Scans all pending/reminded deadlines within 7 days and enqueues BullMQ reminder jobs
   * for 7-day, 3-day, and 1-day milestones.
   * Tracks remindedMarks in the database to prevent duplicate notifications.
   */
  async scanAndScheduleReminders(referenceDate: Date = new Date()): Promise<number> {
    const sevenDaysOut = new Date(referenceDate);
    sevenDaysOut.setDate(sevenDaysOut.getDate() + 8); // Include whole 7th day

    const upcomingDeadlines = await this.prisma.deadline.findMany({
      where: {
        status: { in: ['PENDING', 'REMINDED'] },
        dueDate: {
          gte: referenceDate,
          lte: sevenDaysOut,
        },
      },
      include: {
        client: {
          include: {
            user: { select: { id: true, email: true, phone: true } },
          },
        },
      },
    });

    let scheduledCount = 0;

    for (const deadline of upcomingDeadlines) {
      const diffMs = deadline.dueDate.getTime() - referenceDate.getTime();
      const daysRemaining = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

      // Determine which milestone matches
      let matchedMilestone: number | null = null;

      if (daysRemaining <= 1) {
        if (!deadline.remindedMarks.includes(1)) {
          matchedMilestone = 1;
        }
      } else if (daysRemaining <= 3) {
        if (!deadline.remindedMarks.includes(3)) {
          matchedMilestone = 3;
        }
      } else if (daysRemaining <= 7) {
        if (!deadline.remindedMarks.includes(7)) {
          matchedMilestone = 7;
        }
      }

      if (matchedMilestone !== null) {
        const userEmail = deadline.client.user?.email || 'client@thabrez.com';
        const clientName =
          deadline.client.companyName || userEmail.split('@')[0] || 'Valued Client';

        // 1. Enqueue BullMQ job
        const jobData: DeadlineReminderJobData = {
          deadlineId: deadline.id,
          clientId: deadline.clientId,
          clientName,
          email: userEmail,
          phone: deadline.client.user?.phone,
          serviceType: deadline.type,
          dueDate: deadline.dueDate.toISOString().split('T')[0] || '',
          daysRemaining,
          milestone: matchedMilestone,
        };

        await this.deadlineQueue.add('send-deadline-reminder', jobData, {
          jobId: `reminder_${deadline.id}_${matchedMilestone}day`,
          removeOnComplete: true,
        });

        // 2. Update database record to prevent duplicate reminder sends
        await this.prisma.deadline.update({
          where: { id: deadline.id },
          data: {
            status: 'REMINDED',
            reminderSentAt: new Date(),
            remindedMarks: { push: matchedMilestone },
          },
        });

        await this.auditService.log({
          actorId: 'SYSTEM_CRON',
          action: 'DEADLINE_REMINDER_ENQUEUED',
          entity: 'Deadline',
          entityId: deadline.id,
          metadata: {
            milestone: matchedMilestone,
            daysRemaining,
            email: deadline.client.user.email,
          },
        });

        scheduledCount++;
      }
    }

    return scheduledCount;
  }
}
