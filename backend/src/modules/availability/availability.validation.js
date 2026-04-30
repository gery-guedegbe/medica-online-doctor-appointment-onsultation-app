/**
 * MODULE: Availability - Validation
 * RESPONSABILITÉ:
 * Schémas Zod pour les endpoints de disponibilité
 *
 * RÈGLES CRITIQUES:
 * - day_of_week: 0=Lundi à 6=Dimanche (convention interne)
 * - Horaires au format HH:MM (UTC uniquement)
 * - end_time doit être strictement après start_time
 * - date au format YYYY-MM-DD pour la consultation des slots
 *
 * Voir: /docs/GUIDELINES_DOCS.md - Section 5
 */

const { z } = require('zod');

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

// Schéma pour POST /api/availability/rules
const createRuleSchema = z
  .object({
    day_of_week: z
      .number({ invalid_type_error: 'day_of_week doit être un entier entre 0 et 6' })
      .int()
      .min(0)
      .max(6),
    start_time: z.string().regex(timeRegex, 'Format attendu : HH:MM (ex: 09:00)'),
    end_time: z.string().regex(timeRegex, 'Format attendu : HH:MM (ex: 17:00)'),
  })
  .refine((data) => data.start_time < data.end_time, {
    message: 'end_time doit être après start_time',
    path: ['end_time'],
  });

// Schéma pour PUT /api/availability/rules/:id
const updateRuleSchema = z
  .object({
    start_time: z.string().regex(timeRegex, 'Format attendu : HH:MM').optional(),
    end_time: z.string().regex(timeRegex, 'Format attendu : HH:MM').optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Au moins un champ est requis',
  });

// Schéma pour GET /api/availability/slots (query params)
const getSlotsSchema = z.object({
  doctor_id: z.string().uuid('doctor_id invalide'),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Format attendu : YYYY-MM-DD (ex: 2026-05-15)'),
});

module.exports = { createRuleSchema, updateRuleSchema, getSlotsSchema };
