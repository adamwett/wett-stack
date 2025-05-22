import { createApi } from '@repo/api';
import { fetchRequestHandler } from '@repo/api';
import { type AuthInstance, createAuth } from '@repo/auth/server';
import { createDb } from '@repo/db';
import { type LLMInstance, createLLM } from '@repo/llm';

/**
 * Combines all the packages into a single worker
 */
export default {
  async fetch(request: Request, env: Env) {
    const db = createDb(env.DB);

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

    const api = createApi(context);

    // TODO: figure out proper cors
    // tRPC client looking for options
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Allow-Credentials': 'true',
        },
      });
    }

    return fetchRequestHandler({
      endpoint: '/trpc',
      req: request,
      router: api.trpcRouter,
      createContext: () =>
        api.injectHeaders({
          headers: request.headers,
        }),
      // cors here since origins are different
      responseMeta: () => ({
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Allow-Credentials': 'true',
        },
      }),
    });
  },
} satisfies ExportedHandler<Env>;
