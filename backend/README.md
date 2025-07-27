# Financial APIs - Complete User Management & Data Connector System

A comprehensive RESTful API system for user management and financial data connector tracking built with Node.js, Express.js, and MongoDB. This system handles user profiles and monitors connections to financial platforms (Fi Money and Zerodha) with encrypted credential storage and real-time sync capabilities.

## 🚀 Features

### User Management
- ✅ Create, read, update, and delete users
- ✅ User profile management with validation
- ✅ User preferences management
- ✅ Pagination and filtering for user lists
- ✅ Comprehensive input validation
- ✅ Rate limiting and security measures

### Data Connector Management
- ✅ Connect to Fi Money and Zerodha platforms
- ✅ Encrypted credential storage with AES-256-GCM
- ✅ Session management and refresh capabilities
- ✅ Real-time sync status monitoring
- ✅ Manual and automatic data synchronization
- ✅ Comprehensive sync history and statistics
- ✅ Connection status tracking and analytics
- ✅ Platform-specific error handling

### Security & Performance
- ✅ Advanced encryption for sensitive financial data
- ✅ Rate limiting (different limits for different operations)
- ✅ Input validation with Joi schemas
- ✅ Security headers with Helmet
- ✅ CORS support
- ✅ Error handling and logging
- ✅ MongoDB indexing for performance
- ✅ Interactive Swagger documentation

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## 🛠️ Installation

1. **Clone and setup:**
   ```bash
   cd /Users/yuvakiranarthala/Desktop/ffhackathon
   npm install
   ```

2. **Environment Configuration:**
   Update the `.env` file with your configuration:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/financial_app
   DB_NAME=financial_app
   
   # Encryption (IMPORTANT: Change in production)
   ENCRYPTION_KEY=your_32_char_encryption_key_here_123
   
   # Server
   PORT=3000
   NODE_ENV=development
   
   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=60000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

3. **Start MongoDB:**
   ```bash
   # Using MongoDB service
   brew services start mongodb/brew/mongodb-community
   
   # Or using mongod directly
   mongod --config /usr/local/etc/mongod.conf
   ```

4. **Run the application:**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api/v1
```

### Interactive Documentation
**Swagger UI**: `http://localhost:3000/api-docs`

## 🔧 API Endpoints

### User Management APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/users` | Create a new user |
| GET | `/api/v1/users` | Get users with pagination and filters |
| GET | `/api/v1/users/{userId}` | Get user by ID |
| PUT | `/api/v1/users/{userId}/profile` | Update user profile |
| PUT | `/api/v1/users/{userId}/preferences` | Update user preferences |
| DELETE | `/api/v1/users/{userId}` | Delete user |

### Data Connector APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/connectors` | Connect to financial platform |
| GET | `/api/v1/connectors/user/{userId}` | Get all user's connections |
| GET | `/api/v1/connectors/user/{userId}/platform/{platform}` | Get specific platform connection |
| GET | `/api/v1/connectors/status` | Get connection status summary |
| GET | `/api/v1/connectors/{connectorId}` | Get connector details |
| DELETE | `/api/v1/connectors/{connectorId}` | Disconnect from platform |
| PUT | `/api/v1/connectors/{connectorId}/sync-settings` | Update sync settings |
| POST | `/api/v1/connectors/{connectorId}/sync` | Trigger manual sync |
| GET | `/api/v1/connectors/{connectorId}/sync-status` | Get sync status and history |
| PUT | `/api/v1/connectors/{connectorId}/refresh-session` | Refresh platform session |

## 🔐 Security Features

### Encryption
- **AES-256-GCM encryption** for sensitive financial credentials
- **Secure session ID generation** with cryptographic randomness
- **One-way hashing** for sensitive data verification
- **Encrypted JSON object storage** for complex credential structures

### Rate Limiting
- **General API**: 100 requests/minute per IP
- **User Operations**: 30 requests/minute per IP
- **User Creation**: 5 requests/minute per IP
- **Connector Operations**: 20 requests/minute per IP

## 📊 Database Schemas

### User Collection
```javascript
{
  userId: String (unique, required),
  email: String (unique, required),
  profile: {
    firstName: String,
    lastName: String,
    dateOfBirth: Date,
    phoneNumber: String,
    city: String,
    country: String,
    income: Number,
    riskTolerance: String (enum: ['low', 'medium', 'high'])
  },
  preferences: {
    currency: String (default: 'INR'),
    language: String (default: 'en'),
    notifications: {
      email: Boolean (default: true),
      sms: Boolean (default: false),
      push: Boolean (default: true)
    }
  },
  status: String (enum: ['active', 'inactive', 'suspended']),
  // ... additional fields
}
```

