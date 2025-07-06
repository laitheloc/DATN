/**
 * Route quản lý đơn hàng
 */

const express = require('express');
const { body, validationResult } = require('express-validator');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// Placeholder - sẽ implement sau
router.get('/', protect, (req, res) => {
  res.json({
    success: true,
    message: 'Orders route - sẽ implement sau'
  });
});

module.exports = router; 