import { ForbiddenException, ExecutionContext } from '@nestjs/common';
import { UserRole } from '@thabrez/db';
import { ClientIsolationService } from './client-isolation.service';
import { ClientOwnershipGuard } from './guards/client-ownership.guard';
import type { AuthenticatedUser } from './decorators/current-user.decorator';

describe('Client Data Isolation & Ownership Guard', () => {
  let isolationService: ClientIsolationService;
  let ownershipGuard: ClientOwnershipGuard;

  const mockClientUser: AuthenticatedUser = {
    id: 'user_client_1',
    email: 'client1@example.com',
    phone: '9876543210',
    role: UserRole.CLIENT,
    clientProfileId: 'client_profile_1',
  };

  const mockAdminUser: AuthenticatedUser = {
    id: 'user_admin_1',
    email: 'admin@thabrez.com',
    phone: '9000000001',
    role: UserRole.ADMIN,
    clientProfileId: null,
  };

  const mockSeniorCaUser: AuthenticatedUser = {
    id: 'user_ca_1',
    email: 'ca@thabrez.com',
    phone: '9000000002',
    role: UserRole.SENIOR_CA,
    clientProfileId: null,
  };

  beforeEach(() => {
    isolationService = new ClientIsolationService();
    ownershipGuard = new ClientOwnershipGuard(isolationService);
  });

  describe('ClientIsolationService (Service Layer)', () => {
    it('should allow CLIENT role to access their own user ID', () => {
      expect(() => {
        isolationService.assertClientAccess(mockClientUser, 'user_client_1');
      }).not.toThrow();
    });

    it('should allow CLIENT role to access their own clientProfile ID', () => {
      expect(() => {
        isolationService.assertClientAccess(mockClientUser, 'client_profile_1');
      }).not.toThrow();
    });

    it('should THROW ForbiddenException when CLIENT tries to access another client profile', () => {
      expect(() => {
        isolationService.assertClientAccess(mockClientUser, 'client_profile_999');
      }).toThrow(ForbiddenException);
    });

    it('should THROW ForbiddenException when CLIENT tries to access another user ID', () => {
      expect(() => {
        isolationService.assertClientAccess(mockClientUser, 'user_client_2');
      }).toThrow(ForbiddenException);
    });

    it('should allow staff roles (ADMIN, SENIOR_CA) to access any client data', () => {
      expect(() => {
        isolationService.assertClientAccess(mockAdminUser, 'client_profile_999');
      }).not.toThrow();

      expect(() => {
        isolationService.assertClientAccess(mockSeniorCaUser, 'client_profile_999');
      }).not.toThrow();
    });

    it('should correctly scope Prisma query where clause for CLIENT role', () => {
      const baseWhere = { status: 'RECEIVED' };
      const clientScoped = isolationService.scopeClientWhere(mockClientUser, baseWhere);

      expect(clientScoped).toEqual({
        status: 'RECEIVED',
        clientId: 'client_profile_1',
      });

      const adminScoped = isolationService.scopeClientWhere(mockAdminUser, baseWhere);
      expect(adminScoped).toEqual({
        status: 'RECEIVED',
      });
    });
  });

  describe('ClientOwnershipGuard (Controller/Route Layer)', () => {
    function createMockContext(user: AuthenticatedUser | undefined, params: Record<string, string> = {}, query: Record<string, string> = {}): ExecutionContext {
      return {
        switchToHttp: () => ({
          getRequest: () => ({
            user,
            params,
            query,
          }),
        }),
      } as unknown as ExecutionContext;
    }

    it('should allow staff users regardless of route params', () => {
      const ctx = createMockContext(mockAdminUser, { clientId: 'any_client_id' });
      expect(ownershipGuard.canActivate(ctx)).toBe(true);
    });

    it('should allow CLIENT user when route param matches their clientProfileId', () => {
      const ctx = createMockContext(mockClientUser, { clientId: 'client_profile_1' });
      expect(ownershipGuard.canActivate(ctx)).toBe(true);
    });

    it('should allow CLIENT user when route param matches their userId', () => {
      const ctx = createMockContext(mockClientUser, { userId: 'user_client_1' });
      expect(ownershipGuard.canActivate(ctx)).toBe(true);
    });

    it('should REJECT CLIENT user when route param specifies another client', () => {
      const ctx = createMockContext(mockClientUser, { clientId: 'other_client_profile' });
      expect(() => ownershipGuard.canActivate(ctx)).toThrow(ForbiddenException);
    });

    it('should REJECT CLIENT user when query parameter specifies another client', () => {
      const ctx = createMockContext(mockClientUser, {}, { clientId: 'unauthorized_client_id' });
      expect(() => ownershipGuard.canActivate(ctx)).toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException if user is not authenticated', () => {
      const ctx = createMockContext(undefined, { clientId: 'client_profile_1' });
      expect(() => ownershipGuard.canActivate(ctx)).toThrow(ForbiddenException);
    });
  });
});
