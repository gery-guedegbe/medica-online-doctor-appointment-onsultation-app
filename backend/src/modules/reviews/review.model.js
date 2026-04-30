/**
 * MODULE: Reviews - Model
 * RESPONSABILITÉ: Requêtes DB pour reviews
 * Voir: /docs/GUIDELINES_DOCS.md - Section 6
 */

const supabase = require('../../shared/config/supabase');
const AppError = require('../../shared/errors/AppError');
const logger = require('../../shared/utils/logger');

const createReview = async (data) => {
  logger.info('[review.model] createReview', {
    appointmentId: data.appointment_id,
    patientId: data.patient_id,
    stars: data.stars,
  });

  const { data: review, error } = await supabase
    .from('reviews')
    .insert(data)
    .select('id, appointment_id, patient_id, doctor_id, stars, comment, recommend, created_at')
    .single();

  if (error) {
    logger.error('[review.model] createReview — échec', {
      message: error.message, code: error.code,
    });
    if (error.code === '23505') {
      throw new AppError('Vous avez déjà noté ce rendez-vous', 409, 'REVIEW_ALREADY_EXISTS');
    }
    throw new AppError('Erreur création avis', 500, 'DB_ERROR');
  }

  logger.info('[review.model] createReview — succès', { reviewId: review.id });
  return review;
};

const findByDoctorId = async (doctorId) => {
  logger.info('[review.model] findByDoctorId', { doctorId });

  const { data, error } = await supabase
    .from('reviews')
    .select(`
      id, stars, comment, recommend, created_at,
      users!patient_id(full_name, avatar_url)
    `)
    .eq('doctor_id', doctorId)
    .order('created_at', { ascending: false });

  if (error) {
    logger.error('[review.model] findByDoctorId — échec', { message: error.message });
    throw new AppError('Erreur récupération avis', 500, 'DB_ERROR');
  }

  return data;
};

module.exports = { createReview, findByDoctorId };
