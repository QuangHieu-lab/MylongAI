import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
   server: {
    proxy: {
      '/fpt-tts': {
        target: 'https://api.fpt.ai',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/fpt-tts/, '/hmi/tts/v5'),
      },
    },
  },
})
