const connectorService = require('../services/connectorService');
const { HTTP_STATUS } = require('../utils/constants');
const { CONNECTOR_ERROR_CODES, CONNECTOR_HTTP_STATUS } = require('../utils/connectorConstants');

class ConnectorController {
  // Helper method to extract sessionId from request
  getSessionId(req) {
    return req.headers['x-session-id'] || req.body.sessionId || req.query.sessionId || null;
  }

  async createConnector(req, res, next) {
    try {
      const sessionId = this.getSessionId(req);
      const connector = await connectorService.createConnector({ ...req.body, sessionId });
      
      res.status(CONNECTOR_HTTP_STATUS.CONNECTION_SUCCESS).json({
        message: 'Connected successfully',
        data: {
          id: connector._id,
          userId: connector.userId,
          platform: connector.platform,
          sessionId: connector.sessionId,
          globalSessionId: connector.globalSessionId,
          connectionStatus: connector.connectionStatus,
          connectedAt: connector.connectionDetails.connectedAt,
          dataTypes: connector.metadata.dataTypes,
          syncInterval: connector.connectionDetails.syncInterval,
          accountType: connector.metadata.accountType,
          trackingSessionId: sessionId || connector.globalSessionId
        }
      });
    } catch (error) {
      if (error.statusCode === CONNECTOR_HTTP_STATUS.ALREADY_CONNECTED) {
        return res.status(CONNECTOR_HTTP_STATUS.ALREADY_CONNECTED).json({
          error: {
            code: CONNECTOR_ERROR_CODES.ALREADY_CONNECTED,
            message: 'Already connected to this platform',
            timestamp: new Date().toISOString(),
            path: req.path,
            sessionId: this.getSessionId(req)
          }
        });
      }
      if (error.statusCode === CONNECTOR_HTTP_STATUS.INVALID_CREDENTIALS) {
        return res.status(CONNECTOR_HTTP_STATUS.INVALID_CREDENTIALS).json({
          error: {
            code: CONNECTOR_ERROR_CODES.INVALID_CREDENTIALS,
            message: 'Failed to connect to platform',
            timestamp: new Date().toISOString(),
            path: req.path,
            sessionId: this.getSessionId(req)
          }
        });
      }
      next(error);
    }
  }

