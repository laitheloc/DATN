# 🛒 Electronics Store - Trang Web Bán Đồ Điện Tử

Dự án trang web bán đồ điện tử hoàn chỉnh với Frontend Vue 3 và Backend Node.js + PostgreSQL.

## 🚀 Tổng quan

Đây là một ứng dụng e-commerce hoàn chỉnh với các tính năng:
- **Frontend**: Vue 3 + Vite + Tailwind CSS + Pinia
- **Backend**: Node.js + Express + PostgreSQL + Sequelize
- **Authentication**: JWT + bcryptjs
- **Real-time**: WebSocket (có thể mở rộng)
- **Responsive**: Mobile-first design

## 📁 Cấu trúc dự án

```
DATN/
├── BE/                     # Backend (Node.js + PostgreSQL)
│   ├── config/            # Cấu hình database
│   ├── middleware/        # Middleware (auth, error handling)
│   ├── models/           # Sequelize models
│   ├── routes/           # API routes
│   ├── uploads/          # File uploads
│   ├── server.js         # Entry point
│   └── package.json
├── FE/                     # Frontend (Vue 3)
│   ├── src/
│   │   ├── components/   # Vue components
│   │   ├── views/        # Page components
│   │   ├── stores/       # Pinia stores
│   │   ├── router/       # Vue Router
│   │   ├── api/          # API calls
│   │   └── utils/        # Utility functions
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## 🛠️ Công nghệ sử dụng

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Authentication**: JWT, bcryptjs
- **Validation**: express-validator
- **File Upload**: multer
- **Security**: helmet, cors, rate-limiting

### Frontend
- **Framework**: Vue 3 (Composition API)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Pinia
- **Router**: Vue Router 4
- **HTTP Client**: Axios
- **UI Components**: Headless UI
- **Icons**: Heroicons
- **Notifications**: Vue Toastification

## 📋 Yêu cầu hệ thống

- Node.js (v16 trở lên)
- PostgreSQL (v12 trở lên)
- npm hoặc yarn

## 🔧 Cài đặt và chạy

### 1. Clone repository
```bash
git clone <repository-url>
cd DATN
```

### 2. Backend Setup

```bash
cd BE

# Cài đặt dependencies
npm install

# Cấu hình database PostgreSQL
# Tạo database và user theo hướng dẫn trong BE/README.md

# Cấu hình environment
cp env.example .env
# Chỉnh sửa file .env với thông tin database của bạn

# Tạo thư mục uploads
mkdir uploads
mkdir uploads/products

# Chạy server
npm run dev
```

Backend sẽ chạy tại: `http://localhost:3000`

### 3. Frontend Setup

```bash
cd FE

# Cài đặt dependencies
npm install

# Chạy development server
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:5173`

## 🚀 Tính năng chính

### 👤 Authentication & User Management
- ✅ Đăng ký/Đăng nhập tài khoản
- ✅ JWT Authentication
- ✅ Quản lý profile người dùng
- ✅ Thay đổi mật khẩu
- ✅ Phân quyền (User/Admin)
- ✅ Quản lý địa chỉ giao hàng

### 🛍️ Product Management
- ✅ Hiển thị danh sách sản phẩm
- ✅ Tìm kiếm và lọc sản phẩm
- ✅ Phân trang
- ✅ Chi tiết sản phẩm
- ✅ Đánh giá và bình luận
- ✅ Quản lý kho hàng (Admin)
- ✅ Upload hình ảnh sản phẩm

### 🛒 Shopping Cart
- ✅ Thêm/Xóa sản phẩm vào giỏ hàng
- ✅ Cập nhật số lượng
- ✅ Tính toán giá tự động
- ✅ Lưu giỏ hàng vào localStorage
- ✅ Đồng bộ giỏ hàng với server

### 📦 Order Management
- ✅ Tạo đơn hàng mới
- ✅ Quản lý trạng thái đơn hàng
- ✅ Lịch sử đơn hàng
- ✅ Tracking đơn hàng
- ✅ Quản lý thanh toán

### 💳 Payment Integration
- ✅ Thanh toán khi nhận hàng (COD)
- ✅ Chuyển khoản ngân hàng
- ✅ Tích hợp cổng thanh toán (có thể mở rộng)

### 🎨 UI/UX Features
- ✅ Responsive design (Mobile-first)
- ✅ Dark/Light mode
- ✅ Loading states
- ✅ Error handling
- ✅ Toast notifications
- ✅ Smooth animations
- ✅ SEO optimized

## 📚 API Documentation

### Authentication Endpoints
```
POST   /api/auth/register     - Đăng ký tài khoản
POST   /api/auth/login        - Đăng nhập
GET    /api/auth/profile      - Lấy thông tin profile
PUT    /api/auth/profile      - Cập nhật profile
PUT    /api/auth/change-password - Thay đổi mật khẩu
POST   /api/auth/logout       - Đăng xuất
```

