const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  getMe, 
  updateProfile,
  getAllUsers
} = require('../controllers/userController');
const { protect } = require('../middleware/userAuthMiddleware');
const { adminProtect } = require('../middleware/adminAuthMiddleware');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

// Admin routes
router.get('/all', adminProtect, getAllUsers);

module.exports = router;
