import { type AppRoutes, createApi } from '@repo/api';
import { fetchRequestHandler } from '@repo/api';
import { type AuthInstance, createAuth } from '@repo/auth/server';
import { createDb } from '@repo/db';
import type { TableConfig } from '@repo/db/drizzle';
import type { SQLiteTableWithColumns } from '@repo/db/drizzle';
import { type LLMInstance, createLLM } from '@repo/llm';

// ENDPOINTS
import { agentRouter } from './endpoints/agent';
import { messageRouter } from './endpoints/message';
import { postRouter } from './endpoints/post';

// SCHEMAS
import { agent } from './schemas/agents';
import { user } from './schemas/auth';
import { message } from './schemas/messages';
import { post } from './schemas/posts';

const routes = {
  agents: agentRouter,
  messages: messageRouter,
  posts: postRouter,
};

// biome-ignore lint/suspicious/noExplicitAny: TODO: there's some typescript fuckery I need to do in createDb to get it to tell TS what the table names are. For now, we use any and optional chaining. Ik its AIDS. When you fix it make sure you don't make ctx.db.query into any on accident (by using unknown)
const tables: any = {
  agent,
  message,
  post,
  user,
};

/**
 * Combines all the packages into a single worker
 */
export default {
  async fetch(request: Request, env: Env) {
    const db = createDb(env.DB, tables);

    const auth: AuthInstance = createAuth({
      db,
      authSecret: env.SERVER_AUTH_SECRET,
      webUrl: env.PUBLIC_WEB_URL,
    });
    const llm: LLMInstance = createLLM(env.OPEN_ROUTER_KEY);

    const context = {
      auth,
      db,
      llm,
    };

    const api = createApi(context, routes);

    return fetchRequestHandler({
      endpoint: '/trpc',
      req: request,
      router: api.trpcRouter,
      createContext: () =>
        api.createTRPCContext({
          headers: request.headers,
        }),
    });
  },
} satisfies ExportedHandler<Env>;
