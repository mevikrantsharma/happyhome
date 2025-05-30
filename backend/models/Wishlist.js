const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true,
      default: 'My Wishlist'
    },
    description: {
      type: String,
      trim: true
    },
    items: [
      {
        image: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Image',
          required: true
        },
        addedAt: {
          type: Date,
          default: Date.now
        },
        notes: {
          type: String,
          trim: true
        }
      }
    ],
    isDefault: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// When a user is created, automatically create a default wishlist
wishlistSchema.statics.createDefaultWishlist = async function(userId) {
  try {
    const defaultWishlist = new this({
      user: userId,
      name: 'My Wishlist',
      isDefault: true
    });
    
    return await defaultWishlist.save();
  } catch (error) {
    console.error('Error creating default wishlist:', error);
    throw error;
  }
};

module.exports = mongoose.model('Wishlist', wishlistSchema);
