/**
 * Product Routes
 * Xử lý CRUD operations cho sản phẩm
 */

const express = require('express');
const { body, query, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');

// Import models và middleware
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// Cấu hình multer cho upload ảnh
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/products/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Chỉ chấp nhận file ảnh (jpeg, jpg, png, webp)'));
    }
  }
});

/**
 * @route   GET /api/products
 * @desc    Lấy danh sách sản phẩm với phân trang và lọc
 * @access  Public
 */
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Trang phải là số nguyên dương'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit phải từ 1-100'),
  query('category').optional().isIn(['smartphone', 'laptop', 'tablet', 'desktop', 'accessories', 'audio', 'camera', 'gaming', 'smartwatch', 'tv', 'home-appliance', 'other']),
  query('brand').optional().isString(),
  query('min_price').optional().isFloat({ min: 0 }),
  query('max_price').optional().isFloat({ min: 0 }),
  query('sort').optional().isIn(['price_asc', 'price_desc', 'name_asc', 'name_desc', 'rating_desc', 'newest']),
  query('search').optional().isString()
], async (req, res) => {
  try {
    // Kiểm tra validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Tham số không hợp lệ',
        errors: errors.array()
      });
    }

    const {
      page = 1,
      limit = 12,
      category,
      brand,
      min_price,
      max_price,
      sort = 'newest',
      search
    } = req.query;

    // Xây dựng điều kiện tìm kiếm
    const whereClause = { is_active: true };

    if (category) whereClause.category = category;
    if (brand) whereClause.brand = { [Product.sequelize.Op.iLike]: `%${brand}%` };
    if (min_price || max_price) {
      whereClause.price = {};
      if (min_price) whereClause.price[Product.sequelize.Op.gte] = min_price;
      if (max_price) whereClause.price[Product.sequelize.Op.lte] = max_price;
    }
    if (search) {
      whereClause[Product.sequelize.Op.or] = [
        { name: { [Product.sequelize.Op.iLike]: `%${search}%` } },
        { description: { [Product.sequelize.Op.iLike]: `%${search}%` } },
        { brand: { [Product.sequelize.Op.iLike]: `%${search}%` } }
      ];
    }

    // Xây dựng order clause
    let orderClause = [];
    switch (sort) {
      case 'price_asc':
        orderClause = [['price', 'ASC']];
        break;
      case 'price_desc':
        orderClause = [['price', 'DESC']];
        break;
      case 'name_asc':
        orderClause = [['name', 'ASC']];
        break;
      case 'name_desc':
        orderClause = [['name', 'DESC']];
        break;
      case 'rating_desc':
        orderClause = [['rating_average', 'DESC']];
        break;
      case 'newest':
      default:
        orderClause = [['created_at', 'DESC']];
        break;
    }

    // Thực hiện query với phân trang
    const offset = (page - 1) * limit;
    
    const { count, rows: products } = await Product.findAndCountAll({
      where: whereClause,
      order: orderClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      attributes: { exclude: ['specifications'] } // Không trả về specifications để giảm kích thước response
    });

    // Tính toán thông tin phân trang
    const totalPages = Math.ceil(count / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          current_page: parseInt(page),
          total_pages: totalPages,
          total_items: count,
          items_per_page: parseInt(limit),
          has_next_page: hasNextPage,
          has_prev_page: hasPrevPage
        }
      }
    });

  } catch (error) {
    console.error('Lỗi lấy danh sách sản phẩm:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server, vui lòng thử lại sau'
    });
  }
});

/**
 * @route   GET /api/products/:id
 * @desc    Lấy chi tiết sản phẩm theo ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findOne({
      where: { 
        id: id,
        is_active: true 
      }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm'
      });
    }

    // Tăng view count
    product.view_count += 1;
    await product.save();

    res.json({
      success: true,
      data: { product }
    });

  } catch (error) {
    console.error('Lỗi lấy chi tiết sản phẩm:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server, vui lòng thử lại sau'
    });
  }
});

/**
 * @route   GET /api/products/slug/:slug
 * @desc    Lấy chi tiết sản phẩm theo slug
 * @access  Public
 */
