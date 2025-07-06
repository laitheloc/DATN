<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Đơn hàng của tôi</h1>
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div v-if="loading" class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
        <div v-else-if="orders.length > 0">
          <table class="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Mã đơn</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Ngày đặt</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tổng tiền</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                <th class="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="order in orders" :key="order.id">
                <td class="px-4 py-2 font-medium text-blue-600">#{{ order.id }}</td>
                <td class="px-4 py-2">{{ order.date }}</td>
                <td class="px-4 py-2 font-bold">{{ formatCurrency(order.total) }}</td>
                <td class="px-4 py-2">
                  <span :class="statusClass(order.status)">{{ order.status }}</span>
                </td>
                <td class="px-4 py-2 text-right">
                  <router-link :to="`/orders/${order.id}`" class="text-blue-600 hover:underline">Xem chi tiết</router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="text-center py-12">
          <p class="text-gray-500">Bạn chưa có đơn hàng nào</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { formatCurrency } from '@/utils/format'

const loading = ref(false)
const orders = ref([])

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
    orders.value = [
      { id: 1001, date: '2024-07-01', total: 29990000, status: 'Đã giao' },
      { id: 1002, date: '2024-07-03', total: 45990000, status: 'Đang xử lý' },
      { id: 1003, date: '2024-07-05', total: 5990000, status: 'Đã hủy' }
    ]
    loading.value = false
  }, 1000)
})
</script> 