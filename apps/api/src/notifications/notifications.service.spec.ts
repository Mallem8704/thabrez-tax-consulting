import { NotificationsService } from './notifications.service';
import { Msg91Service } from './msg91.service';
import { ConfigService } from '@nestjs/config';

describe('NotificationsService & Msg91 Integration Tests', () => {
  let notificationsService: NotificationsService;
  let mockConfigService: { get: jest.Mock };
  let mockMsg91Service: { sendSms: jest.Mock; sendWhatsApp: jest.Mock };

  beforeEach(() => {
    mockConfigService = {
      get: jest.fn().mockImplementation((key: string) => {
        if (key === 'RESEND_API_KEY') return 'mock_resend_key';
        if (key === 'EMAIL_FROM') return 'Thabrez & Co. <test@thabrez.com>';
        return null;
      }),
    };

    mockMsg91Service = {
      sendSms: jest.fn().mockResolvedValue({ success: true, messageId: 'sms_123' }),
      sendWhatsApp: jest.fn().mockResolvedValue({ success: true }),
    };

    notificationsService = new NotificationsService(
      mockConfigService as unknown as ConfigService,
      mockMsg91Service as unknown as Msg91Service,
    );
  });

  describe('Deadline Reminder Notification', () => {
    it('should dispatch email and trigger SMS via MSG91 for upcoming deadline', async () => {
      await notificationsService.sendDeadlineReminder(
        {
          to: 'client@example.com',
          clientName: 'Sharma Corp',
          serviceType: 'GST_FILING',
          dueDate: '2026-08-20',
          daysRemaining: 3,
          portalUrl: 'http://localhost:3000/portal',
        },
        '+919876543210',
      );

      // Verify SMS was sent via MSG91
      expect(mockMsg91Service.sendSms).toHaveBeenCalledWith(
        expect.objectContaining({
          to: '+919876543210',
          message: expect.stringContaining('GST_FILING statutory filing deadline is in 3 day(s)'),
        }),
      );

      // Verify WhatsApp was NOT sent for 3-day (only for 1-day urgency)
      expect(mockMsg91Service.sendWhatsApp).not.toHaveBeenCalled();
    });

    it('should trigger both SMS and WhatsApp for 1-day urgent deadline', async () => {
      await notificationsService.sendDeadlineReminder(
        {
          to: 'client@example.com',
          clientName: 'Sharma Corp',
          serviceType: 'ITR_FILING',
          dueDate: '2026-07-31',
          daysRemaining: 1,
          portalUrl: 'http://localhost:3000/portal',
        },
        '+919876543210',
      );

      expect(mockMsg91Service.sendSms).toHaveBeenCalled();
      expect(mockMsg91Service.sendWhatsApp).toHaveBeenCalledWith(
        expect.objectContaining({
          to: '+919876543210',
          templateName: 'urgent_deadline_alert',
        }),
      );
    });
  });

  describe('Typed Email Templates', () => {
    it('should send case status changed email', async () => {
      const spy = jest.spyOn(notificationsService, 'sendEmail');

      await notificationsService.sendCaseStatusChanged({
        to: 'client@example.com',
        clientName: 'Sharma Corp',
        caseId: 'case_123',
        serviceType: 'GST_FILING',
        oldStatus: 'IN_REVIEW',
        newStatus: 'FILED',
        portalUrl: 'http://localhost:3000/portal',
      });

      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'client@example.com',
          subject: expect.stringContaining('is now FILED'),
        }),
      );
    });

    it('should send invoice issued email with amount and due date', async () => {
      const spy = jest.spyOn(notificationsService, 'sendEmail');

      await notificationsService.sendInvoiceIssued({
        to: 'client@example.com',
        clientName: 'Sharma Corp',
        invoiceId: 'inv_123',
        amount: '15000',
        dueDate: '2026-08-30',
        paymentUrl: 'http://localhost:3000/portal/invoices/inv_123/pay',
      });

      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'client@example.com',
          subject: expect.stringContaining('INR 15000'),
        }),
      );
    });
  });
});
