import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { UserRole, type Prisma } from '@thabrez/db';
import bcrypt from 'bcryptjs';

import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { QueryClientsDto } from './dto/query-clients.dto';
import type { AuthenticatedUser } from '../auth/decorators/current-user.decorator';

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

@Injectable()
export class ClientsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  /**
   * List clients with role-based visibility and pagination.
   * - CLIENT: Sees only their own profile
   * - ASSOCIATE: Sees only clients assigned to them
   * - ADMIN / SENIOR_CA / FRONT_DESK: Sees all clients
   */
  async findAll(
    currentUser: AuthenticatedUser,
    query: QueryClientsDto,
  ): Promise<PaginatedResult<unknown>> {
    const page = Math.max(1, query.page || 1);
    const limit = Math.min(100, Math.max(1, query.limit || 20));
    const skip = (page - 1) * limit;

    const where: Prisma.ClientWhereInput = {};

    // 1. Role-based scoping
    if (currentUser.role === UserRole.CLIENT) {
      where.userId = currentUser.id;
    } else if (currentUser.role === UserRole.ASSOCIATE) {
      where.assignedCaId = currentUser.id;
    } else if (query.assignedCaId) {
      where.assignedCaId = query.assignedCaId;
    }

    // 2. Query filters
    if (query.entityType) {
      where.entityType = query.entityType;
    }

    if (query.search) {
      const searchTerm = query.search.trim();
      where.OR = [
        { companyName: { contains: searchTerm, mode: 'insensitive' } },
        { pan: { contains: searchTerm, mode: 'insensitive' } },
        { gstin: { contains: searchTerm, mode: 'insensitive' } },
        { user: { email: { contains: searchTerm, mode: 'insensitive' } } },
      ];
    }

    const [total, data] = await Promise.all([
      this.prisma.client.count({ where }),
      this.prisma.client.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: { select: { id: true, email: true, phone: true, role: true } },
          assignedCa: { select: { id: true, email: true, role: true } },
          _count: { select: { cases: true, invoices: true, deadlines: true } },
        },
        orderBy: { createdAt: 'desc' },
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
   * Get client by ID with role-based access checks.
   */
  async findOne(id: string, currentUser: AuthenticatedUser) {
    const client = await this.prisma.client.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, email: true, phone: true, role: true } },
        assignedCa: { select: { id: true, email: true, role: true } },
        cases: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: {
            assignedTo: { select: { id: true, email: true, role: true } },
            _count: { select: { documents: true, messages: true } },
          },
        },
        deadlines: {
          where: { status: { in: ['PENDING', 'OVERDUE'] } },
          orderBy: { dueDate: 'asc' },
          take: 5,
        },
      },
    });

    if (!client) {
      throw new NotFoundException(`Client ${id} not found`);
    }

    // Role-based authorization
    if (currentUser.role === UserRole.CLIENT) {
      if (client.userId !== currentUser.id && client.id !== currentUser.clientProfileId) {
        throw new ForbiddenException('Access denied: You can only view your own client record.');
      }
    } else if (currentUser.role === UserRole.ASSOCIATE) {
      if (client.assignedCaId !== currentUser.id) {
        throw new ForbiddenException(
          'Access denied: Associates can only view clients assigned to them.',
        );
      }
    }

    return client;
  }

  /**
   * Create a new client and underlying User login.
   * Restricted to ADMIN and SENIOR_CA.
   */
  async create(dto: CreateClientDto, currentUser: AuthenticatedUser) {
    const email = dto.email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new BadRequestException(`A user with email ${email} already exists`);
    }

    // Check unique PAN if provided
    if (dto.pan) {
      const existingPan = await this.prisma.client.findUnique({ where: { pan: dto.pan.toUpperCase() } });
      if (existingPan) {
        throw new BadRequestException(`A client with PAN ${dto.pan} is already registered`);
      }
    }

    const defaultPassword = dto.password || 'Client@Thabrez2025';
    const passwordHash = await bcrypt.hash(defaultPassword, 10);

    const client = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          phone: dto.phone,
          passwordHash,
          role: UserRole.CLIENT,
        },
      });

      return tx.client.create({
        data: {
          userId: user.id,
          companyName: dto.companyName,
          pan: dto.pan?.toUpperCase(),
          gstin: dto.gstin?.toUpperCase(),
          entityType: dto.entityType ?? 'INDIVIDUAL',
          assignedCaId: dto.assignedCaId,
        },
        include: {
          user: { select: { id: true, email: true, phone: true, role: true } },
          assignedCa: { select: { id: true, email: true, role: true } },
        },
      });
    });

    await this.auditService.log({
      actorId: currentUser.id,
      action: 'CLIENT_CREATED',
      entity: 'Client',
      entityId: client.id,
      metadata: {
        companyName: client.companyName,
        email: client.user.email,
        assignedCaId: client.assignedCaId,
      },
    });

    return client;
  }

  /**
   * Update client details.
   * - ASSOCIATE: Can update assigned client details only (cannot reassign CA).
   * - ADMIN / SENIOR_CA: Full update permissions.
   */
  async update(id: string, dto: UpdateClientDto, currentUser: AuthenticatedUser) {
    const client = await this.prisma.client.findUnique({ where: { id } });
    if (!client) {
      throw new NotFoundException(`Client ${id} not found`);
    }

    if (currentUser.role === UserRole.CLIENT) {
      if (client.id !== currentUser.clientProfileId && client.userId !== currentUser.id) {
        throw new ForbiddenException('You can only update your own client profile.');
      }
      if (dto.pan !== undefined || dto.gstin !== undefined || dto.assignedCaId !== undefined) {
        throw new ForbiddenException('PAN, GSTIN, and Assigned CA cannot be modified directly. Please use "Request change" to submit a verification request to staff.');
      }
    }

    if (currentUser.role === UserRole.ASSOCIATE) {
      if (client.assignedCaId !== currentUser.id) {
        throw new ForbiddenException('Associates can only update their assigned clients.');
      }
      if (dto.assignedCaId && dto.assignedCaId !== currentUser.id) {
        throw new ForbiddenException('Associates are not authorized to reassign the Chartered Accountant.');
      }
    }

    if (dto.phone !== undefined) {
      await this.prisma.user.update({
        where: { id: client.userId },
        data: { phone: dto.phone },
      });
    }

    const updated = await this.prisma.client.update({
      where: { id },
      data: {
        ...(dto.companyName !== undefined && { companyName: dto.companyName }),
        ...(dto.pan !== undefined && { pan: dto.pan?.toUpperCase() }),
        ...(dto.gstin !== undefined && { gstin: dto.gstin?.toUpperCase() }),
        ...(dto.entityType !== undefined && { entityType: dto.entityType }),
        ...(dto.assignedCaId !== undefined && { assignedCaId: dto.assignedCaId }),
      },
      include: {
        user: { select: { id: true, email: true, phone: true, role: true } },
        assignedCa: { select: { id: true, email: true, role: true } },
      },
    });

    await this.auditService.log({
      actorId: currentUser.id,
      action: 'CLIENT_UPDATED',
      entity: 'Client',
      entityId: id,
      metadata: {
        updatedFields: Object.keys(dto),
      },
    });

    return updated;
  }

  /**
   * Soft-delete / remove client profile.
   * Restricted to ADMIN and SENIOR_CA.
   */
  async remove(id: string, currentUser: AuthenticatedUser) {
    const client = await this.prisma.client.findUnique({ where: { id } });
    if (!client) {
      throw new NotFoundException(`Client ${id} not found`);
    }

    await this.prisma.client.delete({ where: { id } });

    await this.auditService.log({
      actorId: currentUser.id,
      action: 'CLIENT_DELETED',
      entity: 'Client',
      entityId: id,
      metadata: { companyName: client.companyName, userId: client.userId },
    });

    return { success: true, message: `Client ${id} has been removed` };
  }

  /**
   * Assign or reassign Chartered Accountant to a client.
   * Restricted to ADMIN and SENIOR_CA.
   */
  async assignCa(clientId: string, caId: string, currentUser: AuthenticatedUser) {
    const client = await this.prisma.client.findUnique({ where: { id: clientId } });
    if (!client) {
      throw new NotFoundException(`Client ${clientId} not found`);
    }

    const caUser = await this.prisma.user.findUnique({ where: { id: caId } });
    if (!caUser || (caUser.role !== UserRole.SENIOR_CA && caUser.role !== UserRole.ASSOCIATE)) {
      throw new BadRequestException(`Target user ${caId} is not a valid CA or Associate staff member`);
    }

    const updated = await this.prisma.client.update({
      where: { id: clientId },
      data: { assignedCaId: caId },
      include: {
        assignedCa: { select: { id: true, email: true, role: true } },
      },
    });

    await this.auditService.log({
      actorId: currentUser.id,
      action: 'CLIENT_CA_REASSIGNED',
      entity: 'Client',
      entityId: clientId,
      metadata: {
        previousCaId: client.assignedCaId,
        newCaId: caId,
      },
    });

    return updated;
  }
}
