import { protectedProcedure, publicProcedure, router } from '@repo/api';
import { desc, eq } from '@repo/db/drizzle';
import * as v from 'valibot';
import { AgentInsertSchema, agents } from '#/schemas/agents';

export const agentRouter = router({
  /** Lists all the agents */
  all: publicProcedure.query(({ ctx }) => {
    return ctx.db.select().from(agents).orderBy(desc(agents.id));
  }),
  /** Creates a new agent */
  create: publicProcedure.input(AgentInsertSchema).mutation(({ ctx, input }) => {
    return ctx.db.insert(agents).values({ ...input });
  }),
  /** Deletes an agent (and all messages associated with it!) */
  delete: publicProcedure.input(v.object({ id: v.number() })).mutation(({ ctx, input }) => {
    return ctx.db.delete(agents).where(eq(agents.id, input.id));
  }),
  /** Gets a single agent */
  one: publicProcedure.input(v.object({ id: v.number() })).query(({ ctx, input }) => {
    return ctx.db.select().from(agents).where(eq(agents.id, input.id));
  }),
});
