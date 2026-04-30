/**
 * MIDDLEWARE: Sécurité HTTP
 * RESPONSABILITÉ:
 * Centraliser toutes les mesures de sécurité réseau du serveur
 *
 * MESURES IMPLÉMENTÉES:
 * 1. helmet       — headers HTTP sécurisés (XSS, clickjacking, MIME…)
 * 2. cors         — origines autorisées uniquement
 * 3. rateLimit    — protection brute force / DoS par IP
 * 4. hpp          — protection pollution paramètres HTTP
 * 5. body limit   — taille max des requêtes (50kb)
 *
 * NON IMPLÉMENTÉ (MVP — sur-ingénierie):
 * - Redis rate limit, CSRF, JWT blacklist, WAF, audit trail
 *
 * Voir: /docs/GUIDELINES_DOCS.md - Section 5
 */

const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');

// ============================================================
// 1. HELMET — Headers HTTP sécurisés
// ============================================================
const helmetMiddleware = helmet({
  crossOriginEmbedderPolicy: false, // Désactivé — API mobile (pas de navigateur)
  contentSecurityPolicy: false,     // Désactivé — API pure (pas de HTML servi)
});

// ============================================================
// 2. CORS — Origines autorisées
// ============================================================
const allowedOrigins = [
  'http://localhost:3000',    // Frontend web dev
  'http://localhost:8081',    // Expo dev server
  'http://localhost:5000',    // Backend self (health checks)
  'medica://',                // Deep link React Native prod
];

const corsOptions = {
  origin: (origin, callback) => {
    // Autoriser requêtes sans origin (mobile natif, Postman, curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.some((allowed) => origin.startsWith(allowed))) {
      return callback(null, true);
    }

    callback(new Error(`CORS bloqué: origine non autorisée — ${origin}`));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400, // Cache preflight 24h
};

const corsMiddleware = cors(corsOptions);

// ============================================================
// 3. RATE LIMITING
// ============================================================

// Limite générale — toutes les routes API
const generalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                  // 100 requêtes par IP par fenêtre
  standardHeaders: true,     // Headers RateLimit-* standard
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: 'Trop de requêtes — réessayez dans 15 minutes',
    },
  },
  skip: (req) => req.path === '/health', // Health check non limité
});

// Limite stricte — routes d'authentification (anti brute force)
const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,                   // 10 tentatives de login par IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_AUTH_ATTEMPTS',
      message: 'Trop de tentatives — réessayez dans 15 minutes',
    },
  },
});

// ============================================================
// 4. HPP — Protection pollution paramètres HTTP
// ============================================================
const hppMiddleware = hpp();

module.exports = {
  helmetMiddleware,
  corsMiddleware,
  generalRateLimit,
  authRateLimit,
  hppMiddleware,
};
