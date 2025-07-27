const crypto = require('crypto');
const CryptoJS = require('crypto-js');
const config = require('../config/environment');

class EncryptionService {
  constructor() {
    this.algorithm = 'aes-256-gcm';
    this.secretKey = config.encryption.key;
    this.keyLength = 32;
    this.ivLength = 16;
    this.tagLength = 16;
  }

  /**
   * Encrypt sensitive data using AES-256-GCM
   * @param {string} text - Text to encrypt
   * @returns {string} - Encrypted text with IV and auth tag
   */
  encrypt(text) {
    try {
      if (!text) return null;
      
      const iv = crypto.randomBytes(this.ivLength);
      const cipher = crypto.createCipher(this.algorithm, this.secretKey);
      cipher.setAAD(Buffer.from('financial-api', 'utf8'));
      
      let encrypted = cipher.update(text, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      const authTag = cipher.getAuthTag();
      
      // Combine IV, auth tag, and encrypted data
      const result = iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted;
      return result;
    } catch (error) {
      console.error('Encryption error:', error);
      throw new Error('Failed to encrypt data');
    }
  }

  /**
   * Decrypt sensitive data
   * @param {string} encryptedText - Encrypted text with IV and auth tag
   * @returns {string} - Decrypted text
   */
  decrypt(encryptedText) {
    try {
      if (!encryptedText) return null;
      
      const parts = encryptedText.split(':');
      if (parts.length !== 3) {
        throw new Error('Invalid encrypted data format');
      }
      
      const iv = Buffer.from(parts[0], 'hex');
      const authTag = Buffer.from(parts[1], 'hex');
      const encrypted = parts[2];
      
      const decipher = crypto.createDecipher(this.algorithm, this.secretKey);
      decipher.setAAD(Buffer.from('financial-api', 'utf8'));
      decipher.setAuthTag(authTag);
      
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      return decrypted;
    } catch (error) {
      console.error('Decryption error:', error);
      throw new Error('Failed to decrypt data');
    }
  }

  /**
   * Encrypt JSON object
   * @param {Object} obj - Object to encrypt
   * @returns {string} - Encrypted JSON string
   */
  encryptObject(obj) {
    try {
      const jsonString = JSON.stringify(obj);
      return this.encrypt(jsonString);
    } catch (error) {
      console.error('Object encryption error:', error);
      throw new Error('Failed to encrypt object');
    }
  }

  /**
   * Decrypt JSON object
   * @param {string} encryptedString - Encrypted JSON string
   * @returns {Object} - Decrypted object
   */
  decryptObject(encryptedString) {
    try {
      const decryptedString = this.decrypt(encryptedString);
      return JSON.parse(decryptedString);
    } catch (error) {
      console.error('Object decryption error:', error);
      throw new Error('Failed to decrypt object');
    }
  }

  /**
   * Generate secure session ID
   * @param {string} prefix - Prefix for session ID
   * @returns {string} - Secure session ID
   */
  generateSessionId(prefix = 'sess') {
    const timestamp = Date.now().toString(36);
    const randomBytes = crypto.randomBytes(16).toString('hex');
    return `${prefix}_${timestamp}_${randomBytes}`;
  }

  /**
   * Hash sensitive data (one-way)
   * @param {string} data - Data to hash
   * @returns {string} - Hashed data
   */
  hash(data) {
    try {
      return crypto.createHash('sha256').update(data + this.secretKey).digest('hex');
    } catch (error) {
      console.error('Hashing error:', error);
      throw new Error('Failed to hash data');
    }
  }

  /**
   * Verify hashed data
   * @param {string} data - Original data
   * @param {string} hash - Hash to verify against
   * @returns {boolean} - Verification result
   */
  verifyHash(data, hash) {
    try {
      const computedHash = this.hash(data);
      return computedHash === hash;
    } catch (error) {
      console.error('Hash verification error:', error);
      return false;
    }
  }
}

module.exports = new EncryptionService();