<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div v-if="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <div v-else-if="product" class="bg-white rounded-lg shadow-sm">
        <!-- Breadcrumb -->
        <div class="p-6 border-b border-gray-200">
          <nav class="flex" aria-label="Breadcrumb">
            <ol class="flex items-center space-x-4">
              <li>
                <router-link to="/" class="text-gray-400 hover:text-gray-500">Trang chủ</router-link>
              </li>
              <li>
                <router-link to="/products" class="text-gray-400 hover:text-gray-500">Sản phẩm</router-link>
              </li>
              <li>
                <span class="text-gray-900">{{ product.name }}</span>
              </li>
            </ol>
          </nav>
        </div>

        <!-- Product Details -->
        <div class="p-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Product Image -->
            <div>
              <img 
                :src="product.image" 
                :alt="product.name"
                class="w-full h-96 object-cover rounded-lg"
              />
            </div>

            <!-- Product Info -->
            <div>
              <h1 class="text-3xl font-bold text-gray-900 mb-4">{{ product.name }}</h1>
              
              <!-- Rating -->
              <div class="flex items-center mb-4">
                <div class="flex text-yellow-400">
                  <svg v-for="i in 5" :key="i" class="w-5 h-5" :class="i <= product.rating ? 'fill-current' : 'fill-gray-300'" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <span class="text-gray-600 ml-2">{{ product.rating }}/5 ({{ product.reviewCount }} đánh giá)</span>
              </div>

              <!-- Price -->
              <div class="text-3xl font-bold text-blue-600 mb-6">{{ formatCurrency(product.price) }}</div>

              <!-- Description -->
              <div class="mb-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-2">Mô tả</h3>
                <p class="text-gray-600">{{ product.description }}</p>
              </div>

              <!-- Quantity -->
              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-2">Số lượng</label>
                <div class="flex items-center space-x-3">
                  <button 
                    @click="decreaseQuantity"
                    class="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                    </svg>
                  </button>
                  <input 
                    v-model.number="quantity"
                    type="number"
                    min="1"
                    class="w-20 h-10 border border-gray-300 rounded-lg text-center"
                  />
                  <button 
                    @click="increaseQuantity"
                    class="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex space-x-4">
                <button 
                  @click="addToCart"
                  class="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Thêm vào giỏ hàng
                </button>
                <button 
                  @click="buyNow"
                  class="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  Mua ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-12">
        <p class="text-gray-500">Không tìm thấy sản phẩm</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useToast } from 'vue-toastification'
import { formatCurrency } from '@/utils/format'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()
const toast = useToast()

const loading = ref(false)
const product = ref(null)
const quantity = ref(1)

const loadProduct = async () => {
  loading.value = true
  try {
    // Mock data - replace with actual API call
    product.value = {
      id: parseInt(route.params.id),
      name: 'iPhone 15 Pro Max 256GB',
      price: 29990000,
      image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      rating: 5,
      reviewCount: 128,
      description: 'iPhone 15 Pro Max với chip A17 Pro mạnh mẽ, camera 48MP, màn hình 6.7 inch Super Retina XDR OLED, và thiết kế titanium cao cấp.'
    }
  } catch (error) {
    console.error('Error loading product:', error)
    toast.error('Có lỗi xảy ra khi tải thông tin sản phẩm')
  } finally {
    loading.value = false
  }
}

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const increaseQuantity = () => {
  quantity.value++
}

const addToCart = () => {
  cartStore.addItem({
    id: product.value.id,
    name: product.value.name,
    price: product.value.price,
    image: product.value.image,
    quantity: quantity.value
  })
  toast.success('Đã thêm vào giỏ hàng')
}

const buyNow = () => {
  addToCart()
  router.push('/checkout')
}

onMounted(() => {
  loadProduct()
})
</script> 