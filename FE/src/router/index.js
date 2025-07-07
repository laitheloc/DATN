/**
 * Vue Router configuration
 * Định nghĩa các route và navigation guards
 */

import { createRouter, createWebHistory } from 'vue-router' // Import các hàm từ Vue Router
import { useAuthStore } from '@/stores/auth' // Import Pinia store để quản lý authentication

// Import views (lazy loading)
const Home = () => import('@/views/Home.vue') // Lazy load component Home
const Products = () => import('@/views/Products.vue') // Lazy load component Products
const ProductDetail = () => import('@/views/ProductDetail.vue') // Lazy load component ProductDetail
const Cart = () => import('@/views/Cart.vue') // Lazy load component Cart
const Checkout = () => import('@/views/Checkout.vue') // Lazy load component Checkout
const Login = () => import('@/views/auth/Login.vue') // Lazy load component Login
const Register = () => import('@/views/auth/Register.vue') // Lazy load component Register
const Profile = () => import('@/views/auth/Profile.vue') // Lazy load component Profile
const Orders = () => import('@/views/Orders.vue') // Lazy load component Orders
const OrderDetail = () => import('@/views/OrderDetail.vue') // Lazy load component OrderDetail
const NotFound = () => import('@/views/NotFound.vue') // Lazy load component NotFound

// Route definitions
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: 'Trang chủ - Electronics Store',
      description: 'Trang web bán đồ điện tử uy tín với đa dạng sản phẩm chất lượng cao'
    }
  },
  
  {
    path: '/products',
    name: 'Products',
    component: Products,
    meta: {
      title: 'Sản phẩm - Electronics Store',
      description: 'Khám phá đa dạng sản phẩm điện tử chất lượng cao'
    }
  },
  
  {
    path: '/products/:id',
    name: 'ProductDetail',
    component: ProductDetail,
    props: true,
    meta: {
      title: 'Chi tiết sản phẩm - Electronics Store',
      description: 'Thông tin chi tiết sản phẩm'
    }
  },
  
  {
    path: '/products/slug/:slug',
    name: 'ProductDetailBySlug',
    component: ProductDetail,
    props: true,
    meta: {
      title: 'Chi tiết sản phẩm - Electronics Store',
      description: 'Thông tin chi tiết sản phẩm'
    }
  },
  
  {
    path: '/cart',
    name: 'Cart',
    component: Cart,
    meta: {
      title: 'Giỏ hàng - Electronics Store',
      description: 'Xem và quản lý giỏ hàng của bạn',
      requiresAuth: false
    }
  },
  
  {
    path: '/checkout',
    name: 'Checkout',
    component: Checkout,
    meta: {
      title: 'Thanh toán - Electronics Store',
      description: 'Hoàn tất đơn hàng của bạn',
      requiresAuth: true
    }
  },
  
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      title: 'Đăng nhập - Electronics Store',
      description: 'Đăng nhập vào tài khoản của bạn',
      guestOnly: true
    }
  },
  
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: {
      title: 'Đăng ký - Electronics Store',
      description: 'Tạo tài khoản mới',
      guestOnly: true
    }
  },
  
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: {
      title: 'Hồ sơ cá nhân - Electronics Store',
      description: 'Quản lý thông tin cá nhân',
      requiresAuth: true
    }
  },
  
  {
    path: '/orders',
    name: 'Orders',
    component: Orders,
    meta: {
      title: 'Đơn hàng của tôi - Electronics Store',
      description: 'Xem lịch sử đơn hàng',
      requiresAuth: true
    }
  },
  
  {
    path: '/orders/:id',
    name: 'OrderDetail',
    component: OrderDetail,
    props: true,
    meta: {
      title: 'Chi tiết đơn hàng - Electronics Store',
      description: 'Thông tin chi tiết đơn hàng',
      requiresAuth: true
    }
  },
  
  // 404 route - phải đặt cuối cùng
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    meta: {
      title: 'Không tìm thấy trang - Electronics Store',
      description: 'Trang bạn đang tìm kiếm không tồn tại'
    }
  }
]

// Create router instance
const router = createRouter({
  history: createWebHistory(), // Sử dụng HTML5 History API
  routes, // Mảng routes đã định nghĩa
  
  // Scroll behavior
  scrollBehavior(to, from, savedPosition) {
    // Nếu có saved position (back/forward navigation)
    if (savedPosition) {
      return savedPosition // Trở về vị trí scroll cũ
    }
    
    // Nếu có hash trong URL
    if (to.hash) {
      return {
        el: to.hash, // Element có id trùng với hash
        behavior: 'smooth' // Scroll mượt mà
      }
    }
    
    // Mặc định scroll to top
    return { top: 0 } // Scroll lên đầu trang
  }
})

/**
 * Navigation Guards
 */

// Global before each guard
router.beforeEach(async (to, from, next) => {
  console.log(`🔄 Route change: ${from.path} → ${to.path}`) // Log thay đổi route
  
  // Update document title
  if (to.meta.title) {
    document.title = to.meta.title // Cập nhật tiêu đề trang
  }
  
  // Update meta description
  if (to.meta.description) {
    const metaDescription = document.querySelector('meta[name="description"]') // Tìm meta description
    if (metaDescription) {
      metaDescription.setAttribute('content', to.meta.description) // Cập nhật nội dung meta description
    }
  }
  
  // Get auth store
  const authStore = useAuthStore() // Lấy instance của auth store
  
  // Check if route requires authentication
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    console.log('🔒 Route requires auth, redirecting to login') // Log yêu cầu đăng nhập
    next({
      name: 'Login', // Chuyển hướng đến trang đăng nhập
      query: { redirect: to.fullPath } // Lưu URL hiện tại để redirect sau khi đăng nhập
    })
    return
  }
  
  // Check if route is guest only (not for authenticated users)
  if (to.meta.guestOnly && authStore.isAuthenticated) {
    console.log('👤 Guest only route, redirecting to home') // Log route chỉ cho khách
    next({ name: 'Home' }) // Chuyển hướng về trang chủ
    return
  }
  
  // Continue navigation
  next() // Cho phép điều hướng tiếp
})

// Global after each guard
router.afterEach((to, from) => {
  console.log(`✅ Route change completed: ${from.path} → ${to.path}`) // Log hoàn thành thay đổi route
  
  // Track page view (có thể tích hợp Google Analytics)
  if (typeof gtag !== 'undefined') {
    gtag('config', 'GA_MEASUREMENT_ID', {
      page_path: to.path // Gửi page path đến Google Analytics
    })
  }
})

// Error handling
router.onError((error) => {
  console.error('❌ Router error:', error) // Log lỗi router
  
  // Redirect to 404 if component fails to load
  if (error.name === 'ChunkLoadFailedError') {
    router.push({ name: 'NotFound' }) // Chuyển hướng đến trang 404 nếu component load thất bại
  }
})

export default router 