### Data Connector Collection
```javascript
{
  userId: String (required),
  platform: String (enum: ['fi_money', 'zerodha'], required),
  connectionStatus: String (enum: ['connected', 'disconnected', 'error', 'expired']),
  sessionId: String (unique),
  connectionDetails: {
    connectedAt: Date,
    disconnectedAt: Date,
    sessionDuration: Number,
    lastSyncAt: Date,
    syncInterval: Number,
    autoSync: Boolean,
    nextSyncAt: Date
  },
  credentials: {
    encryptedCredentials: String, // AES-256-GCM encrypted
    encryptedToken: String,
    tokenExpiresAt: Date,
    refreshToken: String
  },
  metadata: {
    platformUserId: String,
    accountType: String,
    permissions: [String],
    dataTypes: [String]
  },
  syncHistory: [{
    syncedAt: Date,
    status: String,
    recordsCount: Number,
    duration: Number,
    errorMessage: String
  }],
  statistics: {
    totalSyncs: Number,
    successfulSyncs: Number,
    failedSyncs: Number,
    successRate: Number (virtual),
    averageSyncDuration: Number,
    totalRecordsSynced: Number
  }
  // ... additional fields
}
```

## 🧪 Testing Examples

### 1. Create a User
```bash
curl -X POST http://localhost:3000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_12345",
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "city": "Bangalore",
    "country": "India",
    "riskTolerance": "medium"
  }'
```

### 2. Connect to Fi Money
```bash
curl -X POST http://localhost:3000/api/v1/connectors \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_12345",
    "platform": "fi_money",
    "credentials": {
      "username": "john_doe",
      "password": "securePassword123",
      "apiKey": "fi_api_key_xyz789"
    },
    "permissions": ["transactions", "portfolio"],
    "syncInterval": 5,
    "autoSync": true
  }'
```

### 3. Connect to Zerodha
```bash
curl -X POST http://localhost:3000/api/v1/connectors \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_12345",
    "platform": "zerodha",
    "credentials": {
      "clientId": "ZT1234",
      "clientSecret": "client_secret_abc123",
      "apiKey": "kite_api_key_def456"
    },
    "permissions": ["portfolio", "trades"],
    "syncInterval": 10
  }'
```

### 4. Get User's Connectors
```bash
curl http://localhost:3000/api/v1/connectors/user/user_12345
```

### 5. Trigger Manual Sync
```bash
curl -X POST http://localhost:3000/api/v1/connectors/{connectorId}/sync \
  -H "Content-Type: application/json" \
  -d '{
    "dataTypes": ["transactions"],
    "forceSync": true
  }'
```

### 6. Get Connection Status Summary
```bash
curl "http://localhost:3000/api/v1/connectors/status?platform=fi_money&status=connected"
```

## 🚦 Error Handling

The API returns consistent error responses with detailed information:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "credentials.username",
        "message": "Username is required for Fi Money"
      }
    ],
    "timestamp": "2024-01-15T10:30:00Z",
    "path": "/api/v1/connectors"
  }
}
```

## 📈 Performance Features

- **Database Indexing**: Optimized compound indexes for complex queries
- **Connection Pooling**: MongoDB connection optimization
- **Pagination**: Efficient pagination for large datasets
- **Rate Limiting**: Prevents API abuse with different limits per operation type
- **Lean Queries**: Optimized database queries for better performance
- **Caching**: Virtual fields and computed properties for frequently accessed data

## 🔧 Platform Integration

### Fi Money Integration
- **Supported Data Types**: Transactions, Portfolio, Profile
- **Default Permissions**: Transactions, Portfolio
- **Sync Intervals**: 1-30 minutes
- **Session Timeout**: 1 hour

### Zerodha Integration
- **Supported Data Types**: Portfolio, Trades, Profile
- **Default Permissions**: Portfolio, Trades
- **Sync Intervals**: 5-60 minutes
- **Session Timeout**: 2 hours

## 📊 Monitoring & Analytics

### Connection Metrics
- Total connections by platform
- Active vs. disconnected connections
- Connection success rates
- Session duration statistics

### Sync Metrics
- Sync success rates
- Average sync duration
- Total records synced
- Error frequency and types

## 🔮 Advanced Features

### Automatic Session Management
- **Session expiry detection** and automatic refresh
- **Token rotation** for enhanced security
- **Connection health monitoring**

### Intelligent Sync Scheduling
- **Adaptive sync intervals** based on data frequency
- **Error-based backoff strategies**
- **Priority-based sync queuing**

### Comprehensive Logging
- **Connection events** (connect/disconnect/errors)
- **Sync operations** with detailed metrics
- **Security events** (failed authentications, suspicious activities)

## 🤝 Contributing

1. Follow the existing code structure and patterns
2. Add proper validation for new endpoints
3. Include comprehensive error handling
4. Update Swagger documentation
5. Add appropriate tests

## 📝 License

ISC License - see package.json for details.

---

**🎯 Ready to test?** Visit `http://localhost:3000/api-docs` for interactive API documentation and testing interface!