router.get('/slug/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const product = await Product.findOne({
      where: { 
        slug: slug,
        is_active: true 
      }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm'
      });
    }

    // Tăng view count
    product.view_count += 1;
    await product.save();

    res.json({
      success: true,
      data: { product }
    });

  } catch (error) {
    console.error('Lỗi lấy chi tiết sản phẩm:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server, vui lòng thử lại sau'
    });
  }
});

/**
 * @route   POST /api/products
 * @desc    Tạo sản phẩm mới (Admin only)
 * @access  Private (Admin)
 */
router.post('/', [
  admin,
  upload.array('images', 10), // Tối đa 10 ảnh
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Tên sản phẩm phải từ 2-100 ký tự'),
  body('description').isLength({ min: 10, max: 2000 }).withMessage('Mô tả phải từ 10-2000 ký tự'),
  body('category').isIn(['smartphone', 'laptop', 'tablet', 'desktop', 'accessories', 'audio', 'camera', 'gaming', 'smartwatch', 'tv', 'home-appliance', 'other']).withMessage('Danh mục không hợp lệ'),
  body('brand').trim().notEmpty().withMessage('Thương hiệu là bắt buộc'),
  body('price').isFloat({ min: 0 }).withMessage('Giá phải là số dương'),
  body('stock').isInt({ min: 0 }).withMessage('Số lượng tồn kho phải là số nguyên không âm'),
  body('sku').trim().notEmpty().withMessage('SKU là bắt buộc')
], async (req, res) => {
  try {
    // Kiểm tra quyền admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền truy cập'
      });
    }

    // Kiểm tra validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu không hợp lệ',
        errors: errors.array()
      });
    }

    const {
      name,
      description,
      short_description,
      category,
      brand,
      price,
      original_price,
      discount,
      stock,
      min_stock,
      specifications,
      length,
      width,
      height,
      weight,
      warranty,
      sku,
      tags,
      meta_title,
      meta_description
    } = req.body;

    // Kiểm tra SKU đã tồn tại
    const existingProduct = await Product.findOne({ where: { sku } });
    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: 'SKU đã tồn tại'
      });
    }

    // Xử lý ảnh upload
    const images = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach((file, index) => {
        images.push({
          url: `/uploads/products/${file.filename}`,
          alt: `${name} - Ảnh ${index + 1}`,
          isMain: index === 0 // Ảnh đầu tiên là ảnh chính
        });
      });
    }

    // Tạo sản phẩm mới
    const product = await Product.create({
      name,
      description,
      short_description,
      category,
      brand,
      price: parseFloat(price),
      original_price: original_price ? parseFloat(original_price) : null,
      discount: discount ? parseInt(discount) : 0,
      stock: parseInt(stock),
      min_stock: min_stock ? parseInt(min_stock) : 5,
      images,
      specifications: specifications ? JSON.parse(specifications) : {},
      length: length ? parseFloat(length) : null,
      width: width ? parseFloat(width) : null,
      height: height ? parseFloat(height) : null,
      weight: weight ? parseFloat(weight) : null,
      warranty: warranty ? parseInt(warranty) : 12,
      sku,
      tags: tags ? JSON.parse(tags) : [],
      meta_title,
      meta_description
    });

    res.status(201).json({
      success: true,
      message: 'Tạo sản phẩm thành công',
      data: { product }
    });

  } catch (error) {
    console.error('Lỗi tạo sản phẩm:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server, vui lòng thử lại sau'
    });
  }
});

/**
 * @route   PUT /api/products/:id
 * @desc    Cập nhật sản phẩm (Admin only)
 * @access  Private (Admin)
 */
