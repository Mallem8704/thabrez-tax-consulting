import { DeadlineSchedulerService } from './deadline-scheduler.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { DeadlineType, DeadlineStatus } from '@thabrez/db';

describe('DeadlineSchedulerService — Reminder Milestones & De-duplication Tests', () => {
  let schedulerService: DeadlineSchedulerService;
  let mockPrisma: any;
  let mockAuditService: { log: jest.Mock };
  let mockQueue: { add: jest.Mock };

  beforeEach(() => {
    mockAuditService = {
      log: jest.fn().mockResolvedValue(undefined),
    };

    mockQueue = {
      add: jest.fn().mockResolvedValue({ id: 'mock_job_id' }),
    };

    mockPrisma = {
      deadline: {
        findMany: jest.fn(),
        update: jest.fn(),
        updateMany: jest.fn(),
      },
    };

    schedulerService = new DeadlineSchedulerService(
      mockPrisma as unknown as PrismaService,
      mockAuditService as unknown as AuditService,
      mockQueue as any,
    );
  });

  describe('3-Day Deadline Reminder De-duplication', () => {
    it('should enqueue exactly one reminder job for a 3-day deadline and NOT duplicate on a second run', async () => {
      const now = new Date('2026-08-16T10:00:00.000Z');
      const threeDaysOut = new Date('2026-08-19T10:00:00.000Z');

      const mockDeadline = {
        id: 'deadline_gst_3d',
        clientId: 'client_100',
        caseId: 'case_gst_100',
        type: DeadlineType.GST_FILING,
        dueDate: threeDaysOut,
        status: DeadlineStatus.PENDING,
        reminderSentAt: null,
        remindedMarks: [] as number[],
        client: {
          companyName: 'Mehta Enterprises',
          user: {
            id: 'user_100',
            email: 'mehta@example.com',
            phone: '9876543210',
          },
        },
      };

      // First run: deadline has no remindedMarks
      mockPrisma.deadline.findMany.mockResolvedValueOnce([mockDeadline]);

      // When update is called, mutate remindedMarks in our mock object
      mockPrisma.deadline.update.mockImplementation(({ data }: any) => {
        if (data.remindedMarks?.push) {
          mockDeadline.remindedMarks.push(data.remindedMarks.push);
        }
        mockDeadline.status = data.status;
        return Promise.resolve(mockDeadline);
      });

      // Execute Run 1
      const countRun1 = await schedulerService.scanAndScheduleReminders(now);

      expect(countRun1).toBe(1);
      expect(mockQueue.add).toHaveBeenCalledTimes(1);
      expect(mockQueue.add).toHaveBeenCalledWith(
        'send-deadline-reminder',
        expect.objectContaining({
          deadlineId: 'deadline_gst_3d',
          email: 'mehta@example.com',
          serviceType: DeadlineType.GST_FILING,
          milestone: 3,
          daysRemaining: 3,
        }),
        expect.objectContaining({
          jobId: 'reminder_deadline_gst_3d_3day',
        }),
      );

      expect(mockPrisma.deadline.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'deadline_gst_3d' },
          data: expect.objectContaining({
            status: 'REMINDED',
            remindedMarks: { push: 3 },
          }),
        }),
      );

      // Verify that deadline now contains remindedMarks = [3]
      expect(mockDeadline.remindedMarks).toContain(3);

      // Second run: deadline now has remindedMarks: [3]
      mockPrisma.deadline.findMany.mockResolvedValueOnce([mockDeadline]);

      // Execute Run 2
      const countRun2 = await schedulerService.scanAndScheduleReminders(now);

      // Must be 0 because 3-day mark was already sent!
      expect(countRun2).toBe(0);
      expect(mockQueue.add).toHaveBeenCalledTimes(1); // Still exactly 1 job in total
    });
  });

  describe('Overdue Deadline Auto-marking', () => {
    it('should mark past due deadlines as OVERDUE and emit audit logs', async () => {
      const now = new Date('2026-08-16T10:00:00.000Z');
      const pastDate = new Date('2026-08-15T10:00:00.000Z');

      const overdueList = [
        {
          id: 'deadline_overdue_1',
          type: DeadlineType.ITR_FILING,
          clientId: 'client_99',
          dueDate: pastDate,
          status: DeadlineStatus.PENDING,
        },
      ];

      mockPrisma.deadline.findMany.mockResolvedValue(overdueList);
      mockPrisma.deadline.updateMany.mockResolvedValue({ count: 1 });

      const count = await schedulerService.checkOverdueDeadlines(now);

      expect(count).toBe(1);
      expect(mockPrisma.deadline.updateMany).toHaveBeenCalledWith({
        where: { id: { in: ['deadline_overdue_1'] } },
        data: { status: 'OVERDUE' },
      });

      expect(mockAuditService.log).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'DEADLINE_MARKED_OVERDUE',
          entity: 'Deadline',
          entityId: 'deadline_overdue_1',
        }),
      );
    });
  });
});
