import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

// drizzle-kit does not read .env.local by default — load it explicitly.
config({ path: ".env.local" });

export default defineConfig({
  schema: "./src/pkg/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  // Use the session-mode pooler (DIRECT_URL) for migrations; fall back to the runtime pooler.
  dbCredentials: { url: process.env.DIRECT_URL ?? process.env.DATABASE_URL! },
});
