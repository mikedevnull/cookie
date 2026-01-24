/// <reference types="vitest/config" />
import { VitePWA } from "vite-plugin-pwa";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { playwright } from "@vitest/browser-playwright";

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    globals: true,
    browser: {
      enabled: true,
      provider: playwright(),
      // https://vitest.dev/config/browser/playwright
      instances: [{ browser: "chromium" }],
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("rxdb") || id.includes("rxjs")) {
              return "rxdb";
            }
            if (id.includes("react")) {
              return "react";
            }
            return "vendor"; // Split vendor libraries
          }
        },
      },
    },
  },
  plugins: [
    react(),
    VitePWA({
      pwaAssets: {
        disabled: false,
        config: true,
      },

      manifest: {
        name: "cookie",
        short_name: "cookie",
        description: "cookie",
        theme_color: "#ffffff",
      },

      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,ico}"],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
      },

      devOptions: {
        enabled: false,
        navigateFallback: "index.html",
        suppressWarnings: true,
        type: "module",
      },
    }),
  ],
});
