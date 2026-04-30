/**
 * MODULE: Appointments - Routes
 * RESPONSABILITÉ: Endpoints rendez-vous avec Swagger
 * Voir: /docs/GUIDELINES_DOCS.md - Section 7 & 8
 */

const express = require('express');
const router = express.Router();

const appointmentController = require('./appointment.controller');
const verifyAuth = require('../../shared/middlewares/auth');
const requireRole = require('../../shared/middlewares/requireRole');
const validate = require('../../shared/middlewares/validation');
const {
  createAppointmentSchema,
  rescheduleSchema,
  cancelSchema,
} = require('./appointment.validation');

/**
 * @swagger
 * tags:
 *   name: Appointments
 *   description: Gestion des rendez-vous médicaux
 */

/**
 * @swagger
 * /api/appointments:
 *   post:
 *     summary: Réserver un rendez-vous (patient)
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [doctor_id, package_id, start_time, patient_name, patient_age, problem_description]
 *             properties:
 *               doctor_id:
 *                 type: string
 *                 example: "uuid-doctor"
 *               package_id:
 *                 type: string
 *                 example: "uuid-package"
 *               start_time:
 *                 type: string
 *                 example: "2026-05-15T09:00:00Z"
 *               patient_name:
 *                 type: string
 *                 example: "Fabien Guedegbe"
 *               patient_age:
 *                 type: integer
 *                 example: 30
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *               problem_description:
 *                 type: string
 *                 example: "Douleurs thoraciques depuis 3 jours"
 *     responses:
 *       201:
 *         description: Rendez-vous créé
 *       409:
 *         description: Créneau déjà réservé (SLOT_TAKEN)
 */
router.post('/', verifyAuth, requireRole('patient'), validate(createAppointmentSchema), appointmentController.book);

/**
 * @swagger
 * /api/appointments:
 *   get:
 *     summary: Voir ses rendez-vous (patient ou doctor)
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [upcoming, completed, cancelled]
 *     responses:
 *       200:
 *         description: Liste des rendez-vous
 */
router.get('/', verifyAuth, appointmentController.getAll);

/**
 * @swagger
 * /api/appointments/{id}:
 *   get:
 *     summary: Détail d'un rendez-vous
 *     tags: [Appointments]
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
 *         description: Détail retourné
 *       403:
 *         description: Accès interdit
 *       404:
 *         description: Introuvable
 */
router.get('/:id', verifyAuth, appointmentController.getById);

/**
 * @swagger
 * /api/appointments/{id}/cancel:
 *   patch:
 *     summary: Annuler un rendez-vous (patient ≥2h avant, doctor toujours)
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cancellation_reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: RDV annulé
 *       400:
 *         description: Annulation trop tardive (CANCELLATION_TOO_LATE)
 */
router.patch('/:id/cancel', verifyAuth, appointmentController.cancel);

/**
 * @swagger
 * /api/appointments/{id}/complete:
 *   patch:
 *     summary: Marquer un rendez-vous comme terminé (doctor)
 *     tags: [Appointments]
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
 *         description: RDV marqué terminé
 *       403:
 *         description: Accès interdit
 */
router.patch('/:id/complete', verifyAuth, requireRole('doctor'), appointmentController.complete);

/**
 * @swagger
 * /api/appointments/{id}/reschedule:
 *   patch:
 *     summary: Replannifier un rendez-vous (patient, max 1 fois)
 *     tags: [Appointments]
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
 *             required: [new_start_time, reschedule_reason]
 *             properties:
 *               new_start_time:
 *                 type: string
 *                 example: "2026-05-20T10:00:00Z"
 *               reschedule_reason:
 *                 type: string
 *                 example: "Conflit d'agenda"
 *     responses:
 *       200:
 *         description: RDV replannifié
 *       400:
 *         description: Max replannification atteint (MAX_RESCHEDULE_REACHED)
 */
router.patch(
  '/:id/reschedule',
  verifyAuth,
  requireRole('patient'),
  validate(rescheduleSchema),
  appointmentController.reschedule
);

module.exports = router;
