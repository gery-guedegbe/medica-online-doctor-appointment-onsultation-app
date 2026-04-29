/**
 * MODULE: Users - Service
 * RESPONSABILITÉ:
 * Logique métier pour la gestion des profils utilisateur
 *
 * RÈGLES CRITIQUES:
 * - Pas de res/req ici
 * - PIN hashé avec bcrypt avant stockage (jamais en clair)
 * - Unicité du nickname vérifiée avant update
 * - avatar uploadé sur Supabase Storage
 * - pin_hash jamais retourné au client
 * - Jamais logger le PIN ou pin_hash
 *
 * Voir: /docs/GUIDELINES_DOCS.md - Section 18
 */

const bcrypt = require('bcrypt');
const supabase = require('../../shared/config/supabase');
const userModel = require('./user.model');
const AppError = require('../../shared/errors/AppError');
const logger = require('../../shared/utils/logger');

const isProfileComplete = (user) =>
  !!(user.full_name && user.nickname && user.date_of_birth && user.gender);

const getProfile = async (userId) => {
  logger.info('[user.service] getProfile', { userId });

  const user = await userModel.findById(userId);
  return { user, profile_complete: isProfileComplete(user) };
};

const updateProfile = async (userId, data) => {
  logger.info('[user.service] updateProfile — début', {
    userId,
    fields: Object.keys(data),
  });

  if (data.nickname) {
    const existing = await userModel.findByNickname(data.nickname);
    if (existing && existing.id !== userId) {
      logger.error('[user.service] updateProfile — nickname déjà pris', {
        userId,
        nickname: data.nickname,
        takenBy: existing.id,
      });
      throw new AppError('Ce nickname est déjà utilisé', 409, 'NICKNAME_TAKEN');
    }
  }

  const user = await userModel.updateProfile(userId, data);
  const profile_complete = isProfileComplete(user);

  logger.info('[user.service] updateProfile — succès', { userId, profile_complete });

  return { user, profile_complete };
};

const uploadAvatar = async (userId, fileBuffer, mimeType) => {
  logger.info('[user.service] uploadAvatar — début', { userId, mimeType });

  const filePath = `${userId}/avatar`;

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, fileBuffer, { contentType: mimeType, upsert: true });

  if (uploadError) {
    logger.error('[user.service] uploadAvatar — échec Supabase Storage', {
      userId,
      filePath,
      message: uploadError.message,
    });
    throw new AppError("Erreur upload de l'avatar", 500, 'UPLOAD_ERROR');
  }

  const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
  const avatar_url = urlData.publicUrl;

  logger.info('[user.service] uploadAvatar — fichier uploadé', { userId, avatar_url });

  const user = await userModel.updateAvatarUrl(userId, avatar_url);

  logger.info('[user.service] uploadAvatar — succès complet', { userId });

  return { user, profile_complete: isProfileComplete(user) };
};

const setPin = async (userId, pin) => {
  logger.info('[user.service] setPin — début', { userId });

  const pin_hash = await bcrypt.hash(pin, 10);
  await userModel.updatePinHash(userId, pin_hash);

  logger.info('[user.service] setPin — PIN défini avec succès', { userId });
};

const getAllUsers = async () => {
  logger.info('[user.service] getAllUsers');
  return userModel.findAll();
};

const getUserById = async (id) => {
  logger.info('[user.service] getUserById', { userId: id });
  return userModel.findById(id);
};

module.exports = {
  getProfile,
  updateProfile,
  uploadAvatar,
  setPin,
  getAllUsers,
  getUserById,
  isProfileComplete,
};
