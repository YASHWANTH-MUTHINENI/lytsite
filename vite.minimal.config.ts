import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom']
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/lytsite-minimal.tsx'),
      name: 'LytsiteTemplate',
      fileName: 'lytsite-template',
      formats: ['iife']
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
        manualChunks: undefined
      },
      external: [],
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