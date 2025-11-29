import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173
  },
  resolve: {
    alias: {
      '@greenline/types': '/../../packages/types/src/index.ts',
      '@greenline/ui': '/../../packages/ui/src/index.tsx'
    }
  }
});
