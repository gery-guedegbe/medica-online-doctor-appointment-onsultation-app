/**
 * MODULE: Doctors - Model
 * RESPONSABILITÉ:
 * Toutes les interactions DB pour les tables `doctors` et `users`
 * Aucune logique métier — uniquement des requêtes
 *
 * RÈGLES CRITIQUES:
 * - JOIN avec users pour retourner les infos complètes
 * - Logger toutes les erreurs DB avec détails Supabase
 * - findByUserId pour les routes /me (doctor connecté)
 * - findById pour les routes /:id (accès par ID doctor)
 *
 * Voir: /docs/GUIDELINES_DOCS.md - Section 6
 */

const supabase = require('../../shared/config/supabase');
const AppError = require('../../shared/errors/AppError');
const logger = require('../../shared/utils/logger');

// JOIN doctors + users + packages actifs
const DOCTOR_WITH_USER = `
  id, user_id, specialty, experience_years, rating, bio,
  hospital_name, hospital_address, hospital_country, patients_count,
  created_at,
  users(full_name, nickname, avatar_url, email),
  doctor_packages(id, type, price, duration_minutes, is_active)
`;

/**
 * Crée l'entrée dans `users` avec role='doctor'.
 * Appelé après l'invitation Supabase Auth.
 */
const createUserWithRole = async (id, email) => {
  logger.info('[doctor.model] createUserWithRole', { userId: id, email });

  const { error } = await supabase
    .from('users')
    .insert({ id, email, role: 'doctor' });

  if (error) {
    logger.error('[doctor.model] createUserWithRole — échec', {
      userId: id,
      message: error.message,
      code: error.code,
      details: error.details,
    });
    throw new AppError("Erreur création compte médecin", 500, 'DB_ERROR');
  }

  logger.info('[doctor.model] createUserWithRole — succès', { userId: id });
};

/**
 * Crée le profil dans la table `doctors`.
 */
const createDoctor = async (userId, data) => {
  logger.info('[doctor.model] createDoctor', { userId, specialty: data.specialty });

  const { data: doctor, error } = await supabase
    .from('doctors')
    .insert({
      user_id: userId,
      specialty: data.specialty,
      experience_years: data.experience_years || null,
      bio: data.bio || null,
    })
    .select(DOCTOR_WITH_USER)
    .single();

  if (error) {
    logger.error('[doctor.model] createDoctor — échec INSERT', {
      userId,
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    });
    throw new AppError('Erreur création profil médecin', 500, 'DB_ERROR');
  }

  logger.info('[doctor.model] createDoctor — succès', { doctorId: doctor.id });
  return doctor;
};

/**
 * Retourne tous les médecins avec filtres: specialty, min_rating, search (nom).
 * - specialty : filtre SQL ilike
 * - min_rating : filtre SQL gte
 * - search : filtre JS post-fetch sur full_name (MVP — dataset petit)
 */
const findAll = async (filters = {}) => {
  logger.info('[doctor.model] findAll', { filters });

  let query = supabase
    .from('doctors')
    .select(DOCTOR_WITH_USER)
    .order('rating', { ascending: false, nullsFirst: false });

  if (filters.specialty) {
    query = query.ilike('specialty', `%${filters.specialty}%`);
  }

  if (filters.min_rating) {
    query = query.gte('rating', parseFloat(filters.min_rating));
  }

  const { data, error } = await query;

  if (error) {
    logger.error('[doctor.model] findAll — échec', {
      message: error.message,
      code: error.code,
    });
    throw new AppError('Erreur récupération des médecins', 500, 'DB_ERROR');
  }

  // Filtre par nom (JS-side) — fiable pour MVP, à migrer en FTS pour la prod
  let result = data;
  if (filters.search) {
    const term = filters.search.toLowerCase();
    result = data.filter(
      (d) =>
        d.users?.full_name?.toLowerCase().includes(term) ||
        d.specialty.toLowerCase().includes(term)
    );
  }

  // Ne retourner que les packages actifs dans la réponse
  result = result.map((d) => ({
    ...d,
    doctor_packages: d.doctor_packages?.filter((p) => p.is_active) ?? [],
  }));

  logger.info('[doctor.model] findAll — succès', { total: data.length, filtered: result.length });
  return result;
};

/**
 * Retourne un médecin par son ID (doctors.id).
 */
const findById = async (id) => {
  logger.info('[doctor.model] findById', { doctorId: id });

  const { data, error } = await supabase
    .from('doctors')
    .select(DOCTOR_WITH_USER)
    .eq('id', id)
    .single();

  if (error || !data) {
    logger.error('[doctor.model] findById — introuvable', {
      doctorId: id,
      message: error?.message,
      code: error?.code,
    });
    throw new AppError('Médecin introuvable', 404, 'NOT_FOUND');
  }

  return data;
};

/**
 * Retourne un médecin par son user_id (pour les routes /me).
 */
const findByUserId = async (userId) => {
  logger.info('[doctor.model] findByUserId', { userId });

  const { data, error } = await supabase
    .from('doctors')
    .select(DOCTOR_WITH_USER)
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    logger.error('[doctor.model] findByUserId — introuvable', {
      userId,
      message: error?.message,
      code: error?.code,
    });
    throw new AppError('Profil médecin introuvable', 404, 'NOT_FOUND');
  }

  return data;
};

/**
 * Met à jour le profil médecin (via user_id du médecin connecté).
 */
const updateByUserId = async (userId, fields) => {
  logger.info('[doctor.model] updateByUserId', { userId, fields: Object.keys(fields) });

  const { data, error } = await supabase
    .from('doctors')
    .update(fields)
    .eq('user_id', userId)
    .select(DOCTOR_WITH_USER)
    .single();

  if (error) {
    logger.error('[doctor.model] updateByUserId — échec', {
      userId,
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    });
    throw new AppError('Erreur mise à jour profil médecin', 500, 'DB_ERROR');
  }

  logger.info('[doctor.model] updateByUserId — succès', { userId });
  return data;
};

module.exports = {
  createUserWithRole,
  createDoctor,
  findAll,
  findById,
  findByUserId,
  updateByUserId,
};
