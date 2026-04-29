/**
 * MODULE: Auth - Routes
 * RESPONSABILITÉ:
 * Définir les endpoints de l'authentification
 * Swagger JSDoc pour chaque endpoint
 *
 * RÈGLES CRITIQUES:
 * - Pas de logique métier ici
 * - Swagger documenté pour chaque route
 * - Validation Zod avant le controller
 *
 * Voir: /docs/GUIDELINES_DOCS.md - Section 7 & 8
 */

const express = require('express');
const router = express.Router();

const authController = require('./auth.controller');
const verifyAuth = require('../../shared/middlewares/auth');
const validate = require('../../shared/middlewares/validation');
const { loginSchema } = require('./auth.validation');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentification des utilisateurs
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Connexion via token Supabase (Google OAuth)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 description: access_token obtenu depuis Supabase Auth sur le mobile
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: "uuid-v4"
 *                         email:
 *                           type: string
 *                           example: "user@gmail.com"
 *                         role:
 *                           type: string
 *                           example: "patient"
 *                         created_at:
 *                           type: string
 *                           example: "2026-04-28T10:00:00.000Z"
 *                     token:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Token manquant dans le body
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error:
 *                 code: "VALIDATION_ERROR"
 *                 message: "Le token Supabase est requis"
 *       401:
 *         description: Token invalide ou expiré
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error:
 *                 code: "INVALID_TOKEN"
 *                 message: "Token invalide ou expiré"
 */
router.post('/login', validate(loginSchema), authController.login);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Retourne l'utilisateur actuellement connecté
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Utilisateur retourné
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         email:
 *                           type: string
 *                         role:
 *                           type: string
 *                         created_at:
 *                           type: string
 *       401:
 *         description: Token manquant ou invalide
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error:
 *                 code: "MISSING_TOKEN"
 *                 message: "Token manquant"
 */
router.get('/me', verifyAuth, authController.getMe);

module.exports = router;
