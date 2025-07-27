const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const connectDB = require('./config/database');
const config = require('./config/environment');
const { generalLimiter } = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');
const { specs, swaggerUi } = require('./config/swagger');

// Import routes
const userRoutes = require('./routes/users');
const connectorRoutes = require('./routes/connectors');

const app = express();

// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet());
app.use(cors());

// Rate limiting
app.use(generalLimiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Financial APIs Documentation',
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    docExpansion: 'none',
    filter: true,
    showExtensions: true,
    showCommonExtensions: true,
    tryItOutEnabled: true
  }
}));

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     description: Returns the current health status of the API server including uptime and environment information.
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Server is healthy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 */
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.nodeEnv
  });
});

// API routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/connectors', connectorRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: {
      code: 'ENDPOINT_NOT_FOUND',
      message: `Endpoint ${req.method} ${req.originalUrl} not found`,
      timestamp: new Date().toISOString(),
      path: req.path
    }
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${config.nodeEnv}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
  console.log(`\n📖 Available Endpoints:`);
  console.log(`\n👥 User APIs:`);
  console.log(`   POST   /api/v1/users                    - Create user`);
  console.log(`   GET    /api/v1/users                    - Get users (with pagination)`);
  console.log(`   GET    /api/v1/users/:userId            - Get user by ID`);
  console.log(`   PUT    /api/v1/users/:userId/profile    - Update user profile`);
  console.log(`   PUT    /api/v1/users/:userId/preferences - Update user preferences`);
  console.log(`   DELETE /api/v1/users/:userId            - Delete user`);
  console.log(`\n🔌 Data Connector APIs:`);
  console.log(`   POST   /api/v1/connectors                           - Connect to platform`);
  console.log(`   GET    /api/v1/connectors/user/:userId              - Get user connectors`);
  console.log(`   GET    /api/v1/connectors/user/:userId/platform/:platform - Get specific connector`);
  console.log(`   GET    /api/v1/connectors/status                    - Get connection status summary`);
  console.log(`   GET    /api/v1/connectors/:connectorId              - Get connector details`);
  console.log(`   DELETE /api/v1/connectors/:connectorId              - Disconnect from platform`);
  console.log(`   PUT    /api/v1/connectors/:connectorId/sync-settings - Update sync settings`);
  console.log(`   POST   /api/v1/connectors/:connectorId/sync          - Trigger manual sync`);
  console.log(`   GET    /api/v1/connectors/:connectorId/sync-status   - Get sync status`);
  console.log(`   PUT    /api/v1/connectors/:connectorId/refresh-session - Refresh session`);
  console.log(`\n🎯 Test the APIs at: http://localhost:${PORT}/api-docs`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

module.exports = app;