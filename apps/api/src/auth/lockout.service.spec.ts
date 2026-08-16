import { LoginLockoutService } from './lockout.service';
import { AuditService } from '../audit/audit.service';

describe('LoginLockoutService', () => {
  let lockoutService: LoginLockoutService;
  let mockAuditService: { log: jest.Mock };

  beforeEach(() => {
    mockAuditService = {
      log: jest.fn().mockResolvedValue(undefined),
    };
    lockoutService = new LoginLockoutService(mockAuditService as unknown as AuditService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should start with 5 remaining attempts and not locked', () => {
    const status = lockoutService.checkLockout('test@example.com');
    expect(status.isLocked).toBe(false);
    expect(status.remainingAttempts).toBe(5);
    expect(status.remainingLockMs).toBe(0);
  });

  it('should decrease remaining attempts on failed login', async () => {
    const status1 = await lockoutService.recordFailedAttempt('test@example.com');
    expect(status1.isLocked).toBe(false);
    expect(status1.remainingAttempts).toBe(4);

    const status2 = await lockoutService.recordFailedAttempt('test@example.com');
    expect(status2.isLocked).toBe(false);
    expect(status2.remainingAttempts).toBe(3);
  });

  it('should lock the account for 15 minutes after 5 failed attempts in 10 minutes', async () => {
    const email = 'victim@example.com';

    // 4 failed attempts
    for (let i = 0; i < 4; i++) {
      const res = await lockoutService.recordFailedAttempt(email);
      expect(res.isLocked).toBe(false);
    }

    expect(mockAuditService.log).not.toHaveBeenCalled();

    // 5th failed attempt -> triggers lockout
    const lockResult = await lockoutService.recordFailedAttempt(email, {
      id: 'user_123',
      email,
    });

    expect(lockResult.isLocked).toBe(true);
    expect(lockResult.remainingAttempts).toBe(0);
    expect(lockResult.remainingLockMs).toBe(15 * 60 * 1000);
    expect(lockResult.lockedUntil).toBeDefined();

    // Check subsequent status check
    const check = lockoutService.checkLockout(email);
    expect(check.isLocked).toBe(true);
    expect(check.remainingAttempts).toBe(0);

    // Verify AuditLog was called with ACCOUNT_LOCKED
    expect(mockAuditService.log).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'ACCOUNT_LOCKED',
        entity: 'User',
        entityId: 'user_123',
        metadata: expect.objectContaining({
          key: email,
          attempts: 5,
        }),
      }),
    );
  });

  it('should unlock the account once the 15-minute lockout expires', async () => {
    const email = 'locked@example.com';
    const now = 1000000;
    jest.spyOn(Date, 'now').mockReturnValue(now);

    for (let i = 0; i < 5; i++) {
      await lockoutService.recordFailedAttempt(email);
    }

    expect(lockoutService.checkLockout(email).isLocked).toBe(true);

    // Advance time past 15 minutes (900,001 ms)
    jest.spyOn(Date, 'now').mockReturnValue(now + 15 * 60 * 1000 + 1);

    const postExpiry = lockoutService.checkLockout(email);
    expect(postExpiry.isLocked).toBe(false);
    expect(postExpiry.remainingAttempts).toBe(5);
  });

  it('should drop failed attempts older than the 10-minute sliding window', async () => {
    const email = 'intermittent@example.com';
    let currentClock = 1000000;
    jest.spyOn(Date, 'now').mockImplementation(() => currentClock);

    // 4 failed attempts at time T=0
    for (let i = 0; i < 4; i++) {
      await lockoutService.recordFailedAttempt(email);
    }

    expect(lockoutService.checkLockout(email).remainingAttempts).toBe(1);

    // Advance time by 11 minutes (past the 10-minute window)
    currentClock += 11 * 60 * 1000;

    // The 4 old attempts expired; recording a 5th total attempt now should be attempt #1 of new window
    const newAttempt = await lockoutService.recordFailedAttempt(email);
    expect(newAttempt.isLocked).toBe(false);
    expect(newAttempt.remainingAttempts).toBe(4);
  });

  it('should reset failed attempts upon explicit reset (successful login)', async () => {
    const email = 'user@example.com';

    await lockoutService.recordFailedAttempt(email);
    await lockoutService.recordFailedAttempt(email);
    expect(lockoutService.checkLockout(email).remainingAttempts).toBe(3);

    lockoutService.reset(email);

    expect(lockoutService.checkLockout(email).remainingAttempts).toBe(5);
  });
});
