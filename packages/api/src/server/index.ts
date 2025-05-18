import type { AuthInstance } from '@repo/auth/server';
import type { DatabaseInstance } from '@repo/db/client';
import type { LLMInstance } from '@repo/llm/client';
import type { Headers } from '@repo/wrangler-config';
import { agentRouter } from './router/agent';
import { messageRouter } from './router/message';
import { postRouter } from './router/post';
import { createTRPCContext as createTRPCContextInternal, router } from './trpc';

export const appRouter = router({
  posts: postRouter,
  agents: agentRouter,
  messages: messageRouter,
});

export const createApi = ({
  auth,
  db,
  llm,
}: {
  auth: AuthInstance;
  db: DatabaseInstance;
  llm: LLMInstance;
}) => {
  return {
    trpcRouter: appRouter,
    createTRPCContext: ({ headers }: { headers: Headers }) => createTRPCContextInternal({ auth, db, headers, llm }),
  };
};

export type AppRouter = typeof appRouter;
