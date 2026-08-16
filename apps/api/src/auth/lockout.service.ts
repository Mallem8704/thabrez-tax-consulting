import { Injectable, Logger } from '@nestjs/common';
import { AuditService } from '../audit/audit.service';

export interface LockoutStatus {
  isLocked: boolean;
  remainingAttempts: number;
  remainingLockMs: number;
  lockedUntil?: Date;
}

interface AttemptRecord {
  attempts: number[];
  lockedUntil: number | null;
}

/**
 * LoginLockoutService
 *
 * Enforces rate-limiting on login attempts:
 * - Window: 10 minutes (600,000 ms)
 * - Threshold: 5 failed attempts
 * - Lock duration: 15 minutes (900,000 ms)
 * - Logs to AuditLog upon locking account
 */
@Injectable()
export class LoginLockoutService {
  private readonly logger = new Logger(LoginLockoutService.name);
  private readonly records = new Map<string, AttemptRecord>();

  readonly WINDOW_MS = 10 * 60 * 1000; // 10 minutes
  readonly MAX_ATTEMPTS = 5;
  readonly LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

  constructor(private readonly auditService: AuditService) {}

  /**
   * Checks if the given key (email / user ID) is currently locked out.
   */
  checkLockout(key: string): LockoutStatus {
    const normalizedKey = key.toLowerCase().trim();
    const record = this.records.get(normalizedKey);
    const now = Date.now();

    if (!record) {
      return {
        isLocked: false,
        remainingAttempts: this.MAX_ATTEMPTS,
        remainingLockMs: 0,
      };
    }

    // Check active lockout
    if (record.lockedUntil !== null) {
      if (now < record.lockedUntil) {
        return {
          isLocked: true,
          remainingAttempts: 0,
          remainingLockMs: record.lockedUntil - now,
          lockedUntil: new Date(record.lockedUntil),
        };
      }
      // Lockout expired -> reset
      this.records.delete(normalizedKey);
      return {
        isLocked: false,
        remainingAttempts: this.MAX_ATTEMPTS,
        remainingLockMs: 0,
      };
    }

    // Clean stale attempts outside window
    record.attempts = record.attempts.filter((ts) => now - ts <= this.WINDOW_MS);
    const remaining = Math.max(0, this.MAX_ATTEMPTS - record.attempts.length);

    return {
      isLocked: false,
      remainingAttempts: remaining,
      remainingLockMs: 0,
    };
  }

  /**
   * Records a failed login attempt. Locks the account if threshold is met.
   */
  async recordFailedAttempt(
    key: string,
    userMeta?: { id?: string; email?: string },
  ): Promise<LockoutStatus> {
    const normalizedKey = key.toLowerCase().trim();
    const now = Date.now();
    let record = this.records.get(normalizedKey);

    if (!record) {
      record = { attempts: [], lockedUntil: null };
      this.records.set(normalizedKey, record);
    }

    // If currently locked, return lock status
    if (record.lockedUntil !== null && now < record.lockedUntil) {
      return {
        isLocked: true,
        remainingAttempts: 0,
        remainingLockMs: record.lockedUntil - now,
        lockedUntil: new Date(record.lockedUntil),
      };
    }

    // Clean old attempts and record current
    record.attempts = record.attempts.filter((ts) => now - ts <= this.WINDOW_MS);
    record.attempts.push(now);

    if (record.attempts.length >= this.MAX_ATTEMPTS) {
      const lockedUntil = now + this.LOCKOUT_DURATION_MS;
      record.lockedUntil = lockedUntil;

      this.logger.warn(
        `Account locked for ${normalizedKey} until ${new Date(lockedUntil).toISOString()} after ${record.attempts.length} failed attempts.`,
      );

      // Log lockout to AuditLog
      await this.auditService.log({
        actorId: userMeta?.id ?? undefined,
        action: 'ACCOUNT_LOCKED',
        entity: 'User',
        entityId: userMeta?.id ?? normalizedKey,
        metadata: {
          key: normalizedKey,
          attempts: record.attempts.length,
          windowMinutes: this.WINDOW_MS / (60 * 1000),
          lockoutMinutes: this.LOCKOUT_DURATION_MS / (60 * 1000),
          lockedUntil: new Date(lockedUntil).toISOString(),
        },
      });

      return {
        isLocked: true,
        remainingAttempts: 0,
        remainingLockMs: this.LOCKOUT_DURATION_MS,
        lockedUntil: new Date(lockedUntil),
      };
    }

    return {
      isLocked: false,
      remainingAttempts: this.MAX_ATTEMPTS - record.attempts.length,
      remainingLockMs: 0,
    };
  }

  /**
   * Resets failed attempts upon a successful login.
   */
  reset(key: string): void {
    const normalizedKey = key.toLowerCase().trim();
    this.records.delete(normalizedKey);
  }

  /**
   * Explicitly clears all in-memory records (useful in tests).
   */
  clearAll(): void {
    this.records.clear();
  }
}
