/**
 * Vue Router configuration
 * Định nghĩa các route và navigation guards
 */

import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Import views (lazy loading)
const Home = () => import('@/views/Home.vue')
const Products = () => import('@/views/Products.vue')
const ProductDetail = () => import('@/views/ProductDetail.vue')
const Cart = () => import('@/views/Cart.vue')
const Checkout = () => import('@/views/Checkout.vue')
const Login = () => import('@/views/auth/Login.vue')
const Register = () => import('@/views/auth/Register.vue')
const Profile = () => import('@/views/auth/Profile.vue')
const Orders = () => import('@/views/Orders.vue')
const OrderDetail = () => import('@/views/OrderDetail.vue')
const NotFound = () => import('@/views/NotFound.vue')

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
  history: createWebHistory(),
  routes,
  
  // Scroll behavior
  scrollBehavior(to, from, savedPosition) {
    // Nếu có saved position (back/forward navigation)
    if (savedPosition) {
      return savedPosition
    }
    
    // Nếu có hash trong URL
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth'
      }
    }
    
    // Mặc định scroll to top
    return { top: 0 }
  }
})

/**
 * Navigation Guards
 */

// Global before each guard
router.beforeEach(async (to, from, next) => {
  console.log(`🔄 Route change: ${from.path} → ${to.path}`)
  
  // Update document title
  if (to.meta.title) {
    document.title = to.meta.title
  }
  
  // Update meta description
  if (to.meta.description) {
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', to.meta.description)
    }
  }
  
  // Get auth store
  const authStore = useAuthStore()
  
  // Check if route requires authentication
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    console.log('🔒 Route requires auth, redirecting to login')
    next({
      name: 'Login',
      query: { redirect: to.fullPath }
    })
    return
  }
  
  // Check if route is guest only (not for authenticated users)
  if (to.meta.guestOnly && authStore.isAuthenticated) {
    console.log('👤 Guest only route, redirecting to home')
    next({ name: 'Home' })
    return
  }
  
  // Continue navigation
  next()
})

// Global after each guard
router.afterEach((to, from) => {
  console.log(`✅ Route change completed: ${from.path} → ${to.path}`)
  
  // Track page view (có thể tích hợp Google Analytics)
  if (typeof gtag !== 'undefined') {
    gtag('config', 'GA_MEASUREMENT_ID', {
      page_path: to.path
    })
  }
})

// Error handling
router.onError((error) => {
  console.error('❌ Router error:', error)
  
  // Redirect to 404 if component fails to load
  if (error.name === 'ChunkLoadFailedError') {
    router.push({ name: 'NotFound' })
  }
})

export default router 