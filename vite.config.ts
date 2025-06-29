import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    // Only include Replit plugins in development and when running on Replit
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          import("@replit/vite-plugin-runtime-error-modal").then((m) => m.default()),
          import("@replit/vite-plugin-cartographer").then((m) => m.cartographer()),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
  optimizeDeps: {
    include: [
      "@radix-ui/react-dialog",
      "@radix-ui/react-portal",
      "@radix-ui/react-overlay",
      "@radix-ui/react-dismissable-layer",
      "@radix-ui/react-focus-scope",
      "@radix-ui/react-id",
      "@radix-ui/react-primitive"
    ]
  }
});