router.put('/:id', [
  admin,
  upload.array('images', 10),
  body('name').optional().trim().isLength({ min: 2, max: 100 }),
  body('category').optional().isIn(['smartphone', 'laptop', 'tablet', 'desktop', 'accessories', 'audio', 'camera', 'gaming', 'smartwatch', 'tv', 'home-appliance', 'other']),
  body('price').optional().isFloat({ min: 0 }),
  body('stock').optional().isInt({ min: 0 })
], async (req, res) => {
  try {
    // Kiểm tra quyền admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền truy cập'
      });
    }

    const { id } = req.params;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm'
      });
    }

    // Cập nhật thông tin sản phẩm
    const updateFields = [
      'name', 'description', 'short_description', 'category', 'brand',
      'price', 'original_price', 'discount', 'stock', 'min_stock',
      'specifications', 'length', 'width', 'height', 'weight',
      'warranty', 'tags', 'meta_title', 'meta_description', 'is_active', 'is_featured'
    ];

    updateFields.forEach(field => {
      if (req.body[field] !== undefined) {
        if (field === 'specifications' || field === 'tags') {
          product[field] = JSON.parse(req.body[field]);
        } else if (field === 'price' || field === 'original_price') {
          product[field] = parseFloat(req.body[field]);
        } else if (field === 'discount' || field === 'stock' || field === 'min_stock' || field === 'warranty') {
          product[field] = parseInt(req.body[field]);
        } else if (field === 'length' || field === 'width' || field === 'height' || field === 'weight') {
          product[field] = parseFloat(req.body[field]);
        } else {
          product[field] = req.body[field];
        }
      }
    });

    // Xử lý ảnh mới nếu có
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file, index) => ({
        url: `/uploads/products/${file.filename}`,
        alt: `${product.name} - Ảnh ${index + 1}`,
        isMain: index === 0
      }));
      
      // Kết hợp với ảnh cũ hoặc thay thế hoàn toàn
      product.images = req.body.replace_images === 'true' ? newImages : [...product.images, ...newImages];
    }

    await product.save();

    res.json({
      success: true,
      message: 'Cập nhật sản phẩm thành công',
      data: { product }
    });

  } catch (error) {
    console.error('Lỗi cập nhật sản phẩm:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server, vui lòng thử lại sau'
    });
  }
});

/**
 * @route   DELETE /api/products/:id
 * @desc    Xóa sản phẩm (Admin only)
 * @access  Private (Admin)
 */
router.delete('/:id', admin, async (req, res) => {
  try {
    // Kiểm tra quyền admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền truy cập'
      });
    }

    const { id } = req.params;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm'
      });
    }

    // Soft delete - chỉ đánh dấu không active
    product.is_active = false;
    await product.save();

    res.json({
      success: true,
      message: 'Xóa sản phẩm thành công'
    });

  } catch (error) {
    console.error('Lỗi xóa sản phẩm:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server, vui lòng thử lại sau'
    });
  }
});

/**
 * @route   GET /api/products/featured
 * @desc    Lấy sản phẩm nổi bật
 * @access  Public
 */
router.get('/featured', async (req, res) => {
  try {
    const products = await Product.findFeatured(8);

    res.json({
      success: true,
      data: { products }
    });

  } catch (error) {
    console.error('Lỗi lấy sản phẩm nổi bật:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server, vui lòng thử lại sau'
    });
  }
});

/**
 * @route   GET /api/products/new
 * @desc    Lấy sản phẩm mới
 * @access  Public
 */
router.get('/new', async (req, res) => {
  try {
    const products = await Product.findNew(8);

    res.json({
      success: true,
      data: { products }
    });

  } catch (error) {
    console.error('Lỗi lấy sản phẩm mới:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server, vui lòng thử lại sau'
    });
  }
});

/**
 * @route   GET /api/products/category/:category
 * @desc    Lấy sản phẩm theo danh mục
 * @access  Public
 */
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 12 } = req.query;

    const offset = (page - 1) * limit;
    
    const { count, rows: products } = await Product.findAndCountAll({
      where: { 
        category,
        is_active: true 
      },
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    const totalPages = Math.ceil(count / limit);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          current_page: parseInt(page),
          total_pages: totalPages,
          total_items: count,
          items_per_page: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Lỗi lấy sản phẩm theo danh mục:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server, vui lòng thử lại sau'
    });
  }
});

module.exports = router; 