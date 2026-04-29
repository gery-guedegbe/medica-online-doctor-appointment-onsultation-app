/**
 * MODULE: Auth - Validation
 * RESPONSABILITÉ:
 * Définir les schémas Zod pour les endpoints d'authentification
 *
 * RÈGLES CRITIQUES:
 * - Valider uniquement ce qui est reçu du client
 * - Messages d'erreur clairs en français
 *
 * Voir: /docs/GUIDELINES_DOCS.md - Section 5
 */

const { z } = require('zod');

// Schéma pour POST /api/auth/login
const loginSchema = z.object({
  token: z.string().min(1, 'Le token Supabase est requis'),
});

module.exports = { loginSchema };
