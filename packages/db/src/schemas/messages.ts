import { MessageRoleSchema } from '@repo/llm';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createdAndUpdatedAt, uuidColumn } from '../utils';
import { threads } from './threads';

export const messages = sqliteTable('messages', {
  id: uuidColumn(),
  threadId: text('thread_id')
    .notNull()
    .references(() => threads.id, { onDelete: 'cascade' }),
  role: text('role', { enum: MessageRoleSchema.options }).notNull().default('user'),
  content: text('content').notNull(),
  ...createdAndUpdatedAt,
});

// export const MessageInsertSchema = v.omit(createInsertSchema(messages), ['id']);
