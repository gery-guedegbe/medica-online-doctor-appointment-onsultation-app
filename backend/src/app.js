/**
 * APP: Configuration Express Global
 * RESPONSABILITÉ:
 * Configurer tous les middlewares globaux
 * Enregistrer les routes
 * Swagger documentation
 *
 * ORDRE DES MIDDLEWARES (critique):
 * 1. Sécurité (helmet, cors, rate limit, hpp)
 * 2. Parsing (json, urlencoded)
 * 3. Logging HTTP
 * 4. Routes
 * 5. 404
 * 6. Error handler (DERNIER)
 *
 * Voir: /docs/GUIDELINES_DOCS.md - Section 6
 */

const express = require('express');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const {
  helmetMiddleware,
  corsMiddleware,
  generalRateLimit,
  authRateLimit,
  hppMiddleware,
} = require('./shared/middlewares/security');
const errorHandler = require('./shared/middlewares/errorHandler');
const logger = require('./shared/utils/logger');

const app = express();

// ========== 1. SÉCURITÉ (en premier — avant tout parsing) ==========
app.use(helmetMiddleware);
app.use(corsMiddleware);
app.use(generalRateLimit);
app.use(hppMiddleware);

// ========== 2. SWAGGER ==========
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Medica API',
      version: '1.0.0',
      description: 'API de gestion de rendez-vous médicaux',
    },
    servers: [{ url: 'http://localhost:5000', description: 'Serveur de développement' }],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
    },
  },
  apis: ['./src/modules/*/*.routes.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ========== 3. PARSING (taille max explicite) ==========
app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ extended: true, limit: '50kb' }));

// ========== 4. LOGGING HTTP ==========
// En production: 'combined' pour les proxies/load balancers
// En dev: 'dev' pour la lisibilité
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// ========== 5. HEALTH CHECK ==========
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Serveur actif' });
});

// ========== 6. ROUTES ==========
// Rate limit strict sur les routes d'auth (anti brute force)
app.use('/api/auth', authRateLimit, require('./modules/auth/auth.routes'));
app.use('/api/users', require('./modules/users/user.routes'));
app.use('/api/doctors', require('./modules/doctors/doctor.routes'));
app.use('/api/availability', require('./modules/availability/availability.routes'));
app.use('/api/packages', require('./modules/packages/package.routes'));
app.use('/api/appointments', require('./modules/appointments/appointment.routes'));
app.use('/api/reviews', require('./modules/reviews/review.routes'));
app.use('/api/favorites', require('./modules/favorites/favorite.routes'));

// ========== 7. 404 ==========
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: { code: 'NOT_FOUND', message: 'Route non trouvée' },
  });
});

// ========== 8. ERROR HANDLER (DOIT ÊTRE LE DERNIER) ==========
app.use(errorHandler);

logger.info('Application Express configurée');

module.exports = app;
