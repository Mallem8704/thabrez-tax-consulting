import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { UserRole } from '@thabrez/db';
import { ClientIsolationService } from '../client-isolation.service';
import type { AuthenticatedUser } from '../decorators/current-user.decorator';

/**
 * ClientOwnershipGuard
 *
 * Guard that enforces that CLIENT role users can only access their own routes/entities.
 * Inspects route parameters (:clientId, :userId, :id) and query parameters.
 */
@Injectable()
export class ClientOwnershipGuard implements CanActivate {
  constructor(private readonly clientIsolationService: ClientIsolationService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{
      user?: AuthenticatedUser;
      params: Record<string, string>;
      query: Record<string, string>;
    }>();

    const user = request.user;
    if (!user) {
      throw new ForbiddenException('User authentication required');
    }

    // Staff roles have elevated access
    if (user.role !== UserRole.CLIENT) {
      return true;
    }

    const { params, query } = request;
    const targetId = params['clientId'] || params['userId'] || query['clientId'] || query['userId'];

    if (targetId) {
      this.clientIsolationService.assertClientAccess(user, targetId);
    }

    return true;
  }
}
