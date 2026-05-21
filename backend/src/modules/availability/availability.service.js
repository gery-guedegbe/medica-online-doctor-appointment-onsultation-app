/**
 * MODULE: Availability - Service
 * RESPONSABILITÉ:
 * Logique métier pour la gestion des disponibilités médecin
 *
 * RÈGLES CRITIQUES:
 * - Un seul règle par doctor par jour (unicité vérifiée avant INSERT)
 * - Vérifier la propriété de la règle avant UPDATE/DELETE
 * - Algorithme de slots : règle → RDV existants → slots disponibles
 * - Durée fixe 30 min, timezone UTC uniquement
 * - day_of_week: 0=Lundi ... 6=Dimanche (différent de JS: 0=Dimanche)
 *
 * Voir: /docs/GUIDELINES_DOCS.md - Section 18
 */

const availabilityModel = require('./availability.model');
const AppError = require('../../shared/errors/AppError');
const logger = require('../../shared/utils/logger');
const { APPOINTMENT_DURATION_MINUTES } = require('../../shared/config/constants');

// Noms des jours pour les logs lisibles
const DAY_NAMES = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

/**
 * Convertit HH:MM en minutes depuis minuit.
 */
const timeToMinutes = (time) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

/**
 * Convertit minutes depuis minuit en HH:MM.
 */
const minutesToTime = (minutes) => {
  const h = Math.floor(minutes / 60).toString().padStart(2, '0');
  const m = (minutes % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
};

/**
 * Convertit une date YYYY-MM-DD en day_of_week interne (0=Lundi, 6=Dimanche).
 * JS getDay() retourne 0=Dimanche, 1=Lundi, ..., 6=Samedi.
 */
const getDayOfWeek = (dateStr) => {
  const date = new Date(`${dateStr}T12:00:00Z`);
  const jsDay = date.getUTCDay(); // 0=Dim, 1=Lun, ..., 6=Sam
  return (jsDay + 6) % 7;        // Notre convention: 0=Lun, 6=Dim
};

/**
 * Récupère le doctor_id à partir du user_id.
 * Utilisé sur toutes les routes /me du doctor.
 */
const getDoctorIdFromUserId = async (userId) => {
  const supabase = require('../../shared/config/supabase');
  const { data, error } = await supabase
    .from('doctors')
    .select('id')
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    logger.error('[availability.service] getDoctorIdFromUserId — introuvable', { userId });
    throw new AppError('Profil médecin introuvable', 404, 'NOT_FOUND');
  }

  return data.id;
};

/**
 * Ajoute une règle de disponibilité.
 * Vérifie qu'il n'en existe pas déjà une pour ce jour.
 */
const addRule = async (userId, data) => {
  logger.info('[availability.service] addRule', {
    userId,
    day: DAY_NAMES[data.day_of_week],
    start_time: data.start_time,
    end_time: data.end_time,
  });

  const doctorId = await getDoctorIdFromUserId(userId);

  const existing = await availabilityModel.findRuleByDayOfWeek(doctorId, data.day_of_week);
  if (existing) {
    throw new AppError(
      `Une règle existe déjà pour le ${DAY_NAMES[data.day_of_week]}`,
      409,
      'RULE_ALREADY_EXISTS'
    );
  }

  const rule = await availabilityModel.createRule(doctorId, data);

  logger.info('[availability.service] addRule — succès', { ruleId: rule.id });
  return rule;
};

/**
 * Retourne toutes les règles du médecin connecté.
 */
const getMyRules = async (userId) => {
  logger.info('[availability.service] getMyRules', { userId });

  const doctorId = await getDoctorIdFromUserId(userId);
  const rules = await availabilityModel.findRulesByDoctorId(doctorId);

  logger.info('[availability.service] getMyRules — succès', { count: rules.length });
  return rules;
};

/**
 * Modifie les horaires d'une règle.
 * Vérifie que la règle appartient bien au médecin connecté.
 */
