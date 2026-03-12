import path from "node:path";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

import { visualizer } from "rollup-plugin-visualizer";

const enableVisualizer = process.env.V4_ENABLE_VISUALIZER === "1";

export default defineConfig({
  plugins: [
    react(),
    ...(enableVisualizer
      ? [
          visualizer({
            filename: "./dist/stats.html",
            open: false,
            gzipSize: true,
            brotliSize: true,
          }) as Plugin,
        ]
      : []),
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  server: {
    port: 5173,
    host: true,
  },

  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;

          const reactCore = [
            "/react/",
            "/react-dom/",
            "/scheduler/",
            "/use-sync-external-store/",
            // These packages access React at top-level module scope (not inside
            // a function), so they must evaluate in the same chunk as React to
            // avoid "Cannot read properties of undefined (reading 'useLayoutEffect')"
            // when SES/Lockdown (e.g. MetaMask) freezes module bindings early.
            // React ecosystem packages that access React hooks at module
            // top-level (IIFE or module-level const) — must evaluate with React.
            "/react-remove-scroll/",
            "/react-remove-scroll-bar/",
            "/react-style-singleton/",
            "/use-callback-ref/",
            "/use-sidecar/",
            "/get-nonce/",
            "/aria-hidden/",
            "/react-focus-lock/",
            "/react-redux/",
            "/redux/",
            "/redux-thunk/",
            "/@reduxjs/",
          ];
          if (reactCore.some((segment) => id.includes(segment)))
            return "vendor-react";

          const chartLibs = ["/recharts/", "/d3-", "/internmap/"];
          if (chartLibs.some((segment) => id.includes(segment)))
            return "vendor-charts";

          const threeLibs = [
            "/three/",
            "/@react-three/fiber/",
            "/@react-three/drei/",
          ];
          if (threeLibs.some((segment) => id.includes(segment)))
            return "vendor-three";

          if (id.includes("/framer-motion/") || id.includes("/motion-dom/"))
            return "vendor-motion";
          if (id.includes("/lucide-react/")) return "vendor-icons";

          // Radix UI primitives
          const radixLibs = ["/@radix-ui/", "/radix-ui/"];
          if (radixLibs.some((segment) => id.includes(segment)))
            return "vendor-radix";

          // Command palette (cmdk)
          if (id.includes("/cmdk/")) return "vendor-cmdk";

          // PDF tooling
          if (id.includes("/pdfjs-dist/") || id.includes("/pdf.worker"))
            return "vendor-pdf";

          return undefined;
        },
      },
    },
    chunkSizeWarningLimit: 600,
    sourcemap: false, // Disable sourcemaps in production for smaller bundles
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },

  optimizeDeps: {
    include: ["react", "react-dom"],
  },
});
