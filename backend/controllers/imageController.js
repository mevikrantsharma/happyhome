const Image = require('../models/Image');
const { cloudinary } = require('../config/cloudinary');

// @desc    Upload image
// @route   POST /api/images
// @access  Private (Admin only)
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Please upload an image file'
      });
    }

    const { title, description, category, featured } = req.body;

    // Create new image in database
    const image = await Image.create({
      title,
      description,
      category,
      imageUrl: req.file.path,
      publicId: req.file.filename,
      featured: featured === 'true'
    });

    res.status(201).json({
      success: true,
      data: image
    });
  } catch (error) {
    console.error(error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: messages
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get all images
// @route   GET /api/images
// @access  Public
exports.getImages = async (req, res) => {
  try {
    // Add filtering by category if provided in query
    const filter = {};
    if (req.query.category) {
      filter.category = req.query.category;
    }
    
    const images = await Image.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: images.length,
      data: images
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get images grouped by category
// @route   GET /api/images/by-category
// @access  Public
exports.getImagesByCategory = async (req, res) => {
  try {
    // Aggregate images by category
    const imagesByCategory = await Image.aggregate([
      {
        $group: {
          _id: '$category',
          images: { $push: '$$ROOT' }
        }
      },
      {
        $project: {
          category: '$_id',
          images: 1,
          _id: 0
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: imagesByCategory
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get featured images
// @route   GET /api/images/featured
// @access  Public
exports.getFeaturedImages = async (req, res) => {
  try {
    const featuredImages = await Image.find({ featured: true }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: featuredImages.length,
      data: featuredImages
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get image by ID
// @route   GET /api/images/:id
// @access  Public
exports.getImageById = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);

    if (!image) {
      return res.status(404).json({
        success: false,
        error: 'Image not found'
      });
    }

    res.status(200).json({
      success: true,
      data: image
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Update image
// @route   PUT /api/images/:id
// @access  Private (Admin only)
exports.updateImage = async (req, res) => {
  try {
    let image = await Image.findById(req.params.id);

    if (!image) {
      return res.status(404).json({
        success: false,
        error: 'Image not found'
      });
    }

    const { title, description, category, featured } = req.body;
    
    // Update fields
    if (title) image.title = title;
    if (description) image.description = description;
    if (category) image.category = category;
    if (featured !== undefined) image.featured = featured === 'true';

    await image.save();

    res.status(200).json({
      success: true,
      data: image
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Delete image
// @route   DELETE /api/images/:id
// @access  Private (Admin only)
exports.deleteImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);

    if (!image) {
      return res.status(404).json({
        success: false,
        error: 'Image not found'
      });
    }

    // Delete image from Cloudinary
    await cloudinary.uploader.destroy(image.publicId);

    // Delete from database
    await image.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};
