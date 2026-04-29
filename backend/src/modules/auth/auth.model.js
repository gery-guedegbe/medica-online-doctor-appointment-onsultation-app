/**
 * MODULE: Auth - Model
 * RESPONSABILITÉ:
 * Toutes les interactions avec la table `users` pour l'auth
 * Pas de logique métier ici, uniquement des requêtes DB
 *
 * RÈGLES CRITIQUES:
 * - Utiliser le client Supabase avec service key (bypass RLS)
 * - Sélectionner uniquement les colonnes nécessaires
 * - Logger toutes les erreurs DB avec les détails Supabase
 * - Lever AppError en cas d'erreur DB
 *
 * Voir: /docs/GUIDELINES_DOCS.md - Section 6
 */

const supabase = require('../../shared/config/supabase');
const AppError = require('../../shared/errors/AppError');
const logger = require('../../shared/utils/logger');

const USER_PUBLIC_FIELDS =
  'id, email, full_name, nickname, date_of_birth, gender, phone_number, avatar_url, role, created_at';

const upsertUser = async ({ id, email }) => {
  logger.info('[auth.model] upsertUser — début', { userId: id, email });

  const { error: upsertError } = await supabase
    .from('users')
    .upsert({ id, email, role: 'patient' }, { onConflict: 'id', ignoreDuplicates: true });

  if (upsertError) {
    logger.error('[auth.model] upsertUser — échec INSERT/UPSERT', {
      userId: id,
      message: upsertError.message,
      code: upsertError.code,
      details: upsertError.details,
      hint: upsertError.hint,
    });
    throw new AppError("Erreur lors de la création de l'utilisateur", 500, 'DB_ERROR');
  }

  const { data, error: selectError } = await supabase
    .from('users')
    .select(USER_PUBLIC_FIELDS)
    .eq('id', id)
    .single();

  if (selectError || !data) {
    logger.error('[auth.model] upsertUser — échec SELECT après upsert', {
      userId: id,
      message: selectError?.message,
      code: selectError?.code,
    });
    throw new AppError('Utilisateur introuvable après upsert', 500, 'DB_ERROR');
  }

  logger.info('[auth.model] upsertUser — succès', {
    userId: data.id,
    role: data.role,
    isNew: !data.nickname,
  });

  return data;
};

const getUserById = async (id) => {
  logger.info('[auth.model] getUserById', { userId: id });

  const { data, error } = await supabase
    .from('users')
    .select(USER_PUBLIC_FIELDS)
    .eq('id', id)
    .single();

  if (error || !data) {
    logger.error('[auth.model] getUserById — introuvable', {
      userId: id,
      message: error?.message,
      code: error?.code,
    });
    throw new AppError('Utilisateur introuvable', 404, 'NOT_FOUND');
  }

  return data;
};

module.exports = { upsertUser, getUserById };
