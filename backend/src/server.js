/**
 * SERVER: Point d'Entrée
 * RESPONSABILITÉ:
 * Initialiser le serveur Express
 * Lancer l'écoute du port
 * Gestion des signaux d'arrêt gracieux
 *
 * Voir: /docs/GUIDELINES_DOCS.md - Section 6
 */

require('dotenv').config();

const app = require('./app');
const logger = require('./shared/utils/logger');

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

const server = app.listen(PORT, () => {
  logger.info(`Serveur Medica démarré`, {
    port: PORT,
    env: NODE_ENV,
    url: `http://localhost:${PORT}`,
    docs: `http://localhost:${PORT}/docs`,
  });
});

// ========== GESTION GRACIEUSE DE L'ARRÊT ==========
process.on('SIGTERM', () => {
  logger.info('Signal SIGTERM reçu, fermeture gracieuse du serveur');
  server.close(() => {
    logger.info('Serveur fermé');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('Signal SIGINT reçu, fermeture gracieuse du serveur');
  server.close(() => {
    logger.info('Serveur fermé');
    process.exit(0);
  });
});

process.on('uncaughtException', (err) => {
  logger.error('Exception non gérée', { error: err.message });
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Promise rejetée non gérée', { reason });
  process.exit(1);
});
