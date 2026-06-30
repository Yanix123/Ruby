import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  resolve: {
    // Mirror tsconfig paths (layers live under src/app; config/pkg at src).
    alias: {
      "@/modules": r("./src/app/modules"),
      "@/widgets": r("./src/app/widgets"),
      "@/features": r("./src/app/features"),
      "@/entities": r("./src/app/entities"),
      "@/shared": r("./src/app/shared"),
      "@/config": r("./src/config"),
      "@/pkg": r("./src/pkg"),
      "@": r("./src"),
      "server-only": r("./tests/stubs/server-only.ts"),
    },
  },
  test: {
    environment: "node",
    // Dummy env so importing env-validated modules (db/auth) doesn't throw in unit tests.
    env: {
      DATABASE_URL: "postgresql://user:pass@localhost:5432/db",
      BETTER_AUTH_SECRET: "0123456789abcdef0123456789abcdef",
      BETTER_AUTH_URL: "http://localhost:3000",
    },
    include: ["tests/unit/**/*.spec.ts"],
  },
});
