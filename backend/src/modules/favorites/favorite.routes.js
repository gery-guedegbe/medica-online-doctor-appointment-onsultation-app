/**
 * MODULE: Favorites - Routes
 * RESPONSABILITÉ: Endpoints favoris avec Swagger
 * Voir: /docs/GUIDELINES_DOCS.md - Section 7 & 8
 */

const express = require('express');
const router = express.Router();

const favoriteController = require('./favorite.controller');
const verifyAuth = require('../../shared/middlewares/auth');
const requireRole = require('../../shared/middlewares/requireRole');

/**
 * @swagger
 * tags:
 *   name: Favorites
 *   description: Médecins favoris du patient
 */

/**
 * @swagger
 * /api/favorites:
 *   get:
 *     summary: Voir ses médecins favoris (patient)
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des favoris avec profil médecin
 *   post:
 *     summary: Ajouter un médecin aux favoris (patient)
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [doctor_id]
 *             properties:
 *               doctor_id:
 *                 type: string
 *                 example: "uuid-doctor"
 *     responses:
 *       201:
 *         description: Ajouté aux favoris
 *       409:
 *         description: Déjà en favoris (ALREADY_FAVORITE)
 */
router.get('/', verifyAuth, requireRole('patient'), favoriteController.getAll);
router.post('/', verifyAuth, requireRole('patient'), favoriteController.add);

/**
 * @swagger
 * /api/favorites/{doctorId}:
 *   delete:
 *     summary: Retirer un médecin des favoris (patient)
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: doctorId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Retiré des favoris
 */
router.delete('/:doctorId', verifyAuth, requireRole('patient'), favoriteController.remove);

module.exports = router;
