<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Chi tiết đơn hàng #{{ orderId }}</h1>
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div v-if="loading" class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
        <div v-else-if="order">
          <div class="mb-6">
            <div class="flex justify-between items-center mb-2">
              <span class="text-gray-600">Ngày đặt:</span>
              <span class="font-medium">{{ order.date }}</span>
            </div>
            <div class="flex justify-between items-center mb-2">
              <span class="text-gray-600">Trạng thái:</span>
              <span :class="statusClass(order.status)">{{ order.status }}</span>
            </div>
            <div class="flex justify-between items-center mb-2">
              <span class="text-gray-600">Tổng tiền:</span>
              <span class="font-bold text-blue-600">{{ formatCurrency(order.total) }}</span>
            </div>
          </div>
          <hr class="my-4">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Sản phẩm</h2>
          <div v-for="item in order.items" :key="item.id" class="flex items-center space-x-4 mb-4">
            <img :src="item.image" :alt="item.name" class="w-16 h-16 object-cover rounded" />
            <div class="flex-1">
              <h3 class="font-medium text-gray-900">{{ item.name }}</h3>
              <p class="text-sm text-gray-600">Số lượng: {{ item.quantity }}</p>
            </div>
            <span class="font-medium">{{ formatCurrency(item.price * item.quantity) }}</span>
          </div>
        </div>
        <div v-else class="text-center py-12">
          <p class="text-gray-500">Không tìm thấy đơn hàng</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { formatCurrency } from '@/utils/format'

const route = useRoute()
const orderId = route.params.id
const loading = ref(false)
const order = ref(null)

const statusClass = (status) => {
  switch (status) {
    case 'Đã giao':
      return 'text-green-600 font-semibold'
    case 'Đang xử lý':
      return 'text-yellow-600 font-semibold'
    case 'Đã hủy':
      return 'text-red-600 font-semibold'
    default:
      return 'text-gray-600'
  }
}

onMounted(() => {
  loading.value = true
  setTimeout(() => {
    // Mock data - thay bằng API thực tế
    order.value = {
      id: orderId,
      date: '2024-07-01',
      total: 29990000,
      status: 'Đã giao',
      items: [
        { id: 1, name: 'iPhone 15 Pro Max 256GB', price: 29990000, quantity: 1, image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' }
      ]
    }
    loading.value = false
  }, 1000)
})
</script> 