import type { AnyTRPCRouter } from '@trpc/server';
import { type APIContext, createGenericContext, router } from './trpc';

export type AppRoutes = Record<string, AnyTRPCRouter>;

export const createApi = (context: APIContext, appRoutes: AppRoutes) => {
  const appRouter = router(appRoutes);

  return {
    trpcRouter: appRouter,
    createTRPCContext: ({ headers }: { headers: Headers }) => createGenericContext({ ...context, headers }),
  };
};

export * from './trpc';
export { TRPCError } from '@trpc/server';
export { fetchRequestHandler } from '@trpc/server/adapters/fetch';
