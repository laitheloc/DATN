/**
 * Main entry point cho ứng dụng Vue 3
 * File này khởi tạo Vue app với các plugin và cấu hình cần thiết
 */

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import Toast from 'vue-toastification'

// Import styles
import 'vue-toastification/dist/index.css'
import './assets/styles/main.css'

// Import App component
import App from './App.vue'

// Tạo Vue app instance
const app = createApp(App)

// Cấu hình Pinia store
const pinia = createPinia()
app.use(pinia)

// Cấu hình Vue Router
app.use(router)

// Cấu hình Toast notifications
app.use(Toast, {
  position: 'top-right',
  timeout: 5000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: 'button',
  icon: true,
  rtl: false,
  transition: 'Vue-Toastification__bounce',
  maxToasts: 20,
  newestOnTop: true
})

// Global error handler
app.config.errorHandler = (err, vm, info) => {
  console.error('❌ Vue Error:', err)
  console.error('Component:', vm)
  console.error('Info:', info)
  
  // Có thể gửi error đến service như Sentry ở đây
}

// Global warn handler
app.config.warnHandler = (msg, vm, trace) => {
  console.warn('⚠️ Vue Warning:', msg)
  console.warn('Component:', vm)
  console.warn('Trace:', trace)
}

// Mount app
app.mount('#app')

// Log khi app đã sẵn sàng
console.log('🚀 Vue app đã khởi động thành công!')
console.log('📱 Environment:', import.meta.env.MODE)
console.log('🔗 API URL:', import.meta.env.VITE_API_URL || 'http://localhost:3000') 