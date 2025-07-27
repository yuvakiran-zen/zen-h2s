const rateLimit = require('express-rate-limit');
const config = require('../config/environment');
const { ERROR_CODES, HTTP_STATUS } = require('../utils/constants');

// General rate limiter
const generalLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: {
    error: {
      code: ERROR_CODES.RATE_LIMIT_EXCEEDED,
      message: 'Too many requests from this IP, please try again later.',
      timestamp: new Date().toISOString()
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// User operations rate limiter (more restrictive)
const userOperationsLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 requests per minute
  message: {
    error: {
      code: ERROR_CODES.RATE_LIMIT_EXCEEDED,
      message: 'Too many user operations from this IP, please try again later.',
      timestamp: new Date().toISOString()
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Create user rate limiter (most restrictive)
const createUserLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // 5 user creations per minute
  message: {
    error: {
      code: ERROR_CODES.RATE_LIMIT_EXCEEDED,
      message: 'Too many user creation attempts from this IP, please try again later.',
      timestamp: new Date().toISOString()
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  generalLimiter,
  userOperationsLimiter,
  createUserLimiter
};