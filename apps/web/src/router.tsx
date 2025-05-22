import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRouter as createTanStackRouter } from '@tanstack/react-router';
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query';

// Import the generated route tree
import { routeTree } from './routeTree.gen';

import { trpcClient } from '@/clients/trpcClient';

export const queryClient = new QueryClient();

export const trpc = createTRPCOptionsProxy({
  client: trpcClient,
  queryClient,
});

export function createRouter() {
  const router = createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: 'intent',
    context: {
      trpc,
      queryClient,
    },
    defaultPendingComponent: () => (
      <div className='p-2 text-2xl'>
        <h1 className='font-bold'>Pending...</h1>
      </div>
    ),
    Wrap: function WrapComponent({ children }) {
      return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
    },
  });

  return router;
}

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
