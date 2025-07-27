// Platform constants
const PLATFORMS = {
  FI_MONEY: 'fi_money',
  ZERODHA: 'zerodha'
};

// Connection status constants
const CONNECTION_STATUS = {
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
  ERROR: 'error',
  EXPIRED: 'expired',
  CONNECTING: 'connecting'
};

// Sync status constants
const SYNC_STATUS = {
  SUCCESS: 'success',
  FAILED: 'failed',
  PARTIAL: 'partial',
  IN_PROGRESS: 'in_progress'
};

// Data types constants
const DATA_TYPES = {
  TRANSACTIONS: 'transactions',
  PORTFOLIO: 'portfolio',
  PROFILE: 'profile',
  TRADES: 'trades',
  ANALYTICS: 'analytics'
};

// Account type constants
const ACCOUNT_TYPES = {
  BASIC: 'basic',
  PREMIUM: 'premium',
  PRO: 'pro'
};

// Error severity constants
const ERROR_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

// Error codes specific to connectors
const CONNECTOR_ERROR_CODES = {
  CONNECTION_FAILED: 'CONNECTION_FAILED',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  SESSION_EXPIRED: 'SESSION_EXPIRED',
  SYNC_FAILED: 'SYNC_FAILED',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  PLATFORM_UNAVAILABLE: 'PLATFORM_UNAVAILABLE',
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
  DATA_CORRUPTION: 'DATA_CORRUPTION',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  CONNECTOR_NOT_FOUND: 'CONNECTOR_NOT_FOUND',
  ALREADY_CONNECTED: 'ALREADY_CONNECTED',
  PLATFORM_MAINTENANCE: 'PLATFORM_MAINTENANCE'
};

// Default values
const DEFAULTS = {
  SYNC_INTERVAL: 5, // minutes
  RETRY_ATTEMPTS: 3,
  TIMEOUT: 30000, // 30 seconds
  PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  MAX_SYNC_HISTORY: 100,
  MAX_ERROR_HISTORY: 50
};

// Platform-specific configurations
const PLATFORM_CONFIG = {
  [PLATFORMS.FI_MONEY]: {
    name: 'Fi Money',
    baseUrl: 'https://api.fi.money',
    supportedDataTypes: [DATA_TYPES.TRANSACTIONS, DATA_TYPES.PORTFOLIO, DATA_TYPES.PROFILE],
    defaultDataTypes: [DATA_TYPES.TRANSACTIONS, DATA_TYPES.PORTFOLIO],
    maxSyncInterval: 30, // minutes
    minSyncInterval: 1,
    sessionTimeout: 3600000, // 1 hour in milliseconds
    rateLimits: {
      requests: 100,
      window: 60000 // 1 minute
    }
  },
  [PLATFORMS.ZERODHA]: {
    name: 'Zerodha',
    baseUrl: 'https://api.kite.trade',
    supportedDataTypes: [DATA_TYPES.PORTFOLIO, DATA_TYPES.TRADES, DATA_TYPES.PROFILE],
    defaultDataTypes: [DATA_TYPES.PORTFOLIO, DATA_TYPES.TRADES],
    maxSyncInterval: 60, // minutes
    minSyncInterval: 5,
    sessionTimeout: 7200000, // 2 hours in milliseconds
    rateLimits: {
      requests: 200,
      window: 60000 // 1 minute
    }
  }
};

// Sync intervals in minutes
const SYNC_INTERVALS = {
  REAL_TIME: 1,
  FREQUENT: 5,
  NORMAL: 15,
  SLOW: 30,
  HOURLY: 60
};

// HTTP status codes specific to connector operations
const CONNECTOR_HTTP_STATUS = {
  CONNECTION_SUCCESS: 201,
  SYNC_SUCCESS: 200,
  PARTIAL_SUCCESS: 206,
  INVALID_CREDENTIALS: 401,
  INSUFFICIENT_PERMISSIONS: 403,
  PLATFORM_NOT_FOUND: 404,
  ALREADY_CONNECTED: 409,
  RATE_LIMITED: 429,
  PLATFORM_ERROR: 502,
  SERVICE_UNAVAILABLE: 503,
  TIMEOUT: 504
};

// Notification types
const NOTIFICATION_TYPES = {
  CONNECTION_SUCCESS: 'connection_success',
  CONNECTION_FAILED: 'connection_failed',
  SYNC_SUCCESS: 'sync_success',
  SYNC_FAILED: 'sync_failed',
  SESSION_EXPIRED: 'session_expired',
  ERROR_ALERT: 'error_alert'
};

// Metrics and analytics constants
const METRICS = {
  CONNECTION_SUCCESS_RATE: 'connection_success_rate',
  SYNC_SUCCESS_RATE: 'sync_success_rate',
  AVERAGE_SYNC_DURATION: 'average_sync_duration',
  TOTAL_RECORDS_SYNCED: 'total_records_synced',
  ERROR_RATE: 'error_rate',
  UPTIME: 'uptime'
};

module.exports = {
  PLATFORMS,
  CONNECTION_STATUS,
  SYNC_STATUS,
  DATA_TYPES,
  ACCOUNT_TYPES,
  ERROR_SEVERITY,
  CONNECTOR_ERROR_CODES,
  DEFAULTS,
  PLATFORM_CONFIG,
  SYNC_INTERVALS,
  CONNECTOR_HTTP_STATUS,
  NOTIFICATION_TYPES,
  METRICS
};