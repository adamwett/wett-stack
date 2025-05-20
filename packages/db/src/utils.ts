import { integer, sql, text } from './drizzle';

export const createdAndUpdatedAt = {
  createdAt: integer('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at').default(sql`CURRENT_TIMESTAMP`),
};

export const uuidColumn = () => text('id', { length: 36 }).primaryKey().notNull();
