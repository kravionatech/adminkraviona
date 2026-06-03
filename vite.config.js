import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// ─── Kraviona admin panel (Vite + React) ────────────────────────────
//
// Configuration:
//   - VITE_API_URL   (default "/api")   → axios baseURL
//   - BACKEND_URL    (default "http://localhost:3123") → dev-server proxy target
//
// In dev, set BACKEND_URL once (or use the default) and the proxy
// forwards every /api/* request to the backend. No CORS surprises,
// no hard-coded host in the bundle, and the same bundle works
// behind a reverse proxy in production (e.g. nginx mounting the
// admin at /admin with /api going to the backend).
export default defineConfig(({ mode }) => {
  // loadEnv returns the merged .env + .env.local for the current mode
  const env = loadEnv(mode, process.cwd(), "");
  const BACKEND_URL = env.BACKEND_URL || "http://localhost:3123";

  return {
    plugins: [react(), tailwindcss()],

    server: {
      port: 5173,
      // The proxy is what makes the admin work in dev without CORS.
      // Rewrite strips the /api prefix so the backend sees the
      // routes it actually mounts (e.g. /auth/login-password,
      // /v1/site-config, /admin/users).
      proxy: {
        "/api": {
          target: BACKEND_URL,
          changeOrigin: true,
          secure: false,
          // Don't rewrite — the backend mounts routes under /api/*.
          // We DO need to forward Host so the backend can log it.
          configure: (proxy) => {
            proxy.on("proxyReq", (proxyReq) => {
              proxyReq.setHeader("X-Forwarded-By", "vite-dev-proxy");
            });
          },
        },
      },
    },

    preview: {
      port: 4173,
    },

    build: {
      outDir: "dist",
      sourcemap: true,
    },
  };
});
