/**
 * API Client - Axios instance với interceptors
 * Cấu hình chung cho tất cả API calls
 */

import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

// Tạo axios instance
const apiClient = axios.create({
  // Base URL cho API
  baseURL: import.meta.env.VITE_API_URL || '/api',
  
  // Timeout
  timeout: 10000,
  
  // Headers mặc định
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

/**
 * Request Interceptor
 * Thêm token vào header trước khi gửi request
 */
apiClient.interceptors.request.use(
  (config) => {
    // Lấy token từ auth store
    const authStore = useAuthStore()
    const token = authStore.getToken
    
    // Thêm Authorization header nếu có token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // Log request (chỉ trong development)
    if (import.meta.env.DEV) {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
        data: config.data,
        params: config.params
      })
    }
    
    return config
  },
  (error) => {
    console.error('❌ Request interceptor error:', error)
    return Promise.reject(error)
  }
)

/**
 * Response Interceptor
 * Xử lý response và error handling
 */
apiClient.interceptors.response.use(
  (response) => {
    // Log response (chỉ trong development)
    if (import.meta.env.DEV) {
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data
      })
    }
    
    return response
  },
  async (error) => {
    // Log error (chỉ trong development)
    if (import.meta.env.DEV) {
      console.error(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      })
    }
    
    // Xử lý lỗi 401 (Unauthorized)
    if (error.response?.status === 401) {
      const authStore = useAuthStore()
      
      // Xóa token và user data
      authStore.setToken(null)
      authStore.setUser(null)
      
      // Redirect đến trang login (nếu không phải đang ở trang login)
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    
    // Xử lý lỗi 403 (Forbidden)
    if (error.response?.status === 403) {
      console.warn('⚠️ Access forbidden - User may not have required permissions')
    }
    
    // Xử lý lỗi 500 (Internal Server Error)
    if (error.response?.status === 500) {
      console.error('💥 Server error - Please try again later')
    }
    
    // Xử lý network error
    if (!error.response) {
      console.error('🌐 Network error - Please check your internet connection')
    }
    
    return Promise.reject(error)
  }
)

/**
 * Utility methods
 */

// Kiểm tra response có thành công không
apiClient.isSuccess = (response) => {
  return response && response.data && response.data.success === true
}

// Lấy data từ response
apiClient.getData = (response) => {
  return response?.data?.data || null
}

// Lấy error message từ response
apiClient.getError = (response) => {
  return response?.data?.error || 'Có lỗi xảy ra'
}

// Tạo URL với query parameters
apiClient.buildUrl = (endpoint, params = {}) => {
  const url = new URL(endpoint, apiClient.defaults.baseURL)
  
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== null) {
      url.searchParams.append(key, params[key])
    }
  })
  
  return url.toString()
}

// Upload file
apiClient.uploadFile = async (endpoint, file, onProgress = null) => {
  const formData = new FormData()
  formData.append('file', file)
  
  return apiClient.post(endpoint, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress: onProgress
  })
}

// Download file
apiClient.downloadFile = async (endpoint, filename = null) => {
  const response = await apiClient.get(endpoint, {
    responseType: 'blob'
  })
  
  const url = window.URL.createObjectURL(new Blob([response.data]))
  const link = document.createElement('a')
  link.href = url
  
  // Sử dụng filename từ response header hoặc parameter
  const contentDisposition = response.headers['content-disposition']
  const serverFilename = contentDisposition 
    ? contentDisposition.split('filename=')[1]?.replace(/"/g, '')
    : null
  
  link.setAttribute('download', filename || serverFilename || 'download')
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}

export default apiClient 