import type { DrizzleConfig } from 'drizzle-orm';
import { type AnyD1Database, drizzle } from 'drizzle-orm/d1';
import type { AnySQLiteTable, TableConfig } from 'drizzle-orm/sqlite-core';
import type { SQLiteTableWithColumns } from 'drizzle-orm/sqlite-core';

// Create a drizzle instance for the API
export const createDb = (db: AnyD1Database, schema: Record<string, SQLiteTableWithColumns<TableConfig>>) => {
  return drizzle(db, {
    schema: schema,
    casing: 'snake_case',
  });
};

export type DatabaseInstance = ReturnType<typeof createDb>;
