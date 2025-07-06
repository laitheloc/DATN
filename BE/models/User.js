/**
 * User Model - Quản lý thông tin người dùng
 * Sử dụng Sequelize ORM cho PostgreSQL
 */

const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  // Primary key
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  
  // Thông tin cơ bản
  full_name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      len: [2, 50],
      notEmpty: true
    }
  },
  
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
      notEmpty: true
    }
  },
  
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [6, 255],
      notEmpty: true
    }
  },
  
  phone: {
    type: DataTypes.STRING(15),
    allowNull: true,
    validate: {
      is: /^[0-9]{10,11}$/
    }
  },
  
  // Địa chỉ
  address_street: {
    type: DataTypes.STRING,
    allowNull: true
  },
  
  address_city: {
    type: DataTypes.STRING,
    allowNull: true
  },
  
  address_district: {
    type: DataTypes.STRING,
    allowNull: true
  },
  
  address_zip_code: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  
  // Phân quyền và trạng thái
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    defaultValue: 'user',
    allowNull: false
  },
  
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false
  },
  
  is_email_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  
  // Thông tin bổ sung
  avatar: {
    type: DataTypes.STRING,
    allowNull: true
  },
  
  date_of_birth: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  
  gender: {
    type: DataTypes.ENUM('male', 'female', 'other'),
    defaultValue: 'other',
    allowNull: false
  },
  
  // Thống kê
  total_orders: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false
  },
  
  total_spent: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
    allowNull: false
  },
  
  // Timestamps
  last_login: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false
  }
  
}, {
  tableName: 'users',
  timestamps: true, // Tự động thêm createdAt và updatedAt
  
  // Indexes
  indexes: [
    {
      unique: true,
      fields: ['email']
    },
    {
      fields: ['phone']
    },
    {
      fields: ['role', 'is_active']
    }
  ],
  
  // Hooks
  hooks: {
    // Hash password trước khi lưu
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(12);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(12);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

// Instance methods
User.prototype.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

User.prototype.getSignedJwtToken = function() {
  return jwt.sign(
    { id: this.id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );
};

// Virtual fields (getters)
User.prototype.getFullAddress = function() {
  const parts = [
    this.address_street,
    this.address_district,
    this.address_city,
    this.address_zip_code
  ].filter(Boolean);
  
  return parts.join(', ');
};

// Class methods (static methods)
User.findByEmail = function(email) {
  return this.findOne({ where: { email: email.toLowerCase() } });
};

User.findActiveUsers = function() {
  return this.findAll({ where: { is_active: true } });
};

User.findByRole = function(role) {
  return this.findAll({ where: { role, is_active: true } });
};

// Associations (sẽ được định nghĩa sau khi tạo các model khác)
// User.hasMany(Order, { foreignKey: 'user_id' });
// User.hasMany(Review, { foreignKey: 'user_id' });

module.exports = User; 