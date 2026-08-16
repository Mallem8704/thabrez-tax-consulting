import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { NotificationsService } from '../notifications/notifications.service';
import { TurnstileService } from './turnstile.service';
import { LeadRateLimiterService } from './lead-rate-limiter.service';
import { LeadStatus, type Prisma } from '@thabrez/db';

import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { QueryLeadsDto } from './dto/query-leads.dto';
import type { AuthenticatedUser } from '../auth/decorators/current-user.decorator';
import type { PaginatedResult } from '../clients/clients.service';
import { sanitizeHtmlContent } from '../common/utils/sanitizer.util';

@Injectable()
export class LeadsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
    private readonly notificationsService: NotificationsService,
    private readonly turnstileService: TurnstileService,
    private readonly rateLimiter: LeadRateLimiterService,
  ) {}

  /**
   * Public contact / consultation form submission.
   * - Applies rate limiting
   * - Verifies Cloudflare Turnstile token
   * - Creates lead row
   * - Automatically sends alert email to firm staff
   */
  async createPublicLead(dto: CreateLeadDto, clientIp?: string) {
    const rateLimitIdentifier = clientIp || dto.email || dto.phone;
    this.rateLimiter.checkRateLimit(rateLimitIdentifier);

    const isHuman = await this.turnstileService.verifyToken(dto.turnstileToken, clientIp);
    if (!isHuman) {
      throw new BadRequestException(
        'Cloudflare Turnstile security verification failed. Please complete the verification.',
      );
    }

    const lead = await this.prisma.lead.create({
      data: {
        name: dto.name.trim(),
        phone: dto.phone,
        email: dto.email ? dto.email.toLowerCase().trim() : null,
        serviceInterest: dto.serviceInterest || 'General Tax Advisory',
        message: dto.message ? sanitizeHtmlContent(dto.message) : null,
        source: dto.source || 'website_contact_form',
        status: LeadStatus.NEW,
      },
    });

    // Automatically email staff on new inbound consultation lead
    const staffAlertEmail = process.env.STAFF_LEAD_EMAIL || 'consult@thabrez.com';
    const emailSubject = `[New Consultation Lead] ${lead.name} — ${lead.serviceInterest}`;
    const emailHtml = `
      <div style="font-family: sans-serif; padding: 20px; background: #fafafa; border-radius: 8px;">
        <h2 style="color: #09090b;">New Prospective Client Lead</h2>
        <p><strong>Name:</strong> ${lead.name}</p>
        <p><strong>Phone:</strong> <a href="tel:${lead.phone}">${lead.phone}</a></p>
        <p><strong>Email:</strong> <a href="mailto:${lead.email}">${lead.email || 'N/A'}</a></p>
        <p><strong>Service Interest:</strong> ${lead.serviceInterest}</p>
        <p><strong>Message:</strong> ${lead.message || 'No additional notes provided.'}</p>
        <p><strong>Source:</strong> ${lead.source}</p>
        <p><strong>Received At:</strong> ${lead.createdAt.toISOString()}</p>
      </div>
    `;

    await this.notificationsService.sendEmail({
      to: staffAlertEmail,
      subject: emailSubject,
      html: emailHtml,
    });

    await this.auditService.log({
      actorId: 'PUBLIC_LEAD_FORM',
      action: 'LEAD_CREATED',
      entity: 'Lead',
      entityId: lead.id,
      metadata: {
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        source: lead.source,
        clientIp,
      },
    });

    return {
      success: true,
      leadId: lead.id,
      message: 'Thank you for reaching out! A Chartered Accountant from our team will contact you shortly.',
    };
  }

  /**
   * Staff: List and filter inbound leads with pagination.
   */
  async findAll(query: QueryLeadsDto): Promise<PaginatedResult<unknown>> {
    const page = Math.max(1, query.page || 1);
    const limit = Math.min(100, Math.max(1, query.limit || 20));
    const skip = (page - 1) * limit;

    const where: Prisma.LeadWhereInput = {};

    if (query.status) {
      where.status = query.status;
    }

    if (query.search) {
      const term = query.search.trim();
      where.OR = [
        { name: { contains: term, mode: 'insensitive' } },
        { phone: { contains: term, mode: 'insensitive' } },
        { email: { contains: term, mode: 'insensitive' } },
        { serviceInterest: { contains: term, mode: 'insensitive' } },
      ];
    }

    const [total, data] = await Promise.all([
      this.prisma.lead.count({ where }),
      this.prisma.lead.findMany({
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
   * Staff: Get single lead by ID.
   */
  async findOne(id: string) {
    const lead = await this.prisma.lead.findUnique({ where: { id } });
    if (!lead) {
      throw new NotFoundException(`Lead ${id} not found`);
    }
    return lead;
  }

  /**
   * Staff: Update lead lifecycle status and notes.
   */
  async update(id: string, dto: UpdateLeadDto, currentUser: AuthenticatedUser) {
    const existing = await this.findOne(id);

    const updated = await this.prisma.lead.update({
      where: { id },
      data: {
        ...(dto.status !== undefined && { status: dto.status }),
        ...(dto.notes !== undefined && { notes: sanitizeHtmlContent(dto.notes) }),
      },
    });

    await this.auditService.log({
      actorId: currentUser.id,
      action: 'LEAD_UPDATED',
      entity: 'Lead',
      entityId: id,
      metadata: {
        previousStatus: existing.status,
        newStatus: dto.status,
      },
    });

    return updated;
  }

  /**
   * Staff: Delete lead.
   */
  async remove(id: string, currentUser: AuthenticatedUser) {
    await this.findOne(id);
    await this.prisma.lead.delete({ where: { id } });

    await this.auditService.log({
      actorId: currentUser.id,
      action: 'LEAD_DELETED',
      entity: 'Lead',
      entityId: id,
    });

    return { success: true, message: `Lead ${id} deleted` };
  }
}
