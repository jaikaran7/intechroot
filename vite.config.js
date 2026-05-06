import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Project root → `src` (use as `@/…` in imports, e.g. `@/data/applicationsStore`). */
const srcRoot = path.resolve(__dirname, "./src");

// IMPORTANT: do not default proxying to localhost. Force explicit config so dev
// can't accidentally hit a locally running backend (and its local secrets).
const proxyTarget = (process.env.VITE_API_URL || "").trim().replace(/\/$/, "");

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": srcRoot,
    },
  },
  server: {
    host: true, // bind to 0.0.0.0 — accessible on LAN
    port: 5173,
    proxy: {
      '/api': {
        target: proxyTarget || 'http://127.0.0.1:9',
        changeOrigin: true,
        // NOTE: set `VITE_API_URL` before running `npm run dev` to enable proxying.
      },
    },
  },
});
