import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  root: '.',
  resolve: {
    alias: {
      src: '/src',
    },
  },
  server: {
    port: 3113,
  },
});
