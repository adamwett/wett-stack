import type { Config } from 'drizzle-kit';

/**
 * Config for Drizzle Kit (migrations)
 */
export default {
  dialect: 'sqlite',
  schema: './src/schema.ts', // this can be a glob but we'll use our typesafe barrel for consistency
  out: './migrations',
  // dbCredentials: { url: './db.sqlite' },
  casing: 'snake_case',
} satisfies Config;
