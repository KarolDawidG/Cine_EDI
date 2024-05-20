// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Nasłuchuje na wszystkich dostępnych adresach
    port: 5173 // Możesz zmienić port, jeśli jest zajęty
  }
})
