/**
 * Backend router
 *
 * In its own file b/c frontend consumes via `import type { AppRouter } from '@agent-smith/router'`
 */

import { router } from '@repo/api';
import { agentRouter } from '#/routes/agent';
import { postRouter } from '#/routes/post';
import { threadRouter } from '#/routes/thread';

export const appRouter = router({
  agents: agentRouter,
  posts: postRouter,
  threads: threadRouter,
});

export type AppRouter = typeof appRouter;
