/**
 * Format utilities
 * Các hàm tiện ích để format dữ liệu
 */

/**
 * Format tiền tệ VND
 * @param {number} amount - Số tiền cần format
 * @param {string} currency - Loại tiền tệ (mặc định: VND)
 * @returns {string} Chuỗi tiền tệ đã format
 */
export const formatCurrency = (amount, currency = 'VND') => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '0 ₫'
  }
  
  try {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  } catch (error) {
    console.error('❌ Format currency error:', error)
    return `${amount.toLocaleString('vi-VN')} ₫`
  }
}

/**
 * Format số với dấu phẩy ngăn cách
 * @param {number} number - Số cần format
 * @param {number} decimals - Số chữ số thập phân
 * @returns {string} Chuỗi số đã format
 */
export const formatNumber = (number, decimals = 0) => {
  if (number === null || number === undefined || isNaN(number)) {
    return '0'
  }
  
  try {
    return new Intl.NumberFormat('vi-VN', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(number)
  } catch (error) {
    console.error('❌ Format number error:', error)
    return number.toLocaleString('vi-VN')
  }
}

/**
 * Format ngày tháng
 * @param {Date|string} date - Ngày cần format
 * @param {string} format - Định dạng (short, long, full)
 * @returns {string} Chuỗi ngày tháng đã format
 */
export const formatDate = (date, format = 'short') => {
  if (!date) return ''
  
  try {
    const dateObj = new Date(date)
    
    if (isNaN(dateObj.getTime())) {
      return ''
    }
    
    const options = {
      short: {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      },
      long: {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      },
      full: {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }
    }
    
    return new Intl.DateTimeFormat('vi-VN', options[format] || options.short).format(dateObj)
  } catch (error) {
    console.error('❌ Format date error:', error)
    return date.toString()
  }
}

/**
 * Format thời gian tương đối (ví dụ: "2 giờ trước")
 * @param {Date|string} date - Ngày cần format
 * @returns {string} Thời gian tương đối
 */
export const formatRelativeTime = (date) => {
  if (!date) return ''
  
  try {
    const dateObj = new Date(date)
    const now = new Date()
    const diffInSeconds = Math.floor((now - dateObj) / 1000)
    
    if (diffInSeconds < 0) {
      return 'Vừa xong'
    }
    
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
      second: 1
    }
    
    for (const [unit, seconds] of Object.entries(intervals)) {
      const interval = Math.floor(diffInSeconds / seconds)
      
      if (interval >= 1) {
        const unitNames = {
          year: 'năm',
          month: 'tháng',
          week: 'tuần',
          day: 'ngày',
          hour: 'giờ',
          minute: 'phút',
          second: 'giây'
        }
        
        return `${interval} ${unitNames[unit]} trước`
      }
    }
    
    return 'Vừa xong'
  } catch (error) {
    console.error('❌ Format relative time error:', error)
    return formatDate(date, 'short')
  }
}

/**
 * Format số điện thoại
 * @param {string} phone - Số điện thoại
 * @returns {string} Số điện thoại đã format
 */
export const formatPhone = (phone) => {
  if (!phone) return ''
  
  // Loại bỏ tất cả ký tự không phải số
  const cleaned = phone.replace(/\D/g, '')
  
  // Format theo định dạng Việt Nam
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3')
  } else if (cleaned.length === 11) {
    return cleaned.replace(/(\d{4})(\d{3})(\d{4})/, '$1 $2 $3')
  }
  
  return phone
}

/**
 * Format tên file
 * @param {string} filename - Tên file
 * @param {number} maxLength - Độ dài tối đa
 * @returns {string} Tên file đã format
 */
export const formatFilename = (filename, maxLength = 30) => {
  if (!filename) return ''
  
  if (filename.length <= maxLength) {
    return filename
  }
  
  const extension = filename.split('.').pop()
  const name = filename.substring(0, filename.lastIndexOf('.'))
  const maxNameLength = maxLength - extension.length - 4 // 4 cho "..."
  
  return `${name.substring(0, maxNameLength)}...${extension ? '.' + extension : ''}`
}

/**
 * Format kích thước file
 * @param {number} bytes - Kích thước file tính bằng bytes
 * @returns {string} Kích thước file đã format
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Format slug từ chuỗi
 * @param {string} text - Chuỗi cần format
 * @returns {string} Slug đã format
 */
export const formatSlug = (text) => {
  if (!text) return ''
  
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Loại bỏ dấu
    .replace(/[^a-z0-9\s-]/g, '') // Loại bỏ ký tự đặc biệt
    .replace(/\s+/g, '-') // Thay khoảng trắng bằng dấu gạch ngang
    .replace(/-+/g, '-') // Loại bỏ dấu gạch ngang liên tiếp
    .trim('-') // Loại bỏ dấu gạch ngang ở đầu và cuối
}

/**
 * Format địa chỉ
 * @param {Object} address - Object địa chỉ
 * @returns {string} Địa chỉ đã format
 */
export const formatAddress = (address) => {
  if (!address) return ''
  
  const parts = [
    address.street,
    address.district,
    address.city,
    address.zipCode
  ].filter(Boolean)
  
  return parts.join(', ')
}

/**
 * Format tên người dùng
 * @param {string} name - Tên người dùng
 * @returns {string} Tên đã format
 */
export const formatName = (name) => {
  if (!name) return ''
  
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

/**
 * Format mã đơn hàng
 * @param {string} orderId - ID đơn hàng
 * @returns {string} Mã đơn hàng đã format
 */
export const formatOrderId = (orderId) => {
  if (!orderId) return ''
  
  return `#${orderId.toString().padStart(8, '0')}`
}

/**
 * Format trạng thái đơn hàng
 * @param {string} status - Trạng thái
 * @returns {Object} Object chứa text và class
 */
export const formatOrderStatus = (status) => {
  const statusMap = {
    pending: {
      text: 'Chờ xử lý',
      class: 'bg-yellow-100 text-yellow-800'
    },
    processing: {
      text: 'Đang xử lý',
      class: 'bg-blue-100 text-blue-800'
    },
    shipped: {
      text: 'Đã gửi hàng',
      class: 'bg-purple-100 text-purple-800'
    },
    delivered: {
      text: 'Đã giao hàng',
      class: 'bg-green-100 text-green-800'
    },
    cancelled: {
      text: 'Đã hủy',
      class: 'bg-red-100 text-red-800'
    },
    returned: {
      text: 'Đã hoàn trả',
      class: 'bg-gray-100 text-gray-800'
    }
  }
  
  return statusMap[status] || {
    text: status,
    class: 'bg-gray-100 text-gray-800'
  }
} 