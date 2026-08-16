import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { Prisma } from '@thabrez/db';

export interface AuditLogInput {
  actorId?: string;
  action: string;
  entity: string;
  entityId: string;
  metadata?: Prisma.InputJsonValue;
}

/**
 * AuditService — writes immutable AuditLog rows.
 * Never throws: audit failures must not break the main request flow.
 * Used directly by AuditInterceptor and any service that needs manual audit entries.
 */
@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(private readonly prisma: PrismaService) {}

  async log(input: AuditLogInput): Promise<void> {
    try {
      await this.prisma.auditLog.create({
        data: {
          actorId: input.actorId ?? null,
          action: input.action,
          entity: input.entity,
          entityId: input.entityId,
          metadata: input.metadata ?? {},
        },
      });
    } catch (err) {
      // Audit failures are logged but never re-thrown
      this.logger.error('Failed to write AuditLog', err);
    }
  }

  async findAll(filters?: { entity?: string; actorId?: string; limit?: number }) {
    return this.prisma.auditLog.findMany({
      where: {
        ...(filters?.entity && { entity: filters.entity }),
        ...(filters?.actorId && { actorId: filters.actorId }),
      },
      orderBy: { createdAt: 'desc' },
      take: filters?.limit ?? 100,
      include: { actor: { select: { id: true, email: true, role: true } } },
    });
  }
}
