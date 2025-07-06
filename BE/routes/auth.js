/**
 * Authentication Routes
 * Xử lý đăng ký, đăng nhập, quản lý profile người dùng
 */

const express = require('express');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Import models và middleware
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Đăng ký tài khoản mới
 * @access  Public
 */
router.post('/register', [
  body('full_name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Họ tên phải từ 2-50 ký tự'),
  
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Họ tên phải từ 2-50 ký tự'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email không hợp lệ'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Mật khẩu phải có ít nhất 6 ký tự')
    .matches(/\d/)
    .withMessage('Mật khẩu phải chứa ít nhất 1 số'),
  
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Mật khẩu xác nhận không khớp');
      }
      return true;
    })
    .withMessage('Mật khẩu xác nhận không khớp'),
  
  body('phone')
    .optional()
    .matches(/^[0-9]{10,11}$/)
    .withMessage('Số điện thoại không hợp lệ')
], async (req, res) => {
  try {
    // Kiểm tra validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu không hợp lệ',
        errors: errors.array()
      });
    }

    const { full_name, name, email, password, phone, address_street, address_city, address_district, address_zip_code } = req.body;
    
    // Sử dụng name hoặc full_name, ưu tiên full_name
    const userFullName = full_name || name;
    
    if (!userFullName) {
      return res.status(400).json({
        success: false,
        message: 'Họ tên là bắt buộc'
      });
    }

    // Kiểm tra email đã tồn tại
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email đã được sử dụng'
      });
    }

    // Tạo user mới
    const user = await User.create({
      full_name: userFullName,
      email: email.toLowerCase(),
      password,
      phone,
      address_street,
      address_city,
      address_district,
      address_zip_code
    });

    // Tạo JWT token
    const token = user.getSignedJwtToken();

    // Trả về response (không bao gồm password)
    const userResponse = {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      is_active: user.is_active,
      is_email_verified: user.is_email_verified,
      avatar: user.avatar,
      created_at: user.created_at
    };

    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công',
      data: {
        user: userResponse,
        token
      }
    });

  } catch (error) {
    console.error('Lỗi đăng ký:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server, vui lòng thử lại sau'
    });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Đăng nhập
 * @access  Public
 */
router.post('/login', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email không hợp lệ'),
  
  body('password')
    .notEmpty()
    .withMessage('Mật khẩu là bắt buộc')
], async (req, res) => {
  try {
    // Kiểm tra validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu không hợp lệ',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Tìm user theo email
    const user = await User.findOne({
      where: { 
        email: email.toLowerCase(),
        is_active: true
      }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không đúng'
      });
    }

    // Kiểm tra password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không đúng'
      });
    }

    // Cập nhật last_login
    user.last_login = new Date();
    await user.save();

    // Tạo JWT token
    const token = user.getSignedJwtToken();

    // Trả về response
    const userResponse = {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      is_active: user.is_active,
      is_email_verified: user.is_email_verified,
      avatar: user.avatar,
      last_login: user.last_login
    };

    res.json({
      success: true,
      message: 'Đăng nhập thành công',
      data: {
        user: userResponse,
        token
      }
    });

  } catch (error) {
    console.error('Lỗi đăng nhập:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server, vui lòng thử lại sau'
    });
  }
});

/**
 * @route   GET /api/auth/profile
 * @desc    Lấy thông tin profile của user đang đăng nhập
 * @access  Private
 */
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng'
      });
    }

    res.json({
      success: true,
      data: { user }
    });

  } catch (error) {
    console.error('Lỗi lấy profile:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server, vui lòng thử lại sau'
    });
  }
});

/**
 * @route   PUT /api/auth/profile
 * @desc    Cập nhật thông tin profile
 * @access  Private
 */
router.put('/profile', [
  protect,
  body('full_name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Họ tên phải từ 2-50 ký tự'),
  
  body('phone')
    .optional()
    .matches(/^[0-9]{10,11}$/)
    .withMessage('Số điện thoại không hợp lệ')
], async (req, res) => {
  try {
    // Kiểm tra validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu không hợp lệ',
        errors: errors.array()
      });
    }

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng'
      });
    }

    // Cập nhật thông tin
    const updateFields = ['full_name', 'phone', 'address_street', 'address_city', 'address_district', 'address_zip_code', 'date_of_birth', 'gender'];
    
    updateFields.forEach(field => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    await user.save();

    // Trả về response (không bao gồm password)
    const userResponse = {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      is_active: user.is_active,
      is_email_verified: user.is_email_verified,
      avatar: user.avatar,
      address_street: user.address_street,
      address_city: user.address_city,
      address_district: user.address_district,
      address_zip_code: user.address_zip_code,
      date_of_birth: user.date_of_birth,
      gender: user.gender,
      updated_at: user.updated_at
    };

    res.json({
      success: true,
      message: 'Cập nhật profile thành công',
      data: { user: userResponse }
    });

  } catch (error) {
    console.error('Lỗi cập nhật profile:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server, vui lòng thử lại sau'
    });
  }
});

/**
 * @route   PUT /api/auth/change-password
 * @desc    Thay đổi mật khẩu
 * @access  Private
 */
router.put('/change-password', [
  protect,
  body('current_password')
    .notEmpty()
    .withMessage('Mật khẩu hiện tại là bắt buộc'),
  
  body('new_password')
    .isLength({ min: 6 })
    .withMessage('Mật khẩu mới phải có ít nhất 6 ký tự')
    .matches(/\d/)
    .withMessage('Mật khẩu mới phải chứa ít nhất 1 số')
], async (req, res) => {
  try {
    // Kiểm tra validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu không hợp lệ',
        errors: errors.array()
      });
    }

    const { current_password, new_password } = req.body;

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng'
      });
    }

    // Kiểm tra mật khẩu hiện tại
    const isMatch = await user.matchPassword(current_password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu hiện tại không đúng'
      });
    }

    // Cập nhật mật khẩu mới
    user.password = new_password;
    await user.save();

    res.json({
      success: true,
      message: 'Thay đổi mật khẩu thành công'
    });

  } catch (error) {
    console.error('Lỗi thay đổi mật khẩu:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server, vui lòng thử lại sau'
    });
  }
});

/**
 * @route   POST /api/auth/logout
 * @desc    Đăng xuất (client sẽ xóa token)
 * @access  Private
 */
router.post('/logout', protect, (req, res) => {
  res.json({
    success: true,
    message: 'Đăng xuất thành công'
  });
});

module.exports = router; 