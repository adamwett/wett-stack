import { desc, eq } from '@repo/db';
import { CreateAgentSchema, agent } from '@repo/db/schema';

import * as v from 'valibot';
import { protectedProcedure, publicProcedure, router } from '../trpc';

export const agentRouter = router({
  /** Lists all the agents */
  all: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.agent.findMany({ orderBy: desc(agent.id) });
  }),
  /** Creates a new agent */
  create: publicProcedure.input(CreateAgentSchema).mutation(({ ctx, input }) => {
    return ctx.db.insert(agent).values({ ...input });
  }),
  /** Deletes an agent (and all messages associated with it!) */
  delete: publicProcedure.input(v.object({ id: v.number() })).mutation(({ ctx, input }) => {
    return ctx.db.delete(agent).where(eq(agent.id, input.id));
  }),
  /** Gets a single agent */
  one: publicProcedure.input(v.object({ id: v.number() })).query(({ ctx, input }) => {
    return ctx.db.query.agent.findFirst({ where: eq(agent.id, input.id) });
  }),
});
