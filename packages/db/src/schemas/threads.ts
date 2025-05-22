import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createdAndUpdatedAt, uuidColumn } from '../utils';
import { models } from './models';

export const threads = sqliteTable('threads', {
  id: uuidColumn(),
  name: text('name').notNull().default('New Thread'),
  systemPrompt: text('system_prompt'),
  model: text().references(() => models.name, { onDelete: 'set null' }),
  inputTokens: integer('input_tokens').notNull().default(0),
  outputTokens: integer('output_tokens').notNull().default(0),
  ...createdAndUpdatedAt,
});

// export const ThreadInsertSchema = v.omit(createInsertSchema(threads), ['id']);
// export const ThreadSelectSchema = createSelectSchema(threads);
// export type Thread = v.InferOutput<typeof ThreadSelectSchema>;
