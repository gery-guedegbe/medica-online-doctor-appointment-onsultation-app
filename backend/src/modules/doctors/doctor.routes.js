/**
 * MODULE: Doctors - Routes
 * RESPONSABILITÉ:
 * Définir les endpoints médecin avec Swagger JSDoc
 *
 * RÈGLES CRITIQUES:
 * - Pas de logique métier ici
 * - /me DOIT être déclaré AVANT /:id (sinon Express matche "me" comme un ID)
 * - requireRole('admin') pour la création
 * - requireRole('doctor') pour les routes /me
 *
 * Voir: /docs/GUIDELINES_DOCS.md - Section 7 & 8
 */

const express = require('express');
const router = express.Router();

const doctorController = require('./doctor.controller');
const verifyAuth = require('../../shared/middlewares/auth');
const requireRole = require('../../shared/middlewares/requireRole');
const validate = require('../../shared/middlewares/validation');
const { createDoctorSchema, updateDoctorSchema } = require('./doctor.validation');

/**
 * @swagger
 * tags:
 *   name: Doctors
 *   description: Gestion des profils médecins
 */

/**
 * @swagger
 * /api/doctors:
 *   post:
 *     summary: Créer un médecin et envoyer une invitation email (admin)
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - specialty
 *             properties:
 *               email:
 *                 type: string
 *                 example: "dr.dupont@gmail.com"
 *               specialty:
 *                 type: string
 *                 example: "Cardiologie"
 *               experience_years:
 *                 type: integer
 *                 example: 10
 *               bio:
 *                 type: string
 *                 example: "Médecin spécialisé en cardiologie..."
 *     responses:
 *       201:
 *         description: Médecin créé, invitation email envoyée
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 doctor:
 *                   id: "uuid"
 *                   specialty: "Cardiologie"
 *                   experience_years: 10
 *                   rating: null
 *                   bio: "..."
 *                   users:
 *                     email: "dr.dupont@gmail.com"
 *                     full_name: null
 *                     avatar_url: null
 *       409:
 *         description: Email déjà enregistré
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error:
 *                 code: "EMAIL_ALREADY_EXISTS"
 *                 message: "Cet email est déjà enregistré"
 *       403:
 *         description: Accès interdit — admin uniquement
 */
router.post(
  '/',
  verifyAuth,
  requireRole('admin'),
  validate(createDoctorSchema),
  doctorController.create
);

/**
 * @swagger
 * /api/doctors:
 *   get:
 *     summary: Lister tous les médecins
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: specialty
 *         schema:
 *           type: string
 *         description: Filtrer par spécialité (recherche partielle)
 *         example: "Cardio"
 *     responses:
 *       200:
 *         description: Liste des médecins retournée
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 doctors: []
 *                 count: 0
 */
router.get('/', verifyAuth, doctorController.getAll);

/**
 * @swagger
 * /api/doctors/me:
 *   get:
 *     summary: Retourne le profil du médecin connecté
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil médecin retourné
 *       403:
 *         description: Accès interdit — doctor uniquement
 *       404:
 *         description: Profil médecin introuvable
 */
router.get('/me', verifyAuth, requireRole('doctor'), doctorController.getMe);

/**
 * @swagger
 * /api/doctors/me:
 *   patch:
 *     summary: Modifier le profil du médecin connecté
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               specialty:
 *                 type: string
 *               experience_years:
 *                 type: integer
 *               bio:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profil mis à jour
 *       403:
 *         description: Accès interdit — doctor uniquement
 */
router.patch(
  '/me',
  verifyAuth,
  requireRole('doctor'),
  validate(updateDoctorSchema),
  doctorController.updateMe
);

/**
 * @swagger
 * /api/doctors/{id}:
 *   get:
 *     summary: Retourne le profil d'un médecin par son ID
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: UUID du médecin (doctors.id)
 *     responses:
 *       200:
 *         description: Profil médecin retourné
 *       404:
 *         description: Médecin introuvable
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error:
 *                 code: "NOT_FOUND"
 *                 message: "Médecin introuvable"
 */
router.get('/:id', verifyAuth, doctorController.getById);

module.exports = router;
