/**
 * APP: Configuration Express Global
 * RESPONSABILITÉ:
 * Configurer tous les middlewares globaux
 * Enregistrer les routes
 * Swagger documentation
 *
 * RÈGLES CRITIQUES:
 * - Error handler DOIT être le dernier middleware
 * - CORS configuré
 * - JSON parsing actif
 *
 * Voir: /docs/GUIDELINES_DOCS.md - Section 6
 */

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const errorHandler = require('./shared/middlewares/errorHandler');
const logger = require('./shared/utils/logger');

const app = express();

// ========== SWAGGER SETUP ==========
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Medica API',
      version: '1.0.0',
      description: 'API de gestion de rendez-vous médicaux',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Serveur de développement',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/modules/*/*.routes.js'], // Fichiers de routes Swagger
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ========== MIDDLEWARES GLOBAUX ==========
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTTP logging
app.use(morgan('combined'));

// ========== HEALTH CHECK ==========
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Serveur actif' });
});

// ========== ROUTES ==========
app.use('/api/auth', require('./modules/auth/auth.routes'));
app.use('/api/users', require('./modules/users/user.routes'));
app.use('/api/doctors', require('./modules/doctors/doctor.routes'));
app.use('/api/availability', require('./modules/availability/availability.routes'));

// ========== 404 HANDLER ==========
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Route non trouvée',
    },
  });
});

// ========== ERROR HANDLER (DOIT ÊTRE LE DERNIER) ==========
app.use(errorHandler);

logger.info('Application Express configurée');

module.exports = app;
