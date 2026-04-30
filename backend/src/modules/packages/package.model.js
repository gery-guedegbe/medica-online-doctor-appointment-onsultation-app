/**
 * MODULE: Packages - Model
 * RESPONSABILITÉ: Requêtes DB pour doctor_packages
 * Voir: /docs/GUIDELINES_DOCS.md - Section 6
 */

const supabase = require('../../shared/config/supabase');
const AppError = require('../../shared/errors/AppError');
const logger = require('../../shared/utils/logger');

const createPackage = async (doctorId, data) => {
  logger.info('[package.model] createPackage', { doctorId, type: data.type });

  const { data: pkg, error } = await supabase
    .from('doctor_packages')
    .insert({ doctor_id: doctorId, ...data })
    .select()
    .single();

  if (error) {
    logger.error('[package.model] createPackage — échec', {
      message: error.message, code: error.code, details: error.details,
    });
    if (error.code === '23505') {
      throw new AppError(`Un package "${data.type}" existe déjà`, 409, 'PACKAGE_ALREADY_EXISTS');
    }
    throw new AppError('Erreur création package', 500, 'DB_ERROR');
  }

  logger.info('[package.model] createPackage — succès', { packageId: pkg.id });
  return pkg;
};

const findByDoctorId = async (doctorId, activeOnly = false) => {
  logger.info('[package.model] findByDoctorId', { doctorId, activeOnly });

  let query = supabase
    .from('doctor_packages')
    .select('id, doctor_id, type, price, duration_minutes, is_active, created_at')
    .eq('doctor_id', doctorId)
    .order('type');

  if (activeOnly) query = query.eq('is_active', true);

  const { data, error } = await query;

  if (error) {
    logger.error('[package.model] findByDoctorId — échec', { message: error.message });
    throw new AppError('Erreur récupération packages', 500, 'DB_ERROR');
  }

  return data;
};

const findById = async (id) => {
  logger.info('[package.model] findById', { packageId: id });

  const { data, error } = await supabase
    .from('doctor_packages')
    .select('id, doctor_id, type, price, duration_minutes, is_active')
    .eq('id', id)
    .single();

  if (error || !data) {
    logger.error('[package.model] findById — introuvable', { packageId: id, message: error?.message });
    throw new AppError('Package introuvable', 404, 'NOT_FOUND');
  }

  return data;
};

const updatePackage = async (id, fields) => {
  logger.info('[package.model] updatePackage', { packageId: id });

  const { data, error } = await supabase
    .from('doctor_packages')
    .update(fields)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    logger.error('[package.model] updatePackage — échec', { message: error.message, code: error.code });
    throw new AppError('Erreur mise à jour package', 500, 'DB_ERROR');
  }

  return data;
};

const deletePackage = async (id) => {
  logger.info('[package.model] deletePackage', { packageId: id });

  const { error } = await supabase.from('doctor_packages').delete().eq('id', id);

  if (error) {
    logger.error('[package.model] deletePackage — échec', { message: error.message });
    throw new AppError('Erreur suppression package', 500, 'DB_ERROR');
  }
};

module.exports = { createPackage, findByDoctorId, findById, updatePackage, deletePackage };
