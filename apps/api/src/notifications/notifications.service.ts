import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import {
  EmailTemplates,
  type DeadlineReminderEmailParams,
  type CaseStatusChangedEmailParams,
  type InvoiceIssuedEmailParams,
  type WelcomeClientEmailParams,
} from './templates/email-templates';
import { Msg91Service } from './msg91.service';

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private readonly resend: Resend | null = null;
  private readonly defaultFrom: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly msg91Service: Msg91Service,
  ) {
    const resendApiKey = this.configService.get<string>('RESEND_API_KEY');
    this.defaultFrom =
      this.configService.get<string>('EMAIL_FROM') || 'Thabrez & Co. <filings@thabrez.com>';

    if (resendApiKey && !resendApiKey.startsWith('mock_')) {
      this.resend = new Resend(resendApiKey);
    }
  }

  /**
   * Generic sendEmail method wrapping Resend API.
   */
  async sendEmail(options: SendEmailOptions): Promise<{ success: boolean; id?: string }> {
    const to = Array.isArray(options.to) ? options.to : [options.to];
    const from = options.from || this.defaultFrom;

    if (!this.resend) {
      this.logger.log(
        `[RESEND STUB] Simulating email to [${to.join(', ')}] with subject: "${options.subject}"`,
      );
      return { success: true, id: `mock_email_${Date.now()}` };
    }

    try {
      const response = await this.resend.emails.send({
        from,
        to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      });

      if (response.error) {
        this.logger.error(`[Resend Error] ${response.error.message}`);
        return { success: false };
      }

      this.logger.log(`[Resend Success] Email sent to [${to.join(', ')}], id=${response.data?.id}`);
      return { success: true, id: response.data?.id };
    } catch (err) {
      this.logger.error(`[Resend Exception] ${(err as Error).message}`);
      return { success: false };
    }
  }

  /**
   * Typed template: Send Compliance Deadline Reminder (Email + optional SMS/WhatsApp)
   */
  async sendDeadlineReminder(
    params: DeadlineReminderEmailParams,
    phone?: string | null,
  ): Promise<void> {
    const { subject, html, text } = EmailTemplates.deadlineReminder(params);
    await this.sendEmail({ to: params.to, subject, html, text });

    // Urgent multichannel alert via SMS / WhatsApp if phone available
    if (phone) {
      const smsMessage = `[Thabrez & Co] Reminder: Your ${params.serviceType} statutory filing deadline is in ${params.daysRemaining} day(s) (${params.dueDate}). Review details: ${params.portalUrl}`;
      await this.msg91Service.sendSms({
        to: phone,
        message: smsMessage,
      });

      // For 1-day urgency, trigger WhatsApp
      if (params.daysRemaining <= 1) {
        await this.msg91Service.sendWhatsApp({
          to: phone,
          templateName: 'urgent_deadline_alert',
          parameters: {
            client_name: params.clientName,
            service: params.serviceType,
            due_date: params.dueDate,
          },
        });
      }
    }
  }

  /**
   * Typed template: Send Case Status Changed Notification
   */
  async sendCaseStatusChanged(params: CaseStatusChangedEmailParams): Promise<void> {
    const { subject, html, text } = EmailTemplates.caseStatusChanged(params);
    await this.sendEmail({ to: params.to, subject, html, text });
  }

  /**
   * Typed template: Send Invoice Issued Notification
   */
  async sendInvoiceIssued(params: InvoiceIssuedEmailParams): Promise<void> {
    const { subject, html, text } = EmailTemplates.invoiceIssued(params);
    await this.sendEmail({ to: params.to, subject, html, text });
  }

  /**
   * Typed template: Send Welcome Onboarding Email
   */
  async sendWelcomeClient(params: WelcomeClientEmailParams): Promise<void> {
    const { subject, html, text } = EmailTemplates.welcomeClient(params);
    await this.sendEmail({ to: params.to, subject, html, text });
  }
}
