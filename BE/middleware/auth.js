/**
 * Middleware xác thực JWT
 * File này kiểm tra token JWT và xác thực người dùng
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Kiểm tra token trong header Authorization
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Lấy token từ header (format: "Bearer <token>")
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Tìm user trong database
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Token không hợp lệ hoặc user không tồn tại'
        });
      }

      // Kiểm tra user có bị khóa không
      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          error: 'Tài khoản đã bị khóa'
        });
      }

      // Gán user vào request để sử dụng ở các route tiếp theo
      req.user = user;
      next();

    } catch (error) {
      console.error('❌ Token verification error:', error);
      return res.status(401).json({
        success: false,
        error: 'Token không hợp lệ'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Không có token, truy cập bị từ chối'
    });
  }
};

/**
 * Middleware kiểm tra quyền admin
 * Sử dụng sau middleware protect
 */
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      error: 'Không có quyền truy cập. Yêu cầu quyền admin'
    });
  }
};

/**
 * Middleware kiểm tra quyền user hoặc admin
 * Sử dụng sau middleware protect
 */
const userOrAdmin = (req, res, next) => {
  if (req.user && (req.user.role === 'user' || req.user.role === 'admin')) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      error: 'Không có quyền truy cập'
    });
  }
};

module.exports = { protect, admin, userOrAdmin }; 