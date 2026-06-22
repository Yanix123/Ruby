import "server-only";
import { serverEnvSchema } from "./env.schema";

// Validated, typed server env. Throws at import if anything is missing/invalid.
export const envServer = serverEnvSchema.parse(process.env);
