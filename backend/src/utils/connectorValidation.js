const Joi = require('joi');

// Data connector validation schemas
const createConnectorSchema = Joi.object({
  userId: Joi.string().alphanum().min(3).max(50).required(),
  platform: Joi.string().valid('fi_money', 'zerodha').required(),
  syncInterval: Joi.number().integer().min(1).max(60).optional(),
  autoSync: Joi.boolean().optional(),
  accountType: Joi.string().valid('basic', 'premium', 'pro').optional(),
  dataTypes: Joi.array().items(
    Joi.string().valid('transactions', 'portfolio', 'profile', 'trades', 'analytics')
  ).min(1).optional(),
  sessionId: Joi.string().min(10).max(200).optional()
});

const updateSyncSettingsSchema = Joi.object({
  syncInterval: Joi.number().integer().min(1).max(60).optional(),
  dataTypes: Joi.array().items(
    Joi.string().valid('transactions', 'portfolio', 'profile', 'trades', 'analytics')
  ).min(1).optional(),
  autoSync: Joi.boolean().optional(),
  retryAttempts: Joi.number().integer().min(1).max(5).optional(),
  timeout: Joi.number().integer().min(5000).max(120000).optional(),
  enableNotifications: Joi.boolean().optional(),
  enableErrorAlerts: Joi.boolean().optional(),
  sessionId: Joi.string().min(10).max(200).optional()
}).min(1);

const manualSyncSchema = Joi.object({
  dataTypes: Joi.array().items(
    Joi.string().valid('transactions', 'portfolio', 'profile', 'trades', 'analytics')
  ).min(1).optional(),
  forceSync: Joi.boolean().optional(),
  fromDate: Joi.date().optional(),
  toDate: Joi.date().optional(),
  sessionId: Joi.string().min(10).max(200).optional()
});

const getConnectorsQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  platform: Joi.string().valid('fi_money', 'zerodha').optional(),
  status: Joi.string().valid('connected', 'disconnected', 'error', 'expired', 'connecting').optional(),
  fromDate: Joi.date().optional(),
  toDate: Joi.date().optional(),
  sortBy: Joi.string().valid('createdAt', 'updatedAt', 'connectedAt', 'lastSyncAt', 'platform').default('createdAt'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
  sessionId: Joi.string().min(10).max(200).optional()
});

const getStatusQuerySchema = Joi.object({
  platform: Joi.string().valid('fi_money', 'zerodha').optional(),
  status: Joi.string().valid('connected', 'disconnected', 'error', 'expired', 'connecting').optional(),
  fromDate: Joi.date().optional(),
  toDate: Joi.date().optional(),
  groupBy: Joi.string().valid('platform', 'status', 'date').optional(),
  sessionId: Joi.string().min(10).max(200).optional()
});

// Validation middleware
const validateRequest = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const details = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          details,
          timestamp: new Date().toISOString(),
          path: req.path
        }
      });
    }

    req[property] = value;
    next();
  };
};

module.exports = {
  createConnectorSchema,
  updateSyncSettingsSchema,
  manualSyncSchema,
  getConnectorsQuerySchema,
  getStatusQuerySchema,
  validateRequest
};