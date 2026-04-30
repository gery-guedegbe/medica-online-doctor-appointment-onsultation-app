/**
 * MODULE: Favorites - Controller
 * RESPONSABILITÉ: Thin controllers pour les favoris
 * Voir: /docs/GUIDELINES_DOCS.md - Section 17
 */

const favoriteService = require('./favorite.service');

const add = async (req, res, next) => {
  try {
    const { doctor_id } = req.body;
    if (!doctor_id) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'doctor_id requis' },
      });
    }
    const favorite = await favoriteService.addFavorite(req.user.id, doctor_id);
    res.status(201).json({ success: true, data: { favorite } });
  } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try {
    await favoriteService.removeFavorite(req.user.id, req.params.doctorId);
    res.json({ success: true, data: { message: 'Médecin retiré des favoris' } });
  } catch (err) { next(err); }
};

const getAll = async (req, res, next) => {
  try {
    const favorites = await favoriteService.getMyFavorites(req.user.id);
    res.json({ success: true, data: { favorites, count: favorites.length } });
  } catch (err) { next(err); }
};

module.exports = { add, remove, getAll };
