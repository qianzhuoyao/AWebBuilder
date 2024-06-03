import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fixReactVirtualized from 'esbuild-plugin-react-virtualized'
// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: {
    esbuildOptions: {
      plugins: [fixReactVirtualized],
    },
  },
  define: {
    _global: ({})
  },
  server: {
    open: true,
    port: 5183,
    proxy: {
      '/xxapi': {
        target: 'http://x.x.x.x:x',
        secure: false,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/xxapi/, 'xxapi'),
      },
    },
  },
  plugins: [react()],
})
