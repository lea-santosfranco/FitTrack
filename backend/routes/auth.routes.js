const express        = require('express');
const router         = express.Router();
const AuthController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');
const validate       = require('../middleware/validate.middleware');
const { registerValidator, loginValidator, updateProfileValidator } = require('../validators/auth.validator');

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Crée un compte utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, email, password]
 *             properties:
 *               username: { type: string }
 *               email: { type: string }
 *               password: { type: string }
 *               weight: { type: number }
 *               goal: { type: string, enum: [lose, maintain, gain] }
 *     responses:
 *       201: { description: Compte créé, JWT renvoyé }
 *       400: { description: Validation échouée }
 *       409: { description: Email ou username déjà utilisé }
 */
router.post('/register', registerValidator, validate, AuthController.register);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Authentifie un utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200: { description: JWT renvoyé }
 *       401: { description: Identifiants invalides }
 */
router.post('/login', loginValidator, validate, AuthController.login);

/**
 * @openapi
 * /auth/me:
 *   get:
 *     summary: Profil de l'utilisateur connecté
 *     tags: [Auth]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Profil utilisateur }
 *       401: { description: Non authentifié }
 */
router.get('/me', authMiddleware, AuthController.me);

/**
 * @openapi
 * /auth/profile:
 *   put:
 *     summary: Met à jour le profil de l'utilisateur connecté
 *     tags: [Auth]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Profil mis à jour }
 *       409: { description: Email ou username déjà utilisé }
 */
router.put('/profile', authMiddleware, updateProfileValidator, validate, AuthController.updateProfile);

module.exports = router;
