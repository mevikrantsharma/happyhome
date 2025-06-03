const Wishlist = require('../models/Wishlist');
const User = require('../models/User');
const Image = require('../models/Image');

// @desc    Get all wishlists for a user
// @route   GET /api/wishlists
// @access  Private
exports.getWishlists = async (req, res) => {
  try {
    const wishlists = await Wishlist.find({ user: req.user.id })
      .populate({
        path: 'items.image',
        select: 'title description imageUrl category'
      })
      .sort({ createdAt: -1 });

    // Filter out items with null images (deleted images)
    wishlists.forEach(wishlist => {
      if (wishlist.items && wishlist.items.length > 0) {
        wishlist.items = wishlist.items.filter(item => item.image !== null);
      }
    });

    res.status(200).json({
      success: true,
      count: wishlists.length,
      data: wishlists
    });
  } catch (error) {
    console.error('Error fetching wishlists:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Get a single wishlist
// @route   GET /api/wishlists/:id
// @access  Private
exports.getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findById(req.params.id)
      .populate({
        path: 'items.image',
        select: 'title description imageUrl category'
      });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        error: 'Wishlist not found'
      });
    }

    // Check if the wishlist belongs to the user
    if (wishlist.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this wishlist'
      });
    }

    // Filter out items with null images (deleted images)
    if (wishlist.items && wishlist.items.length > 0) {
      wishlist.items = wishlist.items.filter(item => item.image !== null);
    }

    res.status(200).json({
      success: true,
      data: wishlist
    });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Create a new wishlist
// @route   POST /api/wishlists
// @access  Private
exports.createWishlist = async (req, res) => {
  try {
    const { name, description } = req.body;

    const wishlist = new Wishlist({
      name,
      description,
      user: req.user.id
    });

    const savedWishlist = await wishlist.save();

    res.status(201).json({
      success: true,
      data: savedWishlist
    });
  } catch (error) {
    console.error('Error creating wishlist:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Add item to wishlist
// @route   POST /api/wishlists/:id/items
// @access  Private
exports.addItemToWishlist = async (req, res) => {
  try {
    const { imageId, notes } = req.body;

    // Check if image exists
    const image = await Image.findById(imageId);
    if (!image) {
      return res.status(404).json({
        success: false,
        error: 'Image not found'
      });
    }

    const wishlist = await Wishlist.findById(req.params.id);
    if (!wishlist) {
      return res.status(404).json({
        success: false,
        error: 'Wishlist not found'
      });
    }

    // Check if the wishlist belongs to the user
    if (wishlist.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to modify this wishlist'
      });
    }

    // Check if the image is already in the wishlist
    const isAlreadyAdded = wishlist.items.some(
      item => item.image.toString() === imageId
    );

    if (isAlreadyAdded) {
      return res.status(400).json({
        success: false,
        error: 'Image already in wishlist'
      });
    }

    // Add the item to the wishlist
    wishlist.items.push({
      image: imageId,
      notes
    });

    await wishlist.save();

    res.status(200).json({
      success: true,
      data: wishlist
    });
  } catch (error) {
    console.error('Error adding item to wishlist:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Remove item from wishlist
// @route   DELETE /api/wishlists/:id/items/:itemId
// @access  Private
exports.removeItemFromWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findById(req.params.id);

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        error: 'Wishlist not found'
      });
    }

    // Check if the wishlist belongs to the user
    if (wishlist.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to modify this wishlist'
      });
    }

    // Find the item index
    const itemIndex = wishlist.items.findIndex(
      item => item._id.toString() === req.params.itemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Item not found in wishlist'
      });
    }

    // Remove the item
    wishlist.items.splice(itemIndex, 1);
    await wishlist.save();

    res.status(200).json({
      success: true,
      data: wishlist
    });
  } catch (error) {
    console.error('Error removing item from wishlist:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Update wishlist
// @route   PUT /api/wishlists/:id
// @access  Private
exports.updateWishlist = async (req, res) => {
  try {
    const { name, description } = req.body;

    const wishlist = await Wishlist.findById(req.params.id);

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        error: 'Wishlist not found'
      });
    }

    // Check if the wishlist belongs to the user
    if (wishlist.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this wishlist'
      });
    }

    wishlist.name = name || wishlist.name;
    wishlist.description = description !== undefined ? description : wishlist.description;

    await wishlist.save();

    res.status(200).json({
      success: true,
      data: wishlist
    });
  } catch (error) {
    console.error('Error updating wishlist:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Delete wishlist
// @route   DELETE /api/wishlists/:id
// @access  Private
exports.deleteWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findById(req.params.id);

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        error: 'Wishlist not found'
      });
    }

    // Check if the wishlist belongs to the user
    if (wishlist.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete this wishlist'
      });
    }

    // Don't allow deletion of default wishlist
    if (wishlist.isDefault) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete default wishlist'
      });
    }

    await wishlist.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error deleting wishlist:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Quick add to default wishlist
// @route   POST /api/wishlists/quick-add
// @access  Private
exports.quickAddToWishlist = async (req, res) => {
  try {
    const { imageId, notes } = req.body;

    // Check if image exists
    const image = await Image.findById(imageId);
    if (!image) {
      return res.status(404).json({
        success: false,
        error: 'Image not found'
      });
    }

    // Find user's default wishlist
    let defaultWishlist = await Wishlist.findOne({ 
      user: req.user.id,
      isDefault: true 
    });

    // If no default wishlist exists, create one
    if (!defaultWishlist) {
      defaultWishlist = await Wishlist.createDefaultWishlist(req.user.id);
    }

    // Check if the image is already in the wishlist
    const isAlreadyAdded = defaultWishlist.items.some(
      item => item.image.toString() === imageId
    );

    if (isAlreadyAdded) {
      return res.status(400).json({
        success: false,
        error: 'Image already in wishlist'
      });
    }

    // Add the item to the wishlist
    defaultWishlist.items.push({
      image: imageId,
      notes
    });

    await defaultWishlist.save();

    res.status(200).json({
      success: true,
      data: defaultWishlist
    });
  } catch (error) {
    console.error('Error with quick add to wishlist:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};
