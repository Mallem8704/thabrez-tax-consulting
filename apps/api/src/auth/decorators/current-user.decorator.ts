import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { UserRole } from '@thabrez/db';

export interface AuthenticatedUser {
  id: string;
  email: string | null;
  phone: string | null;
  role: UserRole;
  clientProfileId?: string | null;
}

export const CurrentUser = createParamDecorator(
  (data: keyof AuthenticatedUser | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<{ user?: AuthenticatedUser }>();
    const user = request.user;
    if (!user) return null;
    return data ? user[data] : user;
  },
);
