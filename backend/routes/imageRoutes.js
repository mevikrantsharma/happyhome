const express = require('express');
const router = express.Router();
const { 
  uploadImage, 
  getImages, 
  getImagesByCategory,
  getFeaturedImages,
  getImageById,
  updateImage,
  deleteImage
} = require('../controllers/imageController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

// Public routes
router.get('/', getImages);
router.get('/by-category', getImagesByCategory);
router.get('/featured', getFeaturedImages);
router.get('/:id', getImageById);

// Protected routes (admin only)
router.post('/', protect, upload.single('image'), uploadImage);
router.put('/:id', protect, updateImage);
router.delete('/:id', protect, deleteImage);

module.exports = router;