### Product Endpoints
```
GET    /api/products          - Lấy danh sách sản phẩm
GET    /api/products/:id      - Lấy chi tiết sản phẩm
GET    /api/products/slug/:slug - Lấy sản phẩm theo slug
GET    /api/products/featured - Sản phẩm nổi bật
GET    /api/products/new      - Sản phẩm mới
GET    /api/products/category/:category - Sản phẩm theo danh mục
POST   /api/products          - Tạo sản phẩm mới (Admin)
PUT    /api/products/:id      - Cập nhật sản phẩm (Admin)
DELETE /api/products/:id      - Xóa sản phẩm (Admin)
```

### Order Endpoints
```
GET    /api/orders            - Lấy danh sách đơn hàng
GET    /api/orders/:id        - Lấy chi tiết đơn hàng
POST   /api/orders            - Tạo đơn hàng mới
PUT    /api/orders/:id        - Cập nhật đơn hàng
DELETE /api/orders/:id        - Hủy đơn hàng
```

## 🗄️ Database Schema

### Users Table
- Thông tin cá nhân, địa chỉ, phân quyền
- Thống kê mua hàng, lịch sử đăng nhập

### Products Table
- Thông tin sản phẩm, giá cả, kho hàng
- Hình ảnh, thông số kỹ thuật, đánh giá
- SEO metadata, tags, warranty

### Orders Table
- Thông tin đơn hàng, thanh toán, giao hàng
- Trạng thái, tracking, timestamps

### OrderItems Table
- Chi tiết sản phẩm trong đơn hàng
- Giá tại thời điểm mua, số lượng

## 🔐 Bảo mật

- **JWT Authentication**: Token-based authentication
- **Password Hashing**: bcryptjs với salt rounds = 12
- **Input Validation**: express-validator cho tất cả inputs
- **Rate Limiting**: Giới hạn 100 requests/15 phút
- **CORS**: Cấu hình cross-origin requests
- **Helmet**: Security headers
- **SQL Injection Protection**: Sequelize ORM

## 🎨 UI Components

### Layout Components
- `AppHeader`: Header với navigation và search
- `AppFooter`: Footer với thông tin liên hệ
- `AppSidebar`: Sidebar cho mobile navigation

### Product Components
- `ProductCard`: Card hiển thị sản phẩm
- `ProductGrid`: Grid layout cho danh sách sản phẩm
- `ProductDetail`: Chi tiết sản phẩm
- `ProductFilter`: Bộ lọc sản phẩm

### Cart Components
- `CartItem`: Item trong giỏ hàng
- `CartSummary`: Tóm tắt giỏ hàng
- `CheckoutForm`: Form thanh toán

### User Components
- `LoginForm`: Form đăng nhập
- `RegisterForm`: Form đăng ký
- `ProfileForm`: Form cập nhật profile

## 📱 Responsive Design

- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

## 🚀 Deployment

### Backend Deployment
```bash
cd BE
npm ci --only=production
NODE_ENV=production npm start
```

### Frontend Deployment
```bash
cd FE
npm run build
# Deploy thư mục dist/ lên hosting
```

### Environment Variables

#### Backend (.env)
```env
PORT=3000
NODE_ENV=production
DB_HOST=your_db_host
DB_PORT=5432
DB_NAME=electronics_store
DB_USER=your_db_user
DB_PASSWORD=your_db_password
JWT_SECRET=your_jwt_secret
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=Electronics Store
```

## 🧪 Testing

```bash
# Backend tests
cd BE
npm test

# Frontend tests
cd FE
npm run test
```

## 📊 Performance

### Backend Optimizations
- Database indexing
- Query optimization
- Connection pooling
- Rate limiting
- Caching (có thể mở rộng)

### Frontend Optimizations
- Code splitting
- Lazy loading
- Image optimization
- Bundle optimization
- Service worker (có thể mở rộng)

## 🔄 Development Workflow

1. **Feature Development**
   - Tạo feature branch
   - Implement backend API
   - Implement frontend components
   - Test integration

2. **Code Quality**
   - ESLint + Prettier
   - Git hooks (husky)
   - Code review

3. **Testing**
   - Unit tests
   - Integration tests
   - E2E tests (có thể mở rộng)

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📄 License

MIT License - xem file [LICENSE](LICENSE) để biết thêm chi tiết.

## 🆘 Support

Nếu gặp vấn đề:
1. Kiểm tra logs trong console
2. Đảm bảo PostgreSQL đang chạy
3. Kiểm tra cấu hình environment variables
4. Tạo issue trên GitHub

## 🔄 Updates

### Version 2.0.0
- Chuyển từ MongoDB sang PostgreSQL
- Sử dụng Sequelize ORM
- Cải thiện performance và scalability
- Thêm associations giữa các models
- Cập nhật validation và error handling
- Cải thiện UI/UX

## 📞 Liên hệ

- **Email**: your.email@example.com
- **GitHub**: [your-username](https://github.com/your-username)

---

**Lưu ý**: Đây là dự án demo cho mục đích học tập. Vui lòng cấu hình và bảo mật phù hợp trước khi deploy production. 