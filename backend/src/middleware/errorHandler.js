const { ERROR_CODES, HTTP_STATUS } = require('../utils/constants');

const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const details = Object.values(err.errors).map(error => ({
      field: error.path,
      message: error.message
    }));

    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      error: {
        code: ERROR_CODES.VALIDATION_ERROR,
        message: 'Validation failed',
        details,
        timestamp: new Date().toISOString(),
        path: req.path
      }
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    
    return res.status(HTTP_STATUS.CONFLICT).json({
      error: {
        code: field === 'email' ? ERROR_CODES.EMAIL_ALREADY_EXISTS : ERROR_CODES.USER_ALREADY_EXISTS,
        message: `${field} '${value}' already exists`,
        timestamp: new Date().toISOString(),
        path: req.path
      }
    });
  }

  // Mongoose cast error
  if (err.name === 'CastError') {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      error: {
        code: ERROR_CODES.VALIDATION_ERROR,
        message: 'Invalid ID format',
        timestamp: new Date().toISOString(),
        path: req.path
      }
    });
  }

  // Default server error
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    error: {
      code: ERROR_CODES.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
      timestamp: new Date().toISOString(),
      path: req.path
    }
  });
};

module.exports = errorHandler;