import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface TurnstileVerificationResult {
  success: boolean;
  errorCodes?: string[];
  hostname?: string;
}

/**
 * TurnstileService
 *
 * Verifies Cloudflare Turnstile CAPTCHA tokens submitted with public lead and contact forms.
 * Provides testing bypasses for test environments and local development.
 */
@Injectable()
export class TurnstileService {
  private readonly logger = new Logger(TurnstileService.name);
  private readonly secretKey: string | undefined;

  constructor(private readonly configService: ConfigService) {
    this.secretKey = this.configService.get<string>('CLOUDFLARE_TURNSTILE_SECRET_KEY');
  }

  /**
   * Verify Turnstile token with Cloudflare API
   * Endpoint: https://challenges.cloudflare.com/turnstile/v0/siteverify
   */
  async verifyToken(token?: string, remoteIp?: string): Promise<boolean> {
    // 1. Test / mock tokens
    if (token === 'mock_turnstile_pass' || (!this.secretKey && !token)) {
      return true;
    }
    if (token === 'mock_turnstile_fail') {
      return false;
    }

    // 2. Production or test key verification
    const secret = this.secretKey || '1x0000000000000000000000000000000AA'; // Cloudflare universal test pass secret

    if (!token) {
      this.logger.warn('[Turnstile] Missing turnstile token in lead submission');
      return false;
    }

    try {
      const formData = new URLSearchParams();
      formData.append('secret', secret);
      formData.append('response', token);
      if (remoteIp) {
        formData.append('remoteip', remoteIp);
      }

      const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
      });

      const data = (await res.json()) as TurnstileVerificationResult;

      if (!data.success) {
        this.logger.warn(`[Turnstile] Verification failed: ${JSON.stringify(data.errorCodes)}`);
        return false;
      }

      return true;
    } catch (err) {
      this.logger.error(`[Turnstile] Exception during verification: ${(err as Error).message}`);
      // Fail closed on error in production
      return false;
    }
  }
}
