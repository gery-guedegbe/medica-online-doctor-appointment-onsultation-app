/**
 * MODULE: Packages - Service
 * RESPONSABILITÉ: Logique métier pour les packages médecin
 * Voir: /docs/GUIDELINES_DOCS.md - Section 18
 */

const packageModel = require('./package.model');
const AppError = require('../../shared/errors/AppError');
const logger = require('../../shared/utils/logger');

const getDoctorIdFromUserId = async (userId) => {
  const supabase = require('../../shared/config/supabase');
  const { data, error } = await supabase
    .from('doctors')
    .select('id')
    .eq('user_id', userId)
    .single();

  if (error || !data) throw new AppError('Profil médecin introuvable', 404, 'NOT_FOUND');
  return data.id;
};

const createPackage = async (userId, data) => {
  logger.info('[package.service] createPackage', { userId, type: data.type });
  const doctorId = await getDoctorIdFromUserId(userId);
  return packageModel.createPackage(doctorId, data);
};

const getPackagesByDoctor = async (doctorId, activeOnly = true) => {
  logger.info('[package.service] getPackagesByDoctor', { doctorId });
  return packageModel.findByDoctorId(doctorId, activeOnly);
};

const getMyPackages = async (userId) => {
  logger.info('[package.service] getMyPackages', { userId });
  const doctorId = await getDoctorIdFromUserId(userId);
  return packageModel.findByDoctorId(doctorId, false);
};

const updatePackage = async (userId, packageId, data) => {
  logger.info('[package.service] updatePackage', { userId, packageId });
  const doctorId = await getDoctorIdFromUserId(userId);
  const pkg = await packageModel.findById(packageId);

  if (pkg.doctor_id !== doctorId) {
    throw new AppError('Accès interdit', 403, 'FORBIDDEN');
  }

  return packageModel.updatePackage(packageId, data);
};

const deletePackage = async (userId, packageId) => {
  logger.info('[package.service] deletePackage', { userId, packageId });
  const doctorId = await getDoctorIdFromUserId(userId);
  const pkg = await packageModel.findById(packageId);

  if (pkg.doctor_id !== doctorId) {
    throw new AppError('Accès interdit', 403, 'FORBIDDEN');
  }

  await packageModel.deletePackage(packageId);
};

module.exports = { createPackage, getPackagesByDoctor, getMyPackages, updatePackage, deletePackage };
