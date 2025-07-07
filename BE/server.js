/**
 * Server chính - Backend API cho trang web bán đồ điện tử
 * Sử dụng Express.js và PostgreSQL với Sequelize ORM
 */

const express = require('express'); // Import thư viện Express.js để tạo web server
const cors = require('cors'); // Import middleware cho phép truy cập từ domain khác (Cross-Origin Resource Sharing)
const helmet = require('helmet'); // Import middleware bảo mật cho HTTP headers
const rateLimit = require('express-rate-limit'); // Import middleware giới hạn số lượng request
const path = require('path'); // Import module xử lý đường dẫn file
require('dotenv').config(); // Load các biến môi trường từ file .env

// Import database connection
const { connectDB } = require('./config/database'); // Import hàm kết nối database

// Import models để đảm bảo associations được định nghĩa
require('./models/index'); // Load tất cả models để đảm bảo các mối quan hệ được thiết lập

// Import routes
const authRoutes = require('./routes/auth'); // Import routes xử lý authentication (đăng nhập, đăng ký)
const productRoutes = require('./routes/products'); // Import routes xử lý sản phẩm
const orderRoutes = require('./routes/orders'); // Import routes xử lý đơn hàng
const userRoutes = require('./routes/users'); // Import routes xử lý người dùng

// Import error handler middleware
const { errorHandler } = require('./middleware/errorHandler'); // Import middleware xử lý lỗi

// Khởi tạo Express app
const app = express(); // Tạo instance của Express application

// Kết nối database
connectDB(); // Gọi hàm kết nối đến PostgreSQL database

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"], // Chỉ cho phép tải tài nguyên từ cùng domain
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"], // Cho phép CSS từ Google Fonts
      fontSrc: ["'self'", "https://fonts.gstatic.com"], // Cho phép font từ Google Fonts
      imgSrc: ["'self'", "data:", "https:"], // Cho phép hình ảnh từ HTTPS và data URL
      scriptSrc: ["'self'"], // Chỉ cho phép JavaScript từ cùng domain
    },
  },
})); // Thiết lập các header bảo mật cho ứng dụng

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Cho phép frontend truy cập từ URL này
  credentials: true, // Cho phép gửi cookies và authentication headers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Cho phép các HTTP methods này
  allowedHeaders: ['Content-Type', 'Authorization'] // Cho phép các headers này
})); // Thiết lập CORS để frontend có thể gọi API

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút - khoảng thời gian tính toán
  max: 100, // Giới hạn 100 requests per windowMs - tối đa 100 request trong 15 phút
  message: {
    error: 'Quá nhiều requests từ IP này, vui lòng thử lại sau 15 phút'
  }, // Thông báo lỗi khi vượt quá giới hạn
  standardHeaders: true, // Thêm headers chuẩn về rate limit
  legacyHeaders: false, // Không sử dụng headers cũ
}); // Tạo middleware giới hạn số lượng request để tránh spam

app.use('/api/', limiter); // Áp dụng rate limiting cho tất cả routes bắt đầu bằng /api/

// Body parser middleware
app.use(express.json({ limit: '10mb' })); // Parse JSON body với giới hạn 10MB
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Parse URL-encoded body với giới hạn 10MB

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Phục vụ file tĩnh từ thư mục uploads

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server đang hoạt động bình thường',
    timestamp: new Date().toISOString(), // Thời gian hiện tại
    environment: process.env.NODE_ENV || 'development' // Môi trường hiện tại
  });
}); // Route kiểm tra trạng thái server

// API Routes
app.use('/api/auth', authRoutes); // Đăng ký routes authentication với prefix /api/auth
app.use('/api/products', productRoutes); // Đăng ký routes sản phẩm với prefix /api/products
app.use('/api/orders', orderRoutes); // Đăng ký routes đơn hàng với prefix /api/orders
app.use('/api/users', userRoutes); // Đăng ký routes người dùng với prefix /api/users

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Không tìm thấy route: ${req.originalUrl}` // URL mà user đang cố truy cập
  });
}); // Xử lý khi không tìm thấy route nào khớp

// Error handler middleware (phải đặt cuối cùng)
app.use(errorHandler); // Middleware xử lý tất cả lỗi trong ứng dụng

// Khởi động server
const PORT = process.env.PORT || 3000; // Lấy port từ biến môi trường hoặc mặc định là 3000

const server = app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy trên port ${PORT}`); // In thông báo server đã khởi động
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`); // In môi trường hiện tại
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`); // In URL cơ sở của API
  console.log(`📁 Uploads: http://localhost:${PORT}/uploads`); // In URL để truy cập file upload
}); // Khởi động server và lắng nghe trên port được chỉ định

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully'); // Thông báo nhận được tín hiệu tắt server
  server.close(() => {
    console.log('🔌 Server đã đóng'); // Thông báo server đã đóng thành công
    process.exit(0); // Thoát process với mã thành công
  });
}); // Xử lý khi nhận tín hiệu SIGTERM (tắt server từ bên ngoài)

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully'); // Thông báo nhận được tín hiệu Ctrl+C
  server.close(() => {
    console.log('🔌 Server đã đóng'); // Thông báo server đã đóng thành công
    process.exit(0); // Thoát process với mã thành công
  });
}); // Xử lý khi nhận tín hiệu SIGINT (Ctrl+C)

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error('❌ Unhandled Rejection:', err); // In lỗi promise bị reject mà không được xử lý
  server.close(() => {
    process.exit(1); // Thoát process với mã lỗi
  });
}); // Xử lý khi có promise bị reject mà không được catch

module.exports = app; // Export app để có thể test hoặc sử dụng ở file khác 