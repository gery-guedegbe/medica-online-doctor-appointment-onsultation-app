/**
 * MODULE: Availability - Controller
 * RESPONSABILITÉ:
 * Recevoir la requête, appeler le service, renvoyer la réponse
 * Aucune logique métier ici
 *
 * RÈGLES CRITIQUES:
 * - Utiliser req.validatedData pour le body
 * - Les query params (doctor_id, date) sont validés séparément
 * - Toujours passer les erreurs à next(err)
 *
 * Voir: /docs/GUIDELINES_DOCS.md - Section 17
 */

const availabilityService = require('./availability.service');
const AppError = require('../../shared/errors/AppError');
const { getSlotsSchema } = require('./availability.validation');

/**
 * POST /api/availability/rules
 */
const addRule = async (req, res, next) => {
  try {
    const rule = await availabilityService.addRule(req.user.id, req.validatedData);
    res.status(201).json({ success: true, data: { rule } });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/availability/rules
 */
const getMyRules = async (req, res, next) => {
  try {
    const rules = await availabilityService.getMyRules(req.user.id);
    res.json({ success: true, data: { rules, count: rules.length } });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/availability/rules/:id
 */
const updateRule = async (req, res, next) => {
  try {
    const rule = await availabilityService.updateRule(
      req.user.id,
      req.params.id,
      req.validatedData
    );
    res.json({ success: true, data: { rule } });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/availability/rules/:id
 */
const deleteRule = async (req, res, next) => {
  try {
    await availabilityService.deleteRule(req.user.id, req.params.id);
    res.json({ success: true, data: { message: 'Règle supprimée avec succès' } });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/availability/slots?doctor_id=&date=
 */
const getSlots = async (req, res, next) => {
  try {
    // Validation des query params
    const result = getSlotsSchema.safeParse(req.query);
    if (!result.success) {
      return next(new AppError(result.error.errors[0].message, 400, 'VALIDATION_ERROR'));
    }

    const { doctor_id, date } = result.data;
    const data = await availabilityService.getAvailableSlots(doctor_id, date);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/availability/doctor/:doctorId
 * Accessible à tous les utilisateurs authentifiés (patients inclus)
 */
const getDoctorRules = async (req, res, next) => {
  try {
    const rules = await availabilityService.getRulesForDoctor(req.params.doctorId);
    res.json({ success: true, data: { rules, count: rules.length } });
  } catch (err) {
    next(err);
  }
};

module.exports = { addRule, getMyRules, updateRule, deleteRule, getSlots, getDoctorRules };
