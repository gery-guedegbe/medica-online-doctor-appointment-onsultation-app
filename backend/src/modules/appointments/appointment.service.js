/**
 * MODULE: Appointments - Service
 * RESPONSABILITÉ: Logique métier des rendez-vous
 *
 * RÈGLES CRITIQUES:
 * - Anti double-booking: géré par contrainte GIST PostgreSQL
 * - Annulation patient: ≥ 2h avant start_time
 * - Annulation doctor: à tout moment (urgence)
 * - Rescheduling: patient uniquement, max 1 fois
 * - end_time calculé par le backend (start + durée du package)
 * - Isolation: patient/doctor voient uniquement leurs propres RDV
 *
 * Voir: /docs/GUIDELINES_DOCS.md - Section 18
 */

const appointmentModel = require('./appointment.model');
const packageModel = require('../packages/package.model');
const AppError = require('../../shared/errors/AppError');
const logger = require('../../shared/utils/logger');
const { CANCELLATION_MIN_HOURS } = require('../../shared/config/constants');

const getDoctorIdFromUserId = async (userId) => {
  const supabase = require('../../shared/config/supabase');
  const { data } = await supabase.from('doctors').select('id').eq('user_id', userId).single();
  if (!data) throw new AppError('Profil médecin introuvable', 404, 'NOT_FOUND');
  return data.id;
};

/**
 * Convertit HH:MM en minutes depuis minuit.
 */
const timeToMinutes = (timeStr) => {
  const [h, m] = timeStr.substring(0, 5).split(':').map(Number);
  return h * 60 + m;
};

/**
 * Vérifie que le créneau (startTime→endTime) est dans les horaires
 * de disponibilité du médecin pour ce jour de la semaine.
 * Convention interne: 0=Lundi … 6=Dimanche
 */
const verifyWithinAvailability = async (doctorId, startTime, endTime) => {
  const supabase = require('../../shared/config/supabase');

  const jsDay = startTime.getUTCDay();          // JS: 0=Dim, 1=Lun…
  const dayOfWeek = (jsDay + 6) % 7;            // Notre convention: 0=Lun

  const { data: rule } = await supabase
    .from('availability_rules')
    .select('start_time, end_time')
    .eq('doctor_id', doctorId)
    .eq('day_of_week', dayOfWeek)
    .maybeSingle();

  if (!rule) {
    throw new AppError(
      'Le médecin n\'est pas disponible ce jour',
      400,
      'DOCTOR_NOT_AVAILABLE'
    );
  }

  const ruleStart = timeToMinutes(rule.start_time);
  const ruleEnd   = timeToMinutes(rule.end_time);
  const slotStart = startTime.getUTCHours() * 60 + startTime.getUTCMinutes();
  const slotEnd   = endTime.getUTCHours()   * 60 + endTime.getUTCMinutes();

  if (slotStart < ruleStart || slotEnd > ruleEnd) {
    logger.error('[appointment.service] verifyWithinAvailability — hors horaires', {
      doctorId, slotStart, slotEnd, ruleStart, ruleEnd,
    });
    throw new AppError(
      `Créneau hors des horaires du médecin (${rule.start_time.substring(0,5)}–${rule.end_time.substring(0,5)} UTC)`,
      400,
      'OUTSIDE_WORKING_HOURS'
    );
  }

  logger.info('[appointment.service] verifyWithinAvailability — OK', {
    doctorId, dayOfWeek, slotStart, slotEnd,
  });
};

/**
 * Vérifie que l'annulation respecte le délai minimum (2h).
 */
const checkCancellationDelay = (startTime) => {
  const now = new Date();
  const appointmentStart = new Date(startTime);
  const hoursUntilAppointment = (appointmentStart - now) / (1000 * 60 * 60);

  if (hoursUntilAppointment < CANCELLATION_MIN_HOURS) {
    throw new AppError(
      `Annulation impossible — moins de ${CANCELLATION_MIN_HOURS}h avant le RDV`,
      400,
      'CANCELLATION_TOO_LATE'
    );
  }
};

/**
 * Réservation d'un rendez-vous par un patient.
 */
const bookAppointment = async (userId, data) => {
  logger.info('[appointment.service] bookAppointment', {
    patientId: userId,
    doctorId: data.doctor_id,
    packageId: data.package_id,
    start_time: data.start_time,
  });

  // Récupère le package pour connaître la durée
  const pkg = await packageModel.findById(data.package_id);

  if (!pkg.is_active) {
    throw new AppError('Ce package n\'est plus disponible', 400, 'PACKAGE_INACTIVE');
  }

  // Fix 3 — Vérifie que le package appartient bien au doctor sélectionné
  if (pkg.doctor_id !== data.doctor_id) {
    logger.error('[appointment.service] bookAppointment — package/doctor mismatch', {
      packageDoctorId: pkg.doctor_id,
      requestedDoctorId: data.doctor_id,
    });
    throw new AppError('Ce package n\'appartient pas à ce médecin', 400, 'INVALID_PACKAGE');
  }

  // Calcule end_time selon la durée du package
  const startTime = new Date(data.start_time);
  const endTime = new Date(startTime.getTime() + pkg.duration_minutes * 60 * 1000);

  // Fix 2 — Vérifie que start_time est dans les horaires du médecin
  await verifyWithinAvailability(data.doctor_id, startTime, endTime);

  const appointment = await appointmentModel.createAppointment({
    doctor_id: data.doctor_id,
    patient_id: userId,
    package_id: data.package_id,
    start_time: startTime.toISOString(),
    end_time: endTime.toISOString(),
    status: 'booked',
    problem_description: data.problem_description,
    patient_name: data.patient_name,
    patient_age: data.patient_age,
  });

  logger.info('[appointment.service] bookAppointment — succès', {
    appointmentId: appointment.id,
    patientId: userId,
  });

  return appointment;
};

