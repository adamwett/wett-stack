import { createInsertSchema, createSelectSchema, integer, sqliteTable, text } from '@repo/db/drizzle';
import * as v from 'valibot';
import { DEFAULT_MODEL } from '#/schemas/models';

export const DEFAULT_SYSTEM_PROMPT = 'You are a helpful assistant.';

export const agents = sqliteTable('agent', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  description: text('description').notNull(),
  model: text('model').notNull().default(DEFAULT_MODEL),
  systemPrompt: text('system_prompt').notNull().default(DEFAULT_SYSTEM_PROMPT),
  // TODO: add createdAt, updatedAt
});

export const AgentInsertSchema = v.omit(createInsertSchema(agents), ['id']);
export const AgentSelectSchema = createSelectSchema(agents);
export type Agent = v.InferOutput<typeof AgentSelectSchema>;
