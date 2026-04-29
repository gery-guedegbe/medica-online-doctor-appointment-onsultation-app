/**
 * MODULE: Users - Routes
 * RESPONSABILITÉ:
 * Définir les endpoints utilisateur avec Swagger JSDoc
 *
 * RÈGLES CRITIQUES:
 * - Pas de logique métier ici
 * - verifyAuth sur toutes les routes
 * - requireRole('admin') pour les routes admin
 * - multer configuré ici pour l'upload avatar
 *
 * Voir: /docs/GUIDELINES_DOCS.md - Section 7 & 8
 */

const express = require('express');
const multer = require('multer');
const router = express.Router();

const userController = require('./user.controller');
const verifyAuth = require('../../shared/middlewares/auth');
const requireRole = require('../../shared/middlewares/requireRole');
const validate = require('../../shared/middlewares/validation');
const { updateProfileSchema, pinSchema } = require('./user.validation');
const AppError = require('../../shared/errors/AppError');

// Multer — stockage en mémoire, upload vers Supabase Storage ensuite
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 Mo max
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new AppError('Seules les images sont acceptées', 400, 'INVALID_FILE_TYPE'));
    }
  },
});

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gestion des profils utilisateur
 */

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Retourne le profil de l'utilisateur connecté
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil retourné
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 user:
 *                   id: "uuid"
 *                   email: "user@gmail.com"
 *                   full_name: "John Doe"
 *                   nickname: "johndoe"
 *                   date_of_birth: "1990-01-15"
 *                   gender: "male"
 *                   phone_number: "+22912345678"
 *                   avatar_url: "https://..."
 *                   role: "patient"
 *                 profile_complete: true
 *       401:
 *         description: Non authentifié
 */
router.get('/profile', verifyAuth, userController.getProfile);

/**
 * @swagger
 * /api/users/profile:
 *   patch:
 *     summary: Mettre à jour le profil (écran Fill Your Profile)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               full_name:
 *                 type: string
 *                 example: "John Doe"
 *               nickname:
 *                 type: string
 *                 example: "johndoe"
 *               date_of_birth:
 *                 type: string
 *                 example: "1990-01-15"
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *               phone_number:
 *                 type: string
 *                 example: "+22912345678"
 *     responses:
 *       200:
 *         description: Profil mis à jour
 *       400:
 *         description: Validation échouée
 *       409:
 *         description: Nickname déjà utilisé
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error:
 *                 code: "NICKNAME_TAKEN"
 *                 message: "Ce nickname est déjà utilisé"
 */
router.patch('/profile', verifyAuth, validate(updateProfileSchema), userController.updateProfile);

/**
 * @swagger
 * /api/users/avatar:
 *   post:
 *     summary: Uploader la photo de profil (Supabase Storage)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Avatar uploadé, URL retournée
 *       400:
 *         description: Fichier manquant ou format invalide
 */
router.post('/avatar', verifyAuth, upload.single('avatar'), userController.uploadAvatar);

/**
 * @swagger
 * /api/users/pin:
 *   post:
 *     summary: Créer le PIN de sécurité (4 chiffres)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pin
 *             properties:
 *               pin:
 *                 type: string
 *                 example: "1234"
 *                 description: Exactement 4 chiffres
 *     responses:
 *       200:
 *         description: PIN créé avec succès
 *       400:
 *         description: Format PIN invalide
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error:
 *                 code: "VALIDATION_ERROR"
 *                 message: "Le PIN doit contenir exactement 4 chiffres"
 */
router.post('/pin', verifyAuth, validate(pinSchema), userController.setPin);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Lister tous les utilisateurs (admin uniquement)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 *       403:
 *         description: Accès interdit
 */
router.get('/', verifyAuth, requireRole('admin'), userController.getAllUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Voir un utilisateur par son ID (admin uniquement)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Utilisateur retourné
 *       403:
 *         description: Accès interdit
 *       404:
 *         description: Utilisateur introuvable
 */
router.get('/:id', verifyAuth, requireRole('admin'), userController.getUserById);

module.exports = router;
