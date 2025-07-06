# Electronics Store Backend API

Backend API cho trang web bán đồ điện tử sử dụng Node.js, Express.js và PostgreSQL với Sequelize ORM.

## 🚀 Tính năng

### Authentication & Authorization
- ✅ Đăng ký tài khoản mới
- ✅ Đăng nhập/Đăng xuất
- ✅ JWT Authentication
- ✅ Quản lý profile người dùng
- ✅ Thay đổi mật khẩu
- ✅ Phân quyền (User/Admin)

### Product Management
- ✅ CRUD operations cho sản phẩm
- ✅ Upload và quản lý hình ảnh sản phẩm
- ✅ Tìm kiếm và lọc sản phẩm
- ✅ Phân trang
- ✅ Sắp xếp theo nhiều tiêu chí
- ✅ Quản lý kho hàng
- ✅ Đánh giá và bình luận

### Order Management
- ✅ Tạo đơn hàng mới
- ✅ Quản lý trạng thái đơn hàng
- ✅ Tính toán giá tự động
- ✅ Quản lý thanh toán
- ✅ Tracking đơn hàng

### User Management
- ✅ Quản lý thông tin người dùng
- ✅ Lịch sử đơn hàng
- ✅ Thống kê mua hàng

## 🛠️ Công nghệ sử dụng

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Authentication**: JWT, bcryptjs
- **Validation**: express-validator
- **File Upload**: multer
- **Security**: helmet, cors, rate-limiting

## 📋 Yêu cầu hệ thống

- Node.js (v16 trở lên)
- PostgreSQL (v12 trở lên)
- npm hoặc yarn

## 🔧 Cài đặt

### 1. Clone repository
```bash
git clone <repository-url>
cd BE
```

### 2. Cài đặt dependencies
```bash
npm install
```

### 3. Cấu hình database

