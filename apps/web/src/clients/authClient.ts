import { env } from '@/lib/env';
import { createAuthClient } from '@repo/auth/client';

export const authClient = createAuthClient({
  apiBaseUrl: env.PUBLIC_SERVER_URL,
});

export type AuthSession = ReturnType<typeof createAuthClient>['$Infer']['Session'] | null;
