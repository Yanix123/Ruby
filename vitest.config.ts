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
    },
  },
  test: {
    environment: "node",
    include: ["tests/unit/**/*.test.ts"],
  },
});
