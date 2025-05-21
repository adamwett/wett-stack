import type { AnyTRPCRouter } from '@trpc/server';
import { type APIContext, type RouterInstance, createGenericContext, router } from './trpc';

export type AppRoutes = Record<string, AnyTRPCRouter>;

// TODO: find an actual type for this
export const createApi = (context: APIContext, router: RouterInstance) => {
  return {
    trpcRouter: router,
    createTRPCContext: ({ headers }: { headers: Headers }) => createGenericContext({ ...context, headers }),
  };
};

export * from './trpc';
export { TRPCError } from '@trpc/server';
export { fetchRequestHandler } from '@trpc/server/adapters/fetch';
