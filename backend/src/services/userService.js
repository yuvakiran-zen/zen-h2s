const User = require('../models/User');
const { ERROR_CODES, HTTP_STATUS, DEFAULTS } = require('../utils/constants');

class UserService {
  async createUser(userData) {
    try {
      // Prepare user data
      const userDoc = {
        userId: userData.userId,
        email: userData.email,
        profile: {
          firstName: userData.firstName,
          lastName: userData.lastName,
          dateOfBirth: userData.dateOfBirth,
          phoneNumber: userData.phoneNumber,
          city: userData.city,
          country: userData.country,
          income: userData.income,
          riskTolerance: userData.riskTolerance
        },
        metadata: {
          source: userData.source,
          referralCode: userData.referralCode,
          tags: userData.tags || []
        }
      };

      // Remove undefined values from profile
      Object.keys(userDoc.profile).forEach(key => {
        if (userDoc.profile[key] === undefined) {
          delete userDoc.profile[key];
        }
      });

      const user = new User(userDoc);
      await user.save();
      
      return user;
    } catch (error) {
      throw error;
    }
  }

  async getUserByUserId(userId) {
    try {
      const user = await User.findOne({ userId });
      if (!user) {
        const error = new Error('User not found');
        error.statusCode = HTTP_STATUS.NOT_FOUND;
        error.code = ERROR_CODES.USER_NOT_FOUND;
        throw error;
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  async updateUserProfile(userId, profileData) {
    try {
      const user = await User.findOne({ userId });
      if (!user) {
        const error = new Error('User not found');
        error.statusCode = HTTP_STATUS.NOT_FOUND;
        error.code = ERROR_CODES.USER_NOT_FOUND;
        throw error;
      }

      // Update profile fields
      Object.keys(profileData).forEach(key => {
        if (profileData[key] !== undefined) {
          user.profile[key] = profileData[key];
        }
      });

      user.updatedAt = new Date();
      await user.save();
      
      return user;
    } catch (error) {
      throw error;
    }
  }

  async updateUserPreferences(userId, preferencesData) {
    try {
      const user = await User.findOne({ userId });
      if (!user) {
        const error = new Error('User not found');
        error.statusCode = HTTP_STATUS.NOT_FOUND;
        error.code = ERROR_CODES.USER_NOT_FOUND;
        throw error;
      }

      // Update preferences
      if (preferencesData.currency) {
        user.preferences.currency = preferencesData.currency;
      }
      if (preferencesData.language) {
        user.preferences.language = preferencesData.language;
      }
      if (preferencesData.notifications) {
        Object.keys(preferencesData.notifications).forEach(key => {
          if (preferencesData.notifications[key] !== undefined) {
            user.preferences.notifications[key] = preferencesData.notifications[key];
          }
        });
      }

      user.updatedAt = new Date();
      await user.save();
      
      return user;
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(userId) {
    try {
      const user = await User.findOneAndDelete({ userId });
      if (!user) {
        const error = new Error('User not found');
        error.statusCode = HTTP_STATUS.NOT_FOUND;
        error.code = ERROR_CODES.USER_NOT_FOUND;
        throw error;
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  async getUsers(queryParams) {
    try {
      const {
        page = 1,
        limit = DEFAULTS.PAGE_SIZE,
        status,
        city,
        country,
        riskTolerance,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = queryParams;

      // Build filter object
      const filter = {};
      if (status) filter.status = status;
      if (city) filter['profile.city'] = new RegExp(city, 'i');
      if (country) filter['profile.country'] = new RegExp(country, 'i');
      if (riskTolerance) filter['profile.riskTolerance'] = riskTolerance;

      // Build sort object
      const sort = {};
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

      // Calculate pagination
      const skip = (page - 1) * limit;

      // Execute queries
      const [users, totalUsers] = await Promise.all([
        User.find(filter)
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .lean(),
        User.countDocuments(filter)
      ]);

      // Calculate pagination info
      const totalPages = Math.ceil(totalUsers / limit);
      const hasNext = page < totalPages;
      const hasPrev = page > 1;

      return {
        users: users.map(user => {
          const { _id, __v, ...userWithoutMeta } = user;
          return { id: _id, ...userWithoutMeta };
        }),
        pagination: {
          currentPage: page,
          totalPages,
          totalUsers,
          hasNext,
          hasPrev,
          limit
        }
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new UserService();