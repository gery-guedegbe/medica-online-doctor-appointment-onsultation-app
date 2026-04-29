/**
 * MIDDLEWARE: Validation Zod
 * RESPONSABILITÉ:
 * Valider les payloads des requêtes avec Zod
 * Rejeter les données invalides
 *
 * RÈGLES CRITIQUES:
 * - Schéma défini dans chaque module
 * - Middleware utilisé route par route
 * - Messages d'erreur clairs
 *
 * Voir: /docs/GUIDELINES_DOCS.md - Section 5
 */

const AppError = require('../errors/AppError');

/**
 * Factory: crée un middleware de validation
 * @param {Object} schema - Schéma Zod
 */
const validate = (schema) => {
  return (req, res, next) => {
    try {
      // Valider body par défaut
      const validated = schema.parse(req.body);
      req.validatedData = validated;
      next();
    } catch (err) {
      if (err.errors) {
        // Erreur Zod
        const message = err.errors[0].message;
        next(new AppError(message, 400, 'VALIDATION_ERROR'));
      } else {
        next(err);
      }
    }
  };
};

module.exports = validate;
