# User & Data Connector APIs - Product Requirements Document

## 1. Project Overview

### 1.1 Purpose
Design and implement RESTful APIs for user management and financial data connector tracking using Node.js and MongoDB. This system will handle user profile management and monitor connections to financial platforms (Fi Money and Zerodha).

### 1.2 Scope
- User profile management and data storage
- Data connector session tracking for Fi Money and Zerodha
- Connection status monitoring and session management
- User data persistence and retrieval

### 1.3 Technical Stack
- **Backend**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Validation**: Joi or express-validator
- **Security**: helmet, cors

## 2. Database Schema Design

### 2.1 User Collection Schema

```javascript
const userSchema = {
  _id: ObjectId,
  userId: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  profile: {
    firstName: String,
    lastName: String,
    dateOfBirth: Date,
    phoneNumber: String,
    city: String,
    country: String,
    income: Number,
    riskTolerance: {
      type: String,
      enum: ['low', 'medium', 'high']
    }
  },
  preferences: {
    currency: {
      type: String,
      default: 'INR'
    },
    language: {
      type: String,
      default: 'en'
    },
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      push: { type: Boolean, default: true }
    }
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  metadata: {
    source: String,
    referralCode: String,
    tags: [String]
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

### 2.2 Data Connector Collection Schema

```javascript
const dataConnectorSchema = {
  _id: ObjectId,
  userId: {
    type: String,
    required: true
  },
  platform: {
    type: String,
    enum: ['fi_money', 'zerodha'],
    required: true
  },
  connectionStatus: {
    type: String,
    enum: ['connected', 'disconnected', 'error', 'expired'],
    default: 'disconnected'
  },
  sessionId: {
    type: String,
    unique: true,
    sparse: true
  },
  connectionDetails: {
    connectedAt: Date,
    disconnectedAt: Date,
    sessionDuration: Number, // in minutes
    lastSyncAt: Date,
    syncInterval: {
      type: Number,
      default: 5 // minutes
    }
  },
  credentials: {
    // Encrypted storage of platform-specific credentials
    encryptedToken: String,
    tokenExpiresAt: Date,
    refreshToken: String
  },
  metadata: {
    platformUserId: String,
    accountType: String,
    permissions: [String],
    dataTypes: [String] // ['transactions', 'portfolio', 'profile']
  },
  syncHistory: [{
    syncedAt: Date,
    status: {
      type: String,
      enum: ['success', 'failed', 'partial']
    },
    recordsCount: Number,
    errorMessage: String
  }],
  errors: [{
    errorCode: String,
    errorMessage: String,
    occurredAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

## 3. API Specifications

### 3.1 User APIs

#### 3.1.1 User Management Endpoints

**POST /api/v1/users**
```json
{
  "method": "POST",
  "endpoint": "/api/v1/users",
  "description": "Create a new user",
  "requestBody": {
    "userId": "user_12345",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "+91-9876543210",
    "city": "Bangalore",
    "country": "India"
  },
  "responses": {
    "201": {
      "message": "User created successfully",
      "data": {
        "id": "64a1b2c3d4e5f6789",
        "userId": "user_12345",
        "email": "user@example.com",
        "profile": {
          "firstName": "John",
          "lastName": "Doe"
        },
        "status": "active"
      }
    },
    "400": {
      "error": "Validation error",
      "details": ["Email already exists"]
    }
  }
}
```

**GET /api/v1/users/{userId}**
```json
{
  "method": "GET",
  "endpoint": "/api/v1/users/{userId}",
  "description": "Get user by userId",
  "responses": {
    "200": {
      "data": {
        "id": "64a1b2c3d4e5f6789",
        "userId": "user_12345",
        "email": "user@example.com",
        "profile": {
          "firstName": "John",
          "lastName": "Doe",
          "dateOfBirth": "1990-01-01",
          "phoneNumber": "+91-9876543210",
          "city": "Bangalore",
          "country": "India",
          "income": 1500000,
          "riskTolerance": "medium"
        },
        "preferences": {
          "currency": "INR",
          "language": "en",
          "notifications": {
            "email": true,
            "sms": false,
            "push": true
          }
        },
        "status": "active",
        "emailVerified": true,
        "createdAt": "2024-01-01T00:00:00Z"
      }
    },
    "404": {
      "error": "User not found"
    }
  }
}
```

**PUT /api/v1/users/{userId}/profile**
```json
{
  "method": "PUT",
  "endpoint": "/api/v1/users/{userId}/profile",
  "description": "Update user profile",
  "requestBody": {
    "firstName": "John",
    "lastName": "Smith",
    "dateOfBirth": "1990-01-01",
    "phoneNumber": "+91-9876543210",
    "city": "Mumbai",
    "income": 1800000,
    "riskTolerance": "high"
  },
  "responses": {
    "200": {
      "message": "Profile updated successfully",
      "data": {
        "userId": "user_12345",
        "profile": {
          "firstName": "John",
          "lastName": "Smith",
          "city": "Mumbai",
          "income": 1800000,
          "riskTolerance": "high"
        }
      }
    }
  }
}
```

**PUT /api/v1/users/{userId}/preferences**
```json
{
  "method": "PUT",
  "endpoint": "/api/v1/users/{userId}/preferences",
  "description": "Update user preferences",
  "requestBody": {
    "currency": "USD",
    "language": "hi",
    "notifications": {
      "email": false,
      "sms": true,
      "push": true
    }
  },
  "responses": {
    "200": {
      "message": "Preferences updated successfully",
      "data": {
        "userId": "user_12345",
        "preferences": {
          "currency": "USD",
          "language": "hi",
          "notifications": {
            "email": false,
            "sms": true,
            "push": true
          }
        }
      }
    }
  }
}
```

**DELETE /api/v1/users/{userId}**
```json
{
  "method": "DELETE",
  "endpoint": "/api/v1/users/{userId}",
  "description": "Delete user account",
  "responses": {
    "200": {
      "message": "User deleted successfully"
    },
    "404": {
      "error": "User not found"
    }
  }
}
```

**GET /api/v1/users**
```json
{
  "method": "GET",
  "endpoint": "/api/v1/users",
  "description": "Get users with pagination and filters",
  "queryParameters": {
    "page": 1,
    "limit": 20,
    "status": "active",
    "city": "Bangalore",
    "riskTolerance": "medium"
  },
  "responses": {
    "200": {
      "data": {
        "users": [
          {
            "userId": "user_12345",
            "email": "user@example.com",
            "profile": {},
            "status": "active",
            "createdAt": "2024-01-01T00:00:00Z"
          }
        ],
        "pagination": {
          "currentPage": 1,
          "totalPages": 5,
          "totalUsers": 100,
          "hasNext": true,
          "hasPrev": false
        }
      }
    }
  }
}
```

### 3.2 Data Connector APIs

#### 3.2.1 Connection Management

**POST /api/v1/connectors**
```json
{
  "method": "POST",
  "endpoint": "/api/v1/connectors",
  "description": "Connect to a financial platform",
  "requestBody": {
    "userId": "user_12345",
    "platform": "fi_money",
    "credentials": {
      "username": "user123",
      "password": "platformPassword",
      "apiKey": "platform_api_key"
    },
    "permissions": ["transactions", "portfolio", "profile"]
  },
  "responses": {
    "201": {
      "message": "Connected successfully",
      "data": {
        "id": "64a1b2c3d4e5f6789",
        "userId": "user_12345",
        "platform": "fi_money",
        "sessionId": "sess_abc123xyz",
        "connectionStatus": "connected",
        "connectedAt": "2024-01-15T10:30:00Z",
        "permissions": ["transactions", "portfolio"],
        "syncInterval": 5
      }
    },
    "400": {
      "error": "Invalid credentials"
    },
    "409": {
      "error": "Already connected to this platform"
    }
  }
}
```

**DELETE /api/v1/connectors/{connectorId}**
```json
{
  "method": "DELETE",
  "endpoint": "/api/v1/connectors/{connectorId}",
  "description": "Disconnect from a financial platform",
  "responses": {
    "200": {
      "message": "Disconnected successfully",
      "data": {
        "platform": "fi_money",
        "disconnectedAt": "2024-01-15T11:30:00Z",
        "sessionDuration": 60
      }
    }
  }
}
```

#### 3.2.2 Connection Status & Monitoring

**GET /api/v1/connectors/user/{userId}**
```json
{
  "method": "GET",
  "endpoint": "/api/v1/connectors/user/{userId}",
  "description": "Get all user's platform connections",
  "responses": {
    "200": {
      "data": {
        "connectors": [
          {
            "id": "64a1b2c3d4e5f6789",
            "platform": "fi_money",
            "connectionStatus": "connected",
            "sessionId": "sess_abc123xyz",
            "connectedAt": "2024-01-15T10:30:00Z",
            "lastSyncAt": "2024-01-15T11:25:00Z",
            "sessionDuration": 55,
            "syncInterval": 5,
            "permissions": ["transactions", "portfolio"],
            "accountType": "premium"
          },
          {
            "id": "64a1b2c3d4e5f6790",
            "platform": "zerodha",
            "connectionStatus": "disconnected",
            "connectedAt": "2024-01-14T09:00:00Z",
            "disconnectedAt": "2024-01-14T17:30:00Z",
            "sessionDuration": 510,
            "permissions": ["portfolio", "trades"]
          }
        ],
        "totalConnectors": 2,
        "activeConnections": 1
      }
    }
  }
}
```

**GET /api/v1/connectors/{connectorId}**
```json
{
  "method": "GET",
  "endpoint": "/api/v1/connectors/{connectorId}",
  "description": "Get specific connector details",
  "responses": {
    "200": {
      "data": {
        "id": "64a1b2c3d4e5f6789",
        "userId": "user_12345",
        "platform": "fi_money",
        "connectionStatus": "connected",
        "sessionId": "sess_abc123xyz",
        "connectionDetails": {
          "connectedAt": "2024-01-15T10:30:00Z",
          "lastSyncAt": "2024-01-15T11:25:00Z",
          "sessionDuration": 55,
          "syncInterval": 5
        },
        "metadata": {
          "platformUserId": "fi_user_123",
          "accountType": "premium",
          "permissions": ["transactions", "portfolio"],
          "dataTypes": ["transactions", "portfolio", "profile"]
        },
        "syncHistory": [
          {
            "syncedAt": "2024-01-15T11:25:00Z",
            "status": "success",
            "recordsCount": 150
          },
          {
            "syncedAt": "2024-01-15T11:20:00Z",
            "status": "failed",
            "errorMessage": "Rate limit exceeded"
          }
        ]
      }
    }
  }
}
```

**GET /api/v1/connectors/user/{userId}/platform/{platform}**
```json
{
  "method": "GET",
  "endpoint": "/api/v1/connectors/user/{userId}/platform/{platform}",
  "description": "Get connector by user and platform (fi_money or zerodha)",
  "responses": {
    "200": {
      "data": {
        "connector": {
          "id": "64a1b2c3d4e5f6789",
          "userId": "user_12345",
          "platform": "fi_money",
          "connectionStatus": "connected",
          "sessionId": "sess_abc123xyz",
          "connectedAt": "2024-01-15T10:30:00Z",
          "sessionDuration": 55
        }
      }
    },
    "404": {
      "error": "No connection found for this platform"
    }
  }
}
```

**GET /api/v1/connectors/status**
```json
{
  "method": "GET",
  "endpoint": "/api/v1/connectors/status",
  "description": "Get connection status summary across all users",
  "queryParameters": {
    "platform": "fi_money",
    "status": "connected",
    "fromDate": "2024-01-01",
    "toDate": "2024-01-31"
  },
  "responses": {
    "200": {
      "data": {
        "summary": {
          "totalConnections": 150,
          "activeConnections": 120,
          "disconnectedConnections": 30,
          "errorConnections": 0
        },
        "byPlatform": {
          "fi_money": {
            "total": 80,
            "active": 70,
            "disconnected": 10
          },
          "zerodha": {
            "total": 70,
            "active": 50,
            "disconnected": 20
          }
        }
      }
    }
  }
}
```

#### 3.2.3 Session Management

**PUT /api/v1/connectors/{connectorId}/refresh-session**
```json
{
  "method": "PUT",
  "endpoint": "/api/v1/connectors/{connectorId}/refresh-session",
  "description": "Refresh platform session",
  "responses": {
    "200": {
      "message": "Session refreshed successfully",
      "data": {
        "sessionId": "sess_new123xyz",
        "expiresAt": "2024-01-15T23:30:00Z"
      }
    }
  }
}
```

**GET /api/v1/connectors/{connectorId}/sync-status**
```json
{
  "method": "GET",
  "endpoint": "/api/v1/connectors/{connectorId}/sync-status",
  "description": "Get sync status and history",
  "responses": {
    "200": {
      "data": {
        "lastSyncAt": "2024-01-15T11:25:00Z",
        "nextSyncAt": "2024-01-15T11:30:00Z",
        "syncInterval": 5,
        "syncHistory": [
          {
            "syncedAt": "2024-01-15T11:25:00Z",
            "status": "success",
            "recordsCount": 150
          }
        ],
        "totalSyncs": 48,
        "successfulSyncs": 46,
        "failedSyncs": 2,
        "successRate": 95.8
      }
    }
  }
}
```

**PUT /api/v1/connectors/{connectorId}/sync-settings**
```json
{
  "method": "PUT",
  "endpoint": "/api/v1/connectors/{connectorId}/sync-settings",
  "description": "Update sync settings",
  "requestBody": {
    "syncInterval": 10,
    "dataTypes": ["transactions", "portfolio"],
    "autoSync": true
  },
  "responses": {
    "200": {
      "message": "Sync settings updated successfully",
      "data": {
        "syncInterval": 10,
        "dataTypes": ["transactions", "portfolio"],
        "autoSync": true
      }
    }
  }
}
```

**POST /api/v1/connectors/{connectorId}/sync**
```json
{
  "method": "POST",
  "endpoint": "/api/v1/connectors/{connectorId}/sync",
  "description": "Trigger manual sync",
  "requestBody": {
    "dataTypes": ["transactions"],
    "forceSync": true
  },
  "responses": {
    "200": {
      "message": "Sync initiated successfully",
      "data": {
        "syncId": "sync_xyz789",
        "status": "in_progress",
        "estimatedDuration": "2-5 minutes"
      }
    }
  }
}
```

## 4. Error Handling

### 4.1 HTTP Status Codes
- **200**: Success
- **201**: Created
- **400**: Bad Request (validation errors)
- **404**: Not Found
- **409**: Conflict (duplicate resource)
- **429**: Too Many Requests (rate limiting)
- **500**: Internal Server Error

### 4.2 Error Response Format
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ],
    "timestamp": "2024-01-15T10:30:00Z",
    "path": "/api/v1/users"
  }
}
```

## 5. Security Requirements

### 5.1 Data Protection
- Encrypt sensitive financial credentials at rest
- Use HTTPS for all API communications
- Implement rate limiting (100 requests/minute per IP)
- Input validation and sanitization

### 5.2 Platform Security
- Store encrypted platform credentials
- Implement secure token refresh mechanisms
- Log all connection/disconnection events
- Monitor for suspicious activities

## 6. Performance Requirements

### 6.1 Response Times
- User profile operations: < 300ms
- Connector status checks: < 200ms
- Data sync operations: < 2s
- List operations: < 500ms

### 6.2 Database Optimization
- Index on userId, email, connector userId+platform
- Use MongoDB aggregation for analytics
- Implement connection pooling
- Cache frequently accessed data

## 7. Validation Rules

### 7.1 User Validation
- UserId: Required, unique, alphanumeric with underscores
- Email: Valid format, unique
- Phone: Valid format with country code
- Income: Positive number

### 7.2 Connector Validation
- Platform: Must be 'fi_money' or 'zerodha'
- SessionId: Unique when present
- Permissions: Valid array of allowed permissions
- Sync interval: Between 1-60 minutes

## 8. API Rate Limiting

### 8.1 Rate Limits
- User operations: 30 requests/minute per IP
- Connector operations: 20 requests/minute per IP
- Status checks: 60 requests/minute per IP
- Sync operations: 5 requests/minute per IP

## 9. Logging & Monitoring

### 9.1 Required Logs
- All user creation/modification events
- Connection/disconnection events
- Sync operations and failures
- API errors and response times

### 9.2 Metrics to Track
- Total active users
- Platform connection success rates
- Sync success/failure rates
- API response times

## 10. Implementation Guidelines

### 10.1 Project Structure
```
src/
├── controllers/
│   ├── userController.js
│   └── connectorController.js
├── models/
│   ├── User.js
│   └── DataConnector.js
├── middleware/
│   ├── validation.js
│   └── rateLimiter.js
├── routes/
│   ├── users.js
│   └── connectors.js
├── services/
│   ├── userService.js
│   └── connectorService.js
├── utils/
│   ├── encryption.js
│   ├── validation.js
│   └── constants.js
└── config/
    ├── database.js
    └── environment.js
```

### 10.2 Environment Variables
```env
# Database
MONGODB_URI=mongodb://localhost:27017/financial_app
DB_NAME=financial_app

# Encryption
ENCRYPTION_KEY=your_32_char_encryption_key

# Server
PORT=3000
NODE_ENV=development

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
```

This PRD provides comprehensive specifications for your LLM to design and implement the User and Data Connector APIs with all necessary endpoints, schemas, and implementation details without authentication dependencies.