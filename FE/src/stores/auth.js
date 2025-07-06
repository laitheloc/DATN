/**
 * Auth Store - Quản lý trạng thái xác thực người dùng
 * Sử dụng Pinia để state management
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import authApi from '@/api/auth'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || null)
  const isLoading = ref(false)
  const isInitialized = ref(false)

  // Computed properties
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const userFullName = computed(() => user.value?.fullName || '')
  const userEmail = computed(() => user.value?.email || '')

  // Getters
  const getUser = computed(() => user.value)
  const getToken = computed(() => token.value)
  const getIsLoading = computed(() => isLoading.value)

  // Actions
  const setToken = (newToken) => {
    token.value = newToken
    if (newToken) {
      localStorage.setItem('token', newToken)
    } else {
      localStorage.removeItem('token')
    }
  }

  const setUser = (userData) => {
    user.value = userData
  }

  const setLoading = (loading) => {
    isLoading.value = loading
  }

  /**
   * Đăng ký tài khoản mới
   */
  const register = async (userData) => {
    try {
      setLoading(true)
      const response = await authApi.register(userData)
      
      if (response.success) {
        const { user: newUser, token: newToken } = response.data
        
        // Lưu thông tin user và token
        setUser(newUser)
        setToken(newToken)
        
        // Thông báo thành công
        const toast = useToast()
        toast.success('Đăng ký thành công!')
        
        return { success: true, user: newUser }
      }
      
      return { success: false, error: response.error }
      
    } catch (error) {
      console.error('❌ Register error:', error)
      const errorMessage = error.response?.data?.error || 'Có lỗi xảy ra khi đăng ký'
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  /**
   * Đăng nhập
   */
  const login = async (credentials) => {
    try {
      setLoading(true)
      const response = await authApi.login(credentials)
      
      if (response.success) {
        const { user: userData, token: newToken } = response.data
        
        // Lưu thông tin user và token
        setUser(userData)
        setToken(newToken)
        
        // Thông báo thành công
        const toast = useToast()
        toast.success(`Chào mừng trở lại, ${userData.fullName}!`)
        
        return { success: true, user: userData }
      }
      
      return { success: false, error: response.error }
      
    } catch (error) {
      console.error('❌ Login error:', error)
      const errorMessage = error.response?.data?.error || 'Email hoặc mật khẩu không đúng'
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  /**
   * Đăng xuất
   */
  const logout = async () => {
    try {
      // Gọi API logout (nếu cần)
      if (token.value) {
        await authApi.logout()
      }
    } catch (error) {
      console.error('❌ Logout API error:', error)
    } finally {
      // Xóa thông tin local
      setUser(null)
      setToken(null)
      
      // Thông báo
      const toast = useToast()
      toast.info('Đã đăng xuất thành công')
      
      // Redirect về trang chủ
      const router = useRouter()
      router.push({ name: 'Home' })
    }
  }

  /**
   * Lấy thông tin user hiện tại
   */
  const fetchCurrentUser = async () => {
    try {
      if (!token.value) {
        return { success: false, error: 'Không có token' }
      }
      
      const response = await authApi.getCurrentUser()
      
      if (response.success) {
        setUser(response.data.user)
        return { success: true, user: response.data.user }
      }
      
      // Nếu token không hợp lệ, xóa token
      if (response.error === 'Token không hợp lệ') {
        setToken(null)
        setUser(null)
      }
      
      return { success: false, error: response.error }
      
    } catch (error) {
      console.error('❌ Fetch current user error:', error)
      
      // Nếu lỗi 401, xóa token
      if (error.response?.status === 401) {
        setToken(null)
        setUser(null)
      }
      
      return { success: false, error: 'Không thể lấy thông tin người dùng' }
    }
  }

  /**
   * Cập nhật thông tin profile
   */
  const updateProfile = async (profileData) => {
    try {
      setLoading(true)
      const response = await authApi.updateProfile(profileData)
      
      if (response.success) {
        const updatedUser = response.data.user
        setUser(updatedUser)
        
        const toast = useToast()
        toast.success('Cập nhật thông tin thành công!')
        
        return { success: true, user: updatedUser }
      }
      
      return { success: false, error: response.error }
      
    } catch (error) {
      console.error('❌ Update profile error:', error)
      const errorMessage = error.response?.data?.error || 'Có lỗi xảy ra khi cập nhật thông tin'
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  /**
   * Đổi mật khẩu
   */
  const changePassword = async (passwordData) => {
    try {
      setLoading(true)
      const response = await authApi.changePassword(passwordData)
      
      if (response.success) {
        const toast = useToast()
        toast.success('Đổi mật khẩu thành công!')
        
        return { success: true }
      }
      
      return { success: false, error: response.error }
      
    } catch (error) {
      console.error('❌ Change password error:', error)
      const errorMessage = error.response?.data?.error || 'Có lỗi xảy ra khi đổi mật khẩu'
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  /**
   * Khởi tạo trạng thái auth từ localStorage
   */
  const initializeAuth = async () => {
    if (isInitialized.value) return
    
    try {
      // Nếu có token, lấy thông tin user
      if (token.value) {
        await fetchCurrentUser()
      }
    } catch (error) {
      console.error('❌ Initialize auth error:', error)
      // Xóa token nếu có lỗi
      setToken(null)
      setUser(null)
    } finally {
      isInitialized.value = true
    }
  }

  /**
   * Kiểm tra quyền truy cập
   */
  const hasPermission = (permission) => {
    if (!isAuthenticated.value) return false
    
    // Kiểm tra role
    switch (permission) {
      case 'admin':
        return isAdmin.value
      case 'user':
        return true
      default:
        return false
    }
  }

  return {
    // State
    user,
    token,
    isLoading,
    isInitialized,
    
    // Computed
    isAuthenticated,
    isAdmin,
    userFullName,
    userEmail,
    
    // Getters
    getUser,
    getToken,
    getIsLoading,
    
    // Actions
    setToken,
    setUser,
    setLoading,
    register,
    login,
    logout,
    fetchCurrentUser,
    updateProfile,
    changePassword,
    initializeAuth,
    hasPermission
  }
}) 