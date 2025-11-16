import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ command }) => ({
  plugins: [react()],
  server: {
    port: 3000,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  resolve: {
    alias: command === 'serve' 
      ? {
          'secretguard-core': path.resolve(__dirname, '../../packages/vibegard-core/src'),
        }
      : {},
  },
}));

