const express = require('express');
const connectorController = require('../controllers/connectorController');
const { 
  validateRequest, 
  createConnectorSchema, 
  updateSyncSettingsSchema, 
  manualSyncSchema,
  getStatusQuerySchema
} = require('../utils/connectorValidation');
const { userOperationsLimiter, createUserLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Apply rate limiting to all connector routes
router.use(userOperationsLimiter);

/**
 * @swagger
 * /api/v1/connectors:
 *   post:
 *     summary: Connect to a financial platform
 *     description: Creates a new connection to Fi Money or Zerodha platform for data synchronization with session tracking.
 *     tags: [Data Connectors]
 *     parameters:
 *       - in: header
 *         name: x-session-id
 *         schema:
 *           type: string
 *         description: Optional session ID for tracking operations
 *         example: "session_chatbot_1753523804706_853834d8"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, platform]
 *             properties:
 *               userId:
 *                 type: string
 *                 description: User identifier
 *                 example: "user_12345"
 *               platform:
 *                 type: string
 *                 enum: [fi_money, zerodha]
 *                 description: Financial platform to connect
 *                 example: "fi_money"
 *               syncInterval:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 60
 *                 description: Sync interval in minutes
 *                 example: 5
 *               autoSync:
 *                 type: boolean
 *                 description: Enable automatic syncing
 *                 example: true
 *               accountType:
 *                 type: string
 *                 enum: [basic, premium, pro]
 *                 description: Account type
 *                 example: "premium"
 *               dataTypes:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [transactions, portfolio, profile, trades, analytics]
 *                 description: Data types to sync
 *                 example: ["transactions", "portfolio"]
 *               sessionId:
 *                 type: string
 *                 description: Optional session ID for tracking (can also be passed in header)
 *                 example: "session_chatbot_1753523804706_853834d8"
 *           examples:
 *             fi_money_connection:
 *               summary: Fi Money connection with session tracking
 *               value:
 *                 userId: "user_12345"
 *                 platform: "fi_money"
 *                 dataTypes: ["transactions", "portfolio", "profile"]
 *                 syncInterval: 5
 *                 autoSync: true
 *                 accountType: "premium"
 *                 sessionId: "session_chatbot_1753523804706_853834d8"
 *             zerodha_connection:
 *               summary: Zerodha connection
 *               value:
 *                 userId: "user_67890"
 *                 platform: "zerodha"
 *                 dataTypes: ["portfolio", "trades"]
 *                 syncInterval: 10
 *                 autoSync: true
 *                 accountType: "basic"
 *     responses:
 *       201:
 *         description: Connected successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Connected successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "64a1b2c3d4e5f6789"
 *                     userId:
 *                       type: string
 *                       example: "user_12345"
 *                     platform:
 *                       type: string
 *                       example: "fi_money"
 *                     sessionId:
 *                       type: string
 *                       example: "sess_abc123xyz"
 *                     globalSessionId:
 *                       type: string
 *                       example: "global_def456uvw"
 *                     connectionStatus:
 *                       type: string
 *                       example: "connected"
 *                     connectedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-01-15T10:30:00Z"
 *                     dataTypes:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["transactions", "portfolio"]
 *                     syncInterval:
 *                       type: integer
 *                       example: 5
 *                     trackingSessionId:
 *                       type: string
 *                       example: "session_chatbot_1753523804706_853834d8"
 *       400:
 *         description: Validation error
 *       409:
 *         description: Already connected to this platform
 *       429:
 *         description: Rate limit exceeded
 *       500:
 *         description: Internal server error
 */
router.post('/', 
  createUserLimiter,
  validateRequest(createConnectorSchema),
  connectorController.createConnector
);

/**
 * @swagger
 * /api/v1/connectors/user/{userId}:
 *   get:
 *     summary: Get all user's platform connections
 *     description: Retrieves all data connectors for a specific user with connection status and statistics, optionally filtered by session.
 *     tags: [Data Connectors]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User identifier
 *         example: user_12345
 *       - in: header
 *         name: x-session-id
 *         schema:
 *           type: string
 *         description: Optional session ID for filtering results
 *         example: "session_chatbot_1753523804706_853834d8"
 *       - in: query
 *         name: sessionId
 *         schema:
 *           type: string
 *         description: Optional session ID for filtering results (alternative to header)
 *         example: "session_chatbot_1753523804706_853834d8"
 *     responses:
 *       200:
 *         description: User connectors retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     connectors:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           platform:
 *                             type: string
 *                           connectionStatus:
 *                             type: string
 *                           sessionId:
 *                             type: string
 *                           globalSessionId:
 *                             type: string
 *                           connectedAt:
 *                             type: string
 *                             format: date-time
 *                           lastSyncAt:
 *                             type: string
 *                             format: date-time
 *                           sessionDuration:
 *                             type: integer
 *                           syncInterval:
 *                             type: integer
 *                           dataTypes:
 *                             type: array
 *                             items:
 *                               type: string
 *                           accountType:
 *                             type: string
 *                     totalConnectors:
 *                       type: integer
 *                       example: 2
 *                     activeConnections:
 *                       type: integer
 *                       example: 1
 *                     sessionId:
 *                       type: string
 *                       example: "global"
 *                     trackingSessionId:
 *                       type: string
 *                       example: "session_chatbot_1753523804706_853834d8"
 *       404:
 *         description: User not found
 *       429:
 *         description: Rate limit exceeded
 *       500:
 *         description: Internal server error
 */
router.get('/user/:userId', connectorController.getUserConnectors);

/**
 * @swagger
 * /api/v1/connectors/user/{userId}/platform/{platform}:
 *   get:
 *     summary: Get connector by user and platform
 *     description: Retrieves a specific connector for a user and platform combination, optionally filtered by session.
 *     tags: [Data Connectors]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User identifier
 *         example: user_12345
 *       - in: path
 *         name: platform
 *         required: true
 *         schema:
 *           type: string
 *           enum: [fi_money, zerodha]
 *         description: Platform name
 *         example: fi_money
 *       - in: header
 *         name: x-session-id
 *         schema:
 *           type: string
 *         description: Optional session ID for filtering results
 *         example: "session_chatbot_1753523804706_853834d8"
 *       - in: query
 *         name: sessionId
 *         schema:
 *           type: string
 *         description: Optional session ID for filtering results (alternative to header)
 *         example: "session_chatbot_1753523804706_853834d8"
 *     responses:
 *       200:
 *         description: Connector retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     connector:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         userId:
 *                           type: string
 *                         platform:
 *                           type: string
 *                         connectionStatus:
 *                           type: string
 *                         sessionId:
 *                           type: string
 *                         globalSessionId:
 *                           type: string
 *                         trackingSessionId:
 *                           type: string
 *       404:
 *         description: No connection found for this platform
 *       429:
 *         description: Rate limit exceeded
 *       500:
 *         description: Internal server error
 */
router.get('/user/:userId/platform/:platform', connectorController.getConnectorByUserAndPlatform);

/**
 * @swagger
 * /api/v1/connectors/status:
 *   get:
 *     summary: Get connection status summary
 *     description: Retrieves aggregated connection statistics across all users and platforms, optionally filtered by session.
 *     tags: [Data Connectors]
 *     parameters:
 *       - in: query
 *         name: platform
 *         schema:
 *           type: string
 *           enum: [fi_money, zerodha]
 *         description: Filter by platform
 *         example: fi_money
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [connected, disconnected, error, expired]
 *         description: Filter by connection status
 *         example: connected
 *       - in: query
 *         name: fromDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter from date
 *         example: "2024-01-01"
 *       - in: query
 *         name: toDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter to date
 *         example: "2024-01-31"
 *       - in: query
 *         name: sessionId
 *         schema:
 *           type: string
 *         description: Filter by session ID
 *         example: "session_chatbot_1753523804706_853834d8"
 *       - in: header
 *         name: x-session-id
 *         schema:
 *           type: string
 *         description: Optional session ID for filtering results (alternative to query)
 *         example: "session_chatbot_1753523804706_853834d8"
 *     responses:
 *       200:
 *         description: Status summary retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     summary:
 *                       type: object
 *                       properties:
 *                         totalConnections:
 *                           type: integer
 *                           example: 150
 *                         activeConnections:
 *                           type: integer
 *                           example: 120
 *                         disconnectedConnections:
 *                           type: integer
 *                           example: 30
 *                         errorConnections:
 *                           type: integer
 *                           example: 0
 *                         sessionId:
 *                           type: string
 *                           example: "global"
 *                     byPlatform:
 *                       type: object
 *                       properties:
 *                         fi_money:
 *                           type: object
 *                           properties:
 *                             total:
 *                               type: integer
 *                               example: 80
 *                             active:
 *                               type: integer
 *                               example: 70
 *                             disconnected:
 *                               type: integer
 *                               example: 10
 *                         zerodha:
 *                           type: object
 *                           properties:
 *                             total:
 *                               type: integer
 *                               example: 70
 *                             active:
 *                               type: integer
 *                               example: 50
 *                             disconnected:
 *                               type: integer
 *                               example: 20
 *                     trackingSessionId:
 *                       type: string
 *                       example: "session_chatbot_1753523804706_853834d8"
 *       429:
 *         description: Rate limit exceeded
 *       500:
 *         description: Internal server error
 */
router.get('/status',
  validateRequest(getStatusQuerySchema, 'query'),
  connectorController.getConnectionStatusSummary
);

/**
 * @swagger
 * /api/v1/connectors/{connectorId}:
 *   get:
 *     summary: Get specific connector details
 *     description: Retrieves detailed information about a specific connector including sync history and statistics with session tracking.
 *     tags: [Data Connectors]
 *     parameters:
 *       - in: path
 *         name: connectorId
 *         required: true
 *         schema:
 *           type: string
 *         description: Connector ID
 *         example: 64a1b2c3d4e5f6789
 *       - in: header
 *         name: x-session-id
 *         schema:
 *           type: string
 *         description: Optional session ID for filtering results
 *         example: "session_chatbot_1753523804706_853834d8"
 *       - in: query
 *         name: sessionId
 *         schema:
 *           type: string
 *         description: Optional session ID for filtering results (alternative to header)
 *         example: "session_chatbot_1753523804706_853834d8"
 *     responses:
 *       200:
 *         description: Connector details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     sessionId:
 *                       type: string
 *                     globalSessionId:
 *                       type: string
 *                     trackingSessionId:
 *                       type: string
 *                     syncHistory:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           sessionId:
 *                             type: string
 *       404:
 *         description: Connector not found
 *       429:
 *         description: Rate limit exceeded
 *       500:
 *         description: Internal server error
 */
router.get('/:connectorId', connectorController.getConnectorById);

/**
 * @swagger
 * /api/v1/connectors/{connectorId}:
 *   delete:
 *     summary: Disconnect from a financial platform
 *     description: Disconnects and removes the connection to a financial platform, clearing all session data with session tracking.
 *     tags: [Data Connectors]
 *     parameters:
 *       - in: path
 *         name: connectorId
 *         required: true
 *         schema:
 *           type: string
 *         description: Connector ID
 *         example: 64a1b2c3d4e5f6789
 *       - in: header
 *         name: x-session-id
 *         schema:
 *           type: string
 *         description: Optional session ID for tracking the disconnect operation
 *         example: "session_chatbot_1753523804706_853834d8"
 *     responses:
 *       200:
 *         description: Disconnected successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Disconnected successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     platform:
 *                       type: string
 *                       example: "fi_money"
 *                     disconnectedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-01-15T11:30:00Z"
 *                     sessionDuration:
 *                       type: integer
 *                       description: Session duration in minutes
 *                       example: 60
 *                     sessionId:
 *                       type: string
 *                       example: "global_abc123"
 *                     trackingSessionId:
 *                       type: string
 *                       example: "session_chatbot_1753523804706_853834d8"
 *       404:
 *         description: Connector not found
 *       429:
 *         description: Rate limit exceeded
 *       500:
 *         description: Internal server error
 */
router.delete('/:connectorId', connectorController.disconnectConnector);

/**
 * @swagger
 * /api/v1/connectors/{connectorId}/sync-settings:
 *   put:
 *     summary: Update sync settings
 *     description: Updates synchronization settings for a specific connector with session tracking.
 *     tags: [Data Connectors]
 *     parameters:
 *       - in: path
 *         name: connectorId
 *         required: true
 *         schema:
 *           type: string
 *         description: Connector ID
 *         example: 64a1b2c3d4e5f6789
 *       - in: header
 *         name: x-session-id
 *         schema:
 *           type: string
 *         description: Optional session ID for tracking the update operation
 *         example: "session_chatbot_1753523804706_853834d8"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             minProperties: 1
 *             properties:
 *               syncInterval:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 60
 *                 description: Sync interval in minutes
 *                 example: 10
 *               dataTypes:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [transactions, portfolio, profile, trades, analytics]
 *                 description: Data types to sync
 *                 example: ["transactions", "portfolio"]
 *               autoSync:
 *                 type: boolean
 *                 description: Enable automatic syncing
 *                 example: true
 *               retryAttempts:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 description: Number of retry attempts
 *                 example: 3
 *               timeout:
 *                 type: integer
 *                 minimum: 5000
 *                 maximum: 120000
 *                 description: Timeout in milliseconds
 *                 example: 30000
 *               enableNotifications:
 *                 type: boolean
 *                 description: Enable sync notifications
 *                 example: true
 *               enableErrorAlerts:
 *                 type: boolean
 *                 description: Enable error alerts
 *                 example: true
 *               sessionId:
 *                 type: string
 *                 description: Optional session ID for tracking (can also be passed in header)
 *                 example: "session_chatbot_1753523804706_853834d8"
 *           examples:
 *             basic_settings:
 *               summary: Basic sync settings with session
 *               value:
 *                 syncInterval: 10
 *                 autoSync: true
 *                 sessionId: "session_chatbot_1753523804706_853834d8"
 *             advanced_settings:
 *               summary: Advanced sync settings
 *               value:
 *                 syncInterval: 15
 *                 dataTypes: ["transactions", "portfolio"]
 *                 autoSync: true
 *                 retryAttempts: 5
 *                 timeout: 45000
 *                 enableNotifications: true
 *                 enableErrorAlerts: true
 *     responses:
 *       200:
 *         description: Sync settings updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Sync settings updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     sessionId:
 *                       type: string
 *                     globalSessionId:
 *                       type: string
 *                     trackingSessionId:
 *                       type: string
 *       400:
 *         description: Validation error
 *       404:
 *         description: Connector not found
 *       429:
 *         description: Rate limit exceeded
 *       500:
 *         description: Internal server error
 */
router.put('/:connectorId/sync-settings',
  validateRequest(updateSyncSettingsSchema),
  connectorController.updateSyncSettings
);

/**
 * @swagger
 * /api/v1/connectors/{connectorId}/sync:
 *   post:
 *     summary: Trigger manual sync
 *     description: Initiates a manual data synchronization for the specified connector with session tracking.
 *     tags: [Data Connectors]
 *     parameters:
 *       - in: path
 *         name: connectorId
 *         required: true
 *         schema:
 *           type: string
 *         description: Connector ID
 *         example: 64a1b2c3d4e5f6789
 *       - in: header
 *         name: x-session-id
 *         schema:
 *           type: string
 *         description: Optional session ID for tracking the sync operation
 *         example: "session_chatbot_1753523804706_853834d8"
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dataTypes:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [transactions, portfolio, profile, trades, analytics]
 *                 description: Specific data types to sync
 *                 example: ["transactions"]
 *               forceSync:
 *                 type: boolean
 *                 description: Force sync even if recently synced
 *                 example: true
 *               fromDate:
 *                 type: string
 *                 format: date
 *                 description: Sync data from this date
 *                 example: "2024-01-01"
 *               toDate:
 *                 type: string
 *                 format: date
 *                 description: Sync data until this date
 *                 example: "2024-01-31"
 *               sessionId:
 *                 type: string
 *                 description: Optional session ID for tracking (can also be passed in header)
 *                 example: "session_chatbot_1753523804706_853834d8"
 *           examples:
 *             full_sync_with_session:
 *               summary: Full data sync with session tracking
 *               value:
 *                 forceSync: true
 *                 sessionId: "session_chatbot_1753523804706_853834d8"
 *             partial_sync:
 *               summary: Partial data sync
 *               value:
 *                 dataTypes: ["transactions"]
 *                 fromDate: "2024-01-01"
 *                 toDate: "2024-01-31"
 *     responses:
 *       200:
 *         description: Sync initiated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Sync initiated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     syncId:
 *                       type: string
 *                       example: "sync_xyz789"
 *                     status:
 *                       type: string
 *                       example: "success"
 *                     recordsCount:
 *                       type: integer
 *                       example: 150
 *                     duration:
 *                       type: integer
 *                       description: Sync duration in milliseconds
 *                       example: 2500
 *                     sessionId:
 *                       type: string
 *                       example: "global_abc123"
 *                     trackingSessionId:
 *                       type: string
 *                       example: "session_chatbot_1753523804706_853834d8"
 *       400:
 *         description: Connector not connected or validation error
 *       404:
 *         description: Connector not found
 *       429:
 *         description: Rate limit exceeded
 *       500:
 *         description: Internal server error
 */
router.post('/:connectorId/sync',
  validateRequest(manualSyncSchema),
  connectorController.triggerManualSync
);

/**
 * @swagger
 * /api/v1/connectors/{connectorId}/sync-status:
 *   get:
 *     summary: Get sync status and history
 *     description: Retrieves detailed synchronization status and history for a specific connector with session information.
 *     tags: [Data Connectors]
 *     parameters:
 *       - in: path
 *         name: connectorId
 *         required: true
 *         schema:
 *           type: string
 *         description: Connector ID
 *         example: 64a1b2c3d4e5f6789
 *       - in: header
 *         name: x-session-id
 *         schema:
 *           type: string
 *         description: Optional session ID for filtering results
 *         example: "session_chatbot_1753523804706_853834d8"
 *       - in: query
 *         name: sessionId
 *         schema:
 *           type: string
 *         description: Optional session ID for filtering results (alternative to header)
 *         example: "session_chatbot_1753523804706_853834d8"
 *     responses:
 *       200:
 *         description: Sync status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     lastSyncAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-01-15T11:25:00Z"
 *                     nextSyncAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-01-15T11:30:00Z"
 *                     syncInterval:
 *                       type: integer
 *                       example: 5
 *                     syncHistory:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           syncedAt:
 *                             type: string
 *                             format: date-time
 *                           status:
 *                             type: string
 *                             enum: [success, failed, partial]
 *                           recordsCount:
 *                             type: integer
 *                           duration:
 *                             type: integer
 *                           errorMessage:
 *                             type: string
 *                           sessionId:
 *                             type: string
 *                             description: Session ID associated with this sync
 *                     totalSyncs:
 *                       type: integer
 *                       example: 48
 *                     successfulSyncs:
 *                       type: integer
 *                       example: 46
 *                     failedSyncs:
 *                       type: integer
 *                       example: 2
 *                     successRate:
 *                       type: number
 *                       example: 95.8
 *                     averageSyncDuration:
 *                       type: number
 *                       example: 2500.5
 *                     totalRecordsSynced:
 *                       type: integer
 *                       example: 7200
 *                     sessionId:
 *                       type: string
 *                       example: "sess_abc123"
 *                     globalSessionId:
 *                       type: string
 *                       example: "global_def456"
 *                     trackingSessionId:
 *                       type: string
 *                       example: "session_chatbot_1753523804706_853834d8"
 *       404:
 *         description: Connector not found
 *       429:
 *         description: Rate limit exceeded
 *       500:
 *         description: Internal server error
 */
router.get('/:connectorId/sync-status', connectorController.getSyncStatus);

/**
 * @swagger
 * /api/v1/connectors/{connectorId}/refresh-session:
 *   put:
 *     summary: Refresh platform session
 *     description: Refreshes the authentication session for a specific connector with session tracking.
 *     tags: [Data Connectors]
 *     parameters:
 *       - in: path
 *         name: connectorId
 *         required: true
 *         schema:
 *           type: string
 *         description: Connector ID
 *         example: 64a1b2c3d4e5f6789
 *       - in: header
 *         name: x-session-id
 *         schema:
 *           type: string
 *         description: Optional session ID for tracking the refresh operation
 *         example: "session_chatbot_1753523804706_853834d8"
 *     responses:
 *       200:
 *         description: Session refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Session refreshed successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     sessionId:
 *                       type: string
 *                       example: "sess_new123xyz"
 *                     refreshedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-01-15T12:30:00Z"
 *                     globalSessionId:
 *                       type: string
 *                       example: "global_def456"
 *                     trackingSessionId:
 *                       type: string
 *                       example: "session_chatbot_1753523804706_853834d8"
 *       400:
 *         description: Session refresh failed
 *       404:
 *         description: Connector not found
 *       429:
 *         description: Rate limit exceeded
 *       500:
 *         description: Internal server error
 */
router.put('/:connectorId/refresh-session', connectorController.refreshSession);

module.exports = router;