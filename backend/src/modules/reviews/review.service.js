/**
 * MODULE: Reviews - Service
 * RESPONSABILITÉ: Logique métier pour les avis
 *
 * RÈGLES CRITIQUES:
 * - Review uniquement si RDV status = 'completed'
 * - Patient peut noter uniquement son propre RDV
 * - 1 review par appointment (unicité en DB)
 * - Rating doctor mis à jour automatiquement via trigger SQL
 *
 * Voir: /docs/GUIDELINES_DOCS.md - Section 18
 */

const reviewModel = require('./review.model');
const appointmentModel = require('../appointments/appointment.model');
const AppError = require('../../shared/errors/AppError');
const logger = require('../../shared/utils/logger');

const createReview = async (userId, data) => {
  logger.info('[review.service] createReview', {
    patientId: userId,
    appointmentId: data.appointment_id,
    stars: data.stars,
  });

  const appointment = await appointmentModel.findById(data.appointment_id);

  if (appointment.patient_id !== userId) {
    throw new AppError('Accès interdit', 403, 'FORBIDDEN');
  }

  if (appointment.status !== 'completed') {
    throw new AppError(
      'Vous ne pouvez noter qu\'un rendez-vous terminé',
      400,
      'APPOINTMENT_NOT_COMPLETED'
    );
  }

  const review = await reviewModel.createReview({
    appointment_id: data.appointment_id,
    patient_id: userId,
    doctor_id: appointment.doctor_id,
    stars: data.stars,
    comment: data.comment || null,
    recommend: data.recommend ?? null,
  });

  logger.info('[review.service] createReview — succès', { reviewId: review.id });
  return review;
};

const getDoctorReviews = async (doctorId) => {
  logger.info('[review.service] getDoctorReviews', { doctorId });
  const reviews = await reviewModel.findByDoctorId(doctorId);
  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.stars, 0) / reviews.length).toFixed(2)
    : null;

  return { reviews, count: reviews.length, average_rating: avgRating };
};

module.exports = { createReview, getDoctorReviews };
