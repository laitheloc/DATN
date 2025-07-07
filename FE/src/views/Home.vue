<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <section class="relative bg-transparent">
      <div class="w-full flex justify-center items-start m-0 p-0">
        <Carousel 
          :autoplay="false" 
          :wrap-around="true" 
          :mouse-drag="true" 
          class="w-screen h-[500px] relative"
          ref="carouselRef"
          >
          <template #addons>
            <button 
              @click="prev"
              class="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-100 text-blue-600 rounded-full w-12 h-12 flex items-center justify-center shadow-lg z-20"
              aria-label="Lùi lại"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
            </button>
            <button 
              @click="next"
              class="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-100 text-blue-600 rounded-full w-12 h-12 flex items-center justify-center shadow-lg z-20"
              aria-label="Tiếp theo"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
            </button>
          </template>
          <Slide v-for="(img, idx) in images" :key="idx">
            <img :src="img" class="object-cover w-full h-[500px]" />
          </Slide>
        </Carousel>
      </div>
    </section>

    <!-- Featured Categories -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">Danh mục nổi bật</h2>
          <p class="text-gray-600 max-w-2xl mx-auto">
            Khám phá các danh mục sản phẩm đa dạng với chất lượng cao và giá cả hợp lý
          </p>
        </div>
        
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div 
            v-for="category in categories" 
            :key="category.id"
            class="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-shadow cursor-pointer"
            @click="goToCategory(category.slug)"
          >
            <div class="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
              <component :is="category.icon" class="w-8 h-8 text-blue-600" />
            </div>
            <h3 class="font-semibold text-gray-900 mb-2">{{ category.name }}</h3>
            <p class="text-sm text-gray-600">{{ category.count }} sản phẩm</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Products -->
    <section class="py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center mb-8">
          <div>
            <h2 class="text-3xl font-bold text-gray-900 mb-2">Sản phẩm nổi bật</h2>
            <p class="text-gray-600">Những sản phẩm được yêu thích nhất</p>
          </div>
          <router-link 
            to="/products"
            class="text-blue-600 hover:text-blue-700 font-semibold flex items-center"
          >
            Xem tất cả
            <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </router-link>
        </div>
        
        <div v-if="loading" class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
        
        <div v-else-if="featuredProducts.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div 
            v-for="product in featuredProducts" 
            :key="product.id"
            class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
          >
            <router-link :to="`/products/${product.id}`">
              <img 
                :src="product.image" 
                :alt="product.name"
                class="w-full h-48 object-cover"
              />
            </router-link>
            <div class="p-4">
              <h3 class="font-semibold text-gray-900 mb-2 line-clamp-2">
                <router-link :to="`/products/${product.id}`" class="hover:text-blue-600">
                  {{ product.name }}
                </router-link>
              </h3>
              <div class="flex items-center justify-between mb-3">
                <span class="text-lg font-bold text-blue-600">{{ formatCurrency(product.price) }}</span>
                <div class="flex items-center">
                  <div class="flex text-yellow-400">
                    <svg v-for="i in 5" :key="i" class="w-4 h-4" :class="i <= product.rating ? 'fill-current' : 'fill-gray-300'" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <span class="text-sm text-gray-600 ml-1">({{ product.reviewCount }})</span>
                </div>
              </div>
              <button 
                @click="addToCart(product)"
                class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Thêm vào giỏ
              </button>
            </div>
          </div>
        </div>
        
        <div v-else class="text-center py-12">
          <p class="text-gray-500">Không có sản phẩm nổi bật</p>
        </div>
      </div>
    </section>

    <!-- API Test Section (Chỉ hiển thị trong development) -->
    <section v-if="isDev" class="py-16 bg-yellow-50">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-2">🧪 Test Kết nối API</h2>
          <p class="text-gray-600">Kiểm tra kết nối giữa Frontend và Backend</p>
        </div>
        <ApiTest />
      </div>
    </section>

    <!-- Why Choose Us -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">Tại sao chọn chúng tôi?</h2>
          <p class="text-gray-600 max-w-2xl mx-auto">
            Chúng tôi cam kết mang đến trải nghiệm mua sắm tốt nhất với chất lượng dịch vụ hàng đầu
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Chất lượng đảm bảo</h3>
            <p class="text-gray-600">Tất cả sản phẩm đều được kiểm tra chất lượng nghiêm ngặt</p>
          </div>
          
          <div class="text-center">
            <div class="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Giao hàng nhanh</h3>
            <p class="text-gray-600">Giao hàng trong vòng 24h tại TP.HCM và 2-3 ngày toàn quốc</p>
          </div>
          
          <div class="text-center">
            <div class="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 109.75 9.75A9.75 9.75 0 0012 2.25z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Hỗ trợ 24/7</h3>
            <p class="text-gray-600">Đội ngũ hỗ trợ khách hàng chuyên nghiệp, sẵn sàng phục vụ</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useToast } from 'vue-toastification'
import { formatCurrency } from '@/utils/format'
import ApiTest from '@/components/ApiTest.vue'
import { Carousel, Slide } from 'vue3-carousel'
import 'vue3-carousel/dist/carousel.css'

const router = useRouter()
const cartStore = useCartStore()
const toast = useToast()

// Reactive data
const loading = ref(false)
const featuredProducts = ref([])
const carouselRef = ref(null)

// Categories data
const categories = ref([
  {
    id: 1,
    name: 'Điện thoại',
    slug: 'phones',
    count: 150,
    icon: 'PhoneIcon'
  },
  {
    id: 2,
    name: 'Laptop',
    slug: 'laptops',
    count: 89,
    icon: 'LaptopIcon'
  },
  {
    id: 3,
    name: 'Máy tính bảng',
    slug: 'tablets',
    count: 67,
    icon: 'TabletIcon'
  },
  {
    id: 4,
    name: 'Phụ kiện',
    slug: 'accessories',
    count: 234,
    icon: 'HeadphonesIcon'
  }
])

const images = [
  'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1025&q=80',
  'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80'
]

// Methods
const goToCategory = (slug) => {
  router.push({
    name: 'Products',
    query: { category: slug }
  })
}

const addToCart = (product) => {
  cartStore.addItem({
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.image,
    quantity: 1
  })
  toast.success('Đã thêm vào giỏ hàng')
}

const loadFeaturedProducts = async () => {
  loading.value = true
  try {
    // Mock data for now - replace with actual API call
    featuredProducts.value = [
      {
        id: 1,
        name: 'iPhone 15 Pro Max 256GB',
        price: 29990000,
        image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        rating: 5,
        reviewCount: 128
      },
      {
        id: 2,
        name: 'MacBook Pro M3 14-inch',
        price: 45990000,
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        rating: 5,
        reviewCount: 89
      },
      {
        id: 3,
        name: 'Samsung Galaxy S24 Ultra',
        price: 27990000,
        image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        rating: 4,
        reviewCount: 156
      },
      {
        id: 4,
        name: 'AirPods Pro 2nd Gen',
        price: 5990000,
        image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        rating: 4,
        reviewCount: 203
      }
    ]
  } catch (error) {
    console.error('Error loading featured products:', error)
    toast.error('Có lỗi xảy ra khi tải sản phẩm nổi bật')
  } finally {
    loading.value = false
  }
}

const next = () => {
  carouselRef.value && carouselRef.value.next()
}

const prev = () => {
  carouselRef.value && carouselRef.value.prev()
}

// Lifecycle
onMounted(() => {
  loadFeaturedProducts()
})

const isDev = import.meta.env.DEV
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 