/**
 * MIDDLEWARE: Vérification JWT Supabase
 * RESPONSABILITÉ:
 * Extraire et vérifier le token JWT via l'API Supabase Auth
 * Attacher l'utilisateur vérifié à req.user
 *
 * RÈGLES CRITIQUES:
 * - Token doit être dans Authorization: Bearer <token>
 * - supabase.auth.getUser(token) = vérification officielle Supabase
 *   → Fonctionne pour HS256 ET ES256 (nouveaux projets Supabase)
 *   → jwt.verify() avec secret string ne fonctionne pas pour ES256
 * - Routes non protégées: /api/auth/login uniquement
 *
 * Voir: /docs/GUIDELINES_DOCS.md - Section 5
 */

const supabase = require('../config/supabase');
const AppError = require('../errors/AppError');
const logger = require('../utils/logger');

const verifyAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logger.error('[auth.middleware] Token manquant', {
        method: req.method,
        url: req.originalUrl,
      });
      return next(new AppError('Token manquant', 401, 'MISSING_TOKEN'));
    }

    const token = authHeader.substring(7);

    // Vérification officielle via l'API Supabase Auth
    // Compatible ES256 (nouveaux projets) et HS256
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      logger.error('[auth.middleware] Token invalide ou expiré', {
        method: req.method,
        url: req.originalUrl,
        error: error?.message,
        status: error?.status,
      });
      return next(new AppError('Token invalide ou expiré', 401, 'INVALID_TOKEN'));
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.user_metadata?.role || 'patient',
    };

    logger.info('[auth.middleware] Token valide', {
      userId: req.user.id,
      role: req.user.role,
      url: req.originalUrl,
    });

    next();
  } catch (err) {
    logger.error('[auth.middleware] Erreur inattendue', {
      method: req.method,
      url: req.originalUrl,
      message: err.message,
    });
    next(new AppError("Erreur d'authentification", 401, 'AUTH_ERROR'));
  }
};

module.exports = verifyAuth;
