import { PrismaClient } from '@prisma/client';

// ---------------------------------------------------------------------------
// Singleton Prisma client with hot-reload safety.
// Import `db` from this file everywhere in the codebase.
// ---------------------------------------------------------------------------

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env['NODE_ENV'] === 'development'
        ? ['query', 'warn', 'error']
        : ['warn', 'error'],
  });

if (process.env['NODE_ENV'] !== 'production') {
  globalForPrisma.prisma = db;
}

export { PrismaClient };
export * from '@prisma/client';
