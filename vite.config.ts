import solid from 'solid-start/vite'
import vercel from 'solid-start-vercel'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [solid({ adapter: vercel({ edge: true }) })],
  optimizeDeps: {
    esbuildOptions: { target: 'es2020' },
  },
  build: { target: 'es2020' },
})
