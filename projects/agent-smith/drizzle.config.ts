import type { Config } from 'drizzle-kit';

/**
 * Config for Drizzle Kit (migrations)
 */
export default {
  dialect: 'sqlite',
  schema: './src/schemas/*.ts',
  out: './migrations',
  dbCredentials: {
    url: '.wrangler/state/v3/d1/miniflare-D1DatabaseObject/d59609584e25de27799f3d0f189bdad4a7eb67377fbb0373278f218fabbbfe7d.sqlite',
  },
  casing: 'snake_case',
} satisfies Config;
