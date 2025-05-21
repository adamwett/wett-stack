import { type BetterAuthOptions, betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';

// TODO: make this a real generic type
// biome-ignore lint/suspicious/noExplicitAny: this is ok here
type DatabaseInstance = any;

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
    // trustedOrigins: [webUrl].map((url) => new URL(url).origin),
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
