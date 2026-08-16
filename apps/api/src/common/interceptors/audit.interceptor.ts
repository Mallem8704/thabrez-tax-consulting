import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import type { Request } from 'express';
import { AuditService } from '../../audit/audit.service';

/** HTTP methods that mutate state. Only these are logged. */
const MUTATION_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

/**
 * Global interceptor that writes an AuditLog row for every successful
 * state-mutating request (POST / PUT / PATCH / DELETE).
 *
 * Registered via APP_INTERCEPTOR in AppModule so DI works correctly.
 *
 * What is logged:
 *   - action  → "{METHOD}_{ENTITY}" e.g. "POST_CASES"
 *   - entity  → first path segment after /api/v1/ e.g. "cases"
 *   - entityId → second segment if present e.g. the CUID
 *   - metadata → { method, url, durationMs, statusCode }
 */
@Injectable()
export class AuditInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AuditInterceptor.name);

  constructor(private readonly auditService: AuditService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const http = context.switchToHttp();
    const request = http.getRequest<Request>();
    const response = http.getResponse<{ statusCode: number }>();
    const { method, url } = request;

    if (!MUTATION_METHODS.has(method)) {
      return next.handle();
    }

    // Extract actor from JWT payload (populated by auth guard in Phase 2)
    const actorId = (request as unknown as { user?: { id: string } }).user?.id;
    const startedAt = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const durationMs = Date.now() - startedAt;
          // Strip prefix: /api/v1/clients/cuid123 → ['clients', 'cuid123']
          const segments = url
            .replace(/^\/api\/v\d+\//, '')
            .split('?')[0]!
            .split('/')
            .filter(Boolean);

          const entity = segments[0] ?? 'unknown';
          const entityId = segments[1] ?? '';
          const action = `${method}_${entity.toUpperCase()}`;

          this.auditService
            .log({
              actorId,
              action,
              entity,
              entityId,
              metadata: {
                method,
                url,
                durationMs,
                statusCode: response.statusCode,
              },
            })
            .catch((err: unknown) =>
              this.logger.error('AuditLog write failed', err),
            );
        },
        // Failed mutations are NOT logged — the exception filter handles errors
      }),
    );
  }
}
