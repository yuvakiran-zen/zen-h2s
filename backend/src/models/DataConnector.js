const mongoose = require('mongoose');

const syncHistorySchema = new mongoose.Schema({
  syncedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['success', 'failed', 'partial'],
    required: true
  },
  recordsCount: {
    type: Number,
    default: 0
  },
  errorMessage: {
    type: String
  },
  dataTypes: [{
    type: String,
    enum: ['transactions', 'portfolio', 'profile', 'trades']
  }],
  duration: {
    type: Number, // in milliseconds
    default: 0
  },
  sessionId: {
    type: String,
    trim: true
  }
}, { _id: false });

const errorSchema = new mongoose.Schema({
  errorCode: {
    type: String,
    required: true
  },
  errorMessage: {
    type: String,
    required: true
  },
  occurredAt: {
    type: Date,
    default: Date.now
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  resolved: {
    type: Boolean,
    default: false
  },
  sessionId: {
    type: String,
    trim: true
  }
}, { _id: false });

const dataConnectorSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    trim: true
  },
  platform: {
    type: String,
    enum: ['fi_money', 'zerodha'],
    required: true,
    lowercase: true
  },
  connectionStatus: {
    type: String,
    enum: ['connected', 'disconnected', 'error', 'expired', 'connecting'],
    default: 'disconnected',
    lowercase: true
  },
  sessionId: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  connectionDetails: {
    connectedAt: {
      type: Date
    },
    disconnectedAt: {
      type: Date
    },
    sessionDuration: {
      type: Number, // in minutes
      default: 0
    },
    lastSyncAt: {
      type: Date
    },
    syncInterval: {
      type: Number,
      default: 5, // minutes
      min: 1,
      max: 60
    },
    autoSync: {
      type: Boolean,
      default: true
    },
    nextSyncAt: {
      type: Date
    },
    sessionId: {
      type: String,
      trim: true
    }
  },
  metadata: {
    platformUserId: {
      type: String,
      trim: true
    },
    accountType: {
      type: String,
      enum: ['basic', 'premium', 'pro'],
      default: 'basic',
      lowercase: true
    },
    dataTypes: [{
      type: String,
      enum: ['transactions', 'portfolio', 'profile', 'trades', 'analytics'],
      lowercase: true
    }],
    platformVersion: {
      type: String
    },
    apiVersion: {
      type: String
    },
    sessionId: {
      type: String,
      trim: true
    }
  },
  syncHistory: [syncHistorySchema],
  errors: [errorSchema],
  statistics: {
    totalSyncs: {
      type: Number,
      default: 0
    },
    successfulSyncs: {
      type: Number,
      default: 0
    },
    failedSyncs: {
      type: Number,
      default: 0
    },
    totalRecordsSynced: {
      type: Number,
      default: 0
    },
    averageSyncDuration: {
      type: Number,
      default: 0
    },
    lastSuccessfulSync: {
      type: Date
    },
    sessionId: {
      type: String,
      trim: true
    }
  },
  settings: {
    retryAttempts: {
      type: Number,
      default: 3,
      min: 1,
      max: 5
    },
    timeout: {
      type: Number,
      default: 30000, // 30 seconds in milliseconds
      min: 5000,
      max: 120000
    },
    enableNotifications: {
      type: Boolean,
      default: true
    },
    enableErrorAlerts: {
      type: Boolean,
      default: true
    },
    sessionId: {
      type: String,
      trim: true
    }
  },
  // Global sessionId for tracking operations across the connector lifecycle
  globalSessionId: {
    type: String,
    required: true,
    trim: true,
    index: true
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

// Compound indexes for better performance
dataConnectorSchema.index({ userId: 1, platform: 1 }, { unique: true });
dataConnectorSchema.index({ sessionId: 1 });
dataConnectorSchema.index({ globalSessionId: 1 });
dataConnectorSchema.index({ connectionStatus: 1 });
dataConnectorSchema.index({ 'connectionDetails.connectedAt': -1 });
dataConnectorSchema.index({ 'connectionDetails.lastSyncAt': -1 });
dataConnectorSchema.index({ 'connectionDetails.nextSyncAt': 1 });
dataConnectorSchema.index({ platform: 1, connectionStatus: 1 });
dataConnectorSchema.index({ createdAt: -1 });
dataConnectorSchema.index({ userId: 1, globalSessionId: 1 });

// Virtual for success rate calculation
dataConnectorSchema.virtual('successRate').get(function() {
  if (this.statistics.totalSyncs === 0) return 0;
  return ((this.statistics.successfulSyncs / this.statistics.totalSyncs) * 100).toFixed(2);
});

// Pre-save middleware to update statistics
dataConnectorSchema.pre('save', function(next) {
  if (this.isModified('syncHistory')) {
    const stats = this.statistics;
    stats.totalSyncs = this.syncHistory.length;
    stats.successfulSyncs = this.syncHistory.filter(sync => sync.status === 'success').length;
    stats.failedSyncs = this.syncHistory.filter(sync => sync.status === 'failed').length;
    stats.totalRecordsSynced = this.syncHistory.reduce((total, sync) => total + (sync.recordsCount || 0), 0);
    
    const successfulSyncs = this.syncHistory.filter(sync => sync.status === 'success');
    if (successfulSyncs.length > 0) {
      stats.averageSyncDuration = successfulSyncs.reduce((total, sync) => total + (sync.duration || 0), 0) / successfulSyncs.length;
      stats.lastSuccessfulSync = successfulSyncs[successfulSyncs.length - 1].syncedAt;
    }
  }
  next();
});

module.exports = mongoose.model('DataConnector', dataConnectorSchema);