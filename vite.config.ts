import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/', // 👈 важно
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5010",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },

  },
})


