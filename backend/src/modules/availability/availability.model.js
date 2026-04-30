/**
 * MODULE: Availability - Model
 * RESPONSABILITÉ:
 * Toutes les interactions DB pour availability_rules et appointments
 * Aucune logique métier — uniquement des requêtes
 *
 * RÈGLES CRITIQUES:
 * - Unicité (doctor_id, day_of_week) vérifiée avant INSERT
 * - Vérifier que la règle appartient au doctor avant UPDATE/DELETE
 * - Logger toutes les erreurs DB avec détails Supabase
 *
 * Voir: /docs/GUIDELINES_DOCS.md - Section 6
 */

const supabase = require('../../shared/config/supabase');
const AppError = require('../../shared/errors/AppError');
const logger = require('../../shared/utils/logger');

/**
 * Vérifie si une règle existe déjà pour ce doctor + ce jour.
 */
const findRuleByDayOfWeek = async (doctorId, dayOfWeek) => {
  logger.info('[availability.model] findRuleByDayOfWeek', { doctorId, dayOfWeek });

  const { data } = await supabase
    .from('availability_rules')
    .select('id')
    .eq('doctor_id', doctorId)
    .eq('day_of_week', dayOfWeek)
    .maybeSingle();

  return data;
};

/**
 * Crée une règle de disponibilité.
 */
const createRule = async (doctorId, data) => {
  logger.info('[availability.model] createRule', { doctorId, ...data });

  const { data: rule, error } = await supabase
    .from('availability_rules')
    .insert({
      doctor_id: doctorId,
      day_of_week: data.day_of_week,
      start_time: data.start_time,
      end_time: data.end_time,
    })
    .select()
    .single();

  if (error) {
    logger.error('[availability.model] createRule — échec', {
      doctorId,
      message: error.message,
      code: error.code,
      details: error.details,
    });
    throw new AppError('Erreur création règle de disponibilité', 500, 'DB_ERROR');
  }

  logger.info('[availability.model] createRule — succès', { ruleId: rule.id });
  return rule;
};

/**
 * Retourne toutes les règles d'un médecin, triées par jour.
 */
const findRulesByDoctorId = async (doctorId) => {
  logger.info('[availability.model] findRulesByDoctorId', { doctorId });

  const { data, error } = await supabase
    .from('availability_rules')
    .select('id, doctor_id, day_of_week, start_time, end_time, created_at')
    .eq('doctor_id', doctorId)
    .order('day_of_week', { ascending: true });

  if (error) {
    logger.error('[availability.model] findRulesByDoctorId — échec', {
      doctorId,
      message: error.message,
      code: error.code,
    });
    throw new AppError('Erreur récupération des règles', 500, 'DB_ERROR');
  }

  return data;
};

/**
 * Récupère une règle par son ID.
 */
const findRuleById = async (id) => {
  logger.info('[availability.model] findRuleById', { ruleId: id });

  const { data, error } = await supabase
    .from('availability_rules')
    .select('id, doctor_id, day_of_week, start_time, end_time')
    .eq('id', id)
    .single();

  if (error || !data) {
    logger.error('[availability.model] findRuleById — introuvable', {
      ruleId: id,
      message: error?.message,
    });
    throw new AppError('Règle introuvable', 404, 'NOT_FOUND');
  }

  return data;
};

/**
 * Met à jour les horaires d'une règle.
 */
const updateRule = async (id, fields) => {
  logger.info('[availability.model] updateRule', { ruleId: id, fields: Object.keys(fields) });

  const { data, error } = await supabase
    .from('availability_rules')
    .update(fields)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    logger.error('[availability.model] updateRule — échec', {
      ruleId: id,
      message: error.message,
      code: error.code,
    });
    throw new AppError('Erreur mise à jour règle', 500, 'DB_ERROR');
  }

  logger.info('[availability.model] updateRule — succès', { ruleId: id });
  return data;
};

/**
 * Supprime une règle.
 */
const deleteRule = async (id) => {
  logger.info('[availability.model] deleteRule', { ruleId: id });

  const { error } = await supabase
    .from('availability_rules')
    .delete()
    .eq('id', id);

  if (error) {
    logger.error('[availability.model] deleteRule — échec', {
      ruleId: id,
      message: error.message,
      code: error.code,
    });
    throw new AppError('Erreur suppression règle', 500, 'DB_ERROR');
  }

  logger.info('[availability.model] deleteRule — succès', { ruleId: id });
};

/**
 * Récupère la règle du médecin pour un jour donné.
 * Utilisé par l'algorithme de génération des slots.
 */
const findRuleForDay = async (doctorId, dayOfWeek) => {
  logger.info('[availability.model] findRuleForDay', { doctorId, dayOfWeek });

  const { data } = await supabase
    .from('availability_rules')
    .select('start_time, end_time')
    .eq('doctor_id', doctorId)
    .eq('day_of_week', dayOfWeek)
    .maybeSingle();

  return data;
};

/**
 * Récupère les RDV confirmés d'un médecin pour une date donnée.
 * Utilisé pour exclure les créneaux déjà réservés.
 */
const findAppointmentsForDate = async (doctorId, date) => {
  logger.info('[availability.model] findAppointmentsForDate', { doctorId, date });

  const startOfDay = `${date}T00:00:00`;
  const endOfDay = `${date}T23:59:59`;

  const { data, error } = await supabase
    .from('appointments')
    .select('start_time, end_time')
    .eq('doctor_id', doctorId)
    .neq('status', 'cancelled')
    .gte('start_time', startOfDay)
    .lte('start_time', endOfDay);

  if (error) {
    logger.error('[availability.model] findAppointmentsForDate — échec', {
      doctorId,
      date,
      message: error.message,
    });
    throw new AppError('Erreur récupération des rendez-vous', 500, 'DB_ERROR');
  }

  logger.info('[availability.model] findAppointmentsForDate — succès', {
    doctorId,
    date,
    count: data.length,
  });

  return data;
};

module.exports = {
  findRuleByDayOfWeek,
  createRule,
  findRulesByDoctorId,
  findRuleById,
  updateRule,
  deleteRule,
  findRuleForDay,
  findAppointmentsForDate,
};
