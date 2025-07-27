const DataConnector = require('../models/DataConnector');
const encryptionService = require('../utils/encryption');
const { 
  CONNECTION_STATUS, 
  SYNC_STATUS, 
  CONNECTOR_ERROR_CODES, 
  DEFAULTS, 
  PLATFORM_CONFIG,
  CONNECTOR_HTTP_STATUS
} = require('../utils/connectorConstants');
const { HTTP_STATUS } = require('../utils/constants');

class ConnectorService {
  /**
   * Create a new data connector
   */
  async createConnector(connectorData) {
    try {
      const { userId, platform, syncInterval, autoSync, accountType, dataTypes, sessionId } = connectorData;

      // Check if connector already exists for this user and platform
      const existingConnector = await DataConnector.findOne({ userId, platform });
      if (existingConnector) {
        const error = new Error('Connector already exists for this platform');
        error.statusCode = CONNECTOR_HTTP_STATUS.ALREADY_CONNECTED;
        error.code = CONNECTOR_ERROR_CODES.ALREADY_CONNECTED;
        throw error;
      }

      // Generate session ID if not provided
      const connectorSessionId = sessionId || encryptionService.generateSessionId('sess');
      
      // Generate global session ID for tracking
      const globalSessionId = encryptionService.generateSessionId('global');

      // Simulate platform connection (in real implementation, this would call actual platform APIs)
      const connectionResult = await this.simulatePlatformConnection(platform, globalSessionId);
      
      if (!connectionResult.success) {
        const error = new Error(connectionResult.error || 'Failed to connect to platform');
        error.statusCode = CONNECTOR_HTTP_STATUS.INVALID_CREDENTIALS;
        error.code = CONNECTOR_ERROR_CODES.CONNECTION_FAILED;
        throw error;
      }

      // Create connector document
      const connectorDoc = {
        userId,
        platform,
        connectionStatus: CONNECTION_STATUS.CONNECTED,
        sessionId: connectorSessionId,
        globalSessionId,
        connectionDetails: {
          connectedAt: new Date(),
          syncInterval: syncInterval || DEFAULTS.SYNC_INTERVAL,
          autoSync: autoSync !== undefined ? autoSync : true,
          nextSyncAt: new Date(Date.now() + (syncInterval || DEFAULTS.SYNC_INTERVAL) * 60000),
          sessionId: globalSessionId
        },
        metadata: {
          platformUserId: connectionResult.platformUserId,
          accountType: accountType || 'basic',
          dataTypes: dataTypes || PLATFORM_CONFIG[platform]?.defaultDataTypes || [],
          platformVersion: connectionResult.platformVersion,
          apiVersion: connectionResult.apiVersion,
          sessionId: globalSessionId
        },
        syncHistory: [],
        errors: [],
        statistics: {
          sessionId: globalSessionId
        },
        settings: {
          sessionId: globalSessionId
        }
      };

      const connector = new DataConnector(connectorDoc);
      await connector.save();

      return connector;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get connector by ID
   */
  async getConnectorById(connectorId, sessionId = null) {
    try {
      const query = { _id: connectorId };
      if (sessionId) {
        query.$or = [
          { globalSessionId: sessionId },
          { sessionId: sessionId },
          { 'connectionDetails.sessionId': sessionId },
          { 'metadata.sessionId': sessionId }
        ];
      }
      
      const connector = await DataConnector.findOne(query);
      if (!connector) {
        const error = new Error('Connector not found');
        error.statusCode = HTTP_STATUS.NOT_FOUND;
        error.code = CONNECTOR_ERROR_CODES.CONNECTOR_NOT_FOUND;
        throw error;
      }
      return connector;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all connectors for a user
   */
  async getUserConnectors(userId, sessionId = null) {
    try {
      const query = { userId };
      if (sessionId) {
        query.$or = [
          { globalSessionId: sessionId },
          { sessionId: sessionId },
          { 'connectionDetails.sessionId': sessionId },
          { 'metadata.sessionId': sessionId }
        ];
      }
      
      const connectors = await DataConnector.find(query)
        .sort({ createdAt: -1 })
        .lean();

      const activeConnections = connectors.filter(c => c.connectionStatus === CONNECTION_STATUS.CONNECTED).length;

      return {
        connectors: connectors.map(connector => {
          const { _id, __v, ...connectorWithoutMeta } = connector;
          return { id: _id, ...connectorWithoutMeta };
        }),
        totalConnectors: connectors.length,
        activeConnections,
        sessionId: sessionId || 'global'
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get connector by user and platform
   */
  async getConnectorByUserAndPlatform(userId, platform, sessionId = null) {
    try {
      const query = { userId, platform };
      if (sessionId) {
        query.$or = [
          { globalSessionId: sessionId },
          { sessionId: sessionId },
          { 'connectionDetails.sessionId': sessionId },
          { 'metadata.sessionId': sessionId }
        ];
      }
      
      const connector = await DataConnector.findOne(query);
      if (!connector) {
        const error = new Error('No connection found for this platform');
        error.statusCode = HTTP_STATUS.NOT_FOUND;
        error.code = CONNECTOR_ERROR_CODES.CONNECTOR_NOT_FOUND;
        throw error;
      }
      return connector;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Disconnect a connector
   */
  async disconnectConnector(connectorId, sessionId = null) {
    try {
      const connector = await this.getConnectorById(connectorId, sessionId);

      // Calculate session duration
      const sessionDuration = connector.connectionDetails.connectedAt 
        ? Math.floor((Date.now() - connector.connectionDetails.connectedAt.getTime()) / 60000)
        : 0;

      // Update connector status
      connector.connectionStatus = CONNECTION_STATUS.DISCONNECTED;
      connector.connectionDetails.disconnectedAt = new Date();
      connector.connectionDetails.sessionDuration = sessionDuration;
      connector.sessionId = null;

      // Add session tracking to disconnect operation
      if (sessionId) {
        connector.connectionDetails.sessionId = sessionId;
      }

      await connector.save();

      return {
        platform: connector.platform,
        disconnectedAt: connector.connectionDetails.disconnectedAt,
        sessionDuration,
        sessionId: sessionId || connector.globalSessionId
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update sync settings
   */
  async updateSyncSettings(connectorId, settings, sessionId = null) {
    try {
      const connector = await this.getConnectorById(connectorId, sessionId);

      // Update connection details
      if (settings.syncInterval !== undefined) {
        connector.connectionDetails.syncInterval = settings.syncInterval;
        connector.connectionDetails.nextSyncAt = new Date(Date.now() + settings.syncInterval * 60000);
      }
      if (settings.autoSync !== undefined) {
        connector.connectionDetails.autoSync = settings.autoSync;
      }
      if (settings.dataTypes !== undefined) {
        connector.metadata.dataTypes = settings.dataTypes;
      }

      // Update settings
      if (settings.retryAttempts !== undefined) {
        connector.settings.retryAttempts = settings.retryAttempts;
      }
      if (settings.timeout !== undefined) {
        connector.settings.timeout = settings.timeout;
      }
      if (settings.enableNotifications !== undefined) {
        connector.settings.enableNotifications = settings.enableNotifications;
      }
      if (settings.enableErrorAlerts !== undefined) {
        connector.settings.enableErrorAlerts = settings.enableErrorAlerts;
      }

      // Track session for this operation
      if (sessionId) {
        connector.settings.sessionId = sessionId;
        connector.connectionDetails.sessionId = sessionId;
      }

      await connector.save();
      return connector;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Trigger manual sync
   */
  async triggerManualSync(connectorId, syncOptions = {}, sessionId = null) {
    try {
      const connector = await this.getConnectorById(connectorId, sessionId);

      if (connector.connectionStatus !== CONNECTION_STATUS.CONNECTED) {
        const error = new Error('Connector is not connected');
        error.statusCode = HTTP_STATUS.BAD_REQUEST;
        error.code = CONNECTOR_ERROR_CODES.CONNECTION_FAILED;
        throw error;
      }

      // Generate sync ID
      const syncId = encryptionService.generateSessionId('sync');
      
      // Simulate sync operation
      const syncResult = await this.simulateDataSync(connector, syncOptions, sessionId);
      
      // Add sync history entry
      const syncEntry = {
        syncedAt: new Date(),
        status: syncResult.success ? SYNC_STATUS.SUCCESS : SYNC_STATUS.FAILED,
        recordsCount: syncResult.recordsCount || 0,
        errorMessage: syncResult.error,
        dataTypes: syncOptions.dataTypes || connector.metadata.dataTypes,
        duration: syncResult.duration || 0,
        sessionId: sessionId || connector.globalSessionId
      };

      connector.syncHistory.push(syncEntry);
      
      // Keep only last 100 sync entries
      if (connector.syncHistory.length > DEFAULTS.MAX_SYNC_HISTORY) {
        connector.syncHistory = connector.syncHistory.slice(-DEFAULTS.MAX_SYNC_HISTORY);
      }

      // Update last sync time
      connector.connectionDetails.lastSyncAt = new Date();
      connector.connectionDetails.nextSyncAt = new Date(Date.now() + connector.connectionDetails.syncInterval * 60000);
      
      // Track session for this sync
      if (sessionId) {
        connector.connectionDetails.sessionId = sessionId;
        connector.statistics.sessionId = sessionId;
      }

      await connector.save();

      return {
        syncId,
        status: syncResult.success ? SYNC_STATUS.SUCCESS : SYNC_STATUS.FAILED,
        recordsCount: syncResult.recordsCount || 0,
        duration: syncResult.duration || 0,
        estimatedDuration: syncResult.success ? null : '2-5 minutes',
        sessionId: sessionId || connector.globalSessionId
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get connection status summary
   */
  async getConnectionStatusSummary(filters = {}) {
    try {
      const { platform, status, fromDate, toDate, sessionId } = filters;
      
      // Build match criteria
      const matchCriteria = {};
      if (platform) matchCriteria.platform = platform;
      if (status) matchCriteria.connectionStatus = status;
      if (fromDate || toDate) {
        matchCriteria.createdAt = {};
        if (fromDate) matchCriteria.createdAt.$gte = new Date(fromDate);
        if (toDate) matchCriteria.createdAt.$lte = new Date(toDate);
      }
      if (sessionId) {
        matchCriteria.$or = [
          { globalSessionId: sessionId },
          { sessionId: sessionId },
          { 'connectionDetails.sessionId': sessionId },
          { 'metadata.sessionId': sessionId }
        ];
      }

      // Aggregate connection statistics
      const [summary, byPlatform] = await Promise.all([
        DataConnector.aggregate([
          { $match: matchCriteria },
          {
            $group: {
              _id: '$connectionStatus',
              count: { $sum: 1 }
            }
          }
        ]),
        DataConnector.aggregate([
          { $match: matchCriteria },
          {
            $group: {
              _id: {
                platform: '$platform',
                status: '$connectionStatus'
              },
              count: { $sum: 1 }
            }
          }
        ])
      ]);

      // Process summary data
      const summaryData = {
        totalConnections: 0,
        activeConnections: 0,
        disconnectedConnections: 0,
        errorConnections: 0,
        sessionId: sessionId || 'global'
      };

      summary.forEach(item => {
        summaryData.totalConnections += item.count;
        switch (item._id) {
          case CONNECTION_STATUS.CONNECTED:
            summaryData.activeConnections = item.count;
            break;
          case CONNECTION_STATUS.DISCONNECTED:
            summaryData.disconnectedConnections = item.count;
            break;
          case CONNECTION_STATUS.ERROR:
          case CONNECTION_STATUS.EXPIRED:
            summaryData.errorConnections += item.count;
            break;
        }
      });

      // Process platform data
      const platformData = {};
      byPlatform.forEach(item => {
        const platform = item._id.platform;
        const status = item._id.status;
        
        if (!platformData[platform]) {
          platformData[platform] = {
            total: 0,
            active: 0,
            disconnected: 0,
            error: 0
          };
        }
        
        platformData[platform].total += item.count;
        switch (status) {
          case CONNECTION_STATUS.CONNECTED:
            platformData[platform].active = item.count;
            break;
          case CONNECTION_STATUS.DISCONNECTED:
            platformData[platform].disconnected = item.count;
            break;
          case CONNECTION_STATUS.ERROR:
          case CONNECTION_STATUS.EXPIRED:
            platformData[platform].error += item.count;
            break;
        }
      });

      return {
        summary: summaryData,
        byPlatform: platformData
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Refresh session for a connector
   */
  async refreshSession(connectorId, sessionId = null) {
    try {
      const connector = await this.getConnectorById(connectorId, sessionId);

      // Generate new session ID
      const newSessionId = encryptionService.generateSessionId('sess');
      
      // Simulate session refresh
      const refreshResult = await this.simulateSessionRefresh(connector, sessionId);
      
      if (!refreshResult.success) {
        const error = new Error('Failed to refresh session');
        error.statusCode = HTTP_STATUS.BAD_REQUEST;
        error.code = CONNECTOR_ERROR_CODES.SESSION_EXPIRED;
        throw error;
      }

      // Update connector
      connector.sessionId = newSessionId;
      connector.connectionStatus = CONNECTION_STATUS.CONNECTED;
      
      // Track session for this refresh
      if (sessionId) {
        connector.connectionDetails.sessionId = sessionId;
        connector.metadata.sessionId = sessionId;
      }

      await connector.save();

      return {
        sessionId: newSessionId,
        refreshedAt: new Date(),
        globalSessionId: connector.globalSessionId,
        trackingSessionId: sessionId || connector.globalSessionId
      };
    } catch (error) {
      throw error;
    }
  }

  // Simulation methods (replace with actual platform integrations)
  async simulatePlatformConnection(platform, sessionId = null) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate success (95% success rate)
    const isValid = Math.random() > 0.05;
    
    if (isValid) {
      return {
        success: true,
        platformUserId: platform + '_user_' + Math.random().toString(36).substr(2, 9),
        platformVersion: '2.1.0',
        apiVersion: 'v1',
        sessionId: sessionId
      };
    } else {
      return {
        success: false,
        error: 'Platform connection failed',
        sessionId: sessionId
      };
    }
  }

  async simulateDataSync(connector, options, sessionId = null) {
    // Simulate sync delay
    const duration = Math.random() * 3000 + 1000; // 1-4 seconds
    await new Promise(resolve => setTimeout(resolve, duration));
    
    // Simulate success rate of 90%
    const success = Math.random() > 0.1;
    
    if (success) {
      return {
        success: true,
        recordsCount: Math.floor(Math.random() * 500) + 50,
        duration: Math.floor(duration),
        sessionId: sessionId
      };
    } else {
      return {
        success: false,
        error: 'Simulated sync failure - rate limit exceeded',
        duration: Math.floor(duration),
        sessionId: sessionId
      };
    }
  }

  async simulateSessionRefresh(connector, sessionId = null) {
    // Simulate refresh delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: true,
      sessionId: sessionId
    };
  }
}

module.exports = new ConnectorService();