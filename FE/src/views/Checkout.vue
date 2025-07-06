<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Thanh toán</h1>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Checkout Form -->
        <div>
          <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Thông tin giao hàng</h2>
            
            <form @submit.prevent="handleSubmit" class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Họ</label>
                  <input 
                    v-model="form.firstName"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Tên</label>
                  <input 
                    v-model="form.lastName"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  v-model="form.email"
                  type="email"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                <input 
                  v-model="form.phone"
                  type="tel"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                <input 
                  v-model="form.address"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Thành phố</label>
                  <input 
                    v-model="form.city"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Mã bưu điện</label>
                  <input 
                    v-model="form.zipCode"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </form>
          </div>

          <div class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Phương thức thanh toán</h2>
            
            <div class="space-y-3">
              <label class="flex items-center space-x-3 cursor-pointer">
                <input 
                  v-model="paymentMethod"
                  type="radio"
                  value="cod"
                  class="text-blue-600 focus:ring-blue-500"
                />
                <span>Thanh toán khi nhận hàng (COD)</span>
              </label>
              
              <label class="flex items-center space-x-3 cursor-pointer">
                <input 
                  v-model="paymentMethod"
                  type="radio"
                  value="bank"
                  class="text-blue-600 focus:ring-blue-500"
                />
                <span>Chuyển khoản ngân hàng</span>
              </label>
              
              <label class="flex items-center space-x-3 cursor-pointer">
                <input 
                  v-model="paymentMethod"
                  type="radio"
                  value="card"
                  class="text-blue-600 focus:ring-blue-500"
                />
                <span>Thẻ tín dụng/ghi nợ</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div>
          <div class="bg-white rounded-lg shadow-sm p-6 sticky top-8">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Tóm tắt đơn hàng</h2>
            
            <div class="space-y-3 mb-6">
              <div v-for="item in cartItems" :key="item.id" class="flex items-center space-x-3">
                <img 
                  :src="item.image" 
                  :alt="item.name"
                  class="w-12 h-12 object-cover rounded"
                />
                <div class="flex-1">
                  <h3 class="font-medium text-gray-900">{{ item.name }}</h3>
                  <p class="text-sm text-gray-600">Số lượng: {{ item.quantity }}</p>
                </div>
                <span class="font-medium">{{ formatCurrency(item.price * item.quantity) }}</span>
              </div>
            </div>
            
            <hr class="my-4">
            
            <div class="space-y-2 mb-6">
              <div class="flex justify-between">
                <span class="text-gray-600">Tạm tính</span>
                <span>{{ formatCurrency(subtotal) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Phí vận chuyển</span>
                <span>{{ formatCurrency(shipping) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Thuế</span>
                <span>{{ formatCurrency(tax) }}</span>
              </div>
              <hr class="my-2">
              <div class="flex justify-between text-lg font-bold">
                <span>Tổng cộng</span>
                <span class="text-blue-600">{{ formatCurrency(total) }}</span>
              </div>
            </div>
            
            <button 
              @click="handleSubmit"
              :disabled="loading"
              class="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {{ loading ? 'Đang xử lý...' : 'Đặt hàng' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'
import { formatCurrency } from '@/utils/format'

const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()
const toast = useToast()

const loading = ref(false)
const paymentMethod = ref('cod')

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  zipCode: ''
})

// Computed properties
const cartItems = computed(() => cartStore.items)
const subtotal = computed(() => cartStore.total)
const shipping = computed(() => subtotal.value > 500000 ? 0 : 30000)
const tax = computed(() => subtotal.value * 0.1)
const total = computed(() => subtotal.value + shipping.value + tax.value)

const handleSubmit = async () => {
  if (cartItems.value.length === 0) {
    toast.error('Giỏ hàng trống')
    return
  }

  loading.value = true
  try {
    // Mock API call - replace with actual API
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Clear cart
    cartStore.clearCart()
    
    toast.success('Đặt hàng thành công!')
    router.push('/orders')
  } catch (error) {
    console.error('Error placing order:', error)
    toast.error('Có lỗi xảy ra khi đặt hàng')
  } finally {
    loading.value = false
  }
}
</script> 