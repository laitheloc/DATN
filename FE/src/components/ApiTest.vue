<template>
  <div class="p-6 bg-white rounded-lg shadow-md">
    <h3 class="text-lg font-semibold mb-4">🔗 Test Kết nối API</h3>
    
    <div class="space-y-4">
      <!-- Test Health Check -->
      <div class="border rounded-lg p-4">
        <h4 class="font-medium mb-2">Health Check API</h4>
        <div class="flex items-center gap-4">
          <button 
            @click="testHealthCheck"
            :disabled="healthLoading"
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {{ healthLoading ? 'Đang test...' : 'Test Health Check' }}
          </button>
          <div v-if="healthResult" class="flex-1">
            <div v-if="healthResult.success" class="text-green-600">
              ✅ {{ healthResult.message }}
            </div>
            <div v-else class="text-red-600">
              ❌ {{ healthResult.error }}
            </div>
          </div>
        </div>
      </div>

      <!-- Test Products API -->
      <div class="border rounded-lg p-4">
        <h4 class="font-medium mb-2">Products API</h4>
        <div class="flex items-center gap-4">
          <button 
            @click="testProductsApi"
            :disabled="productsLoading"
            class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            {{ productsLoading ? 'Đang test...' : 'Test Products API' }}
          </button>
          <div v-if="productsResult" class="flex-1">
            <div v-if="productsResult.success" class="text-green-600">
              ✅ Lấy được {{ productsResult.count }} sản phẩm
            </div>
            <div v-else class="text-red-600">
              ❌ {{ productsResult.error }}
            </div>
          </div>
        </div>
      </div>

      <!-- Connection Status -->
      <div class="border rounded-lg p-4">
        <h4 class="font-medium mb-2">Trạng thái kết nối</h4>
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span class="font-medium">Frontend URL:</span>
            <span class="text-blue-600">{{ frontendUrl }}</span>
          </div>
          <div>
            <span class="font-medium">Backend URL:</span>
            <span class="text-blue-600">{{ backendUrl }}</span>
          </div>
          <div>
            <span class="font-medium">API Base URL:</span>
            <span class="text-blue-600">{{ apiBaseUrl }}</span>
          </div>
          <div>
            <span class="font-medium">Proxy Status:</span>
            <span class="text-green-600">✅ Đã cấu hình</span>
          </div>
        </div>
      </div>

      <!-- Error Log -->
      <div v-if="errors.length > 0" class="border rounded-lg p-4 bg-red-50">
        <h4 class="font-medium mb-2 text-red-700">Lỗi gặp phải:</h4>
        <div class="space-y-2">
          <div v-for="(error, index) in errors" :key="index" class="text-sm text-red-600">
            {{ error }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import apiClient from '@/api/client'

// Reactive data
const healthLoading = ref(false)
const healthResult = ref(null)
const productsLoading = ref(false)
const productsResult = ref(null)
const errors = ref([])

// Computed properties
const frontendUrl = computed(() => window.location.origin)
const backendUrl = computed(() => 'http://localhost:3000')
const apiBaseUrl = computed(() => apiClient.defaults.baseURL)

// Test health check API
const testHealthCheck = async () => {
  healthLoading.value = true
  healthResult.value = null
  
  try {
    const response = await apiClient.get('/health')
    healthResult.value = {
      success: true,
      message: response.data.message,
      timestamp: response.data.timestamp
    }
  } catch (error) {
    healthResult.value = {
      success: false,
      error: error.response?.data?.message || error.message
    }
    errors.value.push(`Health Check Error: ${error.message}`)
  } finally {
    healthLoading.value = false
  }
}

// Test products API
const testProductsApi = async () => {
  productsLoading.value = true
  productsResult.value = null
  
  try {
    const response = await apiClient.get('/products')
    productsResult.value = {
      success: true,
      count: response.data.data?.length || 0
    }
  } catch (error) {
    productsResult.value = {
      success: false,
      error: error.response?.data?.message || error.message
    }
    errors.value.push(`Products API Error: ${error.message}`)
  } finally {
    productsLoading.value = false
  }
}
</script> 