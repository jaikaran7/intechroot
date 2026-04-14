import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Project root → `src` (use as `@/…` in imports, e.g. `@/data/applicationsStore`). */
const srcRoot = path.resolve(__dirname, "./src");

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": srcRoot,
    },
  },
});
