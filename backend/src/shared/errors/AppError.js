/**
 * CLASSE: Erreur Applicative Custom
 * RESPONSABILITÉ:
 * Standardiser toutes les erreurs de l'application
 * Fournir code erreur + message + status HTTP
 *
 * RÈGLES CRITIQUES:
 * - Toutes les erreurs métier passent par cette classe
 * - Jamais de res.status/json directement dans les services
 * - Le middleware errorHandler attrape automatiquement
 *
 * Voir: /docs/GUIDELINES_DOCS.md - Section 13
 */

class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
