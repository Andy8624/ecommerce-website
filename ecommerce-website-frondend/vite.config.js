import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { BASE_URL } from './src/utils/Config'

export default defineConfig({
    plugins: [react()],
    define: {
        global: 'window'
    },
    server: {
        proxy: {
            '/ws': {
                target: `${BASE_URL}`,
                ws: true,
                changeOrigin: true
            },
            '/api': {
                target: `${BASE_URL}`,
                changeOrigin: true
            }
        }
    }
})