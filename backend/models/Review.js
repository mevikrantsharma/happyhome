const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    service: {
      type: String,
      required: true,
      trim: true,
      enum: ['kitchen', 'bathroom', 'bedroom', 'living', 'full-house', 'exterior', 'other']
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000
    },
    ratings: {
      quality: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      },
      timeliness: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      },
      value: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      },
      overall: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      }
    },
    projectDetails: {
      type: String,
      trim: true,
      maxlength: 500
    },
    images: [
      {
        imageUrl: {
          type: String
        },
        caption: {
          type: String,
          trim: true
        }
      }
    ],
    location: {
      type: String,
      trim: true
    },
    featured: {
      type: Boolean,
      default: false
    },
    verified: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    adminResponse: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for average rating
reviewSchema.virtual('averageRating').get(function () {
  const { quality, timeliness, value, overall } = this.ratings;
  return ((quality + timeliness + value + overall) / 4).toFixed(1);
});

// Static method to get average ratings for a service
reviewSchema.statics.getServiceStats = async function (service) {
  const stats = await this.aggregate([
    {
      $match: { service, status: 'approved' }
    },
    {
      $group: {
        _id: '$service',
        avgQuality: { $avg: '$ratings.quality' },
        avgTimeliness: { $avg: '$ratings.timeliness' },
        avgValue: { $avg: '$ratings.value' },
        avgOverall: { $avg: '$ratings.overall' },
        count: { $sum: 1 }
      }
    }
  ]);

  return stats.length > 0 ? stats[0] : {
    avgQuality: 0,
    avgTimeliness: 0,
    avgValue: 0,
    avgOverall: 0,
    count: 0
  };
};

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
