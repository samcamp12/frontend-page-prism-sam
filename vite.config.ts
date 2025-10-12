import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/screenshot': {
        target: 'https://screenshotof.com',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/screenshot/, ''),
        secure: true,
      },
    },
  },
})
