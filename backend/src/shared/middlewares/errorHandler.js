/**
 * MIDDLEWARE: Gestionnaire d'Erreurs Global
 * RESPONSABILITÉ:
 * Attraper TOUTES les erreurs (try/catch dans controllers)
 * Formater la réponse standardisée
 * Logger toutes les erreurs avec contexte de la requête
 *
 * RÈGLES CRITIQUES:
 * - Doit être le DERNIER middleware enregistré dans app.js
 * - Retourne toujours {success: false, error: {code, message}}
 * - Pas de données sensibles dans la réponse client
 * - Logger toujours avec method + url + statusCode pour traçabilité
 *
 * Voir: /docs/GUIDELINES_DOCS.md - Section 13
 */

const logger = require('../utils/logger');

module.exports = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let code = err.code || 'INTERNAL_ERROR';
  let message = err.message || "Une erreur interne s'est produite";

  // Erreurs Multer (upload fichier)
  if (err.name === 'MulterError') {
    statusCode = 400;
    switch (err.code) {
      case 'LIMIT_FILE_SIZE':
        code = 'FILE_TOO_LARGE';
        message = 'Fichier trop volumineux (max 5 Mo)';
        break;
      case 'LIMIT_UNEXPECTED_FILE':
      case 'MISSING_FIELD_NAME':
        code = 'INVALID_FILE_FIELD';
        message = 'Champ fichier invalide — utiliser le champ "avatar"';
        break;
      default:
        code = 'UPLOAD_ERROR';
        message = "Erreur lors de l'upload du fichier";
    }
    logger.error('[errorHandler] Erreur Multer', {
      method: req.method,
      url: req.originalUrl,
      multerCode: err.code,
      message: err.message,
    });
  }
  // Erreurs métier connues (AppError)
  else if (err.statusCode) {
    logger.error('[errorHandler] Erreur métier', {
      method: req.method,
      url: req.originalUrl,
      statusCode,
      code,
      message,
    });
  }
  // Erreurs non gérées — masquer le message technique au client
  else {
    message = "Une erreur interne s'est produite";
    logger.error('[errorHandler] Erreur non gérée', {
      method: req.method,
      url: req.originalUrl,
      name: err.name,
      message: err.message,
      stack: err.stack,
    });
  }

  res.status(statusCode).json({
    success: false,
    error: { code, message },
  });
};
