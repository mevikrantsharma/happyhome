const express = require('express');
const router = express.Router();
const { login, getMe, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Login route
router.post('/login', login);

// Get current admin route - protected
router.get('/me', protect, getMe);

// Update profile route - protected
router.put('/profile', protect, updateProfile);

module.exports = router;
