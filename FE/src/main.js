/**
 * Main entry point cho ứng dụng Vue 3
 * File này khởi tạo Vue app với các plugin và cấu hình cần thiết
 */

import { createApp } from 'vue' // Import hàm createApp từ Vue 3 để tạo ứng dụng
import { createPinia } from 'pinia' // Import hàm createPinia để tạo state management store
import router from './router' // Import router đã được cấu hình
import Toast from 'vue-toastification' // Import plugin thông báo toast

// Import styles
import 'vue-toastification/dist/index.css' // Import CSS cho toast notifications
import './assets/styles/main.css' // Import CSS chính của ứng dụng

// Import App component
import App from './App.vue' // Import component gốc của ứng dụng

// Tạo Vue app instance
const app = createApp(App) // Tạo instance Vue app với component App

// Cấu hình Pinia store
const pinia = createPinia() // Tạo instance Pinia store
app.use(pinia) // Đăng ký Pinia với Vue app

// Cấu hình Vue Router
app.use(router) // Đăng ký router với Vue app

// Cấu hình Toast notifications
app.use(Toast, {
  position: 'top-right', // Vị trí hiển thị toast (góc trên bên phải)
  timeout: 5000, // Thời gian tự động ẩn toast (5 giây)
  closeOnClick: true, // Cho phép đóng toast khi click
  pauseOnFocusLoss: true, // Tạm dừng đếm ngược khi mất focus
  pauseOnHover: true, // Tạm dừng đếm ngược khi hover
  draggable: true, // Cho phép kéo thả toast
  draggablePercent: 0.6, // Phần trăm kéo để đóng toast
  showCloseButtonOnHover: false, // Không hiển thị nút đóng khi hover
  hideProgressBar: false, // Hiển thị thanh tiến trình
  closeButton: 'button', // Loại nút đóng
  icon: true, // Hiển thị icon
  rtl: false, // Không sử dụng right-to-left
  transition: 'Vue-Toastification__bounce', // Hiệu ứng chuyển động
  maxToasts: 20, // Số lượng toast tối đa hiển thị cùng lúc
  newestOnTop: true // Toast mới nhất hiển thị trên cùng
}) // Đăng ký plugin toast với cấu hình

// Global error handler
app.config.errorHandler = (err, vm, info) => {
  console.error('❌ Vue Error:', err) // In lỗi Vue
  console.error('Component:', vm) // In component gây lỗi
  console.error('Info:', info) // In thông tin bổ sung
  
  // Có thể gửi error đến service như Sentry ở đây
} // Xử lý lỗi toàn cục trong Vue app

// Global warn handler
app.config.warnHandler = (msg, vm, trace) => {
  console.warn('⚠️ Vue Warning:', msg) // In cảnh báo Vue
  console.warn('Component:', vm) // In component gây cảnh báo
  console.warn('Trace:', trace) // In stack trace
} // Xử lý cảnh báo toàn cục trong Vue app

// Mount app
app.mount('#app') // Gắn Vue app vào element có id="app" trong HTML

// Log khi app đã sẵn sàng
console.log('🚀 Vue app đã khởi động thành công!') // Thông báo app đã khởi động
console.log('📱 Environment:', import.meta.env.MODE) // In môi trường hiện tại (development/production)
console.log('🔗 API URL:', import.meta.env.VITE_API_URL || 'http://localhost:3000') // In URL API 