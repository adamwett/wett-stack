import { agentRouter } from './routes/agent';
import { threadRouter } from './routes/thread';
import { type APIContext, createTRPCContext, router } from './trpc';

const appRouter = router({
  agents: agentRouter,
  threads: threadRouter,
});

export const createApi = (context: APIContext) => {
  return {
    trpcRouter: appRouter,
    injectHeaders: ({ headers }: { headers: Headers }) => createTRPCContext({ ...context, headers }),
  };
};

export type AppRouter = typeof appRouter;

export * from './trpc';
export { TRPCError } from '@trpc/server';
export { fetchRequestHandler } from '@trpc/server/adapters/fetch';
