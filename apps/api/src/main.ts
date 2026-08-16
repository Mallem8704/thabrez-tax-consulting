import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  // ─── Security Headers via Helmet (CSP, HSTS, X-Frame-Options, etc.) ──────
  app.use(
    helmet({
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          // Only allow resources from own origin and trusted CDN/font sources
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", 'https://fonts.googleapis.com'],
          fontSrc: ["'self'", 'https://fonts.gstatic.com'],
          imgSrc: ["'self'", 'data:', 'https:'],
          // Block object/embed/plugin tags entirely
          objectSrc: ["'none'"],
          // Require HTTPS for all navigations (no mixed content)
          upgradeInsecureRequests: [],
          // Prevent framing of API responses
          frameAncestors: ["'none'"],
          // Block all form submissions to external origins
          formAction: ["'self'"],
          // Allow Razorpay webhook + payment connections
          connectSrc: ["'self'", 'https://api.razorpay.com'],
        },
      },
      // HTTP Strict Transport Security — force HTTPS for 1 year
      hsts: {
        maxAge: 31_536_000, // 1 year in seconds
        includeSubDomains: true,
        preload: true,
      },
      // Prevent browsers from MIME-type sniffing
      noSniff: true,
      // Prevent clickjacking via X-Frame-Options
      frameguard: { action: 'deny' },
      // Hide X-Powered-By header (obscure framework)
      hidePoweredBy: true,
      // Prevent leaking Referer header to external origins
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
      // Disable XSS filter (modern browsers use CSP instead, old filter can be exploited)
      xssFilter: false,
    }),
  );

  // ─── API Versioning — /api/v1/... ─────────────────────────────────────────
  app.setGlobalPrefix('api');
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

  // ─── Global Validation Pipe — strips unknown keys, validates DTOs ─────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // ─── Global Exception Filter — consistent JSON error shapes ──────────────
  app.useGlobalFilters(new AllExceptionsFilter());

  // ─── Rate Limiting ────────────────────────────────────────────────────────
  // ThrottlerGuard is registered as APP_GUARD in AppModule (60 req / 60 s).
  // Public endpoints additionally use LeadRateLimiterService + LoginLockoutService.

  // ─── CORS ─────────────────────────────────────────────────────────────────
  // Tighten allowedOrigins in production via CORS_ORIGINS env var.
  const allowedOrigins = process.env['CORS_ORIGINS']?.split(',') ?? [
    'http://localhost:3000', // apps/web
    'http://localhost:3001', // apps/admin
  ];

  app.enableCors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      // Allow requests with no origin (server-to-server, Razorpay webhooks, mobile apps)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS: Origin ${origin} not allowed`));
    },
    methods: ['GET', 'HEAD', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    maxAge: 86_400, // Pre-flight cache: 24 hours
  });

  // ─── Note on CSRF ─────────────────────────────────────────────────────────
  // This API uses stateless JWT Bearer tokens (Authorization header), NOT
  // session cookies, so it is NOT vulnerable to CSRF. CSRF protection would
  // only be required if we switch to HttpOnly cookie-based sessions.
  // The Razorpay webhook (/invoices/webhook/razorpay) is correctly public and
  // verified via HMAC-SHA256 signature — no JWT required there.

  // ─── Swagger / OpenAPI ────────────────────────────────────────────────────
  const config = new DocumentBuilder()
    .setTitle('Thabrez Tax Consulting API')
    .setDescription(
      'REST API documentation for Thabrez Tax Consulting — Clients, Cases, Documents, Invoices, Deadlines, and CRM',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env['PORT'] ?? 4000;
  await app.listen(port);
  console.log(`🚀 API running on http://localhost:${port}/api/v1`);
  console.log(`📚 Swagger docs available at http://localhost:${port}/api/docs`);
}

void bootstrap();
