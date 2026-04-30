/**
 * MODULE: Appointments - Model
 * RESPONSABILITÉ: Requêtes DB pour appointments
 * Voir: /docs/GUIDELINES_DOCS.md - Section 6
 */

const supabase = require('../../shared/config/supabase');
const AppError = require('../../shared/errors/AppError');
const logger = require('../../shared/utils/logger');

const APPOINTMENT_FIELDS = `
  id, doctor_id, patient_id, package_id, start_time, end_time, status,
  problem_description, patient_name, patient_age,
  cancellation_reason, reschedule_reason, reschedule_count, created_at,
  doctor_packages(type, price, duration_minutes),
  doctors!doctor_id(id, specialty, users(full_name, avatar_url))
`;

const createAppointment = async (data) => {
  logger.info('[appointment.model] createAppointment', {
    doctorId: data.doctor_id,
    patientId: data.patient_id,
    start_time: data.start_time,
  });

  const { data: appointment, error } = await supabase
    .from('appointments')
    .insert(data)
    .select(APPOINTMENT_FIELDS)
    .single();

  if (error) {
    logger.error('[appointment.model] createAppointment — échec', {
      message: error.message,
      code: error.code,
      details: error.details,
    });
    // Code 23P01 = exclusion constraint violation (GIST anti double-booking)
    if (error.code === '23P01') {
      throw new AppError('Ce créneau est déjà réservé', 409, 'SLOT_TAKEN');
    }
    throw new AppError('Erreur création rendez-vous', 500, 'DB_ERROR');
  }

  logger.info('[appointment.model] createAppointment — succès', { appointmentId: appointment.id });
  return appointment;
};

const findById = async (id) => {
  logger.info('[appointment.model] findById', { appointmentId: id });

  const { data, error } = await supabase
    .from('appointments')
    .select(APPOINTMENT_FIELDS)
    .eq('id', id)
    .single();

  if (error || !data) {
    logger.error('[appointment.model] findById — introuvable', { appointmentId: id, message: error?.message });
    throw new AppError('Rendez-vous introuvable', 404, 'NOT_FOUND');
  }

  return data;
};

/**
 * @param {string} patientId
 * @param {{ status: string|null, upcoming: boolean }} filters
 */
const findByPatient = async (patientId, filters = {}) => {
  logger.info('[appointment.model] findByPatient', { patientId, filters });

  let query = supabase
    .from('appointments')
    .select(APPOINTMENT_FIELDS)
    .eq('patient_id', patientId)
    .order('start_time', { ascending: filters.upcoming ?? false });

  if (filters.status) query = query.eq('status', filters.status);

  // upcoming = booked ET dans le futur
  if (filters.upcoming) {
    query = query.gte('start_time', new Date().toISOString());
  }

  const { data, error } = await query;

  if (error) {
    logger.error('[appointment.model] findByPatient — échec', { message: error.message });
    throw new AppError('Erreur récupération rendez-vous', 500, 'DB_ERROR');
  }

  return data;
};

/**
 * @param {string} doctorId
 * @param {{ status: string|null, upcoming: boolean }} filters
 */
const findByDoctor = async (doctorId, filters = {}) => {
  logger.info('[appointment.model] findByDoctor', { doctorId, filters });

  let query = supabase
    .from('appointments')
    .select(APPOINTMENT_FIELDS)
    .eq('doctor_id', doctorId)
    .order('start_time', { ascending: filters.upcoming ?? false });

  if (filters.status) query = query.eq('status', filters.status);

  // upcoming = booked ET dans le futur
  if (filters.upcoming) {
    query = query.gte('start_time', new Date().toISOString());
  }

  const { data, error } = await query;

  if (error) {
    logger.error('[appointment.model] findByDoctor — échec', { message: error.message });
    throw new AppError('Erreur récupération rendez-vous', 500, 'DB_ERROR');
  }

  return data;
};

const updateAppointment = async (id, fields) => {
  logger.info('[appointment.model] updateAppointment', { appointmentId: id, fields: Object.keys(fields) });

  const { data, error } = await supabase
    .from('appointments')
    .update(fields)
    .eq('id', id)
    .select(APPOINTMENT_FIELDS)
    .single();

  if (error) {
    logger.error('[appointment.model] updateAppointment — échec', {
      message: error.message,
      code: error.code,
    });
    if (error.code === '23P01') {
      throw new AppError('Ce nouveau créneau est déjà réservé', 409, 'SLOT_TAKEN');
    }
    throw new AppError('Erreur mise à jour rendez-vous', 500, 'DB_ERROR');
  }

  return data;
};

module.exports = { createAppointment, findById, findByPatient, findByDoctor, updateAppointment };
