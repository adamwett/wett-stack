import type { DatabaseInstance } from '@repo/db';
import { type BetterAuthOptions, betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';

export interface AuthOptions {
  webUrl: string;
  authSecret: string;
  db: DatabaseInstance;
}

export type AuthInstance = ReturnType<typeof betterAuth>;

/**
 * This function is abstracted for schema generations in cli-config.ts
 */
export const getBaseOptions = (db: DatabaseInstance): BetterAuthOptions => ({
  database: drizzleAdapter(db, {
    provider: 'sqlite',
  }),
  plugins: [],
});

export const createAuth = ({ webUrl, db, authSecret }: AuthOptions): AuthInstance => {
  return betterAuth({
    ...getBaseOptions(db),
    secret: authSecret,
    trustedOrigins: [webUrl].map((url) => new URL(url).origin),
    session: {
      cookieCache: {
        enabled: true,
        maxAge: 5 * 60,
      },
    },
    emailAndPassword: {
      enabled: true,
      autoSignIn: true,
      requireEmailVerification: false,
    },
  });
};
