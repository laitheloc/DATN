<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Sản phẩm</h1>
        <p class="text-gray-600">Khám phá đa dạng sản phẩm điện tử chất lượng cao</p>
      </div>

      <!-- Filters and Search -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- Search -->
          <div class="md:col-span-2">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              @input="handleSearch"
            />
          </div>
          
          <!-- Category Filter -->
          <div>
            <select
              v-model="selectedCategory"
              @change="handleFilter"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tất cả danh mục</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
          </div>
          
          <!-- Sort -->
          <div>
            <select
              v-model="sortBy"
              @change="handleSort"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="newest">Mới nhất</option>
              <option value="price_asc">Giá tăng dần</option>
              <option value="price_desc">Giá giảm dần</option>
              <option value="rating">Đánh giá cao</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Products Grid -->
      <div v-if="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <div v-else-if="products.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div 
          v-for="product in products" 
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
        <p class="text-gray-500">Không tìm thấy sản phẩm nào</p>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex justify-center mt-8">
        <nav class="flex items-center space-x-2">
          <button 
            @click="changePage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Trước
          </button>
          
          <button 
            v-for="page in visiblePages" 
            :key="page"
            @click="changePage(page)"
            :class="[
              'px-3 py-2 border rounded-lg',
              page === currentPage 
                ? 'bg-blue-600 text-white border-blue-600' 
                : 'border-gray-300 hover:bg-gray-50'
            ]"
          >
            {{ page }}
          </button>
          
          <button 
            @click="changePage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Sau
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useToast } from 'vue-toastification'
import { formatCurrency } from '@/utils/format'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()
const toast = useToast()

// Reactive data
const loading = ref(false)
const products = ref([])
const searchQuery = ref('')
const selectedCategory = ref('')
const sortBy = ref('newest')
const currentPage = ref(1)
const totalPages = ref(1)
const totalProducts = ref(0)

// Categories
const categories = ref([
  { id: 1, name: 'Điện thoại' },
  { id: 2, name: 'Laptop' },
  { id: 3, name: 'Máy tính bảng' },
  { id: 4, name: 'Phụ kiện' }
])

// Computed
const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, currentPage.value + 2)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

// Methods
const loadProducts = async () => {
  loading.value = true
  try {
    // Mock data - replace with actual API call
    const mockProducts = [
      {
        id: 1,
        name: 'iPhone 15 Pro Max 256GB',
        price: 29990000,
        image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        rating: 5,
        reviewCount: 128,
        categoryId: 1
      },
      {
        id: 2,
        name: 'MacBook Pro M3 14-inch',
        price: 45990000,
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        rating: 5,
        reviewCount: 89,
        categoryId: 2
      },
      {
        id: 3,
        name: 'Samsung Galaxy S24 Ultra',
        price: 27990000,
        image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        rating: 4,
        reviewCount: 156,
        categoryId: 1
      },
      {
        id: 4,
        name: 'AirPods Pro 2nd Gen',
        price: 5990000,
        image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        rating: 4,
        reviewCount: 203,
        categoryId: 4
      }
    ]

    // Filter by search
    let filtered = mockProducts
    if (searchQuery.value) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    }

    // Filter by category
    if (selectedCategory.value) {
      filtered = filtered.filter(product => product.categoryId === parseInt(selectedCategory.value))
    }

    // Sort
    switch (sortBy.value) {
      case 'price_asc':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price_desc':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating)
        break
      default:
        // newest - keep original order
        break
    }

    totalProducts.value = filtered.length
    totalPages.value = Math.ceil(filtered.length / 12)
    
    // Pagination
    const start = (currentPage.value - 1) * 12
    const end = start + 12
    products.value = filtered.slice(start, end)

  } catch (error) {
    console.error('Error loading products:', error)
    toast.error('Có lỗi xảy ra khi tải sản phẩm')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  currentPage.value = 1
  loadProducts()
}

const handleFilter = () => {
  currentPage.value = 1
  loadProducts()
}

const handleSort = () => {
  loadProducts()
}

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    loadProducts()
  }
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

// Watch route changes
watch(() => route.query, (newQuery) => {
  if (newQuery.search) {
    searchQuery.value = newQuery.search
  }
  if (newQuery.category) {
    const category = categories.value.find(c => c.name.toLowerCase().includes(newQuery.category))
    if (category) {
      selectedCategory.value = category.id
    }
  }
  loadProducts()
}, { immediate: true })

// Lifecycle
onMounted(() => {
  loadProducts()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 