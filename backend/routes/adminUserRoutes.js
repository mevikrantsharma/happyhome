const express = require('express');
const router = express.Router();
const { deleteUser, getAllUsers } = require('../controllers/adminUserController');
const { adminProtect } = require('../middleware/adminAuthMiddleware');

// Admin user routes - Each route has individual middleware
router.get('/', adminProtect, getAllUsers);
router.delete('/:id', adminProtect, deleteUser);

module.exports = router;
