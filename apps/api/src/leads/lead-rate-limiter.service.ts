import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

interface RateLimitRecord {
  timestamps: number[];
}

@Injectable()
export class LeadRateLimiterService {
  private readonly attempts = new Map<string, RateLimitRecord>();

  // Max 5 submissions per 10 minutes per IP/email identifier
  private readonly maxAttempts = 5;
  private readonly windowMs = 10 * 60 * 1000; // 10 minutes

  /**
   * Checks if an identifier (IP address or email) is allowed to submit a lead.
   * Throws 429 Too Many Requests if rate limit exceeded.
   */
  checkRateLimit(identifier: string): void {
    const now = Date.now();
    const record = this.attempts.get(identifier) || { timestamps: [] };

    // Filter out attempts outside sliding window
    const recentAttempts = record.timestamps.filter((t) => now - t < this.windowMs);

    if (recentAttempts.length >= this.maxAttempts) {
      throw new HttpException(
        'Too many consultation requests submitted. Please wait 10 minutes before trying again.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // Record new attempt
    recentAttempts.push(now);
    this.attempts.set(identifier, { timestamps: recentAttempts });
  }

  /**
   * Helper to reset attempts for testing
   */
  reset(): void {
    this.attempts.clear();
  }
}
