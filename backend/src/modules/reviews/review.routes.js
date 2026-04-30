/**
 * MODULE: Reviews - Routes
 * RESPONSABILITÉ: Endpoints avis avec Swagger
 * Voir: /docs/GUIDELINES_DOCS.md - Section 7 & 8
 */

const express = require('express');
const router = express.Router();

const reviewController = require('./review.controller');
const verifyAuth = require('../../shared/middlewares/auth');
const requireRole = require('../../shared/middlewares/requireRole');
const validate = require('../../shared/middlewares/validation');
const { createReviewSchema } = require('./review.validation');

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Avis et notations des médecins
 */

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Laisser un avis après un RDV terminé (patient)
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [appointment_id, stars]
 *             properties:
 *               appointment_id:
 *                 type: string
 *               stars:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *               recommend:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Avis créé, rating doctor mis à jour automatiquement
 *       400:
 *         description: RDV pas encore terminé (APPOINTMENT_NOT_COMPLETED)
 *       409:
 *         description: Avis déjà existant (REVIEW_ALREADY_EXISTS)
 */
router.post('/', verifyAuth, requireRole('patient'), validate(createReviewSchema), reviewController.create);

/**
 * @swagger
 * /api/reviews/doctor/{doctorId}:
 *   get:
 *     summary: Voir les avis d'un médecin
 *     tags: [Reviews]
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
 *         description: Avis + note moyenne retournés
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 reviews: []
 *                 count: 0
 *                 average_rating: "4.50"
 */
router.get('/doctor/:doctorId', verifyAuth, reviewController.getByDoctor);

module.exports = router;
