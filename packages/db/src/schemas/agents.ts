import { DEFAULT_MODEL, DEFAULT_SYSTEM_PROMPT } from '@repo/llm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const agents = sqliteTable('agent', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  description: text('description').notNull(),
  model: text('model').notNull().default(DEFAULT_MODEL),
  systemPrompt: text('system_prompt').notNull().default(DEFAULT_SYSTEM_PROMPT),
  // TODO: add createdAt, updatedAt
});

// export const AgentInsertSchema = v.omit(createInsertSchema(agents), ['id']);
// export const AgentSelectSchema = createSelectSchema(agents);
// export type Agent = v.InferOutput<typeof AgentSelectSchema>;
