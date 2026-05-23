import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { inspectAttr } from 'plugin-inspect-react-code'

export default defineConfig({
  base: '/english-study-backend/',
  plugins: [inspectAttr(), react()],
  build: {
    rollupOptions: {
      external: ['@cloudbase/js-sdk'],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
