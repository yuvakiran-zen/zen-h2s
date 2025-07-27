const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const config = require('./environment');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Financial APIs - User Management System',
      version: '1.0.0',
      description: 'A comprehensive RESTful API system for user management and financial data connector tracking built with Node.js, Express.js, and MongoDB.',
      contact: {
        name: 'API Support',
        email: 'support@financialapis.com'
      },
      license: {
        name: 'ISC',
        url: 'https://opensource.org/licenses/ISC'
      }
    },
    servers: [
      {
        url: `http://localhost:${config.port}`,
        description: 'Development server'
      },
      {
        url: 'https://api.financialplatform.com',
        description: 'Production server'
      }
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          required: ['userId', 'email'],
          properties: {
            id: {
              type: 'string',
              description: 'MongoDB ObjectId',
              example: '507f1f77bcf86cd799439011'
            },
            userId: {
              type: 'string',
              description: 'Unique user identifier',
              example: 'user_12345',
              minLength: 3,
              maxLength: 50
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
              example: 'john.doe@example.com'
            },
            profile: {
              type: 'object',
              properties: {
                firstName: {
                  type: 'string',
                  description: 'User first name',
                  example: 'John',
                  maxLength: 50
                },
                lastName: {
                  type: 'string',
                  description: 'User last name',
                  example: 'Doe',
                  maxLength: 50
                },
                dateOfBirth: {
                  type: 'string',
                  format: 'date',
                  description: 'User date of birth',
                  example: '1990-05-15'
                },
                phoneNumber: {
                  type: 'string',
                  description: 'User phone number',
                  example: '+91-9876543210',
                  pattern: '^\\+?[1-9]\\d{1,14}$'
                },
                city: {
                  type: 'string',
                  description: 'User city',
                  example: 'Bangalore',
                  maxLength: 100
                },
                country: {
                  type: 'string',
                  description: 'User country',
                  example: 'India',
                  maxLength: 100
                },
                income: {
                  type: 'number',
                  description: 'User annual income',
                  example: 1500000,
                  minimum: 0
                },
                riskTolerance: {
                  type: 'string',
                  enum: ['low', 'medium', 'high'],
                  description: 'User risk tolerance level',
                  example: 'medium'
                }
              }
            },
            preferences: {
              type: 'object',
              properties: {
                currency: {
                  type: 'string',
                  description: 'Preferred currency',
                  example: 'INR',
                  default: 'INR',
                  maxLength: 3
                },
                language: {
                  type: 'string',
                  description: 'Preferred language',
                  example: 'en',
                  default: 'en',
                  maxLength: 5
                },
                notifications: {
                  type: 'object',
                  properties: {
                    email: {
                      type: 'boolean',
                      description: 'Email notifications enabled',
                      example: true,
                      default: true
                    },
                    sms: {
                      type: 'boolean',
                      description: 'SMS notifications enabled',
                      example: false,
                      default: false
                    },
                    push: {
                      type: 'boolean',
                      description: 'Push notifications enabled',
                      example: true,
                      default: true
                    }
                  }
                }
              }
            },
            status: {
              type: 'string',
              enum: ['active', 'inactive', 'suspended'],
              description: 'User account status',
              example: 'active',
              default: 'active'
            },
            emailVerified: {
              type: 'boolean',
              description: 'Email verification status',
              example: false,
              default: false
            },
            metadata: {
              type: 'object',
              properties: {
                source: {
                  type: 'string',
                  description: 'User acquisition source',
                  example: 'web_signup'
                },
                referralCode: {
                  type: 'string',
                  description: 'Referral code used',
                  example: 'REF123'
                },
                tags: {
                  type: 'array',
                  items: {
                    type: 'string'
                  },
                  description: 'User tags',
                  example: ['premium', 'early_adopter']
                }
              }
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'User creation timestamp',
              example: '2024-01-15T10:30:00Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'User last update timestamp',
              example: '2024-01-15T10:30:00Z'
            }
          }
        },
        CreateUserRequest: {
          type: 'object',
          required: ['userId', 'email'],
          properties: {
            userId: {
              type: 'string',
              description: 'Unique user identifier',
              example: 'user_12345',
              minLength: 3,
              maxLength: 50
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
              example: 'john.doe@example.com'
            },
            firstName: {
              type: 'string',
              description: 'User first name',
              example: 'John',
              maxLength: 50
            },
            lastName: {
              type: 'string',
              description: 'User last name',
              example: 'Doe',
              maxLength: 50
            },
            dateOfBirth: {
              type: 'string',
              format: 'date',
              description: 'User date of birth',
              example: '1990-05-15'
            },
            phoneNumber: {
              type: 'string',
              description: 'User phone number',
              example: '+91-9876543210'
            },
            city: {
              type: 'string',
              description: 'User city',
              example: 'Bangalore'
            },
            country: {
              type: 'string',
              description: 'User country',
              example: 'India'
            },
            income: {
              type: 'number',
              description: 'User annual income',
              example: 1500000,
              minimum: 0
            },
            riskTolerance: {
              type: 'string',
              enum: ['low', 'medium', 'high'],
              description: 'User risk tolerance level',
              example: 'medium'
            },
            source: {
              type: 'string',
              description: 'User acquisition source',
              example: 'web_signup'
            },
            referralCode: {
              type: 'string',
              description: 'Referral code used',
              example: 'REF123'
            },
            tags: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'User tags',
              example: ['premium', 'early_adopter']
            }
          }
        },
        UpdateProfileRequest: {
          type: 'object',
          minProperties: 1,
          properties: {
            firstName: {
              type: 'string',
              description: 'User first name',
              example: 'John',
              maxLength: 50
            },
            lastName: {
              type: 'string',
              description: 'User last name',
              example: 'Smith',
              maxLength: 50
            },
            dateOfBirth: {
              type: 'string',
              format: 'date',
              description: 'User date of birth',
              example: '1990-05-15'
            },
            phoneNumber: {
              type: 'string',
              description: 'User phone number',
              example: '+91-9876543210'
            },
            city: {
              type: 'string',
              description: 'User city',
              example: 'Mumbai'
            },
            country: {
              type: 'string',
              description: 'User country',
              example: 'India'
            },
            income: {
              type: 'number',
              description: 'User annual income',
              example: 1800000,
              minimum: 0
            },
            riskTolerance: {
              type: 'string',
              enum: ['low', 'medium', 'high'],
              description: 'User risk tolerance level',
              example: 'high'
            }
          }
        },
        UpdatePreferencesRequest: {
          type: 'object',
          minProperties: 1,
          properties: {
            currency: {
              type: 'string',
              description: 'Preferred currency',
              example: 'USD',
              maxLength: 3
            },
            language: {
              type: 'string',
              description: 'Preferred language',
              example: 'hi',
              maxLength: 5
            },
            notifications: {
              type: 'object',
              properties: {
                email: {
                  type: 'boolean',
                  description: 'Email notifications enabled',
                  example: false
                },
                sms: {
                  type: 'boolean',
                  description: 'SMS notifications enabled',
                  example: true
                },
                push: {
                  type: 'boolean',
                  description: 'Push notifications enabled',
                  example: true
                }
              }
            }
          }
        },
        UserListResponse: {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              properties: {
                users: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/User'
                  }
                },
                pagination: {
                  type: 'object',
                  properties: {
                    currentPage: {
                      type: 'integer',
                      example: 1
                    },
                    totalPages: {
                      type: 'integer',
                      example: 5
                    },
                    totalUsers: {
                      type: 'integer',
                      example: 100
                    },
                    hasNext: {
                      type: 'boolean',
                      example: true
                    },
                    hasPrev: {
                      type: 'boolean',
                      example: false
                    },
                    limit: {
                      type: 'integer',
                      example: 20
                    }
                  }
                }
              }
            }
          }
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Operation completed successfully'
            },
            data: {
              type: 'object'
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            error: {
              type: 'object',
              properties: {
                code: {
                  type: 'string',
                  example: 'VALIDATION_ERROR'
                },
                message: {
                  type: 'string',
                  example: 'Validation failed'
                },
                details: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      field: {
                        type: 'string',
                        example: 'email'
                      },
                      message: {
                        type: 'string',
                        example: 'Invalid email format'
                      }
                    }
                  }
                },
                timestamp: {
                  type: 'string',
                  format: 'date-time',
                  example: '2024-01-15T10:30:00Z'
                },
                path: {
                  type: 'string',
                  example: '/api/v1/users'
                }
              }
            }
          }
        },
        HealthResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'OK'
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-15T10:30:00Z'
            },
            uptime: {
              type: 'number',
              example: 3600.5
            },
            environment: {
              type: 'string',
              example: 'development'
            }
          }
        }
      },
      responses: {
        BadRequest: {
          description: 'Bad request - validation error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              }
            }
          }
        },
        NotFound: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              }
            }
          }
        },
        Conflict: {
          description: 'Resource already exists',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              }
            }
          }
        },
        TooManyRequests: {
          description: 'Rate limit exceeded',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              }
            }
          }
        },
        InternalServerError: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              }
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Users',
        description: 'User management operations'
      },
      {
        name: 'Health',
        description: 'System health check'
      }
    ]
  },
  apis: ['./src/routes/*.js', './src/server.js']
};

const specs = swaggerJsdoc(options);

module.exports = {
  specs,
  swaggerUi
};