import { clientEnvSchema } from "./env.schema";

// Browser-safe env (NEXT_PUBLIC_* only). Inlined at build time.
export const envClient = clientEnvSchema.parse({
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_BETTER_AUTH_URL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
});
