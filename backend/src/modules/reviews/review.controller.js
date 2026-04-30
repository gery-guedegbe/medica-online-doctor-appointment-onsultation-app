/**
 * MODULE: Reviews - Controller
 * RESPONSABILITÉ: Thin controllers pour les avis
 * Voir: /docs/GUIDELINES_DOCS.md - Section 17
 */

const reviewService = require('./review.service');

const create = async (req, res, next) => {
  try {
    const review = await reviewService.createReview(req.user.id, req.validatedData);
    res.status(201).json({ success: true, data: { review } });
  } catch (err) { next(err); }
};

const getByDoctor = async (req, res, next) => {
  try {
    const data = await reviewService.getDoctorReviews(req.params.doctorId);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

module.exports = { create, getByDoctor };
