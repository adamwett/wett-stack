import { env } from '@/lib/env';
import { createTrpcClient } from '@repo/api/client';

export const trpcClient = createTrpcClient({
  serverUrl: env.PUBLIC_SERVER_URL,
});
