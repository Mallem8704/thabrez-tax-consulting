import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { DeadlineSchedulerService } from './deadline-scheduler.service';
import { UserRole, type DeadlineStatus, type Prisma } from '@thabrez/db';
import type { AuthenticatedUser } from '../auth/decorators/current-user.decorator';

export interface QueryDeadlinesDto {
  clientId?: string;
  status?: DeadlineStatus;
  from?: string;
  to?: string;
}

@Injectable()
export class DeadlinesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
    private readonly schedulerService: DeadlineSchedulerService,
  ) {}

  /**
   * List compliance deadlines with role-based scoping.
   * - CLIENT: strictly limited to their own deadlines
   * - ASSOCIATE: limited to deadlines of assigned clients
   * - ADMIN / SENIOR_CA / FRONT_DESK: all deadlines
   */
  async findAll(currentUser: AuthenticatedUser, query?: QueryDeadlinesDto) {
    const where: Prisma.DeadlineWhereInput = {};

    // 1. Role-based scoping
    if (currentUser.role === UserRole.CLIENT) {
      if (!currentUser.clientProfileId) return [];
      where.clientId = currentUser.clientProfileId;
    } else if (currentUser.role === UserRole.ASSOCIATE) {
      where.client = { assignedCaId: currentUser.id };
    } else if (query?.clientId) {
      where.clientId = query.clientId;
    }

    // 2. Query filters
    if (query?.status) {
      where.status = query.status;
    }

    if (query?.from || query?.to) {
      where.dueDate = {
        ...(query?.from && { gte: new Date(query.from) }),
        ...(query?.to && { lte: new Date(query.to) }),
      };
    }

    return this.prisma.deadline.findMany({
      where,
      include: {
        client: {
          select: {
            id: true,
            companyName: true,
            pan: true,
            assignedCa: { select: { id: true, email: true } },
          },
        },
        case: { select: { id: true, status: true, serviceType: true } },
      },
      orderBy: { dueDate: 'asc' },
    });
  }

  /**
   * Get deadline details with cross-tenant check.
   */
  async findOne(id: string, currentUser: AuthenticatedUser) {
    const d = await this.prisma.deadline.findUnique({
      where: { id },
      include: {
        client: {
          select: {
            id: true,
            userId: true,
            companyName: true,
            pan: true,
            assignedCaId: true,
          },
        },
        case: true,
      },
    });

    if (!d) {
      throw new NotFoundException(`Deadline ${id} not found`);
    }

    if (currentUser.role === UserRole.CLIENT) {
      if (d.clientId !== currentUser.clientProfileId && d.client.userId !== currentUser.id) {
        throw new ForbiddenException('Access denied: You cannot view deadlines of other clients.');
      }
    } else if (currentUser.role === UserRole.ASSOCIATE) {
      if (d.client.assignedCaId !== currentUser.id) {
        throw new ForbiddenException('Access denied: Associates can only view deadlines for assigned clients.');
      }
    }

    return d;
  }

  /**
   * Update deadline status (PENDING, REMINDED, COMPLETED, OVERDUE).
   */
  async updateStatus(id: string, status: DeadlineStatus, currentUser: AuthenticatedUser) {
    const existing = await this.findOne(id, currentUser);

    const updated = await this.prisma.deadline.update({
      where: { id },
      data: {
        status,
        ...(status === 'REMINDED' && { reminderSentAt: new Date() }),
      },
    });

    await this.auditService.log({
      actorId: currentUser.id,
      action: 'DEADLINE_STATUS_UPDATED',
      entity: 'Deadline',
      entityId: id,
      metadata: {
        fromStatus: existing.status,
        toStatus: status,
        serviceType: existing.type,
      },
    });

    return updated;
  }

  /**
   * Trigger manual scan for deadlines and overdue auto-marking.
   * Restricted to ADMIN / SENIOR_CA.
   */
  async triggerScan(currentUser: AuthenticatedUser) {
    const result = await this.schedulerService.handleDailyDeadlineCron();

    await this.auditService.log({
      actorId: currentUser.id,
      action: 'DEADLINE_SCAN_MANUAL_TRIGGER',
      entity: 'Deadline',
      entityId: 'SYSTEM_MANUAL_SCAN',
      metadata: result,
    });

    return { success: true, ...result };
  }
}
