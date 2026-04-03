import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true
  },
  preview: {
    host: '0.0.0.0',
    port: 10000,
    strictPort: true,
    allowedHosts: 'all'   // disables host checking completely
  }
})