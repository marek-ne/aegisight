import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../public/js', // Output directly to public/js
    emptyOutDir: false, // Don't wipe public/js
    lib: {
      entry: resolve(__dirname, 'src/widget-entry.tsx'),
      name: 'AegisightWidget',
      fileName: () => 'scrolly-bundle.js', // Fixed filename
      formats: ['iife'], // IIFE for direct script tag usage
    },
    rollupOptions: {
      // Ensure React is bundled IN since the page is static HTML
      // We are NOT externalizing react/react-dom because the host page doesn't have them
      external: [],
      output: {
        globals: {},
        // Force inline CSS injection via JS or extract to checking
        inlineDynamicImports: true,
      }
    },
    // Minify for performance
    minify: 'esbuild',
  },
  define: {
    'process.env.NODE_ENV': '"production"'
  }
});
