import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Synthesized by TRD Phase 27c.5c — minimal Vite config for React + TypeScript apps
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
