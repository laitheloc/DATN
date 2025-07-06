<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Giỏ hàng</h1>

      <div v-if="cartItems.length === 0" class="text-center py-12">
        <div class="w-24 h-24 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
          <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
          </svg>
        </div>
        <h2 class="text-xl font-semibold text-gray-900 mb-2">Giỏ hàng trống</h2>
        <p class="text-gray-600 mb-6">Bạn chưa có sản phẩm nào trong giỏ hàng</p>
        <router-link 
          to="/products"
          class="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Tiếp tục mua sắm
        </router-link>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Cart Items -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-lg shadow-sm">
            <div class="p-6 border-b border-gray-200">
              <h2 class="text-lg font-semibold text-gray-900">Sản phẩm ({{ cartItems.length }})</h2>
            </div>
            
            <div class="divide-y divide-gray-200">
              <div 
                v-for="item in cartItems" 
                :key="item.id"
                class="p-6 flex items-center space-x-4"
              >
                <img 
                  :src="item.image" 
                  :alt="item.name"
                  class="w-20 h-20 object-cover rounded-lg"
                />
                
                <div class="flex-1">
                  <h3 class="font-semibold text-gray-900 mb-1">{{ item.name }}</h3>
                  <p class="text-lg font-bold text-blue-600">{{ formatCurrency(item.price) }}</p>
                </div>
                
                <div class="flex items-center space-x-3">
                  <button 
                    @click="decreaseQuantity(item.id)"
                    class="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                    </svg>
                  </button>
                  
                  <span class="w-12 text-center font-medium">{{ item.quantity }}</span>
                  
                  <button 
                    @click="increaseQuantity(item.id)"
                    class="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
                
                <div class="text-right">
                  <p class="text-lg font-bold text-gray-900">{{ formatCurrency(item.price * item.quantity) }}</p>
                  <button 
                    @click="removeItem(item.id)"
                    class="text-red-600 hover:text-red-700 text-sm mt-1"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-sm p-6 sticky top-8">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Tóm tắt đơn hàng</h2>
            
            <div class="space-y-3 mb-6">
              <div class="flex justify-between">
                <span class="text-gray-600">Tạm tính</span>
                <span class="font-medium">{{ formatCurrency(subtotal) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Phí vận chuyển</span>
                <span class="font-medium">{{ formatCurrency(shipping) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Thuế</span>
                <span class="font-medium">{{ formatCurrency(tax) }}</span>
              </div>
              <hr class="my-3">
              <div class="flex justify-between text-lg font-bold">
                <span>Tổng cộng</span>
                <span class="text-blue-600">{{ formatCurrency(total) }}</span>
              </div>
            </div>
            
            <button 
              @click="proceedToCheckout"
              class="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Tiến hành thanh toán
            </button>
            
            <div class="mt-4 text-center">
              <router-link 
                to="/products"
                class="text-blue-600 hover:text-blue-700 text-sm"
              >
                Tiếp tục mua sắm
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'
import { formatCurrency } from '@/utils/format'

const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()
const toast = useToast()

// Computed properties
const cartItems = computed(() => cartStore.items)
const subtotal = computed(() => cartStore.total)
const shipping = computed(() => subtotal.value > 500000 ? 0 : 30000)
const tax = computed(() => subtotal.value * 0.1)
const total = computed(() => subtotal.value + shipping.value + tax.value)

// Methods
const increaseQuantity = (itemId) => {
  cartStore.updateQuantity(itemId, 1)
}

const decreaseQuantity = (itemId) => {
  const item = cartItems.value.find(item => item.id === itemId)
  if (item && item.quantity > 1) {
    cartStore.updateQuantity(itemId, -1)
  }
}

const removeItem = (itemId) => {
  cartStore.removeItem(itemId)
  toast.success('Đã xóa sản phẩm khỏi giỏ hàng')
}

const proceedToCheckout = () => {
  if (!authStore.isAuthenticated) {
    toast.error('Vui lòng đăng nhập để thanh toán')
    router.push('/login')
    return
  }
  
  if (cartItems.value.length === 0) {
    toast.error('Giỏ hàng trống')
    return
  }
  
  router.push('/checkout')
}
</script> 