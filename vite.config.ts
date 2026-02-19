import path from 'node:path';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

import { visualizer } from 'rollup-plugin-visualizer';

const enableVisualizer = process.env.V4_ENABLE_VISUALIZER === '1';

export default defineConfig({
  plugins: [
    react(),
    ...(enableVisualizer
      ? [visualizer({
          filename: './dist/stats.html',
          open: false,
          gzipSize: true,
          brotliSize: true,
        }) as Plugin]
      : []),
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
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
          if (!id.includes('node_modules')) return;

          const reactCore = [
            '/react/',
            '/react-dom/',
            '/scheduler/',
            '/use-sync-external-store/',
          ];
          if (reactCore.some((segment) => id.includes(segment))) return 'vendor-react';

          const chartLibs = ['/recharts/', '/d3-', '/internmap/'];
          if (chartLibs.some((segment) => id.includes(segment))) return 'vendor-charts';

          const threeLibs = ['/three/', '/@react-three/fiber/'];
          if (threeLibs.some((segment) => id.includes(segment))) return 'vendor-three';

          if (id.includes('/framer-motion/') || id.includes('/motion-dom/')) return 'vendor-motion';
          if (id.includes('/lucide-react/')) return 'vendor-icons';

          return 'vendor-runtime';
        },
      },
    },
    chunkSizeWarningLimit: 600,
    sourcemap: false, // Disable sourcemaps in production for smaller bundles
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },

  optimizeDeps: {
    include: ['react', 'react-dom']
  }
});
