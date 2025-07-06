/**
 * Cart Store - Quản lý giỏ hàng
 * Sử dụng Pinia để state management
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useToast } from 'vue-toastification'

export const useCartStore = defineStore('cart', () => {
  // State
  const items = ref([])
  const isLoading = ref(false)

  // Computed properties
  const totalItems = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0)
  })

  const totalPrice = computed(() => {
    return items.value.reduce((total, item) => {
      const price = item.discount > 0 
        ? item.price - (item.price * item.discount / 100)
        : item.price
      return total + (price * item.quantity)
    }, 0)
  })

  const totalOriginalPrice = computed(() => {
    return items.value.reduce((total, item) => {
      return total + (item.price * item.quantity)
    }, 0)
  })

  const totalDiscount = computed(() => {
    return totalOriginalPrice.value - totalPrice.value
  })

  const isEmpty = computed(() => items.value.length === 0)

  // Getters
  const getItems = computed(() => items.value)
  const getIsLoading = computed(() => isLoading.value)

  // Actions
  const setLoading = (loading) => {
    isLoading.value = loading
  }

  /**
   * Thêm sản phẩm vào giỏ hàng
   */
  const addToCart = (product, quantity = 1) => {
    try {
      // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
      const existingItem = items.value.find(item => item.id === product.id)
      
      if (existingItem) {
        // Cập nhật số lượng nếu đã có
        const newQuantity = existingItem.quantity + quantity
        
        // Kiểm tra số lượng tồn kho
        if (newQuantity > product.stock) {
          const toast = useToast()
          toast.error(`Chỉ còn ${product.stock} sản phẩm trong kho`)
          return { success: false, error: 'Vượt quá số lượng tồn kho' }
        }
        
        existingItem.quantity = newQuantity
      } else {
        // Thêm sản phẩm mới
        const cartItem = {
          id: product.id,
          name: product.name,
          price: product.price,
          discount: product.discount || 0,
          stock: product.stock,
          quantity: quantity,
          image: product.mainImage || product.images?.[0]?.url,
          slug: product.slug,
          brand: product.brand,
          category: product.category
        }
        
        items.value.push(cartItem)
      }
      
      // Lưu vào localStorage
      saveToStorage()
      
      // Thông báo thành công
      const toast = useToast()
      toast.success(`Đã thêm ${product.name} vào giỏ hàng`)
      
      return { success: true }
      
    } catch (error) {
      console.error('❌ Add to cart error:', error)
      return { success: false, error: 'Có lỗi xảy ra khi thêm vào giỏ hàng' }
    }
  }

  /**
   * Cập nhật số lượng sản phẩm
   */
  const updateQuantity = (productId, quantity) => {
    try {
      const item = items.value.find(item => item.id === productId)
      
      if (!item) {
        return { success: false, error: 'Sản phẩm không tồn tại trong giỏ hàng' }
      }
      
      // Kiểm tra số lượng hợp lệ
      if (quantity <= 0) {
        return { success: false, error: 'Số lượng phải lớn hơn 0' }
      }
      
      if (quantity > item.stock) {
        const toast = useToast()
        toast.error(`Chỉ còn ${item.stock} sản phẩm trong kho`)
        return { success: false, error: 'Vượt quá số lượng tồn kho' }
      }
      
      item.quantity = quantity
      
      // Lưu vào localStorage
      saveToStorage()
      
      return { success: true }
      
    } catch (error) {
      console.error('❌ Update quantity error:', error)
      return { success: false, error: 'Có lỗi xảy ra khi cập nhật số lượng' }
    }
  }

  /**
   * Xóa sản phẩm khỏi giỏ hàng
   */
  const removeFromCart = (productId) => {
    try {
      const index = items.value.findIndex(item => item.id === productId)
      
      if (index === -1) {
        return { success: false, error: 'Sản phẩm không tồn tại trong giỏ hàng' }
      }
      
      const removedItem = items.value[index]
      items.value.splice(index, 1)
      
      // Lưu vào localStorage
      saveToStorage()
      
      // Thông báo
      const toast = useToast()
      toast.info(`Đã xóa ${removedItem.name} khỏi giỏ hàng`)
      
      return { success: true }
      
    } catch (error) {
      console.error('❌ Remove from cart error:', error)
      return { success: false, error: 'Có lỗi xảy ra khi xóa sản phẩm' }
    }
  }

  /**
   * Xóa tất cả sản phẩm khỏi giỏ hàng
   */
  const clearCart = () => {
    try {
      items.value = []
      saveToStorage()
      
      const toast = useToast()
      toast.info('Đã xóa tất cả sản phẩm khỏi giỏ hàng')
      
      return { success: true }
      
    } catch (error) {
      console.error('❌ Clear cart error:', error)
      return { success: false, error: 'Có lỗi xảy ra khi xóa giỏ hàng' }
    }
  }

  /**
   * Lưu giỏ hàng vào localStorage
   */
  const saveToStorage = () => {
    try {
      localStorage.setItem('cart', JSON.stringify(items.value))
    } catch (error) {
      console.error('❌ Save cart to storage error:', error)
    }
  }

  /**
   * Tải giỏ hàng từ localStorage
   */
  const loadFromStorage = () => {
    try {
      const savedCart = localStorage.getItem('cart')
      if (savedCart) {
        items.value = JSON.parse(savedCart)
      }
    } catch (error) {
      console.error('❌ Load cart from storage error:', error)
      // Xóa dữ liệu không hợp lệ
      localStorage.removeItem('cart')
    }
  }

  /**
   * Kiểm tra sản phẩm có trong giỏ hàng không
   */
  const isInCart = (productId) => {
    return items.value.some(item => item.id === productId)
  }

  /**
   * Lấy số lượng sản phẩm trong giỏ hàng
   */
  const getItemQuantity = (productId) => {
    const item = items.value.find(item => item.id === productId)
    return item ? item.quantity : 0
  }

  /**
   * Tính tổng giá trị đơn hàng với phí vận chuyển
   */
  const calculateOrderTotal = (shippingFee = 0) => {
    return totalPrice.value + shippingFee
  }

  /**
   * Kiểm tra tính hợp lệ của giỏ hàng
   */
  const validateCart = () => {
    const errors = []
    
    items.value.forEach(item => {
      if (item.quantity > item.stock) {
        errors.push(`${item.name}: Vượt quá số lượng tồn kho (${item.stock})`)
      }
      
      if (item.quantity <= 0) {
        errors.push(`${item.name}: Số lượng không hợp lệ`)
      }
    })
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }

  /**
   * Cập nhật thông tin sản phẩm từ API
   */
  const updateProductInfo = (productId, productInfo) => {
    const item = items.value.find(item => item.id === productId)
    if (item) {
      Object.assign(item, {
        price: productInfo.price,
        discount: productInfo.discount || 0,
        stock: productInfo.stock,
        name: productInfo.name,
        image: productInfo.mainImage || productInfo.images?.[0]?.url
      })
      
      // Kiểm tra số lượng sau khi cập nhật
      if (item.quantity > item.stock) {
        item.quantity = item.stock
        const toast = useToast()
        toast.warning(`Số lượng ${item.name} đã được điều chỉnh theo tồn kho`)
      }
      
      saveToStorage()
    }
  }

  return {
    // State
    items,
    isLoading,
    
    // Computed
    totalItems,
    totalPrice,
    totalOriginalPrice,
    totalDiscount,
    isEmpty,
    
    // Getters
    getItems,
    getIsLoading,
    
    // Actions
    setLoading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    saveToStorage,
    loadFromStorage,
    isInCart,
    getItemQuantity,
    calculateOrderTotal,
    validateCart,
    updateProductInfo
  }
}) 