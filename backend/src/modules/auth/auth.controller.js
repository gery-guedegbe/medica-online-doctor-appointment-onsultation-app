/**
 * MODULE: Auth - Controller
 * RESPONSABILITÉ:
 * Recevoir la requête, appeler le service, renvoyer la réponse
 * Rien d'autre — pas de logique métier ici
 *
 * RÈGLES CRITIQUES:
 * - Controller = thin layer uniquement
 * - Toujours passer les erreurs à next(err)
 * - Utiliser req.validatedData (fourni par le middleware Zod)
 *
 * Voir: /docs/GUIDELINES_DOCS.md - Section 17
 */

const authService = require('./auth.service');

/**
 * POST /api/auth/login
 * Connexion via token Supabase (Google OAuth ou email)
 */
const login = async (req, res, next) => {
  try {
    const { token } = req.validatedData;
    const data = await authService.login(token);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/auth/me
 * Retourne l'utilisateur connecté (protégé par verifyAuth)
 */
const getMe = async (req, res, next) => {
  try {
    const data = await authService.getMe(req.user.id);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

module.exports = { login, getMe };
