# Frontend - Trang Web Bán Đồ Điện Tử

Frontend được xây dựng bằng Vue 3, Vite và Tailwind CSS cho trang web bán đồ điện tử.

## 🚀 Tính năng

- **Modern UI/UX**: Giao diện hiện đại với Tailwind CSS
- **Responsive Design**: Tương thích mọi thiết bị
- **State Management**: Pinia store cho quản lý state
- **Authentication**: JWT authentication với Vue Router guards
- **Shopping Cart**: Quản lý giỏ hàng với localStorage
- **Product Management**: Hiển thị và tìm kiếm sản phẩm
- **User Dashboard**: Quản lý profile và đơn hàng
- **Form Validation**: Vee-validate với Yup schema
- **Toast Notifications**: Thông báo với vue-toastification
- **Lazy Loading**: Code splitting và lazy loading components

## 📋 Yêu cầu hệ thống

- Node.js (v16 trở lên)
- npm hoặc yarn
- Modern browser (Chrome, Firefox, Safari, Edge)

## 🛠️ Cài đặt

### 1. Clone repository
```bash
git clone <repository-url>
cd DATN/FE
```

### 2. Cài đặt dependencies
```bash
npm install
```

### 3. Cấu hình môi trường
```bash
# Tạo file .env.local
cp .env.example .env.local

# Chỉnh sửa file .env.local với thông tin của bạn
```

### 4. Chạy ứng dụng
```bash
# Development mode
npm run dev

# Build cho production
npm run build

# Preview build
npm run preview
```

## 🔧 Cấu hình

### Biến môi trường (.env.local)

```env
# API URL
VITE_API_URL=http://localhost:3000/api

# App name
VITE_APP_NAME=Electronics Store

# Google Analytics (tùy chọn)
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

## 📚 Cấu trúc dự án

```
FE/
├── public/                 # Static files
├── src/
│   ├── api/               # API services
│   │   ├── client.js      # Axios client
│   │   ├── auth.js        # Auth API
│   │   └── products.js    # Products API
│   ├── assets/            # Assets (images, styles)
│   │   ├── images/        # Images
│   │   └── styles/        # Global styles
│   ├── components/        # Vue components
│   │   ├── layout/        # Layout components
│   │   ├── ui/            # UI components
│   │   └── forms/         # Form components
│   ├── router/            # Vue Router
│   │   └── index.js       # Router configuration
│   ├── stores/            # Pinia stores
│   │   ├── auth.js        # Auth store
│   │   └── cart.js        # Cart store
│   ├── utils/             # Utility functions
│   │   ├── format.js      # Format utilities
│   │   └── validation.js  # Validation schemas
│   ├── views/             # Page components
│   │   ├── auth/          # Auth pages
│   │   └── ...            # Other pages
│   ├── App.vue            # Root component
│   └── main.js            # Entry point
├── index.html             # HTML template
├── package.json           # Dependencies
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # Tailwind configuration
└── README.md
```

## 🎨 UI Components

### Layout Components
- `AppHeader.vue` - Header navigation
- `AppFooter.vue` - Footer
- `AppSidebar.vue` - Sidebar navigation

### UI Components
- `Button.vue` - Button component
- `Input.vue` - Input field
- `Modal.vue` - Modal dialog
- `Loading.vue` - Loading spinner
- `Toast.vue` - Toast notifications

### Form Components
- `LoginForm.vue` - Login form
- `RegisterForm.vue` - Register form
- `ProductForm.vue` - Product form

## 🔐 Authentication

### Features
- JWT token management
- Route guards
- Auto logout on token expiry
- Remember me functionality

### Usage
```javascript
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// Login
await authStore.login({ email, password })

// Check authentication
if (authStore.isAuthenticated) {
  // User is logged in
}

// Logout
await authStore.logout()
```

## 🛒 Shopping Cart

### Features
- Add/remove products
- Update quantities
- Persistent storage
- Price calculations

### Usage
```javascript
import { useCartStore } from '@/stores/cart'

const cartStore = useCartStore()

// Add to cart
cartStore.addToCart(product, quantity)

// Get cart info
const totalItems = cartStore.totalItems
const totalPrice = cartStore.totalPrice
```

## 📱 Responsive Design

### Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### Mobile-first approach
- Touch-friendly interfaces
- Optimized for mobile performance
- Progressive Web App features

## 🎯 Performance

### Optimizations
- Code splitting with dynamic imports
- Lazy loading components
- Image optimization
- Tree shaking
- Bundle analysis

### Bundle Analysis
```bash
npm run build -- --analyze
```

## 🧪 Testing

### Unit Testing
```bash
npm run test:unit
```

### E2E Testing
```bash
npm run test:e2e
```

### Coverage
```bash
npm run test:coverage
```

## 📦 Build & Deploy

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Preview Build
```bash
npm run preview
```

### Deploy to Vercel
```bash
npm run deploy
```

## 🔧 Development

### Code Style
```bash
# Lint code
npm run lint

# Format code
npm run format

# Fix linting errors
npm run lint:fix
```

### Git Hooks
- Pre-commit: Lint and format code
- Pre-push: Run tests

## 📊 Analytics

### Google Analytics
- Page view tracking
- Event tracking
- User behavior analysis

### Custom Events
```javascript
// Track custom events
gtag('event', 'add_to_cart', {
  item_id: product.id,
  value: product.price
})
```

## 🔒 Security

### Features
- XSS protection
- CSRF protection
- Input sanitization
- Secure headers

### Best Practices
- Validate all inputs
- Sanitize user data
- Use HTTPS in production
- Implement rate limiting

## 📞 Support

### Documentation
- [Vue 3 Documentation](https://vuejs.org/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Pinia Documentation](https://pinia.vuejs.org/)

### Issues
- Create issue on GitHub
- Provide detailed description
- Include steps to reproduce

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Make changes
4. Add tests
5. Submit pull request

## 📄 License

MIT License - xem file [LICENSE](LICENSE) để biết thêm chi tiết.

## 📞 Liên hệ

- Email: your-email@example.com
- Project Link: [https://github.com/your-username/electronics-store](https://github.com/your-username/electronics-store) 