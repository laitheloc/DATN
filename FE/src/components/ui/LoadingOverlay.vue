<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-8 shadow-xl max-w-sm w-full mx-4">
      <div class="flex flex-col items-center">
        <!-- Spinner -->
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        
        <!-- Loading text -->
        <h3 class="text-lg font-medium text-gray-900 mb-2">
          {{ title }}
        </h3>
        
        <p class="text-gray-500 text-center">
          {{ message }}
        </p>
        
        <!-- Progress bar (optional) -->
        <div v-if="showProgress" class="w-full mt-4">
          <div class="bg-gray-200 rounded-full h-2">
            <div 
              class="bg-blue-600 h-2 rounded-full transition-all duration-300"
              :style="{ width: `${progress}%` }"
            ></div>
          </div>
          <p class="text-sm text-gray-500 mt-2 text-center">
            {{ progress }}%
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: 'Đang tải...'
  },
  message: {
    type: String,
    default: 'Vui lòng chờ trong giây lát'
  },
  showProgress: {
    type: Boolean,
    default: false
  },
  progress: {
    type: Number,
    default: 0
  }
})
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style> 