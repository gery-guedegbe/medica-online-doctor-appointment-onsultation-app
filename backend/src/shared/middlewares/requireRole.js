/**
 * MIDDLEWARE: Vérification du rôle utilisateur
 * RESPONSABILITÉ:
 * Autoriser l'accès uniquement aux rôles spécifiés
 * Doit être utilisé APRÈS verifyAuth
 *
 * RÈGLES CRITIQUES:
 * - Toujours utiliser après verifyAuth (req.user doit exister)
 * - Lever FORBIDDEN si le rôle ne correspond pas
 *
 * Voir: /docs/GUIDELINES_DOCS.md - Section 5
 */

const AppError = require('../errors/AppError');

/**
 * Factory: crée un middleware de vérification de rôle
 * @param {...string} roles - Rôles autorisés (ex: 'admin', 'doctor')
 *
 * Usage: requireRole('admin')
 *        requireRole('admin', 'doctor')
 */
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Non authentifié', 401, 'MISSING_TOKEN'));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError('Accès interdit', 403, 'FORBIDDEN'));
    }

    next();
  };
};

module.exports = requireRole;
