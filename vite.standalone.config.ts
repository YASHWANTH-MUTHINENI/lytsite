import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom', 'lucide-react']
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/lytsite-standalone.tsx'),
      name: 'LytsiteTemplate',
      fileName: 'lytsite-template',
      formats: ['iife']  // Changed to IIFE for self-contained bundle
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
        manualChunks: undefined
      },
      // Don't externalize any dependencies for standalone build
      external: [],
      // Suppress warnings about external dependencies
      onwarn(warning, warn) {
        if (warning.code === 'UNRESOLVED_IMPORT') return;
        warn(warning);
      }
    },
    outDir: 'dist-standalone',
    minify: 'terser',
    target: 'es2015',
    cssCodeSplit: false
  },
  define: {
    'process.env.NODE_ENV': '"production"'
  }
});
