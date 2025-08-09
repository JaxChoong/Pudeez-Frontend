import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    exclude: ["chunk-JCD3NDNE"],
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3111',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
