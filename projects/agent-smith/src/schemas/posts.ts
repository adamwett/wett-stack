import { createInsertSchema, integer, sql, sqliteTable, text } from '@repo/db/drizzle';
import * as v from 'valibot';
import { user } from './auth';

export const post = sqliteTable('post', {
  id: text('id').primaryKey().default(sql`(uuid())`),
  title: text('title').notNull(),
  content: text('content').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().defaultNow(),
  createdBy: text('created_by')
    .references(() => user.id)
    .notNull(),
});

export const PostInsertSchema = v.omit(createInsertSchema(post), ['id', 'createdAt', 'createdBy']);