const updateRule = async (userId, ruleId, data) => {
  logger.info('[availability.service] updateRule', { userId, ruleId });

  const doctorId = await getDoctorIdFromUserId(userId);
  const rule = await availabilityModel.findRuleById(ruleId);

  if (rule.doctor_id !== doctorId) {
    logger.error('[availability.service] updateRule — tentative accès règle non autorisée', {
      userId,
      ruleId,
      ruleOwner: rule.doctor_id,
    });
    throw new AppError('Accès interdit', 403, 'FORBIDDEN');
  }

  // Valider la cohérence des horaires après merge
  const updatedStart = data.start_time || rule.start_time;
  const updatedEnd = data.end_time || rule.end_time;
  if (updatedStart >= updatedEnd) {
    throw new AppError('end_time doit être après start_time', 400, 'VALIDATION_ERROR');
  }

  return availabilityModel.updateRule(ruleId, data);
};

/**
 * Supprime une règle.
 * Vérifie que la règle appartient bien au médecin connecté.
 */
const deleteRule = async (userId, ruleId) => {
  logger.info('[availability.service] deleteRule', { userId, ruleId });

  const doctorId = await getDoctorIdFromUserId(userId);
  const rule = await availabilityModel.findRuleById(ruleId);

  if (rule.doctor_id !== doctorId) {
    logger.error('[availability.service] deleteRule — tentative suppression non autorisée', {
      userId,
      ruleId,
    });
    throw new AppError('Accès interdit', 403, 'FORBIDDEN');
  }

  await availabilityModel.deleteRule(ruleId);
};

/**
 * Génère les créneaux disponibles pour un médecin à une date donnée.
 * @param {string} doctorId - ID du médecin (doctors.id)
 * @param {string} date - Date au format YYYY-MM-DD
 */
const getAvailableSlots = async (doctorId, date) => {
  logger.info('[availability.service] getAvailableSlots', { doctorId, date });

  const dayOfWeek = getDayOfWeek(date);
  logger.info('[availability.service] getAvailableSlots — jour calculé', {
    date,
    dayOfWeek,
    dayName: DAY_NAMES[dayOfWeek],
  });

  // 1. Récupère la règle pour ce jour de la semaine
  const rule = await availabilityModel.findRuleForDay(doctorId, dayOfWeek);

  if (!rule) {
    logger.info('[availability.service] getAvailableSlots — aucune règle ce jour', {
      doctorId,
      date,
      dayName: DAY_NAMES[dayOfWeek],
    });
    return { doctor_id: doctorId, date, day: DAY_NAMES[dayOfWeek], slots: [] };
  }

  // 2. Récupère les RDV existants pour ce jour
  const appointments = await availabilityModel.findAppointmentsForDate(doctorId, date);

  // 3. Génère tous les créneaux de 30 min et marque les occupés
  const startMinutes = timeToMinutes(rule.start_time);
  const endMinutes = timeToMinutes(rule.end_time);
  const slots = [];

  for (
    let minutes = startMinutes;
    minutes + APPOINTMENT_DURATION_MINUTES <= endMinutes;
    minutes += APPOINTMENT_DURATION_MINUTES
  ) {
    const slotStart = minutesToTime(minutes);
    const slotEnd = minutesToTime(minutes + APPOINTMENT_DURATION_MINUTES);

    // Vérifie si un RDV occupe ce créneau
    const isBooked = appointments.some((apt) => {
      const aptStartMinutes = timeToMinutes(apt.start_time.substring(11, 16));
      const aptEndMinutes = timeToMinutes(apt.end_time.substring(11, 16));
      return aptStartMinutes < minutes + APPOINTMENT_DURATION_MINUTES && aptEndMinutes > minutes;
    });

    slots.push({ start: slotStart, end: slotEnd, available: !isBooked });
  }

  logger.info('[availability.service] getAvailableSlots — succès', {
    doctorId,
    date,
    total: slots.length,
    available: slots.filter((s) => s.available).length,
  });

  return {
    doctor_id: doctorId,
    date,
    day: DAY_NAMES[dayOfWeek],
    working_hours: { start: rule.start_time, end: rule.end_time },
    slots,
  };
};

/**
 * Retourne les règles de disponibilité d'un médecin (accessible aux patients).
 */
const getRulesForDoctor = async (doctorId) => {
  logger.info('[availability.service] getRulesForDoctor', { doctorId });
  return availabilityModel.findRulesByDoctorId(doctorId);
};

module.exports = { addRule, getMyRules, updateRule, deleteRule, getAvailableSlots, getRulesForDoctor };
