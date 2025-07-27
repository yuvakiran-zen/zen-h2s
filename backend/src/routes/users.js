const express = require('express');
const userController = require('../controllers/userController');
const { validateRequest, createUserSchema, updateProfileSchema, updatePreferencesSchema, getUsersQuerySchema } = require('../utils/validation');
const { userOperationsLimiter, createUserLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Apply rate limiting to all user routes
router.use(userOperationsLimiter);

/**
 * @swagger
 * /api/v1/users:
 *   post:
 *     summary: Create a new user
 *     description: Creates a new user with the provided information. Rate limited to 5 requests per minute.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserRequest'
 *           examples:
 *             basic_user:
 *               summary: Basic user creation
 *               value:
 *                 userId: "user_12345"
 *                 email: "john.doe@example.com"
 *                 firstName: "John"
 *                 lastName: "Doe"
 *             detailed_user:
 *               summary: Detailed user creation
 *               value:
 *                 userId: "user_67890"
 *                 email: "jane.smith@example.com"
 *                 firstName: "Jane"
 *                 lastName: "Smith"
 *                 dateOfBirth: "1985-03-20"
 *                 phoneNumber: "+91-9876543210"
 *                 city: "Bangalore"
 *                 country: "India"
 *                 income: 1500000
 *                 riskTolerance: "medium"
 *                 source: "web_signup"
 *                 referralCode: "REF123"
 *                 tags: ["premium", "early_adopter"]
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               message: "User created successfully"
 *               data:
 *                 id: "507f1f77bcf86cd799439011"
 *                 userId: "user_12345"
 *                 email: "john.doe@example.com"
 *                 profile:
 *                   firstName: "John"
 *                   lastName: "Doe"
 *                 status: "active"
 *                 createdAt: "2024-01-15T10:30:00Z"
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       409:
 *         $ref: '#/components/responses/Conflict'
 *       429:
 *         $ref: '#/components/responses/TooManyRequests'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post('/', 
  createUserLimiter,
  validateRequest(createUserSchema),
  userController.createUser
);

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Get users with pagination and filters
 *     description: Retrieves a paginated list of users with optional filtering and sorting capabilities.
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Number of users per page
 *         example: 20
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive, suspended]
 *         description: Filter by user status
 *         example: active
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: Filter by user city (case-insensitive partial match)
 *         example: Bangalore
 *       - in: query
 *         name: country
 *         schema:
 *           type: string
 *         description: Filter by user country (case-insensitive partial match)
 *         example: India
 *       - in: query
 *         name: riskTolerance
 *         schema:
 *           type: string
 *           enum: [low, medium, high]
 *         description: Filter by risk tolerance level
 *         example: medium
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, updatedAt, userId, email]
 *           default: createdAt
 *         description: Field to sort by
 *         example: createdAt
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
 *         example: desc
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserListResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       429:
 *         $ref: '#/components/responses/TooManyRequests'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/',
  validateRequest(getUsersQuerySchema, 'query'),
  userController.getUsers
);

/**
 * @swagger
 * /api/v1/users/{userId}:
 *   get:
 *     summary: Get user by userId
 *     description: Retrieves a specific user by their unique userId.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique user identifier
 *         example: user_12345
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       429:
 *         $ref: '#/components/responses/TooManyRequests'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/:userId', userController.getUserByUserId);

/**
 * @swagger
 * /api/v1/users/{userId}/profile:
 *   put:
 *     summary: Update user profile
 *     description: Updates the profile information of a specific user. At least one field must be provided.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique user identifier
 *         example: user_12345
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProfileRequest'
 *           examples:
 *             basic_update:
 *               summary: Basic profile update
 *               value:
 *                 firstName: "John"
 *                 lastName: "Smith"
 *                 city: "Mumbai"
 *             income_update:
 *               summary: Income and risk tolerance update
 *               value:
 *                 income: 1800000
 *                 riskTolerance: "high"
 *             contact_update:
 *               summary: Contact information update
 *               value:
 *                 phoneNumber: "+91-9876543210"
 *                 city: "Delhi"
 *                 country: "India"
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               message: "Profile updated successfully"
 *               data:
 *                 userId: "user_12345"
 *                 profile:
 *                   firstName: "John"
 *                   lastName: "Smith"
 *                   city: "Mumbai"
 *                   income: 1800000
 *                   riskTolerance: "high"
 *                 updatedAt: "2024-01-15T10:35:00Z"
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       429:
 *         $ref: '#/components/responses/TooManyRequests'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.put('/:userId/profile',
  validateRequest(updateProfileSchema),
  userController.updateUserProfile
);

/**
 * @swagger
 * /api/v1/users/{userId}/preferences:
 *   put:
 *     summary: Update user preferences
 *     description: Updates the preferences of a specific user including currency, language, and notification settings.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique user identifier
 *         example: user_12345
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePreferencesRequest'
 *           examples:
 *             currency_language:
 *               summary: Update currency and language
 *               value:
 *                 currency: "USD"
 *                 language: "hi"
 *             notifications:
 *               summary: Update notification preferences
 *               value:
 *                 notifications:
 *                   email: false
 *                   sms: true
 *                   push: true
 *             complete_preferences:
 *               summary: Update all preferences
 *               value:
 *                 currency: "EUR"
 *                 language: "en"
 *                 notifications:
 *                   email: true
 *                   sms: false
 *                   push: true
 *     responses:
 *       200:
 *         description: Preferences updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               message: "Preferences updated successfully"
 *               data:
 *                 userId: "user_12345"
 *                 preferences:
 *                   currency: "USD"
 *                   language: "hi"
 *                   notifications:
 *                     email: false
 *                     sms: true
 *                     push: true
 *                 updatedAt: "2024-01-15T10:40:00Z"
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       429:
 *         $ref: '#/components/responses/TooManyRequests'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.put('/:userId/preferences',
  validateRequest(updatePreferencesSchema),
  userController.updateUserPreferences
);

/**
 * @swagger
 * /api/v1/users/{userId}:
 *   delete:
 *     summary: Delete user
 *     description: Permanently deletes a user and all associated data. This action cannot be undone.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique user identifier
 *         example: user_12345
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User deleted successfully"
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       429:
 *         $ref: '#/components/responses/TooManyRequests'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.delete('/:userId', userController.deleteUser);

module.exports = router;