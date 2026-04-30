/**
 * MODULE: Appointments - Validation
 * RESPONSABILITÉ: Schémas Zod pour les rendez-vous
 * Voir: /docs/GUIDELINES_DOCS.md - Section 5
 */

const { z } = require('zod');

const createAppointmentSchema = z.object({
  doctor_id: z.string().uuid('doctor_id invalide'),
  package_id: z.string().uuid('package_id invalide'),
  start_time: z.string().datetime({ message: 'Format ISO 8601 requis (ex: 2026-05-15T09:00:00Z)' }),
  patient_name: z.string().min(2).max(255),
  patient_age: z.number().int().min(1).max(120),
  gender: z.enum(['male', 'female', 'other']).optional(),
  problem_description: z.string().min(5, 'Minimum 5 caractères').max(1000),
});

const rescheduleSchema = z.object({
  new_start_time: z.string().datetime({ message: 'Format ISO 8601 requis' }),
  reschedule_reason: z.string().min(5, 'Minimum 5 caractères').max(500),
});

const cancelSchema = z.object({
  cancellation_reason: z.string().min(3).max(500).optional(),
});

module.exports = { createAppointmentSchema, rescheduleSchema, cancelSchema };
