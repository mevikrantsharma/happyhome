const Review = require('../models/Review');
const User = require('../models/User');
const { cloudinary } = require('../config/cloudinary');

// @desc    Get all approved reviews (and user's own pending reviews if authenticated)
// @route   GET /api/reviews
// @access  Public
exports.getReviews = async (req, res) => {
  try {
    const { service, limit = 10, page = 1, featured } = req.query;
    
    // Base query for approved reviews
    let query = { status: 'approved' };
    
    // If user is authenticated, add their own pending reviews to the results
    if (req.headers.authorization) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if (decoded && decoded.id) {
          // Include either approved reviews OR pending reviews that belong to this user
          query = { 
            $or: [
              { status: 'approved' },
              { status: 'pending', user: decoded.id }
            ]
          };
        }
      } catch (error) {
        // Invalid token, just continue with approved reviews only
        console.log('Token verification failed, showing only approved reviews');
      }
    }
    
    // Add service filter if provided
    if (service) {
      if (query.$or) {
        // If we have $or conditions, apply service filter to both conditions
        query.$or[0].service = service;
        query.$or[1].service = service;
      } else {
        query.service = service;
      }
    }
    
    // Add featured filter if provided
    if (featured === 'true') {
      if (query.$or) {
        // If we have $or conditions, apply featured filter to both conditions
        query.$or[0].featured = true;
        query.$or[1].featured = true;
      } else {
        query.featured = true;
      }
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const reviews = await Review.find(query)
      .populate({
        path: 'user',
        select: 'name avatar'
      })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);
    
    const total = await Review.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: reviews.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: reviews
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Get review by ID
// @route   GET /api/reviews/:id
// @access  Public
exports.getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate({
        path: 'user',
        select: 'name avatar'
      });
    
    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }
    
    // Only return approved reviews to the public, unless the user is an admin or the review author
    if (review.status !== 'approved' && 
        (!req.user || (req.user.role !== 'admin' && req.user.id !== review.user._id.toString()))) {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: review
    });
  } catch (error) {
    console.error('Error fetching review:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private
exports.createReview = async (req, res) => {
  try {
    const { title, content, service, ratings, projectDetails, location, images } = req.body;
    
    // Removed validation that limited users to one review per service
    
    // Process images if provided
    const processedImages = [];
    if (images && images.length > 0) {
      for (const image of images) {
        // Upload to cloudinary
        const result = await cloudinary.uploader.upload(image.dataUrl, {
          folder: 'reviews',
          width: 1000,
          crop: 'limit'
        });
        
        processedImages.push({
          imageUrl: result.secure_url,
          caption: image.caption || ''
        });
      }
    }
    
    // Create the review
    const review = await Review.create({
      user: req.user.id,
      title,
      content,
      service,
      ratings,
      projectDetails,
      location,
      images: processedImages,
      status: 'pending' // All reviews start as pending until approved
    });
    
    res.status(201).json({
      success: true,
      data: review
    });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private
exports.updateReview = async (req, res) => {
  try {
    let review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }
    
    // Check if user is the review owner or an admin
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this review'
      });
    }
    
    // If admin is updating review status
    if (req.user.role === 'admin' && req.body.status) {
      review.status = req.body.status;
      
      if (req.body.adminResponse) {
        review.adminResponse = req.body.adminResponse;
      }
      
      if (req.body.featured !== undefined) {
        review.featured = req.body.featured;
      }
      
      await review.save();
      
      return res.status(200).json({
        success: true,
        data: review
      });
    }
    
    // For regular users, only allow updates if review is still pending
    if (review.status !== 'pending' && req.user.role !== 'admin') {
      return res.status(400).json({
        success: false,
        error: 'Cannot update a review once it has been approved or rejected'
      });
    }
    
    // Process new images if provided
    if (req.body.newImages && req.body.newImages.length > 0) {
      const newProcessedImages = [];
      for (const image of req.body.newImages) {
        // Upload to cloudinary
        const result = await cloudinary.uploader.upload(image.dataUrl, {
          folder: 'reviews',
          width: 1000,
          crop: 'limit'
        });
        
        newProcessedImages.push({
          imageUrl: result.secure_url,
          caption: image.caption || ''
        });
      }
      
      // Combine with existing images
      review.images = [...review.images, ...newProcessedImages];
    }
    
    // Update fields
    if (req.body.title) review.title = req.body.title;
    if (req.body.content) review.content = req.body.content;
    if (req.body.ratings) review.ratings = req.body.ratings;
    if (req.body.projectDetails) review.projectDetails = req.body.projectDetails;
    if (req.body.location) review.location = req.body.location;
    
    // Remove images if specified
    if (req.body.removeImageIds && req.body.removeImageIds.length > 0) {
      review.images = review.images.filter(
        (img, index) => !req.body.removeImageIds.includes(index.toString())
      );
    }
    
    await review.save();
    
    res.status(200).json({
      success: true,
      data: review
    });
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }
    
    // Check if user is the review owner or an admin
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete this review'
      });
    }
    
    // Delete images from cloudinary
    for (const image of review.images) {
      if (image.imageUrl) {
        try {
          const publicId = image.imageUrl.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(`reviews/${publicId}`);
        } catch (imageError) {
          console.error('Error deleting image from Cloudinary:', imageError);
          // Continue with deletion even if image removal fails
        }
      }
    }
    
    // Use deleteOne() instead of remove() (which is deprecated)
    await Review.deleteOne({ _id: review._id });
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Get service stats (average ratings)
// @route   GET /api/reviews/stats
// @access  Public
exports.getServiceStats = async (req, res) => {
  try {
    const { service } = req.query;
    
    if (!service) {
      return res.status(400).json({
        success: false,
        error: 'Service parameter is required'
      });
    }
    
    const stats = await Review.getServiceStats(service);
    
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching service stats:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Get all reviews (including pending and rejected) - Admin only
// @route   GET /api/reviews/admin
// @access  Private/Admin
exports.getAdminReviews = async (req, res) => {
  try {
    const { status, service, limit = 10, page = 1 } = req.query;
    
    const query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (service) {
      query.service = service;
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const reviews = await Review.find(query)
      .populate({
        path: 'user',
        select: 'name email avatar'
      })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);
    
    const total = await Review.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: reviews.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: reviews
    });
  } catch (error) {
    console.error('Error fetching admin reviews:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Get reviews by logged in user (includes all statuses)
// @route   GET /api/reviews/user
// @access  Private
exports.getUserReviews = async (req, res) => {
  try {
    // Find all reviews by the currently logged in user
    const reviews = await Review.find({ user: req.user.id })
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};
