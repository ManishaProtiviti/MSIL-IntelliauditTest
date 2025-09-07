import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    strictPort: true,
    port: 5173,
    hmr: {
      protocol: 'wss',
      host: 'devintelliaudit.maruti-suzuki.ai'
    },
    origin: 'https://devintelliaudit.maruti-suzuki.ai'
  }
})
