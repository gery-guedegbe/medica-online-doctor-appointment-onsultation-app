/**
 * MODULE: Doctors - Service
 * RESPONSABILITÉ:
 * Logique métier pour la gestion des profils médecins
 *
 * RÈGLES CRITIQUES:
 * - Pas de res/req ici
 * - Création médecin = invitation Supabase Auth + users + doctors (3 étapes atomiques)
 * - Si une étape échoue, logger précisément l'étape en erreur
 * - Seul l'admin peut créer un médecin (contrôlé par middleware requireRole)
 *
 * Voir: /docs/GUIDELINES_DOCS.md - Section 18
 */

const supabase = require('../../shared/config/supabase');
const doctorModel = require('./doctor.model');
const AppError = require('../../shared/errors/AppError');
const logger = require('../../shared/utils/logger');

/**
 * Crée un médecin :
 * 1. Invitation Supabase Auth (email)
 * 2. Création dans users avec role='doctor'
 * 3. Création dans doctors avec le profil
 */
const createDoctor = async (data) => {
  logger.info('[doctor.service] createDoctor — début', { email: data.email, specialty: data.specialty });

  // Étape 1 — Invitation via Supabase Auth Admin
  // redirectTo = URL frontend qui recevra le token d'invitation
  // En dev: configurable via FRONTEND_URL dans .env
  const redirectTo = process.env.FRONTEND_URL || 'http://localhost:3000';

  const { data: inviteData, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(
    data.email,
    {
      redirectTo: `${redirectTo}/auth/accept-invite`,
      data: { role: 'doctor' },
    }
  );

  if (inviteError) {
    logger.error('[doctor.service] createDoctor — échec invitation Supabase', {
      email: data.email,
      message: inviteError.message,
      status: inviteError.status,
    });

    // Email déjà enregistré dans Supabase Auth
    if (inviteError.message?.includes('already been registered')) {
      throw new AppError('Cet email est déjà enregistré', 409, 'EMAIL_ALREADY_EXISTS');
    }

    throw new AppError("Erreur lors de l'invitation du médecin", 500, 'INVITE_ERROR');
  }

  const authUserId = inviteData.user.id;
  logger.info('[doctor.service] createDoctor — invitation envoyée', {
    userId: authUserId,
    email: data.email,
  });

  // Étape 2 — Création dans notre table users avec role='doctor'
  await doctorModel.createUserWithRole(authUserId, data.email);

  // Étape 3 — Création du profil dans la table doctors
  const doctor = await doctorModel.createDoctor(authUserId, data);

  logger.info('[doctor.service] createDoctor — succès complet', {
    doctorId: doctor.id,
    userId: authUserId,
  });

  return doctor;
};

/**
 * Retourne tous les médecins avec filtres optionnels.
 * @param {object} filters - { specialty }
 */
const getAllDoctors = async (filters = {}) => {
  logger.info('[doctor.service] getAllDoctors', { filters });
  return doctorModel.findAll(filters);
};

/**
 * Retourne un médecin par son ID.
 */
const getDoctorById = async (doctorId) => {
  logger.info('[doctor.service] getDoctorById', { doctorId });
  return doctorModel.findById(doctorId);
};

/**
 * Retourne le profil du médecin connecté.
 * @param {string} userId - ID de l'utilisateur connecté (req.user.id)
 */
const getMyProfile = async (userId) => {
  logger.info('[doctor.service] getMyProfile', { userId });
  return doctorModel.findByUserId(userId);
};

/**
 * Modifie le profil du médecin connecté.
 * @param {string} userId - ID de l'utilisateur connecté
 * @param {object} data - Champs à mettre à jour
 */
const updateMyProfile = async (userId, data) => {
  logger.info('[doctor.service] updateMyProfile', { userId, fields: Object.keys(data) });
  return doctorModel.updateByUserId(userId, data);
};

module.exports = {
  createDoctor,
  getAllDoctors,
  getDoctorById,
  getMyProfile,
  updateMyProfile,
};
