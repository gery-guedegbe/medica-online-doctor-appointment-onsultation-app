/**
 * 🎯 UTILITY: Logger Centralisé
 * 📌 RESPONSABILITÉ:
 * Logs simples et utiles (info / error uniquement)
 * Pas de données sensibles
 * Timestamps automatiques
 *
 * ⚠️ RÈGLES CRITIQUES:
 * - Jamais logger: mots de passe, tokens, emails sensibles
 * - Info: opérations normales
 * - Error: problèmes réels uniquement
 * - Pas de spam
 *
 * 📘 Voir: /docs/GUIDELINES_DOCS.md - Section 15
 */

const LOG_LEVEL = process.env.LOG_LEVEL || 'info';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
};

const formatLog = (level, message, data = {}) => {
  const timestamp = new Date().toISOString();
  const dataStr = Object.keys(data).length > 0 ? JSON.stringify(data) : '';
  return `[${timestamp}] [${level}] ${message} ${dataStr}`;
};

const logger = {
  info: (message, data = {}) => {
    if (['info', 'debug'].includes(LOG_LEVEL)) {
      console.log(`${colors.green}${formatLog('INFO', message, data)}${colors.reset}`);
    }
  },

  error: (message, data = {}) => {
    console.error(`${colors.red}${formatLog('ERROR', message, data)}${colors.reset}`);
  },

  warn: (message, data = {}) => {
    console.warn(`${colors.yellow}${formatLog('WARN', message, data)}${colors.reset}`);
  },
};

module.exports = logger;
