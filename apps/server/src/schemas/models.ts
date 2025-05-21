import { integer, sql, sqliteTable, text } from '@repo/db/drizzle';
import { uuidColumn } from '@repo/db/utils';
import * as v from 'valibot';

export const ModelNameSchema = v.picklist(['meta-llama/llama-3.2-3b-instruct:free']);
export const ModelNames = ModelNameSchema.options;
export type ModelName = v.InferOutput<typeof ModelNameSchema>;

export const DEFAULT_MODEL: ModelName = ModelNameSchema.options[0];

export const models = sqliteTable('models', {
  id: uuidColumn(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  inputCost: integer('input_cost').notNull(),
  outputCost: integer('output_cost').notNull(),
  createdAt: integer('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});
