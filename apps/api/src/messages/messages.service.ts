import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { UserRole } from '@thabrez/db';

import { CreateMessageDto } from './dto/create-message.dto';
import type { AuthenticatedUser } from '../auth/decorators/current-user.decorator';
import { sanitizeHtmlContent } from '../common/utils/sanitizer.util';

@Injectable()
export class MessagesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  /**
   * Post a message within a case thread.
   * Access check: Only the client owner and assigned staff can participate.
   */
  async create(dto: CreateMessageDto, currentUser: AuthenticatedUser) {
    const c = await this.prisma.case.findUnique({
      where: { id: dto.caseId },
      include: { client: true },
    });

    if (!c) {
      throw new NotFoundException(`Case ${dto.caseId} not found`);
    }

    this.assertCaseAccess(c, currentUser, 'post messages in');

    const message = await this.prisma.message.create({
      data: {
        caseId: dto.caseId,
        senderId: currentUser.id,
        body: sanitizeHtmlContent(dto.body.trim()),
      },
      include: {
        sender: { select: { id: true, email: true, role: true } },
      },
    });

    await this.auditService.log({
      actorId: currentUser.id,
      action: 'MESSAGE_SENT',
      entity: 'Message',
      entityId: message.id,
      metadata: {
        caseId: dto.caseId,
        senderRole: currentUser.role,
      },
    });

    return message;
  }

  /**
   * List all threaded messages for a case in chronological order.
   */
  async findByCaseId(caseId: string, currentUser: AuthenticatedUser) {
    const c = await this.prisma.case.findUnique({
      where: { id: caseId },
      include: { client: true },
    });

    if (!c) {
      throw new NotFoundException(`Case ${caseId} not found`);
    }

    this.assertCaseAccess(c, currentUser, 'view messages for');

    return this.prisma.message.findMany({
      where: { caseId },
      include: {
        sender: { select: { id: true, email: true, role: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  /**
   * Delete a message (Sender or Admin only).
   */
  async remove(id: string, currentUser: AuthenticatedUser) {
    const message = await this.prisma.message.findUnique({ where: { id } });
    if (!message) {
      throw new NotFoundException(`Message ${id} not found`);
    }

    if (currentUser.role !== UserRole.ADMIN && message.senderId !== currentUser.id) {
      throw new ForbiddenException('You can only delete your own messages.');
    }

    await this.prisma.message.delete({ where: { id } });

    await this.auditService.log({
      actorId: currentUser.id,
      action: 'MESSAGE_DELETED',
      entity: 'Message',
      entityId: id,
      metadata: { caseId: message.caseId },
    });

    return { success: true, message: `Message ${id} deleted` };
  }

  private assertCaseAccess(
    c: { clientId: string; assignedToId?: string | null; client: { userId: string; assignedCaId?: string | null } },
    user: AuthenticatedUser,
    actionDesc: string,
  ): void {
    if (user.role === UserRole.CLIENT) {
      if (c.clientId !== user.clientProfileId && c.client.userId !== user.id) {
        throw new ForbiddenException(`Access denied: You cannot ${actionDesc} another client's case.`);
      }
    } else if (user.role === UserRole.ASSOCIATE) {
      const isAssignee = c.assignedToId === user.id;
      const isClientCa = c.client.assignedCaId === user.id;
      if (!isAssignee && !isClientCa) {
        throw new ForbiddenException(`Access denied: Associates cannot ${actionDesc} unassigned cases.`);
      }
    }
  }
}
