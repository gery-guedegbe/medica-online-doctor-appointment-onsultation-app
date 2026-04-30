/**
 * MODULE: Availability - Routes
 * RESPONSABILITÉ:
 * Définir les endpoints de disponibilité avec Swagger JSDoc
 *
 * RÈGLES CRITIQUES:
 * - Pas de logique métier ici
 * - Routes règles: doctor uniquement (requireRole)
 * - Route slots: tous les utilisateurs authentifiés
 * - Swagger documenté pour chaque route
 *
 * Voir: /docs/GUIDELINES_DOCS.md - Section 7 & 8
 */

const express = require('express');
const router = express.Router();

const availabilityController = require('./availability.controller');
const verifyAuth = require('../../shared/middlewares/auth');
const requireRole = require('../../shared/middlewares/requireRole');
const validate = require('../../shared/middlewares/validation');
const { createRuleSchema, updateRuleSchema } = require('./availability.validation');

/**
 * @swagger
 * tags:
 *   name: Availability
 *   description: Gestion des disponibilités médecin
 */

/**
 * @swagger
 * /api/availability/rules:
 *   post:
 *     summary: Ajouter une règle de disponibilité hebdomadaire
 *     tags: [Availability]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - day_of_week
 *               - start_time
 *               - end_time
 *             properties:
 *               day_of_week:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 6
 *                 description: "0=Lundi, 1=Mardi, ..., 6=Dimanche"
 *                 example: 0
 *               start_time:
 *                 type: string
 *                 example: "09:00"
 *               end_time:
 *                 type: string
 *                 example: "17:00"
 *     responses:
 *       201:
 *         description: Règle créée
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 rule:
 *                   id: "uuid"
 *                   doctor_id: "uuid"
 *                   day_of_week: 0
 *                   start_time: "09:00:00"
 *                   end_time: "17:00:00"
 *       409:
 *         description: Règle déjà existante pour ce jour
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error:
 *                 code: "RULE_ALREADY_EXISTS"
 *                 message: "Une règle existe déjà pour le Lundi"
 *       403:
 *         description: Accès interdit — doctor uniquement
 */
router.post(
  '/rules',
  verifyAuth,
  requireRole('doctor'),
  validate(createRuleSchema),
  availabilityController.addRule
);

/**
 * @swagger
 * /api/availability/rules:
 *   get:
 *     summary: Voir le planning hebdomadaire du médecin connecté
 *     tags: [Availability]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des règles triées par jour
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 rules:
 *                   - id: "uuid"
 *                     day_of_week: 0
 *                     start_time: "09:00:00"
 *                     end_time: "17:00:00"
 *                 count: 1
 */
router.get('/rules', verifyAuth, requireRole('doctor'), availabilityController.getMyRules);

/**
 * @swagger
 * /api/availability/rules/{id}:
 *   put:
 *     summary: Modifier les horaires d'une règle
 *     tags: [Availability]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               start_time:
 *                 type: string
 *                 example: "10:00"
 *               end_time:
 *                 type: string
 *                 example: "18:00"
 *     responses:
 *       200:
 *         description: Règle mise à jour
 *       403:
 *         description: Accès interdit
 *       404:
 *         description: Règle introuvable
 */
router.put(
  '/rules/:id',
  verifyAuth,
  requireRole('doctor'),
  validate(updateRuleSchema),
  availabilityController.updateRule
);

/**
 * @swagger
 * /api/availability/rules/{id}:
 *   delete:
 *     summary: Supprimer une règle de disponibilité
 *     tags: [Availability]
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
 *         description: Règle supprimée
 *       403:
 *         description: Accès interdit
 *       404:
 *         description: Règle introuvable
 */
router.delete(
  '/rules/:id',
  verifyAuth,
  requireRole('doctor'),
  availabilityController.deleteRule
);

/**
 * @swagger
 * /api/availability/slots:
 *   get:
 *     summary: Créneaux disponibles d'un médecin à une date
 *     tags: [Availability]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: doctor_id
 *         required: true
 *         schema:
 *           type: string
 *         description: UUID du médecin (doctors.id)
 *         example: "uuid-doctor"
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *         description: Date au format YYYY-MM-DD (UTC)
 *         example: "2026-05-15"
 *     responses:
 *       200:
 *         description: Créneaux disponibles retournés
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 doctor_id: "uuid"
 *                 date: "2026-05-15"
 *                 day: "Vendredi"
 *                 working_hours:
 *                   start: "09:00"
 *                   end: "17:00"
 *                 slots:
 *                   - start: "09:00"
 *                     end: "09:30"
 *                     available: true
 *                   - start: "09:30"
 *                     end: "10:00"
 *                     available: false
 *       400:
 *         description: Paramètres invalides
 */
router.get('/slots', verifyAuth, availabilityController.getSlots);

module.exports = router;
