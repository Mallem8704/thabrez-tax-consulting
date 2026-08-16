import { BadRequestException, ForbiddenException } from '@nestjs/common';
import crypto from 'crypto';
import { UserRole, InvoiceStatus } from '@thabrez/db';
import { InvoicesService } from './invoices.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { NotificationsService } from '../notifications/notifications.service';
import { RazorpayService } from './razorpay.service';
import { InvoicePdfService } from './invoice-pdf.service';
import { ConfigService } from '@nestjs/config';
import type { AuthenticatedUser } from '../auth/decorators/current-user.decorator';

describe('InvoicesService — Drafts, Razorpay Webhooks, Signature Verification & PDF Generation', () => {
  let invoicesService: InvoicesService;
  let razorpayService: RazorpayService;
  let invoicePdfService: InvoicePdfService;
  let mockPrisma: any;
  let mockAuditService: { log: jest.Mock };
  let mockNotificationsService: { sendInvoiceIssued: jest.Mock };
  let mockConfigService: { get: jest.Mock };

  const webhookSecret = 'test_webhook_secret_key_123';

  const clientUser: AuthenticatedUser = {
    id: 'user_client_1',
    email: 'client1@example.com',
    phone: '9876543210',
    role: UserRole.CLIENT,
    clientProfileId: 'client_profile_1',
  };

  const staffUser: AuthenticatedUser = {
    id: 'user_ca_1',
    email: 'ca@thabrez.com',
    phone: '9000000010',
    role: UserRole.SENIOR_CA,
    clientProfileId: null,
  };

  beforeEach(() => {
    mockAuditService = {
      log: jest.fn().mockResolvedValue(undefined),
    };

    mockNotificationsService = {
      sendInvoiceIssued: jest.fn().mockResolvedValue(undefined),
    };

    mockConfigService = {
      get: jest.fn().mockImplementation((key: string) => {
        if (key === 'RAZORPAY_KEY_ID') return 'mock_key_id';
        if (key === 'RAZORPAY_KEY_SECRET') return 'mock_key_secret';
        if (key === 'RAZORPAY_WEBHOOK_SECRET') return webhookSecret;
        return null;
      }),
    };

    mockPrisma = {
      client: {
        findUnique: jest.fn(),
      },
      invoice: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn().mockResolvedValue(41),
        create: jest.fn(),
        update: jest.fn(),
      },
    };

    razorpayService = new RazorpayService(mockConfigService as unknown as ConfigService);
    invoicePdfService = new InvoicePdfService();

    invoicesService = new InvoicesService(
      mockPrisma as unknown as PrismaService,
      mockAuditService as unknown as AuditService,
      mockNotificationsService as unknown as NotificationsService,
      razorpayService,
      invoicePdfService,
    );
  });

  describe('Razorpay Webhook Signature Verification', () => {
    const rawPayload = JSON.stringify({
      event: 'payment.captured',
      payload: {
        payment: {
          entity: {
            id: 'pay_rzp_987654321',
            order_id: 'order_rzp_123456',
            amount: 1770000,
            status: 'captured',
            notes: { invoiceId: 'inv_abc_123' },
          },
        },
      },
    });

    it('should REJECT an incoming webhook with an INVALID signature (throws BadRequestException)', async () => {
      const invalidSignature = 'invalid_tampered_signature_hex_1234567890abcdef';

      await expect(
        invoicesService.handleRazorpayWebhook(rawPayload, invalidSignature),
      ).rejects.toThrow(BadRequestException);

      // Verify no DB update occurred
      expect(mockPrisma.invoice.update).not.toHaveBeenCalled();
    });

    it('should ACCEPT an incoming webhook with a VALID HMAC SHA-256 signature and mark invoice PAID', async () => {
      // Generate genuine HMAC SHA-256 signature
      const validSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(rawPayload)
        .digest('hex');

      mockPrisma.invoice.findUnique.mockResolvedValue({
        id: 'inv_abc_123',
        amount: 17700,
        status: InvoiceStatus.SENT,
        razorpayOrderId: 'order_rzp_123456',
      });

      mockPrisma.invoice.update.mockImplementation(({ data }: any) => ({
        id: 'inv_abc_123',
        ...data,
      }));

      const res = await invoicesService.handleRazorpayWebhook(rawPayload, validSignature);

      expect(res.status).toBe('processed');
      expect(res.paid).toBe(true);

      // Verify DB update
      expect(mockPrisma.invoice.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'inv_abc_123' },
          data: expect.objectContaining({
            status: InvoiceStatus.PAID,
            razorpayPaymentId: 'pay_rzp_987654321',
          }),
        }),
      );

      // Verify AuditLog entry
      expect(mockAuditService.log).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'INVOICE_PAID',
          entity: 'Invoice',
          entityId: 'inv_abc_123',
        }),
      );
    });
  });

  describe('Invoice Lifecycle: Draft -> Send -> Payment', () => {
    it('should create a DRAFT invoice with sequential invoice number', async () => {
      mockPrisma.client.findUnique.mockResolvedValue({ id: 'client_profile_1' });
      mockPrisma.invoice.create.mockImplementation(({ data }: any) => ({
        id: 'new_inv_1',
        ...data,
      }));

      const res = await invoicesService.create(
        {
          clientId: 'client_profile_1',
          amount: 17700,
          notes: 'GST Filing FY24',
          lineItems: [
            {
              description: 'GST Filing',
              quantity: 1,
              unitPrice: 15000,
              amount: 15000,
            },
          ],
        },
        staffUser,
      );

      expect(res.status).toBe(InvoiceStatus.DRAFT);
      expect(res.invoiceNumber).toMatch(/^INV-\d{4}-\d{5}$/);
      expect(mockAuditService.log).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'INVOICE_CREATED' }),
      );
    });

    it('should transition invoice from DRAFT to SENT and send email notification', async () => {
      mockPrisma.invoice.findUnique.mockResolvedValue({
        id: 'inv_draft_1',
        invoiceNumber: 'INV-2026-00042',
        amount: 17700,
        status: InvoiceStatus.DRAFT,
        client: {
          companyName: 'Mehta Corp',
          user: { email: 'mehta@example.com' },
        },
      });

      mockPrisma.invoice.update.mockResolvedValue({
        id: 'inv_draft_1',
        status: InvoiceStatus.SENT,
      });

      await invoicesService.sendInvoice('inv_draft_1', staffUser);

      expect(mockPrisma.invoice.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'inv_draft_1' },
          data: expect.objectContaining({ status: InvoiceStatus.SENT }),
        }),
      );

      expect(mockNotificationsService.sendInvoiceIssued).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'mehta@example.com',
          invoiceId: 'INV-2026-00042',
        }),
      );
    });
  });

  describe('Invoice PDF Generation with Letterhead', () => {
    it('should render a valid PDF document with firm letterhead and line items', async () => {
      mockPrisma.invoice.findUnique.mockResolvedValue({
        id: 'inv_pdf_1',
        invoiceNumber: 'INV-2026-00100',
        amount: 17700,
        status: InvoiceStatus.SENT,
        issuedAt: new Date('2026-08-16'),
        dueDate: new Date('2026-08-30'),
        clientId: 'client_profile_1',
        client: {
          userId: 'user_client_1',
          companyName: 'Sharma & Sons',
          pan: 'ABCDE1234F',
          gstin: '27ABCDE1234F1Z5',
          user: { email: 'sharma@example.com' },
        },
        lineItems: [
          {
            description: 'Annual GST Return Filing',
            quantity: 1,
            unitPrice: 15000,
            amount: 15000,
          },
        ],
      });

      const pdfBytes = await invoicesService.getInvoicePdf('inv_pdf_1', clientUser);

      expect(pdfBytes).toBeInstanceOf(Uint8Array);
      expect(pdfBytes.length).toBeGreaterThan(1000);

      // Verify PDF header magic bytes "%PDF-"
      const header = Buffer.from(pdfBytes.slice(0, 5)).toString('utf8');
      expect(header).toBe('%PDF-');
    });

    it("should REJECT a CLIENT attempting to download another client's invoice PDF", async () => {
      mockPrisma.invoice.findUnique.mockResolvedValue({
        id: 'inv_other_client',
        clientId: 'client_profile_99',
        client: { userId: 'user_other_client' },
      });

      await expect(
        invoicesService.getInvoicePdf('inv_other_client', clientUser),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
