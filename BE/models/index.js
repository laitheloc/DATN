/**
 * Models Index - Quản lý associations giữa các models
 * File này định nghĩa mối quan hệ giữa các bảng trong database
 */

const User = require('./User');
const Product = require('./Product');
const Order = require('./Order');
const OrderItem = require('./OrderItem');

// Associations

// User - Order (1:N)
User.hasMany(Order, { 
  foreignKey: 'user_id',
  as: 'orders'
});
Order.belongsTo(User, { 
  foreignKey: 'user_id',
  as: 'user'
});

// Order - OrderItem (1:N)
Order.hasMany(OrderItem, { 
  foreignKey: 'order_id',
  as: 'items'
});
OrderItem.belongsTo(Order, { 
  foreignKey: 'order_id',
  as: 'order'
});

// Product - OrderItem (1:N)
Product.hasMany(OrderItem, { 
  foreignKey: 'product_id',
  as: 'orderItems'
});
OrderItem.belongsTo(Product, { 
  foreignKey: 'product_id',
  as: 'product'
});

// Export models
module.exports = {
  User,
  Product,
  Order,
  OrderItem
}; 