/**
 * Récupère les rendez-vous de l'utilisateur connecté (patient ou doctor).
 * Filtre optionnel: upcoming | completed | cancelled
 */
const getMyAppointments = async (userId, role, statusFilter) => {
  logger.info('[appointment.service] getMyAppointments', { userId, role, statusFilter });

  // Construit les filtres DB selon le paramètre reçu
  const filters = {};
  if (statusFilter === 'completed')  { filters.status = 'completed'; }
  else if (statusFilter === 'cancelled') { filters.status = 'cancelled'; }
  else if (statusFilter === 'upcoming')  { filters.status = 'booked'; filters.upcoming = true; }

  if (role === 'doctor') {
    const doctorId = await getDoctorIdFromUserId(userId);
    return appointmentModel.findByDoctor(doctorId, filters);
  }

  return appointmentModel.findByPatient(userId, filters);
};

/**
 * Récupère un rendez-vous par ID (vérifie l'accès patient/doctor).
 */
const getAppointmentById = async (userId, role, appointmentId) => {
  logger.info('[appointment.service] getAppointmentById', { userId, appointmentId });

  const appointment = await appointmentModel.findById(appointmentId);

  const doctorId = role === 'doctor' ? await getDoctorIdFromUserId(userId) : null;
  const isOwner =
    appointment.patient_id === userId ||
    (doctorId && appointment.doctor_id === doctorId);

  if (!isOwner) {
    throw new AppError('Accès interdit', 403, 'FORBIDDEN');
  }

  return appointment;
};

/**
 * Annulation par le patient (≥ 2h avant) ou le doctor (à tout moment).
 */
const cancelAppointment = async (userId, role, appointmentId, reason) => {
  logger.info('[appointment.service] cancelAppointment', { userId, role, appointmentId });

  const appointment = await appointmentModel.findById(appointmentId);

  if (appointment.status !== 'booked') {
    throw new AppError('Seuls les RDV "booked" peuvent être annulés', 400, 'INVALID_STATUS');
  }

  // Vérification accès selon le rôle
  if (role === 'patient') {
    if (appointment.patient_id !== userId) {
      throw new AppError('Accès interdit', 403, 'FORBIDDEN');
    }
    checkCancellationDelay(appointment.start_time);
  } else if (role === 'doctor') {
    const doctorId = await getDoctorIdFromUserId(userId);
    if (appointment.doctor_id !== doctorId) {
      throw new AppError('Accès interdit', 403, 'FORBIDDEN');
    }
    // Doctor peut annuler à tout moment (urgence)
  }

  const updated = await appointmentModel.updateAppointment(appointmentId, {
    status: 'cancelled',
    cancellation_reason: reason || null,
  });

  logger.info('[appointment.service] cancelAppointment — succès', { appointmentId, cancelledBy: role });
  return updated;
};

/**
 * Marquer un rendez-vous comme terminé (doctor uniquement).
 */
const completeAppointment = async (userId, appointmentId) => {
  logger.info('[appointment.service] completeAppointment', { userId, appointmentId });

  const appointment = await appointmentModel.findById(appointmentId);
  const doctorId = await getDoctorIdFromUserId(userId);

  if (appointment.doctor_id !== doctorId) {
    throw new AppError('Accès interdit', 403, 'FORBIDDEN');
  }

  if (appointment.status !== 'booked') {
    throw new AppError('Seuls les RDV "booked" peuvent être complétés', 400, 'INVALID_STATUS');
  }

  return appointmentModel.updateAppointment(appointmentId, { status: 'completed' });
};

/**
 * Replannifier un rendez-vous (patient, max 1 fois).
 */
const rescheduleAppointment = async (userId, appointmentId, data) => {
  logger.info('[appointment.service] rescheduleAppointment', { userId, appointmentId });

  const appointment = await appointmentModel.findById(appointmentId);

  if (appointment.patient_id !== userId) {
    throw new AppError('Accès interdit', 403, 'FORBIDDEN');
  }

  if (appointment.status !== 'booked') {
    throw new AppError('Seuls les RDV "booked" peuvent être replannifiés', 400, 'INVALID_STATUS');
  }

  if (appointment.reschedule_count >= 1) {
    throw new AppError('Ce RDV a déjà été replannifié une fois (maximum)', 400, 'MAX_RESCHEDULE_REACHED');
  }

  // Recalcule end_time avec le même package
  const pkg = await packageModel.findById(appointment.package_id);
  const newStart = new Date(data.new_start_time);
  const newEnd = new Date(newStart.getTime() + pkg.duration_minutes * 60 * 1000);

  const updated = await appointmentModel.updateAppointment(appointmentId, {
    start_time: newStart.toISOString(),
    end_time: newEnd.toISOString(),
    reschedule_reason: data.reschedule_reason,
    reschedule_count: appointment.reschedule_count + 1,
  });

  logger.info('[appointment.service] rescheduleAppointment — succès', { appointmentId });
  return updated;
};

module.exports = {
  bookAppointment,
  getMyAppointments,
  getAppointmentById,
  cancelAppointment,
  completeAppointment,
  rescheduleAppointment,
};
