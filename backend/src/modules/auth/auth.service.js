/**
 * MODULE: Auth - Service
 * RESPONSABILITÉ:
 * Contenir toute la logique métier de l'authentification
 * Vérifier le token Supabase, synchroniser l'utilisateur en DB
 *
 * RÈGLES CRITIQUES:
 * - Pas de res/req ici (logique pure)
 * - Toutes les erreurs via AppError
 * - supabase.auth.getUser() = vérification officielle du token
 * - Jamais logger le token complet (données sensibles)
 *
 * Voir: /docs/GUIDELINES_DOCS.md - Section 18
 */

const supabase = require('../../shared/config/supabase');
const authModel = require('./auth.model');
const AppError = require('../../shared/errors/AppError');
const logger = require('../../shared/utils/logger');

const isProfileComplete = (user) =>
  !!(user.full_name && user.nickname && user.date_of_birth && user.gender);

const login = async (token) => {
  logger.info('[auth.service] login — vérification token Supabase');

  const { data: { user: supabaseUser }, error } = await supabase.auth.getUser(token);

  if (error || !supabaseUser) {
    logger.error('[auth.service] login — token invalide ou expiré', {
      error: error?.message,
      status: error?.status,
    });
    throw new AppError('Token invalide ou expiré', 401, 'INVALID_TOKEN');
  }

  logger.info('[auth.service] login — token valide', {
    userId: supabaseUser.id,
    email: supabaseUser.email,
    provider: supabaseUser.app_metadata?.provider,
  });

  const user = await authModel.upsertUser({
    id: supabaseUser.id,
    email: supabaseUser.email,
  });

  const profile_complete = isProfileComplete(user);

  logger.info('[auth.service] login — connexion réussie', {
    userId: user.id,
    role: user.role,
    profile_complete,
  });

  return { user, token, profile_complete };
};

const getMe = async (userId) => {
  logger.info('[auth.service] getMe', { userId });

  const user = await authModel.getUserById(userId);
  return { user, profile_complete: isProfileComplete(user) };
};

module.exports = { login, getMe };
