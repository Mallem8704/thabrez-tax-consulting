import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import crypto from 'crypto';
import Razorpay from 'razorpay';

export interface RazorpayOrderResult {
  orderId: string;
  amount: number; // in paise
  currency: string;
  keyId: string;
}

@Injectable()
export class RazorpayService {
  private readonly logger = new Logger(RazorpayService.name);
  private readonly razorpay: Razorpay | null = null;
  private readonly keyId: string;
  private readonly keySecret: string;
  private readonly webhookSecret: string;

  constructor(private readonly configService: ConfigService) {
    this.keyId = this.configService.get<string>('RAZORPAY_KEY_ID') || 'rzp_test_key';
    this.keySecret = this.configService.get<string>('RAZORPAY_KEY_SECRET') || 'rzp_test_secret';
    this.webhookSecret =
      this.configService.get<string>('RAZORPAY_WEBHOOK_SECRET') || this.keySecret;

    if (this.keyId && this.keySecret && !this.keyId.startsWith('mock_')) {
      try {
        this.razorpay = new Razorpay({
          key_id: this.keyId,
          key_secret: this.keySecret,
        });
      } catch (err) {
        this.logger.warn(`Razorpay init warning: ${(err as Error).message}`);
      }
    }
  }

  /**
   * Create Razorpay order in INR (amount converted to paise: INR * 100).
   */
  async createOrder(
    amountInr: number,
    receiptId: string,
    notes?: Record<string, string>,
  ): Promise<RazorpayOrderResult> {
    const amountInPaise = Math.round(amountInr * 100);

    if (!this.razorpay) {
      this.logger.log(
        `[RAZORPAY STUB] Created mock order for INR ${amountInr} (receipt: ${receiptId})`,
      );
      return {
        orderId: `order_mock_${Date.now()}`,
        amount: amountInPaise,
        currency: 'INR',
        keyId: this.keyId,
      };
    }

    const order = await this.razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: receiptId,
      notes: notes || {},
    });

    return {
      orderId: order.id,
      amount: order.amount as number,
      currency: order.currency,
      keyId: this.keyId,
    };
  }

  /**
   * Verifies the cryptographic HMAC SHA-256 signature on incoming Razorpay webhooks.
   * Uses timingSafeEqual to protect against timing attacks.
   */
  verifyWebhookSignature(
    rawBody: string | Buffer,
    signature: string,
    secret?: string,
  ): boolean {
    if (!signature) return false;

    const webhookSecret = secret || this.webhookSecret;
    const bodyString = typeof rawBody === 'string' ? rawBody : rawBody.toString('utf8');

    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(bodyString)
      .digest('hex');

    const signatureBuffer = Buffer.from(signature, 'utf8');
    const expectedBuffer = Buffer.from(expectedSignature, 'utf8');

    if (signatureBuffer.length !== expectedBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(signatureBuffer, expectedBuffer);
  }
}
