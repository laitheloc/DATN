/**
 * Order Model - Quản lý đơn hàng
 * Sử dụng Sequelize ORM cho PostgreSQL
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Order = sequelize.define('Order', {
  // Primary key
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  
  // Mã đơn hàng
  order_number: {
    type: DataTypes.STRING(20),
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  
  // Thông tin khách hàng
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  
  // Thông tin giao hàng
  shipping_address: {
    type: DataTypes.JSON,
    allowNull: false,
    validate: {
      isObject: true
    }
  },
  
  // Thông tin thanh toán
  payment_method: {
    type: DataTypes.ENUM('cod', 'bank_transfer', 'credit_card', 'momo', 'vnpay'),
    allowNull: false
  },
  
  payment_status: {
    type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'),
    defaultValue: 'pending',
    allowNull: false
  },
  
  // Trạng thái đơn hàng
  status: {
    type: DataTypes.ENUM(
      'pending', 'confirmed', 'processing', 'shipped', 
      'delivered', 'cancelled', 'returned'
    ),
    defaultValue: 'pending',
    allowNull: false
  },
  
  // Thông tin giá
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  
  tax_amount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
    validate: {
      min: 0
    }
  },
  
  shipping_fee: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
    validate: {
      min: 0
    }
  },
  
  discount_amount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
    validate: {
      min: 0
    }
  },
  
  total_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  
  // Thông tin giao hàng
  shipping_method: {
    type: DataTypes.ENUM('standard', 'express', 'same_day'),
    defaultValue: 'standard',
    allowNull: false
  },
  
  tracking_number: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  
  estimated_delivery: {
    type: DataTypes.DATE,
    allowNull: true
  },
  
  // Ghi chú
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  
  // Thông tin bổ sung
  coupon_code: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  
  // Timestamps
  paid_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  
  shipped_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  
  delivered_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  
  cancelled_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
  
}, {
  tableName: 'orders',
  timestamps: true, // Tự động thêm createdAt và updatedAt
  
  // Indexes
  indexes: [
    {
      unique: true,
      fields: ['order_number']
    },
    {
      fields: ['user_id']
    },
    {
      fields: ['status']
    },
    {
      fields: ['payment_status']
    },
    {
      fields: ['created_at']
    }
  ],
  
  // Hooks
  hooks: {
    // Tạo mã đơn hàng trước khi lưu
    beforeCreate: async (order) => {
      if (!order.order_number) {
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        order.order_number = `ORD${year}${month}${day}${random}`;
      }
    }
  }
});

// Instance methods
Order.prototype.calculateTotal = function() {
  this.total_amount = parseFloat(this.subtotal) + 
                     parseFloat(this.tax_amount) + 
                     parseFloat(this.shipping_fee) - 
                     parseFloat(this.discount_amount);
  return this.total_amount;
};

Order.prototype.markAsPaid = async function() {
  this.payment_status = 'paid';
  this.paid_at = new Date();
  return await this.save();
};

Order.prototype.markAsShipped = async function(trackingNumber = null) {
  this.status = 'shipped';
  this.shipped_at = new Date();
  if (trackingNumber) {
    this.tracking_number = trackingNumber;
  }
  return await this.save();
};

Order.prototype.markAsDelivered = async function() {
  this.status = 'delivered';
  this.delivered_at = new Date();
  return await this.save();
};

Order.prototype.cancel = async function(reason = null) {
  this.status = 'cancelled';
  this.cancelled_at = new Date();
  if (reason) {
    this.notes = this.notes ? `${this.notes}\nLý do hủy: ${reason}` : `Lý do hủy: ${reason}`;
  }
  return await this.save();
};

// Class methods (static methods)
Order.findByUser = function(userId, limit = 10) {
  return this.findAll({
    where: { user_id: userId },
    order: [['created_at', 'DESC']],
    limit: limit
  });
};

Order.findByStatus = function(status, limit = 20) {
  return this.findAll({
    where: { status },
    order: [['created_at', 'DESC']],
    limit: limit
  });
};

Order.findPending = function(limit = 20) {
  return this.findAll({
    where: { 
      status: 'pending',
      payment_status: 'paid'
    },
    order: [['created_at', 'ASC']],
    limit: limit
  });
};

// Associations (sẽ được định nghĩa sau khi tạo các model khác)
// Order.belongsTo(User, { foreignKey: 'user_id' });
// Order.hasMany(OrderItem, { foreignKey: 'order_id' });

module.exports = Order; 