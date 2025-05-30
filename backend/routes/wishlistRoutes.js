const express = require('express');
const router = express.Router();
const { 
  getWishlists,
  getWishlist,
  createWishlist,
  updateWishlist,
  deleteWishlist,
  addItemToWishlist,
  removeItemFromWishlist,
  quickAddToWishlist
} = require('../controllers/wishlistController');
const { protect } = require('../middleware/userAuthMiddleware');

// All routes require authentication
router.use(protect);

// Quick add to default wishlist
router.post('/quick-add', quickAddToWishlist);

// Routes for managing wishlists
router.route('/')
  .get(getWishlists)
  .post(createWishlist);

router.route('/:id')
  .get(getWishlist)
  .put(updateWishlist)
  .delete(deleteWishlist);

// Routes for managing items in a wishlist
router.post('/:id/items', addItemToWishlist);
router.delete('/:id/items/:itemId', removeItemFromWishlist);

module.exports = router;
