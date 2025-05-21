import { createInsertSchema, createSelectSchema, integer, sql, sqliteTable, text } from '@repo/db/drizzle';
import { createdAndUpdatedAt, uuidColumn } from '@repo/db/utils';
import { MessageRoleSchema } from '@repo/llm';
import * as v from 'valibot';
import { DEFAULT_MODEL, ModelNameSchema } from '#/schemas/models';

export const threads = sqliteTable('threads', {
  id: uuidColumn(),
  name: text('name').notNull().default('New Thread'),
  systemPrompt: text('system_prompt').notNull(),
  model: text('model', { enum: ModelNameSchema.options }).notNull().default(DEFAULT_MODEL),
  inputTokens: integer('input_tokens').notNull().default(0),
  outputTokens: integer('output_tokens').notNull().default(0),
  ...createdAndUpdatedAt,
});

// export const ThreadInsertSchema = v.omit(createInsertSchema(threads), ['id']);
export const ThreadSelectSchema = createSelectSchema(threads);
export type Thread = v.InferOutput<typeof ThreadSelectSchema>;

export const messages = sqliteTable('messages', {
  id: uuidColumn(),
  threadId: text('thread_id')
    .notNull()
    .references(() => threads.id, { onDelete: 'cascade' }),
  role: text('role', { enum: MessageRoleSchema.options }).notNull().default('user'),
  content: text('content').notNull(),
  ...createdAndUpdatedAt,
});

export const MessageInsertSchema = v.omit(createInsertSchema(messages), ['id']);
