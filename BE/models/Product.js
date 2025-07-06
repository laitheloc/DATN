/**
 * Product Model - Quản lý thông tin sản phẩm điện tử
 * Sử dụng Sequelize ORM cho PostgreSQL
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Product = sequelize.define('Product', {
  // Primary key
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  
  // Thông tin cơ bản
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      len: [2, 100],
      notEmpty: true
    }
  },
  
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      len: [10, 2000],
      notEmpty: true
    }
  },
  
  short_description: {
    type: DataTypes.STRING(200),
    allowNull: true,
    validate: {
      len: [0, 200]
    }
  },
  
  // Phân loại
  category: {
    type: DataTypes.ENUM(
      'smartphone', 'laptop', 'tablet', 'desktop', 
      'accessories', 'audio', 'camera', 'gaming',
      'smartwatch', 'tv', 'home-appliance', 'other'
    ),
    allowNull: false
  },
  
  brand: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  
  // Giá cả
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  
  original_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    validate: {
      min: 0
    }
  },
  
  discount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 100
    }
  },
  
  // Kho hàng
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  
  min_stock: {
    type: DataTypes.INTEGER,
    defaultValue: 5,
    validate: {
      min: 0
    }
  },
  
  // Hình ảnh (JSON array)
  images: {
    type: DataTypes.JSON,
    defaultValue: [],
    validate: {
      isArray: true
    }
  },
  
  // Thông số kỹ thuật (JSON object)
  specifications: {
    type: DataTypes.JSON,
    defaultValue: {},
    validate: {
      isObject: true
    }
  },
  
  // Kích thước và trọng lượng
  length: {
    type: DataTypes.DECIMAL(8, 2), // cm
    allowNull: true
  },
  
  width: {
    type: DataTypes.DECIMAL(8, 2), // cm
    allowNull: true
  },
  
  height: {
    type: DataTypes.DECIMAL(8, 2), // cm
    allowNull: true
  },
  
  weight: {
    type: DataTypes.DECIMAL(8, 2), // gram
    allowNull: true
  },
  
  // Đánh giá và bình luận
  rating_average: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0.00,
    validate: {
      min: 0,
      max: 5
    }
  },
  
  rating_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  
  // Trạng thái
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false
  },
  
  is_featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  
  is_new: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false
  },
  
  // SEO
  slug: {
    type: DataTypes.STRING(150),
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  
  meta_title: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  
  meta_description: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  
  // Thống kê
  view_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  
  sold_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  
  // Tags (JSON array)
  tags: {
    type: DataTypes.JSON,
    defaultValue: [],
    validate: {
      isArray: true
    }
  },
  
  // Bảo hành
  warranty: {
    type: DataTypes.INTEGER, // Tháng
    defaultValue: 12,
    validate: {
      min: 0
    }
  },
  
  // SKU (Stock Keeping Unit)
  sku: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  }
  
}, {
  tableName: 'products',
  timestamps: true, // Tự động thêm createdAt và updatedAt
  
  // Indexes
  indexes: [
    {
      unique: true,
      fields: ['slug']
    },
    {
      unique: true,
      fields: ['sku']
    },
    {
      fields: ['category', 'is_active']
    },
    {
      fields: ['brand', 'is_active']
    },
    {
      fields: ['price']
    },
    {
      fields: ['rating_average']
    },
    {
      fields: ['created_at']
    },
    {
      type: 'FULLTEXT',
      fields: ['name', 'description', 'brand']
    }
  ],
  
  // Hooks
  hooks: {
    // Tạo slug từ tên sản phẩm trước khi lưu
    beforeCreate: async (product) => {
      if (!product.slug && product.name) {
        product.slug = product.name
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim('-');
      }
    },
    
    beforeUpdate: async (product) => {
      if (product.changed('name') && !product.changed('slug')) {
        product.slug = product.name
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim('-');
      }
    }
  }
});

// Instance methods
Product.prototype.getFinalPrice = function() {
  if (this.discount > 0) {
    return parseFloat(this.price) - (parseFloat(this.price) * this.discount / 100);
  }
  return parseFloat(this.price);
};

Product.prototype.getMainImage = function() {
  if (this.images && this.images.length > 0) {
    const mainImg = this.images.find(img => img.isMain);
    return mainImg ? mainImg.url : this.images[0].url;
  }
  return null;
};

Product.prototype.isInStock = function() {
  return this.stock > 0;
};

Product.prototype.isLowStock = function() {
  return this.stock <= this.min_stock && this.stock > 0;
};

Product.prototype.updateRating = async function(newRating) {
  const totalRating = parseFloat(this.rating_average) * this.rating_count + newRating;
  this.rating_count += 1;
  this.rating_average = totalRating / this.rating_count;
  return await this.save();
};

Product.prototype.decreaseStock = async function(quantity) {
  if (this.stock >= quantity) {
    this.stock -= quantity;
    this.sold_count += quantity;
    return await this.save();
  }
  throw new Error('Không đủ hàng trong kho');
};

Product.prototype.increaseStock = async function(quantity) {
  this.stock += quantity;
  return await this.save();
};

// Class methods (static methods)
Product.findByCategory = function(category, limit = 10) {
  return this.findAll({
    where: { category, is_active: true },
    order: [['created_at', 'DESC']],
    limit: limit
  });
};

Product.findFeatured = function(limit = 10) {
  return this.findAll({
    where: { is_featured: true, is_active: true },
    order: [['rating_average', 'DESC']],
    limit: limit
  });
};

Product.findNew = function(limit = 10) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  return this.findAll({
    where: {
      created_at: {
        [sequelize.Op.gte]: thirtyDaysAgo
      },
      is_active: true
    },
    order: [['created_at', 'DESC']],
    limit: limit
  });
};

Product.search = function(searchTerm, limit = 20) {
  return this.findAll({
    where: {
      [sequelize.Op.or]: [
        {
          name: {
            [sequelize.Op.iLike]: `%${searchTerm}%`
          }
        },
        {
          description: {
            [sequelize.Op.iLike]: `%${searchTerm}%`
          }
        },
        {
          brand: {
            [sequelize.Op.iLike]: `%${searchTerm}%`
          }
        }
      ],
      is_active: true
    },
    order: [['rating_average', 'DESC']],
    limit: limit
  });
};

// Associations (sẽ được định nghĩa sau khi tạo các model khác)
// Product.hasMany(OrderItem, { foreignKey: 'product_id' });
// Product.hasMany(Review, { foreignKey: 'product_id' });
// Product.hasMany(ProductImage, { foreignKey: 'product_id' });

module.exports = Product; 