import type { D1Database, Env } from '@repo/wrangler-config';
import { type AnyD1Database, type DrizzleD1Database, drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';

export type DatabaseInstance = DrizzleD1Database<typeof schema>;

export const createDb = (db: D1Database): DatabaseInstance => {
  return drizzle(db, {
    schema,
    casing: 'snake_case',
  });
};
