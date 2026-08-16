import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { NotificationsService } from '../notifications/notifications.service';
import { RazorpayService } from './razorpay.service';
import { InvoicePdfService } from './invoice-pdf.service';
import { UserRole, InvoiceStatus, type Prisma } from '@thabrez/db';

import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { QueryInvoicesDto } from './dto/query-invoices.dto';
import type { AuthenticatedUser } from '../auth/decorators/current-user.decorator';
import type { PaginatedResult } from '../clients/clients.service';

@Injectable()
export class InvoicesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
    private readonly notificationsService: NotificationsService,
    private readonly razorpayService: RazorpayService,
    private readonly invoicePdfService: InvoicePdfService,
  ) {}

  /**
   * List invoices with role-based scoping and pagination.
   */
  async findAll(
    currentUser: AuthenticatedUser,
    query: QueryInvoicesDto,
  ): Promise<PaginatedResult<unknown>> {
    const page = Math.max(1, query.page || 1);
    const limit = Math.min(100, Math.max(1, query.limit || 20));
    const skip = (page - 1) * limit;

    const where: Prisma.InvoiceWhereInput = {};

    // 1. Role-based scoping
    if (currentUser.role === UserRole.CLIENT) {
      if (!currentUser.clientProfileId) {
        return { data: [], meta: { total: 0, page, limit, totalPages: 0 } };
      }
      where.clientId = currentUser.clientProfileId;
    } else if (currentUser.role === UserRole.ASSOCIATE) {
      where.client = { assignedCaId: currentUser.id };
    } else if (query.clientId) {
      where.clientId = query.clientId;
    }

    if (query.status) {
      where.status = query.status;
    }

    const [total, data] = await Promise.all([
      this.prisma.invoice.count({ where }),
      this.prisma.invoice.findMany({
        where,
        skip,
        take: limit,
        include: {
          client: { select: { id: true, companyName: true, pan: true, gstin: true } },
          case: { select: { id: true, serviceType: true, status: true } },
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
   * Get single invoice details with access check.
   */
  async findOne(id: string, currentUser: AuthenticatedUser) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id },
      include: {
        client: {
          include: {
            user: { select: { id: true, email: true, phone: true } },
            assignedCa: { select: { id: true, email: true, role: true } },
          },
        },
        case: true,
      },
    });

    if (!invoice) {
      throw new NotFoundException(`Invoice ${id} not found`);
    }

    this.assertInvoiceAccess(invoice, currentUser);

    return invoice;
  }

  /**
   * Staff creates a draft invoice against a client/case with itemized line items.
   * Restricted to ADMIN, SENIOR_CA, ASSOCIATE.
   */
  async create(dto: CreateInvoiceDto, currentUser: AuthenticatedUser) {
    const client = await this.prisma.client.findUnique({ where: { id: dto.clientId } });
    if (!client) {
      throw new NotFoundException(`Client ${dto.clientId} not found`);
    }

    // Generate unique sequential invoice number (e.g. INV-2026-00042)
    const year = new Date().getFullYear();
    const count = await this.prisma.invoice.count();
    const invoiceNumber = `INV-${year}-${String(count + 1).padStart(5, '0')}`;

    const invoice = await this.prisma.invoice.create({
      data: {
        invoiceNumber,
        clientId: dto.clientId,
        caseId: dto.caseId,
        amount: dto.amount,
        status: InvoiceStatus.DRAFT,
        lineItems: dto.lineItems as unknown as Prisma.InputJsonValue,
        notes: dto.notes,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      },
      include: {
        client: { select: { id: true, companyName: true } },
      },
    });

    await this.auditService.log({
      actorId: currentUser.id,
      action: 'INVOICE_CREATED',
      entity: 'Invoice',
      entityId: invoice.id,
      metadata: {
        invoiceNumber,
        amount: dto.amount,
        clientId: dto.clientId,
      },
    });

    return invoice;
  }

  /**
   * Transitions invoice status from DRAFT to SENT and emails client a payment link.
   */
  async sendInvoice(id: string, currentUser: AuthenticatedUser) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id },
      include: {
        client: {
          include: {
            user: { select: { email: true, phone: true } },
          },
        },
      },
    });

    if (!invoice) {
      throw new NotFoundException(`Invoice ${id} not found`);
    }

    const issuedAt = new Date();
    const updated = await this.prisma.invoice.update({
      where: { id },
      data: {
        status: InvoiceStatus.SENT,
        issuedAt,
      },
      include: {
        client: { select: { companyName: true, user: { select: { email: true } } } },
      },
    });

    const portalUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const paymentUrl = `${portalUrl}/portal/invoices/${id}/pay`;
    const formattedAmount = Number(invoice.amount).toLocaleString('en-IN');
    const formattedDueDate = invoice.dueDate
      ? invoice.dueDate.toISOString().split('T')[0]
      : 'Upon Receipt';

    const clientEmail = invoice.client.user?.email || 'client@thabrez.com';
    const clientName = invoice.client.companyName || clientEmail.split('@')[0] || 'Valued Client';

    // Dispatch email notification to client
    await this.notificationsService.sendInvoiceIssued({
      to: clientEmail,
      clientName,
      invoiceId: invoice.invoiceNumber || invoice.id,
      amount: formattedAmount,
      dueDate: formattedDueDate || '',
      paymentUrl,
    });

    await this.auditService.log({
      actorId: currentUser.id,
      action: 'INVOICE_SENT',
      entity: 'Invoice',
      entityId: id,
      metadata: {
        invoiceNumber: invoice.invoiceNumber,
        amount: Number(invoice.amount),
        email: invoice.client.user.email,
      },
    });

    return updated;
  }

  /**
   * Creates a Razorpay order for online payment checkout.
   */
  async createRazorpayOrder(id: string, currentUser: AuthenticatedUser) {
    const invoice = await this.findOne(id, currentUser);

    if (invoice.status === InvoiceStatus.PAID) {
      throw new BadRequestException('This invoice has already been paid.');
    }

    const amountInr = Number(invoice.amount);
    const orderResult = await this.razorpayService.createOrder(
      amountInr,
      invoice.id,
      {
        invoiceId: invoice.id,
        invoiceNumber: invoice.invoiceNumber || '',
        clientId: invoice.clientId,
      },
    );

    // Save orderId on the invoice
    await this.prisma.invoice.update({
      where: { id },
      data: { razorpayOrderId: orderResult.orderId },
    });

    await this.auditService.log({
      actorId: currentUser.id,
      action: 'INVOICE_RAZORPAY_ORDER_CREATED',
      entity: 'Invoice',
      entityId: id,
      metadata: {
        orderId: orderResult.orderId,
        amountPaise: orderResult.amount,
      },
    });

    return {
      orderId: orderResult.orderId,
      keyId: orderResult.keyId,
      amount: orderResult.amount,
      currency: orderResult.currency,
      invoiceNumber: invoice.invoiceNumber,
      clientName: invoice.client.companyName || invoice.client.user.email,
    };
  }

  /**
   * Razorpay Webhook Handler:
   * 1. Verifies cryptographic signature using HMAC SHA-256.
   * 2. Rejects invalid signatures with BadRequestException.
   * 3. Marks invoice as PAID and records razorpayPaymentId.
   */
  async handleRazorpayWebhook(rawBody: string | Buffer, signature: string) {
    const isValid = this.razorpayService.verifyWebhookSignature(rawBody, signature);

    if (!isValid) {
      throw new BadRequestException('Invalid Razorpay webhook signature');
    }

    const payload = typeof rawBody === 'string' ? JSON.parse(rawBody) : JSON.parse(rawBody.toString('utf8'));
    const eventType = payload.event;

    // Handle payment.captured or order.paid
    if (eventType === 'payment.captured' || eventType === 'order.paid') {
      const paymentEntity = payload.payload?.payment?.entity;
      const orderId = paymentEntity?.order_id || payload.payload?.order?.entity?.id;
      const paymentId = paymentEntity?.id;
      const invoiceIdFromNotes = paymentEntity?.notes?.invoiceId;

      let invoice = null;

      if (orderId) {
        invoice = await this.prisma.invoice.findUnique({ where: { razorpayOrderId: orderId } });
      }

      if (!invoice && invoiceIdFromNotes) {
        invoice = await this.prisma.invoice.findUnique({ where: { id: invoiceIdFromNotes } });
      }

      if (invoice && invoice.status !== InvoiceStatus.PAID) {
        const updated = await this.prisma.invoice.update({
          where: { id: invoice.id },
          data: {
            status: InvoiceStatus.PAID,
            razorpayPaymentId: paymentId || `pay_${Date.now()}`,
            paidAt: new Date(),
          },
        });

        await this.auditService.log({
          actorId: 'RAZORPAY_WEBHOOK',
          action: 'INVOICE_PAID',
          entity: 'Invoice',
          entityId: invoice.id,
          metadata: {
            razorpayOrderId: orderId,
            razorpayPaymentId: paymentId,
            amount: Number(invoice.amount),
          },
        });

        return { status: 'processed', invoiceId: updated.id, paid: true };
      }
    }

    return { status: 'acknowledged', event: eventType };
  }

  /**
   * Generates and returns a downloadable PDF Tax Invoice with firm letterhead.
   */
  async getInvoicePdf(id: string, currentUser: AuthenticatedUser): Promise<Uint8Array> {
    const invoice = await this.findOne(id, currentUser);

    const lineItems = Array.isArray(invoice.lineItems)
      ? (invoice.lineItems as any[])
      : [
          {
            description: 'Chartered Accountant Professional Services',
            quantity: 1,
            unitPrice: Number(invoice.amount),
            amount: Number(invoice.amount),
          },
        ];

    const clientEmail = invoice.client.user?.email || 'client@thabrez.com';
    const clientName = invoice.client.companyName || clientEmail.split('@')[0] || 'Valued Client';
    const issuedAtStr = (invoice.issuedAt ? invoice.issuedAt.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]) || '';
    const dueDateStr = (invoice.dueDate ? invoice.dueDate.toISOString().split('T')[0] : 'Upon Receipt') || 'Upon Receipt';

    const pdfBytes = await this.invoicePdfService.generateInvoicePdf({
      invoiceNumber: invoice.invoiceNumber || `INV-${invoice.id.substring(0, 8).toUpperCase()}`,
      issuedAt: issuedAtStr,
      dueDate: dueDateStr,
      status: invoice.status,
      clientName,
      companyName: invoice.client.companyName,
      clientPan: invoice.client.pan,
      clientGstin: invoice.client.gstin,
      lineItems,
      totalAmount: Number(invoice.amount),
      notes: invoice.notes,
    });

    await this.auditService.log({
      actorId: currentUser.id,
      action: 'INVOICE_PDF_DOWNLOADED',
      entity: 'Invoice',
      entityId: id,
      metadata: { invoiceNumber: invoice.invoiceNumber },
    });

    return pdfBytes;
  }

  private assertInvoiceAccess(
    invoice: { clientId: string; client: { userId: string; assignedCaId?: string | null } },
    user: AuthenticatedUser,
  ) {
    if (user.role === UserRole.CLIENT) {
      if (invoice.clientId !== user.clientProfileId && invoice.client.userId !== user.id) {
        throw new ForbiddenException('Access denied: You can only access your own invoices.');
      }
    } else if (user.role === UserRole.ASSOCIATE) {
      if (invoice.client.assignedCaId !== user.id) {
        throw new ForbiddenException('Access denied: Associates can only access invoices for assigned clients.');
      }
    }
  }
}
