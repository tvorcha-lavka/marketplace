import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    strictPort: true,
    port: 8080,
    watch: {
      usePolling: true,
    },
  },
  worker: {
    count: 2
  },
  optimizeDeps: {
    include: ['date-fns', 'date-fns/locale'],
  },
});
