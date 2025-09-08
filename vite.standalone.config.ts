import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
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