#### Cài đặt PostgreSQL
- **Windows**: Tải từ [postgresql.org](https://www.postgresql.org/download/windows/)
- **macOS**: `brew install postgresql`
- **Ubuntu**: `sudo apt-get install postgresql postgresql-contrib`

#### Tạo database
```sql
CREATE DATABASE electronics_store;
CREATE USER postgres WITH PASSWORD 'your_password_here';
GRANT ALL PRIVILEGES ON DATABASE electronics_store TO postgres;
```

### 4. Cấu hình environment variables
```bash
cp env.example .env
```

Chỉnh sửa file `.env`:
```env
# Cấu hình Server
PORT=3000
NODE_ENV=development

# Cấu hình Database PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=electronics_store
DB_USER=postgres
DB_PASSWORD=your_password_here
DATABASE_URL=postgresql://postgres:your_password_here@localhost:5432/electronics_store

# JWT Secret Key
JWT_SECRET=loIh+m38FWadbiVhQGzLqTGdiJSnZWDYQLjqPee1347iODKxPVYLXha7lAcLoNyQIs+1RJWMECwuJicmLr7HFQ==

# Cấu hình Upload
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880
```

### 5. Tạo thư mục uploads
```bash
mkdir uploads
mkdir uploads/products
```

### 6. Khởi động server
```bash
# Development
npm run dev

# Production
npm start
```

Server sẽ chạy tại: `http://localhost:3000`

## 📚 API Endpoints

### Authentication
```
POST   /api/auth/register     - Đăng ký tài khoản
POST   /api/auth/login        - Đăng nhập
GET    /api/auth/profile      - Lấy thông tin profile
PUT    /api/auth/profile      - Cập nhật profile
PUT    /api/auth/change-password - Thay đổi mật khẩu
POST   /api/auth/logout       - Đăng xuất
```

### Products
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

### Orders
```
GET    /api/orders            - Lấy danh sách đơn hàng
GET    /api/orders/:id        - Lấy chi tiết đơn hàng
POST   /api/orders            - Tạo đơn hàng mới
PUT    /api/orders/:id        - Cập nhật đơn hàng
DELETE /api/orders/:id        - Hủy đơn hàng
```

### Users
```
GET    /api/users             - Lấy danh sách users (Admin)
GET    /api/users/:id         - Lấy thông tin user
PUT    /api/users/:id         - Cập nhật user (Admin)
DELETE /api/users/:id         - Xóa user (Admin)
```

## 🗂️ Cấu trúc thư mục

```
BE/
├── config/
│   └── database.js          # Cấu hình kết nối PostgreSQL
├── middleware/
│   ├── auth.js              # JWT Authentication middleware
│   └── errorHandler.js      # Error handling middleware
├── models/
│   ├── index.js             # Model associations
│   ├── User.js              # User model
│   ├── Product.js           # Product model
│   ├── Order.js             # Order model
│   └── OrderItem.js         # OrderItem model
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── products.js          # Product routes
│   ├── orders.js            # Order routes
│   └── users.js             # User routes
├── uploads/                 # Thư mục lưu file upload
├── .env                     # Environment variables
├── .env.example             # Environment variables example
├── package.json             # Dependencies và scripts
├── server.js                # Entry point
└── README.md                # Documentation
```

## 🔐 Bảo mật

- **JWT Authentication**: Xác thực người dùng
- **Password Hashing**: bcryptjs với salt rounds = 12
- **Input Validation**: express-validator
- **Rate Limiting**: Giới hạn 100 requests/15 phút
- **CORS**: Cấu hình cross-origin requests
- **Helmet**: Security headers
- **SQL Injection Protection**: Sequelize ORM

## 🧪 Testing

```bash
# Chạy tests
npm test

# Chạy tests với coverage
npm run test:coverage
```

## 📊 Database Schema

### Users Table
- `id` (Primary Key)
- `full_name`, `email`, `password`
- `phone`, `address_*`
- `role`, `is_active`, `is_email_verified`
- `avatar`, `date_of_birth`, `gender`
- `total_orders`, `total_spent`
- `last_login`, `created_at`, `updated_at`

### Products Table
- `id` (Primary Key)
- `name`, `description`, `short_description`
- `category`, `brand`, `sku`
- `price`, `original_price`, `discount`
- `stock`, `min_stock`
- `images` (JSON), `specifications` (JSON)
- `dimensions`, `weight`
- `rating_average`, `rating_count`
- `is_active`, `is_featured`, `is_new`
- `slug`, `meta_title`, `meta_description`
- `view_count`, `sold_count`
- `tags` (JSON), `warranty`
- `created_at`, `updated_at`

### Orders Table
- `id` (Primary Key)
- `order_number`, `user_id` (Foreign Key)
- `shipping_address` (JSON)
- `payment_method`, `payment_status`
- `status`, `shipping_method`
- `subtotal`, `tax_amount`, `shipping_fee`, `discount_amount`, `total_amount`
- `tracking_number`, `estimated_delivery`
- `notes`, `coupon_code`
- `paid_at`, `shipped_at`, `delivered_at`, `cancelled_at`
- `created_at`, `updated_at`

### OrderItems Table
- `id` (Primary Key)
- `order_id`, `product_id` (Foreign Keys)
- `product_name`, `product_sku`, `product_image`
- `quantity`, `unit_price`, `discount_percent`, `total_price`
- `product_specifications` (JSON)
- `is_returned`, `return_reason`, `return_date`
- `created_at`, `updated_at`

## 🚀 Deployment

### Production Environment
```bash
# Set environment
NODE_ENV=production

# Install dependencies
npm ci --only=production

# Start server
npm start
```

### Docker (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 📝 Logs

Server logs được ghi ra console với các level:
- `INFO`: Thông tin hoạt động bình thường
- `WARN`: Cảnh báo
- `ERROR`: Lỗi nghiêm trọng

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📄 License

MIT License - xem file [LICENSE](LICENSE) để biết thêm chi tiết.

## 🆘 Support

Nếu gặp vấn đề, vui lòng:
1. Kiểm tra logs trong console
2. Đảm bảo PostgreSQL đang chạy
3. Kiểm tra cấu hình trong file `.env`
4. Tạo issue trên GitHub

## 🔄 Updates

### Version 2.0.0
- Chuyển từ MongoDB sang PostgreSQL
- Sử dụng Sequelize ORM
- Cải thiện performance và scalability
- Thêm associations giữa các models
- Cập nhật validation và error handling

## 📞 Liên hệ

- Email: your-email@example.com
- Project Link: [https://github.com/your-username/electronics-store](https://github.com/your-username/electronics-store) 