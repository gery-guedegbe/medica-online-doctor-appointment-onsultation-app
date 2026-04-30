/**
 * MODULE: Doctors - Controller
 * RESPONSABILITÉ:
 * Recevoir la requête, appeler le service, renvoyer la réponse
 * Aucune logique métier ici
 *
 * RÈGLES CRITIQUES:
 * - Utiliser req.validatedData (fourni par le middleware Zod)
 * - Toujours passer les erreurs à next(err)
 * - Lire les query params pour les filtres (specialty)
 *
 * Voir: /docs/GUIDELINES_DOCS.md - Section 17
 */

const doctorService = require('./doctor.service');

/**
 * POST /api/doctors — Admin
 */
const create = async (req, res, next) => {
  try {
    const doctor = await doctorService.createDoctor(req.validatedData);
    res.status(201).json({ success: true, data: { doctor } });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/doctors
 */
const getAll = async (req, res, next) => {
  try {
    const filters = {
      specialty: req.query.specialty || null,
      search: req.query.search || null,
      min_rating: req.query.min_rating || null,
    };
    const doctors = await doctorService.getAllDoctors(filters);
    res.json({ success: true, data: { doctors, count: doctors.length } });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/doctors/me — Doctor connecté
 */
const getMe = async (req, res, next) => {
  try {
    const doctor = await doctorService.getMyProfile(req.user.id);
    res.json({ success: true, data: { doctor } });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/doctors/:id
 */
const getById = async (req, res, next) => {
  try {
    const doctor = await doctorService.getDoctorById(req.params.id);
    res.json({ success: true, data: { doctor } });
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/doctors/me — Doctor connecté
 */
const updateMe = async (req, res, next) => {
  try {
    const doctor = await doctorService.updateMyProfile(req.user.id, req.validatedData);
    res.json({ success: true, data: { doctor } });
  } catch (err) {
    next(err);
  }
};

module.exports = { create, getAll, getMe, getById, updateMe };
