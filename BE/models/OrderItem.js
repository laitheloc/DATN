/**
 * OrderItem Model - Quản lý chi tiết đơn hàng
 * Sử dụng Sequelize ORM cho PostgreSQL
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const OrderItem = sequelize.define('OrderItem', {
  // Primary key
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  
  // Foreign keys
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'orders',
      key: 'id'
    }
  },
  
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'products',
      key: 'id'
    }
  },
  
  // Thông tin sản phẩm tại thời điểm đặt hàng
  product_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  
  product_sku: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  
  product_image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  
  // Số lượng và giá
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  
  unit_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  
  discount_percent: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 100
    }
  },
  
  total_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  
  // Thông tin bổ sung
  product_specifications: {
    type: DataTypes.JSON,
    defaultValue: {},
    validate: {
      isObject: true
    }
  },
  
  // Trạng thái
  is_returned: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  
  return_reason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  
  return_date: {
    type: DataTypes.DATE,
    allowNull: true
  }
  
}, {
  tableName: 'order_items',
  timestamps: true, // Tự động thêm createdAt và updatedAt
  
  // Indexes
  indexes: [
    {
      fields: ['order_id']
    },
    {
      fields: ['product_id']
    },
    {
      fields: ['order_id', 'product_id']
    }
  ],
  
  // Hooks
  hooks: {
    // Tính tổng giá trước khi lưu
    beforeCreate: async (orderItem) => {
      const discountAmount = (parseFloat(orderItem.unit_price) * orderItem.discount_percent) / 100;
      const finalPrice = parseFloat(orderItem.unit_price) - discountAmount;
      orderItem.total_price = finalPrice * orderItem.quantity;
    },
    
    beforeUpdate: async (orderItem) => {
      if (orderItem.changed('unit_price') || orderItem.changed('discount_percent') || orderItem.changed('quantity')) {
        const discountAmount = (parseFloat(orderItem.unit_price) * orderItem.discount_percent) / 100;
        const finalPrice = parseFloat(orderItem.unit_price) - discountAmount;
        orderItem.total_price = finalPrice * orderItem.quantity;
      }
    }
  }
});

// Instance methods
OrderItem.prototype.getFinalUnitPrice = function() {
  const discountAmount = (parseFloat(this.unit_price) * this.discount_percent) / 100;
  return parseFloat(this.unit_price) - discountAmount;
};

OrderItem.prototype.calculateTotal = function() {
  const finalUnitPrice = this.getFinalUnitPrice();
  return finalUnitPrice * this.quantity;
};

OrderItem.prototype.return = async function(reason) {
  this.is_returned = true;
  this.return_reason = reason;
  this.return_date = new Date();
  return await this.save();
};

// Class methods (static methods)
OrderItem.findByOrder = function(orderId) {
  return this.findAll({
    where: { order_id: orderId },
    order: [['created_at', 'ASC']]
  });
};

OrderItem.findByProduct = function(productId, limit = 20) {
  return this.findAll({
    where: { product_id: productId },
    order: [['created_at', 'DESC']],
    limit: limit
  });
};

// Associations (sẽ được định nghĩa sau khi tạo các model khác)
// OrderItem.belongsTo(Order, { foreignKey: 'order_id' });
// OrderItem.belongsTo(Product, { foreignKey: 'product_id' });

module.exports = OrderItem; 