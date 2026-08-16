import { defineConfig } from 'prisma/config';

/**
 * Prisma configuration file (replaces the deprecated package.json#prisma field).
 * Docs: https://pris.ly/prisma-config
 */
export default defineConfig({
  earlyAccess: true,
  schema: 'prisma/schema.prisma',
  migrate: {
    async afterApply() {
      // Hook: run seed automatically after `prisma migrate reset`
      // Leave empty for now; seed is run explicitly via `pnpm db:seed`
    },
  },
});
