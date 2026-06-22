// Runs once at server startup — fail fast with a clear message on bad env.
export async function register() {
  const { serverEnvSchema } = await import("@/config/env/env.schema");
  const result = serverEnvSchema.safeParse(process.env);
  if (!result.success) {
    const details = result.error.issues
      .map((i) => `  - ${i.path.join(".")}: ${i.message}`)
      .join("\n");
    throw new Error(`Invalid environment variables:\n${details}`);
  }
}
