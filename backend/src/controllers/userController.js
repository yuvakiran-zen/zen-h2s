const userService = require('../services/userService');
const { HTTP_STATUS, ERROR_CODES } = require('../utils/constants');

class UserController {
  async createUser(req, res, next) {
    try {
      const user = await userService.createUser(req.body);
      
      res.status(HTTP_STATUS.CREATED).json({
        message: 'User created successfully',
        data: {
          id: user._id,
          userId: user.userId,
          email: user.email,
          profile: {
            firstName: user.profile.firstName,
            lastName: user.profile.lastName
          },
          status: user.status,
          createdAt: user.createdAt
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserByUserId(req, res, next) {
    try {
      const { userId } = req.params;
      const user = await userService.getUserByUserId(userId);
      
      res.status(HTTP_STATUS.OK).json({
        data: user
      });
    } catch (error) {
      if (error.statusCode === HTTP_STATUS.NOT_FOUND) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          error: {
            code: ERROR_CODES.USER_NOT_FOUND,
            message: 'User not found',
            timestamp: new Date().toISOString(),
            path: req.path
          }
        });
      }
      next(error);
    }
  }

  async updateUserProfile(req, res, next) {
    try {
      const { userId } = req.params;
      const user = await userService.updateUserProfile(userId, req.body);
      
      res.status(HTTP_STATUS.OK).json({
        message: 'Profile updated successfully',
        data: {
          userId: user.userId,
          profile: user.profile,
          updatedAt: user.updatedAt
        }
      });
    } catch (error) {
      if (error.statusCode === HTTP_STATUS.NOT_FOUND) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          error: {
            code: ERROR_CODES.USER_NOT_FOUND,
            message: 'User not found',
            timestamp: new Date().toISOString(),
            path: req.path
          }
        });
      }
      next(error);
    }
  }

  async updateUserPreferences(req, res, next) {
    try {
      const { userId } = req.params;
      const user = await userService.updateUserPreferences(userId, req.body);
      
      res.status(HTTP_STATUS.OK).json({
        message: 'Preferences updated successfully',
        data: {
          userId: user.userId,
          preferences: user.preferences,
          updatedAt: user.updatedAt
        }
      });
    } catch (error) {
      if (error.statusCode === HTTP_STATUS.NOT_FOUND) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          error: {
            code: ERROR_CODES.USER_NOT_FOUND,
            message: 'User not found',
            timestamp: new Date().toISOString(),
            path: req.path
          }
        });
      }
      next(error);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const { userId } = req.params;
      await userService.deleteUser(userId);
      
      res.status(HTTP_STATUS.OK).json({
        message: 'User deleted successfully'
      });
    } catch (error) {
      if (error.statusCode === HTTP_STATUS.NOT_FOUND) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          error: {
            code: ERROR_CODES.USER_NOT_FOUND,
            message: 'User not found',
            timestamp: new Date().toISOString(),
            path: req.path
          }
        });
      }
      next(error);
    }
  }

  async getUsers(req, res, next) {
    try {
      const result = await userService.getUsers(req.query);
      
      res.status(HTTP_STATUS.OK).json({
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();