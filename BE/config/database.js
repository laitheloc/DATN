/**
 * Cấu hình kết nối PostgreSQL
 * File này xử lý việc kết nối đến database PostgreSQL sử dụng Sequelize ORM
 */

const { Sequelize } = require('sequelize'); // Import Sequelize từ thư viện sequelize

// Tạo Sequelize instance
const sequelize = new Sequelize(
  process.env.DB_NAME || 'electronics_store', // Tên database (lấy từ biến môi trường hoặc mặc định)
  process.env.DB_USER || 'postgres', // Username database (lấy từ biến môi trường hoặc mặc định)
  process.env.DB_PASSWORD || '1234', // Password database (lấy từ biến môi trường hoặc mặc định)
  {
    host: process.env.DB_HOST || 'localhost', // Host database (lấy từ biến môi trường hoặc mặc định)
    port: process.env.DB_PORT || 5432, // Port database (lấy từ biến môi trường hoặc mặc định)
    dialect: 'postgres', // Loại database (PostgreSQL)
    logging: process.env.NODE_ENV === 'development' ? console.log : false, // Chỉ log SQL trong development
    
    // Connection pool configuration
    pool: {
      max: 5, // Số connection tối đa trong pool (tối đa 5 kết nối đồng thời)
      min: 0, // Số connection tối thiểu trong pool (có thể đóng hết khi không dùng)
      acquire: 30000, // Thời gian tối đa để acquire connection (30 giây)
      idle: 10000 // Thời gian connection có thể idle trước khi bị đóng (10 giây)
    },
    
    // Timezone configuration
    timezone: '+07:00', // Timezone Việt Nam (UTC+7)
    
    // Define configuration
    define: {
      timestamps: true, // Tự động thêm createdAt và updatedAt vào tất cả tables
      underscored: true, // Sử dụng snake_case cho column names (user_id thay vì userId)
      freezeTableName: true // Không thêm 's' vào cuối table name (user thay vì users)
    }
  }
);

const connectDB = async () => {
  try {
    // Test kết nối database
    await sequelize.authenticate(); // Kiểm tra kết nối đến database
    console.log(`✅ PostgreSQL đã kết nối thành công: ${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`); // In thông báo thành công
    
    // Sync database (tạo tables nếu chưa có)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true }); // alter: true để cập nhật schema trong development
      console.log('🔄 Database đã được sync'); // In thông báo sync thành công
    } else {
      await sequelize.sync(); // Chỉ tạo tables nếu chưa có (production)
    }
    
    // Xử lý các sự kiện kết nối
    sequelize.addHook('afterConnect', (connection) => {
      console.log('🔗 Database connection established'); // In thông báo khi có kết nối mới
    }); // Thêm hook để xử lý khi có kết nối mới
    
    // Xử lý khi ứng dụng tắt
    process.on('SIGINT', async () => {
      await sequelize.close(); // Đóng kết nối database
      console.log('🔌 Database connection đã đóng do ứng dụng tắt'); // In thông báo đóng kết nối
      process.exit(0); // Thoát process với mã thành công
    }); // Xử lý khi nhận tín hiệu SIGINT (Ctrl+C)
    
  } catch (error) {
    console.error('❌ Lỗi kết nối PostgreSQL:', error.message); // In lỗi kết nối
    process.exit(1); // Thoát process với mã lỗi
  }
};

// Export sequelize instance và connectDB function
module.exports = { sequelize, connectDB }; // Export để sử dụng ở file khác 