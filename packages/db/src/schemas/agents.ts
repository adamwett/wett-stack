import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema } from 'drizzle-valibot';
import * as v from 'valibot';

export const agent = sqliteTable('agent', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  description: text('description').notNull(),
  systemPrompt: text('system_prompt').notNull(),
  // TODO: add createdAt, updatedAt
});

// TODO: make a resuable helper
export const CreateAgentSchema = v.omit(createInsertSchema(agent), ['id']);
export type CreateAgentSchema = v.InferOutput<typeof CreateAgentSchema>;

export const message = sqliteTable('message', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  agentId: text('agent_id')
    .notNull()
    .references(() => agent.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  role: text('role', ['user', 'assistant', 'system']).notNull(),
  // TODO: add createdAt, updatedAt
});

export const CreateMessageSchema = v.omit(createInsertSchema(message), ['id']);
