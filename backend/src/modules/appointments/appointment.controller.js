/**
 * MODULE: Appointments - Controller
 * RESPONSABILITÉ: Thin controllers pour les rendez-vous
 * Voir: /docs/GUIDELINES_DOCS.md - Section 17
 */

const appointmentService = require('./appointment.service');

const book = async (req, res, next) => {
  try {
    const appointment = await appointmentService.bookAppointment(req.user.id, req.validatedData);
    res.status(201).json({ success: true, data: { appointment } });
  } catch (err) { next(err); }
};

const getAll = async (req, res, next) => {
  try {
    const status = req.query.status || null;
    const appointments = await appointmentService.getMyAppointments(req.user.id, req.user.role, status);
    res.json({ success: true, data: { appointments, count: appointments.length } });
  } catch (err) { next(err); }
};

const getById = async (req, res, next) => {
  try {
    const appointment = await appointmentService.getAppointmentById(
      req.user.id, req.user.role, req.params.id
    );
    res.json({ success: true, data: { appointment } });
  } catch (err) { next(err); }
};

const cancel = async (req, res, next) => {
  try {
    const reason = req.body?.cancellation_reason || null;
    const appointment = await appointmentService.cancelAppointment(
      req.user.id, req.user.role, req.params.id, reason
    );
    res.json({ success: true, data: { appointment } });
  } catch (err) { next(err); }
};

const complete = async (req, res, next) => {
  try {
    const appointment = await appointmentService.completeAppointment(req.user.id, req.params.id);
    res.json({ success: true, data: { appointment } });
  } catch (err) { next(err); }
};

const reschedule = async (req, res, next) => {
  try {
    const appointment = await appointmentService.rescheduleAppointment(
      req.user.id, req.params.id, req.validatedData
    );
    res.json({ success: true, data: { appointment } });
  } catch (err) { next(err); }
};

module.exports = { book, getAll, getById, cancel, complete, reschedule };
