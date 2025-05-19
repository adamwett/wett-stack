import type { AuthInstance } from '@repo/auth/server';
import type { DatabaseInstance } from '@repo/db';
import { TRPCError, initTRPC } from '@trpc/server';
import SuperJSON from 'superjson';

const TIMING_MIDDLEWARE_ENABLED = false;

/** Barebones context for the API. Add extra properties as needed via generics. */
export type APIContext = {
  auth: AuthInstance;
  db: DatabaseInstance;
};

/** The context with headers */
export type APIContextWithHeaders = APIContext & { headers: Headers };

/** NOTE: Session can be null if the user is not logged in */
export type APIContextWithSession = APIContextWithHeaders & { session: AuthInstance['$Infer']['Session'] | null };

export const createGenericContext = async (context: APIContextWithHeaders): Promise<APIContextWithSession> => {
  const session = await context.auth.api.getSession({
    headers: context.headers,
  });

  return {
    ...context,
    session,
  };
};

/**
 * tRPC context with SuperJSON as the serializer
 * @returns The TRPC instance
 */
export const t = initTRPC.context<typeof createGenericContext>().create({
  transformer: SuperJSON,
});

/**
 * The tRPC router instance
 */
export const router = t.router;

/**
 * Timing middleware, only enabled in dev
 */
const timingMiddleware = t.middleware(async ({ next, path }) => {
  const start = Date.now();
  let waitMsDisplay = '';
  if (t._config.isDev) {
    // artificial delay in dev 100-500ms
    const waitMs = Math.floor(Math.random() * 400) + 100;
    await new Promise((resolve) => setTimeout(resolve, waitMs));
    waitMsDisplay = ` (artificial delay: ${waitMs}ms)`;
  }
  const result = await next();
  const end = Date.now();

  console.log(`\t[TRPC] /${path} executed after ${end - start}ms${waitMsDisplay}`);
  return result;
});

export const publicProcedure = TIMING_MIDDLEWARE_ENABLED ? t.procedure.use(timingMiddleware) : t.procedure;

export const protectedProcedure = publicProcedure.use(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: 'FORBIDDEN' });
  }
  return next({
    ctx: {
      session: { ...ctx.session },
    },
  });
});
