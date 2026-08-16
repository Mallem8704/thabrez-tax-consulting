import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface SendSmsOptions {
  to: string; // e.g. "+919876543210" or "919876543210"
  message: string;
  templateId?: string;
}

export interface SendWhatsAppOptions {
  to: string;
  templateName: string;
  parameters: Record<string, string>;
}

@Injectable()
export class Msg91Service {
  private readonly logger = new Logger(Msg91Service.name);
  private readonly authKey: string | undefined;
  private readonly senderId: string;

  constructor(private readonly configService: ConfigService) {
    this.authKey = this.configService.get<string>('MSG91_API_KEY');
    this.senderId = this.configService.get<string>('MSG91_SENDER_ID') || 'THABRZ';
  }

  /**
   * Sends an SMS reminder via MSG91 Flow / SMS API.
   */
  async sendSms(options: SendSmsOptions): Promise<{ success: boolean; messageId?: string }> {
    const cleanNumber = options.to.replace(/[^0-9]/g, '');

    if (!this.authKey) {
      this.logger.warn(`[MSG91 STUB] No MSG91_API_KEY set. Simulating SMS to ${cleanNumber}: "${options.message}"`);
      return { success: true, messageId: `mock_sms_${Date.now()}` };
    }

    try {
      const response = await fetch('https://control.msg91.com/api/v5/flow/', {
        method: 'POST',
        headers: {
          'authkey': this.authKey,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          template_id: options.templateId || 'default_deadline_flow',
          sender: this.senderId,
          short_url: '1',
          mobiles: cleanNumber,
          VAR1: options.message,
        }),
      });

      const data = (await response.json()) as Record<string, any>;
      this.logger.log(`[MSG91 SMS] Sent to ${cleanNumber}: ${JSON.stringify(data)}`);
      return { success: response.ok, messageId: (data?.request_id as string) || `msg91_${Date.now()}` };
    } catch (err) {
      this.logger.error(`[MSG91 SMS ERROR] Failed to send SMS to ${cleanNumber}: ${(err as Error).message}`);
      return { success: false };
    }
  }

  /**
   * Sends a high-urgency WhatsApp notification via MSG91 WhatsApp API.
   */
  async sendWhatsApp(options: SendWhatsAppOptions): Promise<{ success: boolean }> {
    const cleanNumber = options.to.replace(/[^0-9]/g, '');

    if (!this.authKey) {
      this.logger.warn(
        `[MSG91 STUB] No MSG91_API_KEY set. Simulating WhatsApp to ${cleanNumber} [Template: ${options.templateName}]`,
      );
      return { success: true };
    }

    try {
      const response = await fetch('https://control.msg91.com/api/v5/whatsapp/whatsapp-outbound-message/', {
        method: 'POST',
        headers: {
          'authkey': this.authKey,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          integrated_number: this.senderId,
          content_type: 'template',
          payload: {
            to: cleanNumber,
            type: 'template',
            template: {
              name: options.templateName,
              language: { code: 'en' },
              components: [
                {
                  type: 'body',
                  parameters: Object.entries(options.parameters).map(([_, val]) => ({
                    type: 'text',
                    text: val,
                  })),
                },
              ],
            },
          },
        }),
      });

      const data = await response.json();
      this.logger.log(`[MSG91 WhatsApp] Sent to ${cleanNumber}: ${JSON.stringify(data)}`);
      return { success: response.ok };
    } catch (err) {
      this.logger.error(`[MSG91 WhatsApp ERROR] Failed WhatsApp to ${cleanNumber}: ${(err as Error).message}`);
      return { success: false };
    }
  }
}
