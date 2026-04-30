/**
 * MODULE: Reviews - Validation
 * RESPONSABILITÉ: Schémas Zod pour les avis patients
 * Voir: /docs/GUIDELINES_DOCS.md - Section 5
 */

const { z } = require('zod');

const createReviewSchema = z.object({
  appointment_id: z.string().uuid('appointment_id invalide'),
  stars: z.number().int().min(1, 'Minimum 1 étoile').max(5, 'Maximum 5 étoiles'),
  comment: z.string().max(1000).optional(),
  recommend: z.boolean().optional(),
});

module.exports = { createReviewSchema };
