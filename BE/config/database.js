/**
 * Cấu hình kết nối PostgreSQL
 * File này xử lý việc kết nối đến database PostgreSQL sử dụng Sequelize ORM
 */

const { Sequelize } = require('sequelize');

// Tạo Sequelize instance
const sequelize = new Sequelize(
  process.env.DB_NAME || 'electronics_store',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || '1234',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    
    // Connection pool configuration
    pool: {
      max: 5, // Số connection tối đa trong pool
      min: 0, // Số connection tối thiểu trong pool
      acquire: 30000, // Thời gian tối đa để acquire connection (ms)
      idle: 10000 // Thời gian connection có thể idle trước khi bị đóng (ms)
    },
    
    // Timezone configuration
    timezone: '+07:00', // Timezone Việt Nam
    
    // Define configuration
    define: {
      timestamps: true, // Tự động thêm createdAt và updatedAt
      underscored: true, // Sử dụng snake_case cho column names
      freezeTableName: true // Không thêm 's' vào cuối table name
    }
  }
);

const connectDB = async () => {
  try {
    // Test kết nối database
    await sequelize.authenticate();
    console.log(`✅ PostgreSQL đã kết nối thành công: ${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);
    
    // Sync database (tạo tables nếu chưa có)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true }); // alter: true để cập nhật schema
      console.log('🔄 Database đã được sync');
    } else {
      await sequelize.sync(); // Chỉ tạo tables nếu chưa có
    }
    
    // Xử lý các sự kiện kết nối
    sequelize.addHook('afterConnect', (connection) => {
      console.log('🔗 Database connection established');
    });
    
    // Xử lý khi ứng dụng tắt
    process.on('SIGINT', async () => {
      await sequelize.close();
      console.log('🔌 Database connection đã đóng do ứng dụng tắt');
      process.exit(0);
    });
    
  } catch (error) {
    console.error('❌ Lỗi kết nối PostgreSQL:', error.message);
    process.exit(1);
  }
};

// Export sequelize instance và connectDB function
module.exports = { sequelize, connectDB }; 