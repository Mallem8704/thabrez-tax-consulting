import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { TurnstileService } from './turnstile.service';
import { LeadRateLimiterService } from './lead-rate-limiter.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { NotificationsService } from '../notifications/notifications.service';
import { ConfigService } from '@nestjs/config';

describe('LeadsService — Rate-limiting, Cloudflare Turnstile & Staff Auto-email', () => {
  let leadsService: LeadsService;
  let turnstileService: TurnstileService;
  let rateLimiter: LeadRateLimiterService;
  let mockPrisma: any;
  let mockAuditService: { log: jest.Mock };
  let mockNotificationsService: { sendEmail: jest.Mock };

  beforeEach(() => {
    mockAuditService = {
      log: jest.fn().mockResolvedValue(undefined),
    };

    mockNotificationsService = {
      sendEmail: jest.fn().mockResolvedValue({ success: true }),
    };

    mockPrisma = {
      lead: {
        create: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn().mockResolvedValue(1),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const mockConfigService = {
      get: jest.fn().mockReturnValue(null), // dev / mock mode
    };

    turnstileService = new TurnstileService(mockConfigService as unknown as ConfigService);
    rateLimiter = new LeadRateLimiterService();
    rateLimiter.reset();

    leadsService = new LeadsService(
      mockPrisma as unknown as PrismaService,
      mockAuditService as unknown as AuditService,
      mockNotificationsService as unknown as NotificationsService,
      turnstileService,
      rateLimiter,
    );
  });

  describe('Cloudflare Turnstile Verification', () => {
    it('should PASS verification for mock_turnstile_pass token', async () => {
      const isValid = await turnstileService.verifyToken('mock_turnstile_pass', '127.0.0.1');
      expect(isValid).toBe(true);
    });

    it('should REJECT verification for mock_turnstile_fail token', async () => {
      const isValid = await turnstileService.verifyToken('mock_turnstile_fail', '127.0.0.1');
      expect(isValid).toBe(false);
    });

    it('should reject lead submission when Turnstile verification fails', async () => {
      await expect(
        leadsService.createPublicLead(
          {
            name: 'Malicious Bot',
            phone: '9999999999',
            email: 'bot@spam.com',
            turnstileToken: 'mock_turnstile_fail',
          },
          '192.168.1.100',
        ),
      ).rejects.toThrow(BadRequestException);

      expect(mockPrisma.lead.create).not.toHaveBeenCalled();
    });
  });

  describe('Lead Rate Limiting (Max 5 submissions in 10 minutes)', () => {
    it('should ALLOW up to 5 submissions from the same IP, and REJECT the 6th with 429 Too Many Requests', async () => {
      const clientIp = '203.0.113.42';

      mockPrisma.lead.create.mockResolvedValue({
        id: 'lead_1',
        name: 'Prospective Client',
        phone: '9876543210',
        email: 'prospect@example.com',
        serviceInterest: 'GST',
        source: 'contact_form',
        createdAt: new Date(),
      });

      // Submissions 1 through 5 should succeed
      for (let i = 1; i <= 5; i++) {
        const res = await leadsService.createPublicLead(
          {
            name: `Client ${i}`,
            phone: `987654321${i}`,
            email: `client${i}@example.com`,
            turnstileToken: 'mock_turnstile_pass',
          },
          clientIp,
        );
        expect(res.success).toBe(true);
      }

      expect(mockPrisma.lead.create).toHaveBeenCalledTimes(5);

      // 6th submission must be rate-limited
      await expect(
        leadsService.createPublicLead(
          {
            name: 'Client 6',
            phone: '9876543216',
            email: 'client6@example.com',
            turnstileToken: 'mock_turnstile_pass',
          },
          clientIp,
        ),
      ).rejects.toThrow(
        expect.objectContaining({
          status: HttpStatus.TOO_MANY_REQUESTS,
        }),
      );

      // Verify DB was NOT called for 6th attempt
      expect(mockPrisma.lead.create).toHaveBeenCalledTimes(5);
    });
  });

  describe('Lead Creation & Staff Alert', () => {
    it('should create a lead in DB and send an automated email to staff', async () => {
      mockPrisma.lead.create.mockResolvedValue({
        id: 'lead_new_123',
        name: 'Aarav Mehta',
        phone: '+919876543210',
        email: 'aarav@mehtalogistics.com',
        serviceInterest: 'COMPANY_REGISTRATION',
        message: 'Looking to incorporate Private Limited Company.',
        source: 'website_contact_form',
        status: 'NEW',
        createdAt: new Date('2026-08-16T12:00:00.000Z'),
      });

      const res = await leadsService.createPublicLead(
        {
          name: 'Aarav Mehta',
          phone: '+919876543210',
          email: 'aarav@mehtalogistics.com',
          serviceInterest: 'COMPANY_REGISTRATION',
          message: 'Looking to incorporate Private Limited Company.',
          turnstileToken: 'mock_turnstile_pass',
        },
        '127.0.0.1',
      );

      expect(res.success).toBe(true);
      expect(res.leadId).toBe('lead_new_123');

      // Verify email sent to staff
      expect(mockNotificationsService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          subject: expect.stringContaining('Aarav Mehta'),
          html: expect.stringContaining('Looking to incorporate Private Limited Company.'),
        }),
      );

      // Verify AuditLog
      expect(mockAuditService.log).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'LEAD_CREATED',
          entity: 'Lead',
          entityId: 'lead_new_123',
        }),
      );
    });
  });
});
