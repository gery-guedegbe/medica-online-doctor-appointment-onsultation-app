/**
 * MODULE: Users - Controller
 * RESPONSABILITÉ:
 * Recevoir la requête, appeler le service, renvoyer la réponse
 * Aucune logique métier ici
 *
 * RÈGLES CRITIQUES:
 * - Utiliser req.validatedData (fourni par le middleware Zod)
 * - Toujours passer les erreurs à next(err)
 * - req.file disponible pour l'upload (multer)
 *
 * Voir: /docs/GUIDELINES_DOCS.md - Section 17
 */

const userService = require('./user.service');
const AppError = require('../../shared/errors/AppError');

/**
 * GET /api/users/profile
 */
const getProfile = async (req, res, next) => {
  try {
    const result = await userService.getProfile(req.user.id);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/users/profile
 */
const updateProfile = async (req, res, next) => {
  try {
    const result = await userService.updateProfile(req.user.id, req.validatedData);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/users/avatar
 */
const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new AppError('Aucun fichier fourni', 400, 'MISSING_FILE'));
    }

    const result = await userService.uploadAvatar(req.user.id, req.file.buffer, req.file.mimetype);

    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/users/pin
 */
const setPin = async (req, res, next) => {
  try {
    await userService.setPin(req.user.id, req.validatedData.pin);
    res.json({ success: true, data: { message: 'PIN créé avec succès' } });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/users — Admin uniquement
 */
const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    res.json({ success: true, data: { users } });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/users/:id — Admin uniquement
 */
const getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.json({ success: true, data: { user } });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  uploadAvatar,
  setPin,
  getAllUsers,
  getUserById,
};
