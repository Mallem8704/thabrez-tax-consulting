import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';

interface ApiErrorBody {
  statusCode: number;
  message: string;
  errors?: Record<string, string[]>;
  timestamp: string;
  path: string;
}

/**
 * Catches every unhandled exception and returns a consistent JSON error shape:
 * {
 *   statusCode: 400,
 *   message:    "Validation failed",
 *   errors:     { field: ["must not be empty"] },   // present for validation errors
 *   timestamp:  "2025-08-16T16:00:00.000Z",
 *   path:       "/api/v1/clients"
 * }
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let statusCode: number;
    let message: string;
    let errors: Record<string, string[]> | undefined;

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const raw = exception.getResponse();

      if (typeof raw === 'object' && raw !== null) {
        const body = raw as Record<string, unknown>;
        const bodyMessage = body['message'];

        if (Array.isArray(bodyMessage)) {
          // class-validator returns an array of constraint strings
          message = 'Validation failed';
          errors = { validation: bodyMessage as string[] };
        } else {
          message =
            typeof bodyMessage === 'string' ? bodyMessage : exception.message;
        }
      } else {
        message = typeof raw === 'string' ? raw : exception.message;
      }
    } else {
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';
      this.logger.error(
        'Unhandled exception',
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    const body: ApiErrorBody = {
      statusCode,
      message,
      ...(errors !== undefined && { errors }),
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(statusCode).json(body);
  }
}
