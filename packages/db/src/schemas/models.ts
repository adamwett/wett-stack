import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createdAndUpdatedAt, uuidColumn } from '../utils';

export const models = sqliteTable('models', {
  id: uuidColumn(),
  name: text('name').primaryKey(),
  description: text('description').notNull(),
  inputCost: integer('input_cost').notNull(),
  outputCost: integer('output_cost').notNull(),
  ...createdAndUpdatedAt,
});
