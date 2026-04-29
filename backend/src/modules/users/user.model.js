/**
 * MODULE: Users - Model
 * RESPONSABILITÉ:
 * Toutes les interactions DB pour la table `users`
 * Aucune logique métier ici — uniquement des requêtes
 *
 * RÈGLES CRITIQUES:
 * - Sélectionner uniquement les colonnes nécessaires
 * - Ne jamais retourner pin_hash au client
 * - Logger toutes les erreurs DB avec détails Supabase
 * - Lever AppError en cas d'erreur DB
 *
 * Voir: /docs/GUIDELINES_DOCS.md - Section 6
 */

const supabase = require('../../shared/config/supabase');
const AppError = require('../../shared/errors/AppError');
const logger = require('../../shared/utils/logger');

const USER_PUBLIC_FIELDS =
  'id, email, full_name, nickname, date_of_birth, gender, phone_number, avatar_url, role, created_at';

const findById = async (id) => {
  logger.info('[user.model] findById', { userId: id });

  const { data, error } = await supabase
    .from('users')
    .select(USER_PUBLIC_FIELDS)
    .eq('id', id)
    .single();

  if (error || !data) {
    logger.error('[user.model] findById — introuvable', {
      userId: id,
      message: error?.message,
      code: error?.code,
    });
    throw new AppError('Utilisateur introuvable', 404, 'NOT_FOUND');
  }

  return data;
};

const findByNickname = async (nickname) => {
  logger.info('[user.model] findByNickname', { nickname });

  const { data, error } = await supabase
    .from('users')
    .select('id')
    .eq('nickname', nickname)
    .maybeSingle();

  if (error) {
    logger.error('[user.model] findByNickname — erreur DB', {
      nickname,
      message: error.message,
      code: error.code,
    });
  }

  return data;
};

const updateProfile = async (id, fields) => {
  logger.info('[user.model] updateProfile', { userId: id, fields: Object.keys(fields) });

  const { data, error } = await supabase
    .from('users')
    .update(fields)
    .eq('id', id)
    .select(USER_PUBLIC_FIELDS)
    .single();

  if (error) {
    logger.error('[user.model] updateProfile — échec UPDATE', {
      userId: id,
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    });
    throw new AppError('Erreur mise à jour du profil', 500, 'DB_ERROR');
  }

  logger.info('[user.model] updateProfile — succès', { userId: id });
  return data;
};

const updatePinHash = async (id, pin_hash) => {
  logger.info('[user.model] updatePinHash', { userId: id });

  const { error } = await supabase
    .from('users')
    .update({ pin_hash })
    .eq('id', id);

  if (error) {
    logger.error('[user.model] updatePinHash — échec', {
      userId: id,
      message: error.message,
      code: error.code,
    });
    throw new AppError('Erreur enregistrement PIN', 500, 'DB_ERROR');
  }

  logger.info('[user.model] updatePinHash — succès', { userId: id });
};

const updateAvatarUrl = async (id, avatar_url) => {
  logger.info('[user.model] updateAvatarUrl', { userId: id, avatar_url });

  const { data, error } = await supabase
    .from('users')
    .update({ avatar_url })
    .eq('id', id)
    .select(USER_PUBLIC_FIELDS)
    .single();

  if (error) {
    logger.error('[user.model] updateAvatarUrl — échec', {
      userId: id,
      message: error.message,
      code: error.code,
    });
    throw new AppError("Erreur mise à jour de l'avatar", 500, 'DB_ERROR');
  }

  logger.info('[user.model] updateAvatarUrl — succès', { userId: id });
  return data;
};

const findAll = async () => {
  logger.info('[user.model] findAll');

  const { data, error } = await supabase
    .from('users')
    .select(USER_PUBLIC_FIELDS)
    .order('created_at', { ascending: false });

  if (error) {
    logger.error('[user.model] findAll — échec', {
      message: error.message,
      code: error.code,
    });
    throw new AppError('Erreur récupération utilisateurs', 500, 'DB_ERROR');
  }

  logger.info('[user.model] findAll — succès', { count: data.length });
  return data;
};

module.exports = {
  findById,
  findByNickname,
  updateProfile,
  updatePinHash,
  updateAvatarUrl,
  findAll,
};
