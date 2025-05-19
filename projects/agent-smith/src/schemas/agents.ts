import { createInsertSchema, integer, sqliteTable, text } from '@repo/db/drizzle';
import * as v from 'valibot';

export const agent = sqliteTable('agent', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  description: text('description').notNull(),
  systemPrompt: text('system_prompt').notNull(),
  // TODO: add createdAt, updatedAt
});

export const AgentInsertSchema = v.omit(createInsertSchema(agent), ['id']);
