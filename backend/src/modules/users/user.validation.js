/**
 * MODULE: Users - Validation
 * RESPONSABILITÉ:
 * Schémas Zod pour les endpoints utilisateur
 *
 * RÈGLES CRITIQUES:
 * - PIN = exactement 4 chiffres numériques
 * - Date de naissance au format ISO (YYYY-MM-DD)
 * - Au moins un champ requis pour la mise à jour du profil
 *
 * Voir: /docs/GUIDELINES_DOCS.md - Section 5
 */

const { z } = require('zod');

// Schéma pour PATCH /api/users/profile
const updateProfileSchema = z
  .object({
    full_name: z.string().min(2, 'Minimum 2 caractères').max(255).optional(),
    nickname: z.string().min(2, 'Minimum 2 caractères').max(100).optional(),
    date_of_birth: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Format attendu : YYYY-MM-DD')
      .optional(),
    gender: z
      .enum(['male', 'female', 'other'], {
        errorMap: () => ({ message: 'Valeur acceptée : male, female, other' }),
      })
      .optional(),
    phone_number: z.string().min(8, 'Minimum 8 caractères').max(20).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Au moins un champ est requis',
  });

// Schéma pour POST /api/users/pin
const pinSchema = z.object({
  pin: z
    .string()
    .length(4, 'Le PIN doit contenir exactement 4 chiffres')
    .regex(/^\d{4}$/, 'Le PIN doit contenir uniquement des chiffres'),
});

module.exports = { updateProfileSchema, pinSchema };
