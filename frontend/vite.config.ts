import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Em desenvolvimento, as chamadas para /api vão para o backend Java (Spring Boot)
    proxy: {
      '/api': 'http://127.0.0.1:8080',
    },
  },
})
