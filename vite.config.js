import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
   plugins: [react()],
   resolve: {
      alias: {
         '@': path.resolve(__dirname, './src'),
         '@components': path.resolve(__dirname, './src/components'),
         '@pages': path.resolve(__dirname, './src/pages'),
         '@features': path.resolve(__dirname, './src/features'),
         '@services': path.resolve(__dirname, './src/services'),
         '@hooks': path.resolve(__dirname, './src/hooks'),
         '@utils': path.resolve(__dirname, './src/utils'),
         '@assets': path.resolve(__dirname, './src/assets'),
      },
   },
})
