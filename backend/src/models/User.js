const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  profile: {
    firstName: {
      type: String,
      trim: true
    },
    lastName: {
      type: String,
      trim: true
    },
    dateOfBirth: {
      type: Date
    },
    phoneNumber: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      trim: true
    },
    country: {
      type: String,
      trim: true
    },
    income: {
      type: Number,
      min: 0
    },
    riskTolerance: {
      type: String,
      enum: ['low', 'medium', 'high'],
      lowercase: true
    }
  },
  preferences: {
    currency: {
      type: String,
      default: 'INR',
      uppercase: true
    },
    language: {
      type: String,
      default: 'en',
      lowercase: true
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      sms: {
        type: Boolean,
        default: false
      },
      push: {
        type: Boolean,
        default: true
      }
    }
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active',
    lowercase: true
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  metadata: {
    source: {
      type: String,
      trim: true
    },
    referralCode: {
      type: String,
      trim: true
    },
    tags: [{
      type: String,
      trim: true
    }]
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Indexes for better performance
userSchema.index({ userId: 1 });
userSchema.index({ email: 1 });
userSchema.index({ 'profile.city': 1 });
userSchema.index({ 'profile.riskTolerance': 1 });
userSchema.index({ status: 1 });
userSchema.index({ createdAt: -1 });

module.exports = mongoose.model('User', userSchema);