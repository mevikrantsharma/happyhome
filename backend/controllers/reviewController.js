const Review = require('../models/Review');
const User = require('../models/User');
const { cloudinary } = require('../config/cloudinary');

// @desc    Get all approved reviews
// @route   GET /api/reviews
// @access  Public
exports.getReviews = async (req, res) => {
  try {
    const { service, limit = 10, page = 1, featured } = req.query;
    
    const query = { status: 'approved' };
    
    // Add service filter if provided
    if (service) {
      query.service = service;
    }
    
    // Add featured filter if provided
    if (featured === 'true') {
      query.featured = true;
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
    
    // Check if user has already reviewed this service
    const existingReview = await Review.findOne({ 
      user: req.user.id,
      service
    });
    
    if (existingReview) {
      return res.status(400).json({
        success: false,
        error: 'You have already submitted a review for this service'
      });
    }
    
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
        const publicId = image.imageUrl.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`reviews/${publicId}`);
      }
    }
    
    await review.remove();
    
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
