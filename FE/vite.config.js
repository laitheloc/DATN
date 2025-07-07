import { defineConfig } from 'vite' // Import hàm defineConfig từ Vite để cấu hình
import vue from '@vitejs/plugin-vue' // Import plugin Vue cho Vite
import { resolve } from 'path' // Import hàm resolve từ module path để xử lý đường dẫn

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()], // Đăng ký plugin Vue để Vite có thể xử lý file .vue
  
  // Cấu hình alias để import dễ dàng hơn
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'), // Alias @ trỏ đến thư mục src
      '@components': resolve(__dirname, 'src/components'), // Alias cho thư mục components
      '@views': resolve(__dirname, 'src/views'), // Alias cho thư mục views
      '@stores': resolve(__dirname, 'src/stores'), // Alias cho thư mục stores (Pinia)
      '@utils': resolve(__dirname, 'src/utils'), // Alias cho thư mục utils
      '@assets': resolve(__dirname, 'src/assets'), // Alias cho thư mục assets
      '@api': resolve(__dirname, 'src/api') // Alias cho thư mục api
    }
  },
  
  // Cấu hình server development
  server: {
    port: 8080, // Port mà development server sẽ chạy
    host: true, // Cho phép truy cập từ các IP khác (không chỉ localhost)
    proxy: {
      // Proxy API requests đến backend
      '/api': {
        target: 'http://localhost:3000', // Chuyển hướng request /api đến backend server
        changeOrigin: true, // Thay đổi origin header để tránh CORS
        secure: false // Cho phép kết nối HTTP (không chỉ HTTPS)
      }
    }
  },
  
  // Cấu hình build
  build: {
    outDir: 'dist', // Thư mục output khi build production
    assetsDir: 'assets', // Thư mục chứa assets (CSS, JS, images)
    sourcemap: false, // Không tạo source map để giảm kích thước file
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia'], // Tách các thư viện core thành chunk riêng
          ui: ['lucide-vue-next', 'vue3-carousel'] // Tách các thư viện UI thành chunk riêng
        }
      }
    }
  },
  
  // Cấu hình CSS
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/assets/styles/variables.scss";` // Tự động import file variables.scss vào tất cả file SCSS
      }
    }
  }
}) 