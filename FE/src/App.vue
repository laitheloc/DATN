<template>
  <!-- App container -->
  <div id="app" class="min-h-screen bg-gray-50">
    <!-- Header Navigation -->
    <AppHeader />
    
    <!-- Main Content -->
    <main class="flex-1">
      <!-- Router view để render các trang -->
      <router-view v-slot="{ Component, route }">
        <!-- Transition animation cho page changes -->
        <transition 
          name="page" 
          mode="out-in"
          @before-enter="beforeEnter"
          @enter="enter"
          @leave="leave"
        >
          <component 
            :is="Component" 
            :key="route.path"
            class="page-component"
          />
        </transition>
      </router-view>
    </main>
    
    <!-- Footer -->
    <AppFooter />
    
    <!-- Back to top button -->
    <BackToTop />
    
    <!-- Loading overlay -->
    <LoadingOverlay v-if="isLoading" />
  </div>
</template>

<script setup>
/**
 * App.vue - Component chính của ứng dụng
 * Quản lý layout tổng thể và global state
 */

import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'

// Import components
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import BackToTop from '@/components/ui/BackToTop.vue'
import LoadingOverlay from '@/components/ui/LoadingOverlay.vue'

// Import stores
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'

// Import utilities
import { formatCurrency } from '@/utils/format'

// Reactive data
const isLoading = ref(false)
const route = useRoute()
const toast = useToast()

// Store instances
const authStore = useAuthStore()
const cartStore = useCartStore()

/**
 * Lifecycle hooks
 */
onMounted(async () => {
  console.log('🎯 App component mounted')
  
  try {
    // Khôi phục trạng thái từ localStorage
    await authStore.initializeAuth()
    cartStore.loadFromStorage()
    
    // Log thông tin app
    console.log('📊 App Info:', {
      user: authStore.user ? 'Logged in' : 'Not logged in',
      cartItems: cartStore.items.length,
      currentRoute: route.path
    })
    
  } catch (error) {
    console.error('❌ Error initializing app:', error)
    toast.error('Có lỗi xảy ra khi khởi tạo ứng dụng')
  }
})

onUnmounted(() => {
  console.log('👋 App component unmounted')
})

/**
 * Page transition methods
 */
const beforeEnter = (el) => {
  // Reset scroll position
  window.scrollTo(0, 0)
  
  // Set initial state
  el.style.opacity = '0'
  el.style.transform = 'translateY(20px)'
}

const enter = (el, done) => {
  // Animate in
  el.style.transition = 'all 0.3s ease-out'
  el.style.opacity = '1'
  el.style.transform = 'translateY(0)'
  
  setTimeout(done, 300)
}

const leave = (el, done) => {
  // Animate out
  el.style.transition = 'all 0.2s ease-in'
  el.style.opacity = '0'
  el.style.transform = 'translateY(-10px)'
  
  setTimeout(done, 200)
}

/**
 * Global methods có thể được sử dụng trong toàn bộ app
 */
const showLoading = () => {
  isLoading.value = true
}

const hideLoading = () => {
  isLoading.value = false
}

// Expose methods globally
window.$app = {
  showLoading,
  hideLoading,
  formatCurrency,
  toast
}
</script>

<style scoped>
/* App-specific styles */
#app {
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
}

/* Page transition styles */
.page-enter-active,
.page-leave-active {
  transition: all 0.3s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Page component styles */
.page-component {
  min-height: calc(100vh - 200px); /* Adjust based on header/footer height */
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Focus styles for accessibility */
*:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Print styles */
@media print {
  .no-print {
    display: none !important;
  }
}
</style> 