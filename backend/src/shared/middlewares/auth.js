/**
 * MIDDLEWARE: Vérification JWT Supabase
 * RESPONSABILITÉ:
 * Extraire et vérifier le token JWT via l'API Supabase Auth
 * Lire le rôle depuis notre table `users` (source de vérité)
 * Attacher l'utilisateur vérifié à req.user
 *
 * RÈGLES CRITIQUES:
 * - Token doit être dans Authorization: Bearer <token>
 * - supabase.auth.getUser(token) = vérification officielle (ES256 + HS256)
 * - Le rôle vient de notre table `users`, PAS du token Supabase
 *   (user_metadata Supabase ne contient pas notre rôle métier)
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

    // Étape 1 — Vérification officielle du token via Supabase Auth
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      logger.error('[auth.middleware] Token invalide ou expiré', {
        method: req.method,
        url: req.originalUrl,
        error: error?.message,
      });
      return next(new AppError('Token invalide ou expiré', 401, 'INVALID_TOKEN'));
    }

    // Étape 2 — Lecture du rôle depuis notre table `users` (source de vérité)
    // Le token Supabase ne contient pas notre rôle métier (patient/doctor/admin)
    const { data: dbUser, error: dbError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (dbError || !dbUser) {
      logger.error('[auth.middleware] Utilisateur introuvable en DB', {
        userId: user.id,
        message: dbError?.message,
      });
      return next(new AppError('Utilisateur introuvable', 401, 'USER_NOT_FOUND'));
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: dbUser.role,
    };

    logger.info('[auth.middleware] Authentification réussie', {
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
