import { createApi } from '@repo/api/server';
import { type AuthInstance, createAuth } from '@repo/auth/server';
import { type DatabaseInstance, createDb } from '@repo/db/client';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

import type { CloudflareRequest, CloudflareResponse, Env, ExportedHandler } from '@repo/wrangler-config';

/**
 * Combines all the packages into a single worker
 */
export default {
  async fetch(request: CloudflareRequest, env: Env) {
    const db: DatabaseInstance = createDb(env.DB);

    const auth: AuthInstance = createAuth({
      db,
      authSecret: env.SERVER_AUTH_SECRET,
      webUrl: env.PUBLIC_WEB_URL,
    });

    const api = createApi({ auth, db });

    const regularRequest = new Request(request.url, {
      method: request.method,
      headers: request.headers,
      body: request.body,
    });

    return fetchRequestHandler({
      endpoint: '/trpc',
      req: regularRequest,
      router: api.trpcRouter,
      createContext: (opts) =>
        api.createTRPCContext({
          headers: request.headers,
        }),
    }) as unknown as CloudflareResponse;
  },
} satisfies ExportedHandler<Env>;
