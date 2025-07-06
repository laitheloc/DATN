/**
 * Route quản lý người dùng
 */

const express = require('express');
const { body, validationResult } = require('express-validator');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// Placeholder - sẽ implement sau
router.get('/', protect, admin, (req, res) => {
  res.json({
    success: true,
    message: 'Users route - sẽ implement sau'
  });
});

module.exports = router; 