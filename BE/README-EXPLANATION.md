# Giải thích chi tiết các file cấu hình Backend

## 1. package.json

File này định nghĩa thông tin và dependencies của project:

### Thông tin cơ bản:
- `name`: Tên của project
- `version`: Phiên bản hiện tại
- `description`: Mô tả về project
- `main`: File chính để chạy ứng dụng
- `scripts`: Các lệnh để chạy project
  - `start`: Chạy production server
  - `dev`: Chạy development server với nodemon (tự động restart khi có thay đổi)
  - `test`: Lệnh chạy test (chưa được cấu hình)

### Dependencies (thư viện cần thiết):
- `express`: Framework web cho Node.js
- `cors`: Middleware cho phép truy cập từ domain khác (Cross-Origin Resource Sharing)
- `dotenv`: Load biến môi trường từ file .env
- `bcryptjs`: Thư viện mã hóa password
- `jsonwebtoken`: Thư viện tạo và xác thực JWT token
- `sequelize`: ORM để tương tác với database
- `pg`: Driver PostgreSQL cho Node.js
- `pg-hstore`: Plugin để lưu trữ JSON trong PostgreSQL
- `multer`: Middleware xử lý upload file
- `express-validator`: Thư viện validate dữ liệu đầu vào
- `helmet`: Middleware bảo mật cho HTTP headers
- `express-rate-limit`: Middleware giới hạn số lượng request

### DevDependencies (thư viện chỉ dùng trong development):
- `nodemon`: Tool tự động restart server khi có thay đổi code

## 2. server.js

File chính để khởi động server:

### Import các thư viện:
- `express`: Framework web
- `cors`: Middleware CORS
- `helmet`: Middleware bảo mật
- `rateLimit`: Middleware giới hạn request
- `path`: Module xử lý đường dẫn
- `dotenv`: Load biến môi trường

### Cấu hình bảo mật:
- `helmet`: Thiết lập các header bảo mật
- `cors`: Cho phép frontend truy cập API
- `rateLimit`: Giới hạn 100 request/15 phút

### Middleware:
- `express.json()`: Parse JSON body
- `express.urlencoded()`: Parse form data
- `express.static()`: Phục vụ file tĩnh

### Routes:
- `/api/auth`: Xử lý đăng nhập, đăng ký
- `/api/products`: Xử lý sản phẩm
- `/api/orders`: Xử lý đơn hàng
- `/api/users`: Xử lý người dùng

### Error handling:
- 404 handler: Xử lý route không tồn tại
- Global error handler: Xử lý tất cả lỗi

### Graceful shutdown:
- Xử lý tín hiệu SIGTERM và SIGINT
- Đóng server an toàn khi có lỗi

## 3. env.example

File mẫu cho biến môi trường:

- `NODE_ENV`: Môi trường (development/production)
- `PORT`: Port server chạy
- `DB_HOST`: Host database
- `DB_PORT`: Port database
- `DB_NAME`: Tên database
- `DB_USER`: Username database
- `DB_PASSWORD`: Password database
- `JWT_SECRET`: Secret key cho JWT
- `FRONTEND_URL`: URL frontend

## 4. docker-compose.yml

File cấu hình Docker:

- `postgres`: Database PostgreSQL
- `pgadmin`: Tool quản lý database
- `redis`: Cache database (nếu cần)

## 5. Cấu trúc thư mục:

- `config/`: Cấu hình database, middleware
- `models/`: Định nghĩa models database
- `routes/`: Định nghĩa API routes
- `middleware/`: Custom middleware
- `uploads/`: Thư mục lưu file upload 