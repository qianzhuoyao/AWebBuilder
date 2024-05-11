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
    port: 5173,
    proxy: {
      '/mwapi': {
        target: 'http://10.180.5.186:30095',
        secure: false,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/mwapi/, 'mwapi'),
      },
    },
  },
  plugins: [react()],
})