  async getConnectorById(req, res, next) {
    try {
      const { connectorId } = req.params;
      const sessionId = this.getSessionId(req);
      const connector = await connectorService.getConnectorById(connectorId, sessionId);
      
      res.status(HTTP_STATUS.OK).json({
        data: {
          id: connector._id,
          userId: connector.userId,
          platform: connector.platform,
          connectionStatus: connector.connectionStatus,
          sessionId: connector.sessionId,
          globalSessionId: connector.globalSessionId,
          connectionDetails: {
            connectedAt: connector.connectionDetails.connectedAt,
            disconnectedAt: connector.connectionDetails.disconnectedAt,
            lastSyncAt: connector.connectionDetails.lastSyncAt,
            sessionDuration: connector.connectionDetails.sessionDuration,
            syncInterval: connector.connectionDetails.syncInterval,
            autoSync: connector.connectionDetails.autoSync,
            nextSyncAt: connector.connectionDetails.nextSyncAt,
            sessionId: connector.connectionDetails.sessionId
          },
          metadata: {
            ...connector.metadata,
            sessionId: connector.metadata.sessionId
          },
          syncHistory: connector.syncHistory.slice(-10).map(sync => ({
            ...sync,
            sessionId: sync.sessionId
          })), // Last 10 syncs with sessionId
          statistics: {
            ...connector.statistics,
            successRate: connector.successRate,
            sessionId: connector.statistics.sessionId
          },
          settings: {
            ...connector.settings,
            sessionId: connector.settings.sessionId
          },
          createdAt: connector.createdAt,
          updatedAt: connector.updatedAt,
          trackingSessionId: sessionId || connector.globalSessionId
        }
      });
    } catch (error) {
      if (error.statusCode === HTTP_STATUS.NOT_FOUND) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          error: {
            code: CONNECTOR_ERROR_CODES.CONNECTOR_NOT_FOUND,
            message: 'Connector not found',
            timestamp: new Date().toISOString(),
            path: req.path,
            sessionId: this.getSessionId(req)
          }
        });
      }
      next(error);
    }
  }

  async getUserConnectors(req, res, next) {
    try {
      const { userId } = req.params;
      const sessionId = this.getSessionId(req);
      const result = await connectorService.getUserConnectors(userId, sessionId);
      
      res.status(HTTP_STATUS.OK).json({
        data: {
          ...result,
          trackingSessionId: sessionId || 'global'
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async getConnectorByUserAndPlatform(req, res, next) {
    try {
      const { userId, platform } = req.params;
      const sessionId = this.getSessionId(req);
      const connector = await connectorService.getConnectorByUserAndPlatform(userId, platform, sessionId);
      
      res.status(HTTP_STATUS.OK).json({
        data: {
          connector: {
            id: connector._id,
            userId: connector.userId,
            platform: connector.platform,
            connectionStatus: connector.connectionStatus,
            sessionId: connector.sessionId,
            globalSessionId: connector.globalSessionId,
            connectedAt: connector.connectionDetails.connectedAt,
            disconnectedAt: connector.connectionDetails.disconnectedAt,
            sessionDuration: connector.connectionDetails.sessionDuration,
            lastSyncAt: connector.connectionDetails.lastSyncAt,
            syncInterval: connector.connectionDetails.syncInterval,
            dataTypes: connector.metadata.dataTypes,
            accountType: connector.metadata.accountType,
            trackingSessionId: sessionId || connector.globalSessionId
          }
        }
      });
    } catch (error) {
      if (error.statusCode === HTTP_STATUS.NOT_FOUND) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          error: {
            code: CONNECTOR_ERROR_CODES.CONNECTOR_NOT_FOUND,
            message: 'No connection found for this platform',
            timestamp: new Date().toISOString(),
            path: req.path,
            sessionId: this.getSessionId(req)
          }
        });
      }
      next(error);
    }
  }

  async disconnectConnector(req, res, next) {
    try {
      const { connectorId } = req.params;
      const sessionId = this.getSessionId(req);
      const result = await connectorService.disconnectConnector(connectorId, sessionId);
      
      res.status(HTTP_STATUS.OK).json({
        message: 'Disconnected successfully',
        data: {
          ...result,
          trackingSessionId: sessionId || result.sessionId
        }
      });
    } catch (error) {
      if (error.statusCode === HTTP_STATUS.NOT_FOUND) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          error: {
            code: CONNECTOR_ERROR_CODES.CONNECTOR_NOT_FOUND,
            message: 'Connector not found',
            timestamp: new Date().toISOString(),
            path: req.path,
            sessionId: this.getSessionId(req)
          }
        });
      }
      next(error);
    }
  }

  async updateSyncSettings(req, res, next) {
    try {
      const { connectorId } = req.params;
      const sessionId = this.getSessionId(req);
      const connector = await connectorService.updateSyncSettings(connectorId, req.body, sessionId);
      
      res.status(HTTP_STATUS.OK).json({
        message: 'Sync settings updated successfully',
        data: {
          syncInterval: connector.connectionDetails.syncInterval,
          autoSync: connector.connectionDetails.autoSync,
          dataTypes: connector.metadata.dataTypes,
          settings: connector.settings,
          nextSyncAt: connector.connectionDetails.nextSyncAt,
          sessionId: connector.sessionId,
          globalSessionId: connector.globalSessionId,
          trackingSessionId: sessionId || connector.globalSessionId
        }
      });
    } catch (error) {
      if (error.statusCode === HTTP_STATUS.NOT_FOUND) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          error: {
            code: CONNECTOR_ERROR_CODES.CONNECTOR_NOT_FOUND,
            message: 'Connector not found',
            timestamp: new Date().toISOString(),
            path: req.path,
            sessionId: this.getSessionId(req)
          }
        });
      }
      next(error);
    }
  }

  async triggerManualSync(req, res, next) {
    try {
      const { connectorId } = req.params;
      const sessionId = this.getSessionId(req);
      const result = await connectorService.triggerManualSync(connectorId, req.body, sessionId);
      
      res.status(HTTP_STATUS.OK).json({
        message: 'Sync initiated successfully',
        data: {
          ...result,
          trackingSessionId: sessionId || result.sessionId
        }
      });
    } catch (error) {
      if (error.statusCode === HTTP_STATUS.NOT_FOUND) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          error: {
            code: CONNECTOR_ERROR_CODES.CONNECTOR_NOT_FOUND,
            message: 'Connector not found',
            timestamp: new Date().toISOString(),
            path: req.path,
            sessionId: this.getSessionId(req)
          }
        });
      }
      if (error.statusCode === HTTP_STATUS.BAD_REQUEST) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          error: {
            code: error.code || CONNECTOR_ERROR_CODES.CONNECTION_FAILED,
            message: error.message,
            timestamp: new Date().toISOString(),
            path: req.path,
            sessionId: this.getSessionId(req)
          }
        });
      }
      next(error);
    }
  }

  async getSyncStatus(req, res, next) {
    try {
      const { connectorId } = req.params;
      const sessionId = this.getSessionId(req);
      const connector = await connectorService.getConnectorById(connectorId, sessionId);
      
      const recentSyncHistory = connector.syncHistory.slice(-20); // Last 20 syncs
      const successfulSyncs = recentSyncHistory.filter(sync => sync.status === 'success');
      const failedSyncs = recentSyncHistory.filter(sync => sync.status === 'failed');
      
      res.status(HTTP_STATUS.OK).json({
        data: {
          lastSyncAt: connector.connectionDetails.lastSyncAt,
          nextSyncAt: connector.connectionDetails.nextSyncAt,
          syncInterval: connector.connectionDetails.syncInterval,
          autoSync: connector.connectionDetails.autoSync,
          syncHistory: recentSyncHistory.map(sync => ({
            ...sync,
            sessionId: sync.sessionId
          })),
          totalSyncs: connector.statistics.totalSyncs,
          successfulSyncs: connector.statistics.successfulSyncs,
          failedSyncs: connector.statistics.failedSyncs,
          successRate: parseFloat(connector.successRate),
          averageSyncDuration: connector.statistics.averageSyncDuration,
          totalRecordsSynced: connector.statistics.totalRecordsSynced,
          lastSuccessfulSync: connector.statistics.lastSuccessfulSync,
          sessionId: connector.sessionId,
          globalSessionId: connector.globalSessionId,
          trackingSessionId: sessionId || connector.globalSessionId
        }
      });
    } catch (error) {
      if (error.statusCode === HTTP_STATUS.NOT_FOUND) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          error: {
            code: CONNECTOR_ERROR_CODES.CONNECTOR_NOT_FOUND,
            message: 'Connector not found',
            timestamp: new Date().toISOString(),
            path: req.path,
            sessionId: this.getSessionId(req)
          }
        });
      }
      next(error);
    }
  }

  async refreshSession(req, res, next) {
    try {
      const { connectorId } = req.params;
      const sessionId = this.getSessionId(req);
      const result = await connectorService.refreshSession(connectorId, sessionId);
      
      res.status(HTTP_STATUS.OK).json({
        message: 'Session refreshed successfully',
        data: {
          ...result,
          trackingSessionId: sessionId || result.trackingSessionId
        }
      });
    } catch (error) {
      if (error.statusCode === HTTP_STATUS.NOT_FOUND) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          error: {
            code: CONNECTOR_ERROR_CODES.CONNECTOR_NOT_FOUND,
            message: 'Connector not found',
            timestamp: new Date().toISOString(),
            path: req.path,
            sessionId: this.getSessionId(req)
          }
        });
      }
      if (error.statusCode === HTTP_STATUS.BAD_REQUEST) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          error: {
            code: error.code || CONNECTOR_ERROR_CODES.SESSION_EXPIRED,
            message: error.message,
            timestamp: new Date().toISOString(),
            path: req.path,
            sessionId: this.getSessionId(req)
          }
        });
      }
      next(error);
    }
  }

  async getConnectionStatusSummary(req, res, next) {
    try {
      const sessionId = this.getSessionId(req);
      const result = await connectorService.getConnectionStatusSummary({ ...req.query, sessionId });
      
      res.status(HTTP_STATUS.OK).json({
        data: {
          ...result,
          trackingSessionId: sessionId || 'global'
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ConnectorController();