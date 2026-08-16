import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import type { ResourceType, Prisma } from '@thabrez/db';

import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { QueryResourceDto } from './dto/query-resource.dto';
import type { AuthenticatedUser } from '../auth/decorators/current-user.decorator';
import type { PaginatedResult } from '../clients/clients.service';
import { sanitizeHtmlContent } from '../common/utils/sanitizer.util';

@Injectable()
export class ResourcesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  /**
   * Public: List knowledge library resources with filtering and pagination.
   */
  async findAll(query: QueryResourceDto): Promise<PaginatedResult<unknown>> {
    const page = Math.max(1, query.page || 1);
    const limit = Math.min(100, Math.max(1, query.limit || 20));
    const skip = (page - 1) * limit;

    const where: Prisma.ResourceWhereInput = {};

    if (query.type) {
      where.type = query.type;
    }

    if (query.category) {
      where.category = { contains: query.category.trim(), mode: 'insensitive' };
    }

    if (query.search) {
      const term = query.search.trim();
      where.OR = [
        { title: { contains: term, mode: 'insensitive' } },
        { category: { contains: term, mode: 'insensitive' } },
        { bodyOrFileUrl: { contains: term, mode: 'insensitive' } },
      ];
    }

    const [total, data] = await Promise.all([
      this.prisma.resource.count({ where }),
      this.prisma.resource.findMany({
        where,
        skip,
        take: limit,
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
   * Public: Full-Text Search across Acts, Rules, Forms, Circulars & Bulletins.
   * Matches terms across title, category, and contents.
   */
  async search(queryText: string, type?: ResourceType, category?: string) {
    const trimmed = queryText.trim();
    if (!trimmed) return [];

    const words = trimmed.split(/\s+/).filter(Boolean);

    const andConditions: Prisma.ResourceWhereInput[] = words.map((word) => ({
      OR: [
        { title: { contains: word, mode: 'insensitive' } },
        { category: { contains: word, mode: 'insensitive' } },
        { bodyOrFileUrl: { contains: word, mode: 'insensitive' } },
      ],
    }));

    const where: Prisma.ResourceWhereInput = {
      AND: andConditions,
      ...(type && { type }),
      ...(category && { category: { contains: category, mode: 'insensitive' } }),
    };

    return this.prisma.resource.findMany({
      where,
      take: 50,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Public: Get single resource by ID.
   */
  async findOne(id: string) {
    const resource = await this.prisma.resource.findUnique({ where: { id } });
    if (!resource) {
      throw new NotFoundException(`Resource ${id} not found`);
    }
    return resource;
  }

  /**
   * Staff: Create a resource in the knowledge library.
   */
  async create(dto: CreateResourceDto, currentUser: AuthenticatedUser) {
    const resource = await this.prisma.resource.create({
      data: {
        type: dto.type,
        title: dto.title.trim(),
        category: dto.category.trim(),
        bodyOrFileUrl: sanitizeHtmlContent(dto.bodyOrFileUrl),
      },
    });

    await this.auditService.log({
      actorId: currentUser.id,
      action: 'RESOURCE_CREATED',
      entity: 'Resource',
      entityId: resource.id,
      metadata: { title: resource.title, type: resource.type, category: resource.category },
    });

    return resource;
  }

  /**
   * Staff: Update a resource.
   */
  async update(id: string, dto: UpdateResourceDto, currentUser: AuthenticatedUser) {
    await this.findOne(id);

    const updated = await this.prisma.resource.update({
      where: { id },
      data: {
        ...(dto.type !== undefined && { type: dto.type }),
        ...(dto.title !== undefined && { title: dto.title.trim() }),
        ...(dto.category !== undefined && { category: dto.category.trim() }),
        ...(dto.bodyOrFileUrl !== undefined && { bodyOrFileUrl: sanitizeHtmlContent(dto.bodyOrFileUrl) }),
      },
    });

    await this.auditService.log({
      actorId: currentUser.id,
      action: 'RESOURCE_UPDATED',
      entity: 'Resource',
      entityId: id,
    });

    return updated;
  }

  /**
   * Staff: Delete a resource.
   */
  async remove(id: string, currentUser: AuthenticatedUser) {
    await this.findOne(id);
    await this.prisma.resource.delete({ where: { id } });

    await this.auditService.log({
      actorId: currentUser.id,
      action: 'RESOURCE_DELETED',
      entity: 'Resource',
      entityId: id,
    });

    return { success: true, message: `Resource ${id} deleted` };
  }
}
