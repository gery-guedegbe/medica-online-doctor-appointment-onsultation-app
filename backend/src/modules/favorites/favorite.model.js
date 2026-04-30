/**
 * MODULE: Favorites - Model
 * RESPONSABILITÉ: Requêtes DB pour favorites
 * Voir: /docs/GUIDELINES_DOCS.md - Section 6
 */

const supabase = require('../../shared/config/supabase');
const AppError = require('../../shared/errors/AppError');
const logger = require('../../shared/utils/logger');

const addFavorite = async (patientId, doctorId) => {
  logger.info('[favorite.model] addFavorite', { patientId, doctorId });

  const { data, error } = await supabase
    .from('favorites')
    .insert({ patient_id: patientId, doctor_id: doctorId })
    .select('id, patient_id, doctor_id, created_at')
    .single();

  if (error) {
    logger.error('[favorite.model] addFavorite — échec', { message: error.message, code: error.code });
    if (error.code === '23505') {
      throw new AppError('Ce médecin est déjà dans vos favoris', 409, 'ALREADY_FAVORITE');
    }
    throw new AppError('Erreur ajout favori', 500, 'DB_ERROR');
  }

  return data;
};

const removeFavorite = async (patientId, doctorId) => {
  logger.info('[favorite.model] removeFavorite', { patientId, doctorId });

  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('patient_id', patientId)
    .eq('doctor_id', doctorId);

  if (error) {
    logger.error('[favorite.model] removeFavorite — échec', { message: error.message });
    throw new AppError('Erreur suppression favori', 500, 'DB_ERROR');
  }
};

const findByPatient = async (patientId) => {
  logger.info('[favorite.model] findByPatient', { patientId });

  const { data, error } = await supabase
    .from('favorites')
    .select(`
      id, created_at,
      doctors!doctor_id(
        id, specialty, experience_years, rating,
        users(full_name, avatar_url, email)
      )
    `)
    .eq('patient_id', patientId)
    .order('created_at', { ascending: false });

  if (error) {
    logger.error('[favorite.model] findByPatient — échec', { message: error.message });
    throw new AppError('Erreur récupération favoris', 500, 'DB_ERROR');
  }

  return data;
};

module.exports = { addFavorite, removeFavorite, findByPatient };
