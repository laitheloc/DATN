/**
 * Auth API Service
 * Xử lý các API calls liên quan đến xác thực
 */

import apiClient from './client'

const authApi = {
  /**
   * Đăng ký tài khoản mới
   * @param {Object} userData - Thông tin người dùng
   * @returns {Promise} Response từ API
   */
  async register(userData) {
    try {
      const response = await apiClient.post('/auth/register', userData)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  },

  /**
   * Đăng nhập
   * @param {Object} credentials - Email và mật khẩu
   * @returns {Promise} Response từ API
   */
  async login(credentials) {
    try {
      const response = await apiClient.post('/auth/login', credentials)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  },

  /**
   * Đăng xuất
   * @returns {Promise} Response từ API
   */
  async logout() {
    try {
      const response = await apiClient.post('/auth/logout')
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  },

  /**
   * Lấy thông tin user hiện tại
   * @returns {Promise} Response từ API
   */
  async getCurrentUser() {
    try {
      const response = await apiClient.get('/auth/me')
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  },

  /**
   * Cập nhật thông tin profile
   * @param {Object} profileData - Thông tin profile mới
   * @returns {Promise} Response từ API
   */
  async updateProfile(profileData) {
    try {
      const response = await apiClient.put('/auth/profile', profileData)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  },

  /**
   * Đổi mật khẩu
   * @param {Object} passwordData - Mật khẩu hiện tại và mới
   * @returns {Promise} Response từ API
   */
  async changePassword(passwordData) {
    try {
      const response = await apiClient.post('/auth/change-password', passwordData)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  },

  /**
   * Xử lý lỗi từ API
   * @param {Error} error - Error object
   * @returns {Error} Formatted error
   */
  handleError(error) {
    console.error('❌ Auth API Error:', error)
    
    // Nếu có response từ server
    if (error.response) {
      const { status, data } = error.response
      
      // Xử lý các status code cụ thể
      switch (status) {
        case 400:
          return new Error(data.error || 'Dữ liệu không hợp lệ')
        case 401:
          return new Error(data.error || 'Không có quyền truy cập')
        case 403:
          return new Error(data.error || 'Truy cập bị từ chối')
        case 404:
          return new Error(data.error || 'Không tìm thấy tài nguyên')
        case 422:
          return new Error(data.error || 'Dữ liệu không hợp lệ')
        case 500:
          return new Error('Lỗi server nội bộ')
        default:
          return new Error(data.error || 'Có lỗi xảy ra')
      }
    }
    
    // Nếu không có response (network error)
    if (error.request) {
      return new Error('Không thể kết nối đến server')
    }
    
    // Lỗi khác
    return new Error(error.message || 'Có lỗi xảy ra')
  }
}

export default authApi 