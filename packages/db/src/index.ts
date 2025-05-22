// Imported on server

import { type DrizzleD1Database, drizzle } from 'drizzle-orm/d1';
import type { AnyD1Database } from 'drizzle-orm/d1';

import * as schema from './schema';

export type DatabaseInstance = DrizzleD1Database<typeof schema>;

export const createDb = <T extends AnyD1Database>(db: T) => {
  return drizzle(db, {
    schema: schema,
    casing: 'snake_case',
  });
};

export { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-valibot';

export * from 'drizzle-orm/sql';
