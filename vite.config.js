import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    headers: {
      // 設定 CSP 設置
      'Content-Security-Policy': "script-src 'self' https://www.gstatic.com https://apis.google.com https://accounts.google.com; frame-src 'self' https://accounts.google.com; connect-src 'self' https://www.googleapis.com http://localhost:8080;",
    },
  }

})
