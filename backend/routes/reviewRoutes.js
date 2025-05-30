const express = require('express');
const router = express.Router();
const {
  getReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
  getServiceStats,
  getAdminReviews,
  getUserReviews
} = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/userAuthMiddleware');

// Public routes
router.get('/', getReviews);
router.get('/stats', getServiceStats);

// Protected routes (logged in users)
router.get('/user', protect, getUserReviews);  // Must come BEFORE /:id route
router.get('/:id', getReviewById);

// Protected routes (logged in users)
router.post('/', protect, createReview);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);

// Admin routes
router.get('/admin/all', protect, authorize('admin'), getAdminReviews);

module.exports = router;
