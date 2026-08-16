import { ForbiddenException, Injectable } from '@nestjs/common';
import { UserRole } from '@thabrez/db';
import type { AuthenticatedUser } from './decorators/current-user.decorator';

/**
 * ClientIsolationService
 *
 * Enforces strict multi-tenant data isolation at the SERVICE layer.
 * A user with role CLIENT is strictly restricted to their own data records.
 */
@Injectable()
export class ClientIsolationService {
  /**
   * Asserts that a user with CLIENT role can only access records matching their own user ID or client profile ID.
   *
   * @param currentUser The authenticated user performing the action
   * @param targetOwnerId The user ID or client profile ID that owns the target resource
   */
  assertClientAccess(currentUser: AuthenticatedUser, targetOwnerId: string): void {
    if (currentUser.role !== UserRole.CLIENT) {
      // Staff roles (ADMIN, SENIOR_CA, ASSOCIATE, FRONT_DESK) pass service check
      return;
    }

    const isDirectOwner = currentUser.id === targetOwnerId;
    const isProfileOwner = currentUser.clientProfileId === targetOwnerId;

    if (!isDirectOwner && !isProfileOwner) {
      throw new ForbiddenException(
        'Client data isolation violation: You do not have permission to access data belonging to another client.',
      );
    }
  }

  /**
   * Helper to build a safe Prisma `where` clause for CLIENT roles.
   * For CLIENT users, automatically filters by their client profile ID.
   * For Staff users, returns the base where clause unfiltered.
   */
  scopeClientWhere<T extends Record<string, unknown>>(
    currentUser: AuthenticatedUser,
    baseWhere: T = {} as T,
  ): T & { clientId?: string; userId?: string } {
    if (currentUser.role === UserRole.CLIENT) {
      if (currentUser.clientProfileId) {
        return {
          ...baseWhere,
          clientId: currentUser.clientProfileId,
        };
      }
      return {
        ...baseWhere,
        userId: currentUser.id,
      };
    }
    return baseWhere;
  }
}
