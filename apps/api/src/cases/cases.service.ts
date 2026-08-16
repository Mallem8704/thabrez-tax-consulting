import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { UserRole, ServiceType, CaseStatus, DeadlineType, type Prisma } from '@thabrez/db';

import { CreateCaseDto } from './dto/create-case.dto';
import { UpdateCaseStatusDto } from './dto/update-case-status.dto';
import { AssignCaseDto } from './dto/assign-case.dto';
import { QueryCasesDto } from './dto/query-cases.dto';
import type { AuthenticatedUser } from '../auth/decorators/current-user.decorator';
import type { PaginatedResult } from '../clients/clients.service';

@Injectable()
export class CasesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  /**
   * List cases with strict role-based access control and pagination.
   * - CLIENT: Sees only their own client cases
   * - ASSOCIATE: Sees only cases assigned to them or their assigned clients
   * - ADMIN / SENIOR_CA / FRONT_DESK: Sees all cases
   */
  async findAll(
    currentUser: AuthenticatedUser,
    query: QueryCasesDto,
  ): Promise<PaginatedResult<unknown>> {
    const page = Math.max(1, query.page || 1);
    const limit = Math.min(100, Math.max(1, query.limit || 20));
    const skip = (page - 1) * limit;

    const where: Prisma.CaseWhereInput = {};

    // 1. Strict RBAC scoping
    if (currentUser.role === UserRole.CLIENT) {
      if (!currentUser.clientProfileId) {
        return { data: [], meta: { total: 0, page, limit, totalPages: 0 } };
      }
      where.clientId = currentUser.clientProfileId;
    } else if (currentUser.role === UserRole.ASSOCIATE) {
      where.OR = [
        { assignedToId: currentUser.id },
        { client: { assignedCaId: currentUser.id } },
      ];
    } else if (query.assignedToId) {
      where.assignedToId = query.assignedToId;
    }

    // 2. Query filters
    if (query.clientId && currentUser.role !== UserRole.CLIENT) {
      where.clientId = query.clientId;
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.serviceType) {
      where.serviceType = query.serviceType;
    }

    const [total, data] = await Promise.all([
      this.prisma.case.count({ where }),
      this.prisma.case.findMany({
        where,
        skip,
        take: limit,
        include: {
          client: { select: { id: true, companyName: true, pan: true, gstin: true } },
          assignedTo: { select: { id: true, email: true, role: true } },
          _count: { select: { documents: true, messages: true, deadlines: true, invoices: true } },
        },
        orderBy: { updatedAt: 'desc' },
      }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  /**
   * Get case by ID with full details and access checks.
   */
  async findOne(id: string, currentUser: AuthenticatedUser) {
    const c = await this.prisma.case.findUnique({
      where: { id },
      include: {
        client: {
          select: {
            id: true,
            userId: true,
            companyName: true,
            pan: true,
            gstin: true,
            entityType: true,
            assignedCaId: true,
          },
        },
        assignedTo: { select: { id: true, email: true, role: true } },
        documents: { orderBy: { uploadedAt: 'desc' }, take: 20 },
        messages: {
          orderBy: { createdAt: 'asc' },
          take: 50,
          include: { sender: { select: { id: true, email: true, role: true } } },
        },
        deadlines: { orderBy: { dueDate: 'asc' } },
        invoices: { select: { id: true, amount: true, status: true, issuedAt: true } },
      },
    });

    if (!c) {
      throw new NotFoundException(`Case ${id} not found`);
    }

    // Role-based authorization
    if (currentUser.role === UserRole.CLIENT) {
      if (c.clientId !== currentUser.clientProfileId && c.client.userId !== currentUser.id) {
        throw new ForbiddenException('Access denied: You cannot view cases belonging to other clients.');
      }
    } else if (currentUser.role === UserRole.ASSOCIATE) {
      const isDirectAssignee = c.assignedToId === currentUser.id;
      const isClientCa = c.client.assignedCaId === currentUser.id;
      if (!isDirectAssignee && !isClientCa) {
        throw new ForbiddenException('Access denied: You can only view cases assigned to you.');
      }
    }

    return c;
  }

  /**
   * Create a new Case and automatically generate a standard compliance Deadline record.
   */
  async create(dto: CreateCaseDto, currentUser: AuthenticatedUser) {
    // Validate client exists
    const client = await this.prisma.client.findUnique({ where: { id: dto.clientId } });
    if (!client) {
      throw new NotFoundException(`Client ${dto.clientId} not found`);
    }

    // RBAC: CLIENT can only create for their own profile
    if (currentUser.role === UserRole.CLIENT) {
      if (dto.clientId !== currentUser.clientProfileId && client.userId !== currentUser.id) {
        throw new ForbiddenException('Clients can only create cases under their own account.');
      }
    }

    // Calculate due date based on statutory standard cycle if not provided
    const dueDate = dto.dueDate ? new Date(dto.dueDate) : this.calculateStandardDeadline(dto.serviceType);

    // Default assignedTo to client assigned CA if not specified
    const assignedToId = dto.assignedToId || client.assignedCaId || (currentUser.role !== UserRole.CLIENT ? currentUser.id : undefined);

    const newCase = await this.prisma.$transaction(async (tx) => {
      const c = await tx.case.create({
        data: {
          clientId: dto.clientId,
          serviceType: dto.serviceType,
          assignedToId,
          dueDate,
          status: CaseStatus.RECEIVED,
        },
        include: {
          client: { select: { id: true, companyName: true, pan: true } },
          assignedTo: { select: { id: true, email: true, role: true } },
        },
      });

      // Auto-generate standard compliance Deadline record
      await tx.deadline.create({
        data: {
          clientId: dto.clientId,
          caseId: c.id,
          type: dto.serviceType as unknown as DeadlineType,
          dueDate,
          status: 'PENDING',
        },
      });

      return c;
    });

    await this.auditService.log({
      actorId: currentUser.id,
      action: 'CASE_CREATED',
      entity: 'Case',
      entityId: newCase.id,
      metadata: {
        serviceType: dto.serviceType,
        clientId: dto.clientId,
        assignedToId,
        dueDate: dueDate.toISOString(),
      },
    });

    return newCase;
  }

  /**
   * Update case lifecycle status with an AuditLog entry on every status change.
   */
  async updateStatus(id: string, dto: UpdateCaseStatusDto, currentUser: AuthenticatedUser) {
    const existing = await this.prisma.case.findUnique({
      where: { id },
      include: { client: true },
    });

    if (!existing) {
      throw new NotFoundException(`Case ${id} not found`);
    }

    // RBAC: CLIENT cannot update case filing status
    if (currentUser.role === UserRole.CLIENT) {
      throw new ForbiddenException('Clients cannot modify internal case status.');
    }

    if (currentUser.role === UserRole.ASSOCIATE) {
      const isAssignee = existing.assignedToId === currentUser.id;
      const isClientCa = existing.client.assignedCaId === currentUser.id;
      if (!isAssignee && !isClientCa) {
        throw new ForbiddenException('Associates can only update status for cases assigned to them.');
      }
    }

    const previousStatus = existing.status;
    const newStatus = dto.status;

    const updated = await this.prisma.$transaction(async (tx) => {
      const c = await tx.case.update({
        where: { id },
        data: { status: newStatus },
        include: {
          client: { select: { id: true, companyName: true } },
          assignedTo: { select: { id: true, email: true } },
        },
      });

      // If case completed/filed/closed, update pending deadline status
      if (newStatus === CaseStatus.FILED || newStatus === CaseStatus.ACKNOWLEDGED || newStatus === CaseStatus.CLOSED) {
        await tx.deadline.updateMany({
          where: { caseId: id, status: 'PENDING' },
          data: { status: 'COMPLETED' },
        });
      }

      return c;
    });

    // Write AuditLog entry for every status change
    await this.auditService.log({
      actorId: currentUser.id,
      action: 'CASE_STATUS_CHANGE',
      entity: 'Case',
      entityId: id,
      metadata: {
        fromStatus: previousStatus,
        toStatus: newStatus,
        serviceType: existing.serviceType,
        clientId: existing.clientId,
      },
    });

    return updated;
  }

  /**
   * Assign or reassign case to staff.
   * Restricted to ADMIN and SENIOR_CA.
   */
  async assignTo(id: string, dto: AssignCaseDto, currentUser: AuthenticatedUser) {
    const existing = await this.prisma.case.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Case ${id} not found`);
    }

    const staffUser = await this.prisma.user.findUnique({ where: { id: dto.assignedToId } });
    if (!staffUser || staffUser.role === UserRole.CLIENT) {
      throw new BadRequestException(`Target user ${dto.assignedToId} is not a valid staff member`);
    }

    const updated = await this.prisma.case.update({
      where: { id },
      data: { assignedToId: dto.assignedToId },
      include: {
        assignedTo: { select: { id: true, email: true, role: true } },
      },
    });

    await this.auditService.log({
      actorId: currentUser.id,
      action: 'CASE_ASSIGNED',
      entity: 'Case',
      entityId: id,
      metadata: {
        previousAssignee: existing.assignedToId,
        newAssignee: dto.assignedToId,
      },
    });

    return updated;
  }

  /**
   * Standard Statutory Compliance Deadline Calculation for India
   */
  private calculateStandardDeadline(serviceType: ServiceType): Date {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // 0-indexed (0 = Jan, 11 = Dec)

    switch (serviceType) {
      case ServiceType.GST_FILING: {
        // GSTR-3B monthly deadline is the 20th of next month
        const nextMonth = new Date(year, month + 1, 20, 23, 59, 59);
        return nextMonth;
      }
      case ServiceType.ITR_FILING: {
        // Standard non-audit ITR is 31st July of current year
        const currentYearItr = new Date(year, 6, 31, 23, 59, 59); // July 31
        if (now > currentYearItr) {
          return new Date(year + 1, 6, 31, 23, 59, 59);
        }
        return currentYearItr;
      }
      case ServiceType.TDS_FILING: {
        // Quarterly TDS (Q1: Jul 31, Q2: Oct 31, Q3: Jan 31, Q4: May 31)
        if (month >= 0 && month <= 2) return new Date(year, 4, 31, 23, 59, 59); // May 31 for Q4
        if (month >= 3 && month <= 5) return new Date(year, 6, 31, 23, 59, 59); // Jul 31 for Q1
        if (month >= 6 && month <= 8) return new Date(year, 9, 31, 23, 59, 59); // Oct 31 for Q2
        return new Date(year + 1, 0, 31, 23, 59, 59); // Jan 31 for Q3
      }
      case ServiceType.ROC_ANNUAL_COMPLIANCE: {
        // Annual ROC filings (Sep 30 / Oct 30)
        return new Date(year, 8, 30, 23, 59, 59); // Sep 30
      }
      case ServiceType.BOOKKEEPING: {
        // Monthly closing: 10th of next month
        return new Date(year, month + 1, 10, 23, 59, 59);
      }
      default: {
        // 14 business days from now
        const defaultDeadline = new Date(now);
        defaultDeadline.setDate(now.getDate() + 14);
        return defaultDeadline;
      }
    }
  }
}
