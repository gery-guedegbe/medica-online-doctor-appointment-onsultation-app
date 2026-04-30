/**
 * MODULE: Packages - Validation
 * RESPONSABILITÉ: Schémas Zod pour les packages médecin
 * Voir: /docs/GUIDELINES_DOCS.md - Section 5
 */

const { z } = require('zod');

const createPackageSchema = z.object({
  type: z.enum(['messaging', 'video', 'voice'], {
    errorMap: () => ({ message: 'Type accepté : messaging, video, voice' }),
  }),
  price: z.number().min(0, 'Prix invalide'),
  duration_minutes: z.number().int().min(5).max(120),
});

const updatePackageSchema = z
  .object({
    price: z.number().min(0).optional(),
    duration_minutes: z.number().int().min(5).max(120).optional(),
    is_active: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Au moins un champ est requis',
  });

module.exports = { createPackageSchema, updatePackageSchema };
