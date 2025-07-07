# Giải thích chi tiết các file cấu hình Frontend

## 1. package.json

File này định nghĩa thông tin và dependencies của project Vue 3:

### Thông tin cơ bản:
- `name`: Tên của project
- `version`: Phiên bản hiện tại
- `description`: Mô tả về project
- `scripts`: Các lệnh để chạy project
  - `dev`: Chạy development server với Vite
  - `build`: Build project cho production
  - `preview`: Xem trước build production
  - `lint`: Kiểm tra và sửa lỗi code
  - `format`: Format code với Prettier

### Dependencies (thư viện cần thiết):
- `vue`: Framework Vue 3
- `vue-router`: Router cho Vue (điều hướng trang)
- `pinia`: State management cho Vue 3
- `axios`: Thư viện gọi HTTP API
- `vue-toastification`: Plugin thông báo toast
- `vee-validate`: Thư viện validate form
- `yup`: Schema validation
- `lucide-vue-next`: Icon library
- `vue3-carousel`: Component carousel
- `vue3-lottie`: Animation library
- `@vueuse/core`: Collection of Vue composition utilities

### DevDependencies (thư viện chỉ dùng trong development):
- `vite`: Build tool và development server
- `@vitejs/plugin-vue`: Plugin Vue cho Vite
- `tailwindcss`: CSS framework
- `autoprefixer`: Tự động thêm CSS prefixes
- `postcss`: CSS post-processor
- `eslint`: Code linter
- `prettier`: Code formatter
- `sass`: CSS preprocessor

## 2. vite.config.js

File cấu hình Vite build tool:

### Import:
- `defineConfig`: Hàm cấu hình Vite
- `vue`: Plugin Vue
- `resolve`: Hàm xử lý đường dẫn

### Cấu hình:
- `plugins`: Đăng ký plugin Vue
- `resolve.alias`: Tạo alias cho import dễ dàng
  - `@`: Trỏ đến thư mục src
  - `@components`: Trỏ đến components
  - `@views`: Trỏ đến views
  - `@stores`: Trỏ đến Pinia stores
  - `@utils`: Trỏ đến utilities
  - `@assets`: Trỏ đến assets
  - `@api`: Trỏ đến API services

### Server development:
- `port`: Port 8080
- `host`: Cho phép truy cập từ IP khác
- `proxy`: Chuyển hướng API requests đến backend

### Build:
- `outDir`: Thư mục output
- `assetsDir`: Thư mục assets
- `sourcemap`: Không tạo source map
- `manualChunks`: Tách code thành chunks

### CSS:
- `preprocessorOptions`: Cấu hình SCSS
- `additionalData`: Tự động import variables

## 3. main.js

File entry point của ứng dụng Vue:

### Import:
- `createApp`: Tạo Vue app
- `createPinia`: Tạo Pinia store
- `router`: Vue Router
- `Toast`: Plugin toast

### Cấu hình:
- Tạo Vue app instance
- Đăng ký Pinia store
- Đăng ký Vue Router
- Cấu hình Toast notifications
- Global error handlers
- Mount app vào DOM

### Toast configuration:
- `position`: Vị trí hiển thị
- `timeout`: Thời gian tự động ẩn
- `closeOnClick`: Đóng khi click
- `pauseOnHover`: Tạm dừng khi hover
- `draggable`: Cho phép kéo thả
- `maxToasts`: Số lượng tối đa

## 4. tailwind.config.js

Cấu hình Tailwind CSS:

- `content`: Định nghĩa files để scan classes
- `theme`: Tùy chỉnh theme (colors, fonts, spacing)
- `plugins`: Các plugin Tailwind
- `darkMode`: Chế độ dark mode

## 5. postcss.config.js

Cấu hình PostCSS:

- `tailwindcss`: Plugin Tailwind
- `autoprefixer`: Plugin tự động thêm prefixes

## 6. Cấu trúc thư mục:

- `src/`: Source code chính
  - `components/`: Vue components
  - `views/`: Page components
  - `router/`: Vue Router configuration
  - `stores/`: Pinia stores
  - `api/`: API services
  - `utils/`: Utility functions
  - `assets/`: Static assets (images, styles)
- `public/`: Public files
- `dist/`: Build output (sau khi build)

## 7. Các lệnh quan trọng:

```bash
npm run dev      # Chạy development server
npm run build    # Build cho production
npm run preview  # Xem trước build
npm run lint     # Kiểm tra lỗi code
npm run format   # Format code
```

## 8. Environment variables:

- `VITE_API_URL`: URL của backend API
- `VITE_APP_TITLE`: Tiêu đề ứng dụng
- `VITE_APP_VERSION`: Phiên bản ứng dụng

## 9. Development workflow:

1. Chạy `npm run dev` để khởi động development server
2. Code trong thư mục `src/`
3. Sử dụng `npm run lint` để kiểm tra lỗi
4. Sử dụng `npm run format` để format code
5. Build với `npm run build` khi deploy 