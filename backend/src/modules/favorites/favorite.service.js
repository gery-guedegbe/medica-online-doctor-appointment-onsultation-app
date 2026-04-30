/**
 * MODULE: Favorites - Service
 * RESPONSABILITÉ: Logique métier pour les favoris
 * Voir: /docs/GUIDELINES_DOCS.md - Section 18
 */

const favoriteModel = require('./favorite.model');
const logger = require('../../shared/utils/logger');

const addFavorite = async (patientId, doctorId) => {
  logger.info('[favorite.service] addFavorite', { patientId, doctorId });
  return favoriteModel.addFavorite(patientId, doctorId);
};

const removeFavorite = async (patientId, doctorId) => {
  logger.info('[favorite.service] removeFavorite', { patientId, doctorId });
  await favoriteModel.removeFavorite(patientId, doctorId);
};

const getMyFavorites = async (patientId) => {
  logger.info('[favorite.service] getMyFavorites', { patientId });
  return favoriteModel.findByPatient(patientId);
};

module.exports = { addFavorite, removeFavorite, getMyFavorites };
