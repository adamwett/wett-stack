import { createInsertSchema, integer, sqliteTable, text } from '@repo/db/drizzle';
import * as v from 'valibot';
import { agent } from './agents';

export const message = sqliteTable('message', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  agentId: text('agent_id')
    .notNull()
    .references(() => agent.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  role: text('role', ['user', 'assistant', 'system']).notNull(),
  // TODO: add createdAt, updatedAt
});

export const MessageInsertSchema = v.omit(createInsertSchema(message), ['id']);
