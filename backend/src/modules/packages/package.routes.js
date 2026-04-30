/**
 * MODULE: Packages - Routes
 * RESPONSABILITÉ: Endpoints packages médecin avec Swagger
 * Voir: /docs/GUIDELINES_DOCS.md - Section 7 & 8
 */

const express = require('express');
const router = express.Router();

const packageController = require('./package.controller');
const verifyAuth = require('../../shared/middlewares/auth');
const requireRole = require('../../shared/middlewares/requireRole');
const validate = require('../../shared/middlewares/validation');
const { createPackageSchema, updatePackageSchema } = require('./package.validation');

/**
 * @swagger
 * tags:
 *   name: Packages
 *   description: Packages de consultation médecin (messaging, video, voice)
 */

/**
 * @swagger
 * /api/packages:
 *   post:
 *     summary: Créer un package de consultation (doctor)
 *     tags: [Packages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [type, price, duration_minutes]
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [messaging, video, voice]
 *               price:
 *                 type: number
 *                 example: 25000
 *               duration_minutes:
 *                 type: integer
 *                 example: 30
 *     responses:
 *       201:
 *         description: Package créé
 *       409:
 *         description: Package déjà existant pour ce type
 */
router.post('/', verifyAuth, requireRole('doctor'), validate(createPackageSchema), packageController.create);

/**
 * @swagger
 * /api/packages/me:
 *   get:
 *     summary: Voir ses propres packages (doctor)
 *     tags: [Packages]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des packages
 */
router.get('/me', verifyAuth, requireRole('doctor'), packageController.getMyPackages);

/**
 * @swagger
 * /api/packages/doctor/{doctorId}:
 *   get:
 *     summary: Voir les packages actifs d'un médecin (patient)
 *     tags: [Packages]
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
 *         description: Packages actifs du médecin
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 packages:
 *                   - type: "messaging"
 *                     price: 15000
 *                     duration_minutes: 30
 *                   - type: "video"
 *                     price: 25000
 *                     duration_minutes: 30
 */
router.get('/doctor/:doctorId', verifyAuth, packageController.getByDoctor);

/**
 * @swagger
 * /api/packages/{id}:
 *   patch:
 *     summary: Modifier un package (doctor)
 *     tags: [Packages]
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
 *         description: Package mis à jour
 *   delete:
 *     summary: Supprimer un package (doctor)
 *     tags: [Packages]
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
 *         description: Package supprimé
 */
router.patch('/:id', verifyAuth, requireRole('doctor'), validate(updatePackageSchema), packageController.update);
router.delete('/:id', verifyAuth, requireRole('doctor'), packageController.remove);

module.exports = router;
