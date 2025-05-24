const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// Protect routes
exports.protect = async (req, res, next) => {
  let token;
  console.log('Checking authorization...');

  // Check for token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
      console.log('Token extracted from header');
      
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Token verified successfully');
      
      // Find admin by ID
      const admin = await Admin.findById(decoded.id);
      
      if (!admin) {
        console.log('No admin found with the ID from token');
        return res.status(401).json({
          success: false,
          error: 'Admin account not found'
        });
      }
      
      // Set req.admin to the admin data
      req.admin = admin;
      console.log('Admin authenticated:', admin.email);
      return next();
    } catch (error) {
      console.error('Auth error:', error.message);
      return res.status(401).json({
        success: false,
        error: 'Invalid authentication token'
      });
    }
  }

  if (!token) {
    console.log('No token provided in request');
    return res.status(401).json({
      success: false,
      error: 'Not authorized to access this route - No token provided'
    });
  }
};
