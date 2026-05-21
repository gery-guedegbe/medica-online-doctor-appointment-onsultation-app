/**
 * MODULE: Doctors - Validation
 * RESPONSABILITÉ:
 * Schémas Zod pour les endpoints médecin
 *
 * RÈGLES CRITIQUES:
 * - email requis pour la création (invitation Supabase)
 * - specialty obligatoire à la création
 * - Au moins un champ requis pour la mise à jour
 *
 * Voir: /docs/GUIDELINES_DOCS.md - Section 5
 */

const { z } = require('zod');

// Schéma pour POST /api/doctors (admin)
const createDoctorSchema = z.object({
  email: z.string().email('Email invalide'),
  specialty: z.string().min(2, 'Minimum 2 caractères').max(255),
  experience_years: z.number().int().min(0).max(60).optional(),
  bio: z.string().max(1000).optional(),
  hospital_name: z.string().max(255).optional(),
  hospital_address: z.string().max(255).optional(),
  hospital_country: z.string().max(100).optional(),
  patients_count: z.number().int().min(0).optional(),
});

// Schéma pour PATCH /api/doctors/me (doctor)
const updateDoctorSchema = z
  .object({
    specialty: z.string().min(2).max(255).optional(),
    experience_years: z.number().int().min(0).max(60).optional(),
    bio: z.string().max(1000).optional(),
    hospital_name: z.string().max(255).optional(),
    hospital_address: z.string().max(255).optional(),
    hospital_country: z.string().max(100).optional(),
    patients_count: z.number().int().min(0).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Au moins un champ est requis',
  });

module.exports = { createDoctorSchema, updateDoctorSchema };
