const Joi = require('joi');

// User validation schemas
const createUserSchema = Joi.object({
  userId: Joi.string().alphanum().min(3).max(50).required(),
  email: Joi.string().email().required(),
  firstName: Joi.string().min(1).max(50).optional(),
  lastName: Joi.string().min(1).max(50).optional(),
  dateOfBirth: Joi.date().max('now').optional(),
  phoneNumber: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).optional(),
  city: Joi.string().min(1).max(100).optional(),
  country: Joi.string().min(1).max(100).optional(),
  income: Joi.number().min(0).optional(),
  riskTolerance: Joi.string().valid('low', 'medium', 'high').optional(),
  source: Joi.string().max(100).optional(),
  referralCode: Joi.string().max(50).optional(),
  tags: Joi.array().items(Joi.string().max(50)).optional()
});

const updateProfileSchema = Joi.object({
  firstName: Joi.string().min(1).max(50).optional(),
  lastName: Joi.string().min(1).max(50).optional(),
  dateOfBirth: Joi.date().max('now').optional(),
  phoneNumber: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).optional(),
  city: Joi.string().min(1).max(100).optional(),
  country: Joi.string().min(1).max(100).optional(),
  income: Joi.number().min(0).optional(),
  riskTolerance: Joi.string().valid('low', 'medium', 'high').optional()
}).min(1);

const updatePreferencesSchema = Joi.object({
  currency: Joi.string().length(3).uppercase().optional(),
  language: Joi.string().min(2).max(5).lowercase().optional(),
  notifications: Joi.object({
    email: Joi.boolean().optional(),
    sms: Joi.boolean().optional(),
    push: Joi.boolean().optional()
  }).optional()
}).min(1);

const getUsersQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  status: Joi.string().valid('active', 'inactive', 'suspended').optional(),
  city: Joi.string().max(100).optional(),
  country: Joi.string().max(100).optional(),
  riskTolerance: Joi.string().valid('low', 'medium', 'high').optional(),
  sortBy: Joi.string().valid('createdAt', 'updatedAt', 'userId', 'email').default('createdAt'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc')
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
  createUserSchema,
  updateProfileSchema,
  updatePreferencesSchema,
  getUsersQuerySchema,
  validateRequest
};