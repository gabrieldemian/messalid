import solid from 'solid-start/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [solid()],
  optimizeDeps: {
    esbuildOptions: { target: 'es2020' },
  },
  build: { target: 'es2020' },
})
