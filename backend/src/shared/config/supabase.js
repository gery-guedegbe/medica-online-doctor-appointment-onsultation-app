/**
 * CONFIG: Client Supabase
 * RESPONSABILITÉ:
 * Initialiser et exporter le client Supabase
 * Réutilisable dans tous les modules
 *
 * RÈGLES CRITIQUES:
 * - Une seule instance de client
 * - Lire les vars d'env depuis .env
 * - Vérifier que les vars existent
 *
 * Voir: /docs/GUIDELINES_DOCS.md - Section 6
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const logger = require('../utils/logger');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  logger.error('Variables Supabase manquantes dans .env');
  process.exit(1);
}

// Client avec la service key (accès complet)
// À utiliser côté backend uniquement
const supabase = createClient(supabaseUrl, supabaseServiceKey);

logger.info('Client Supabase initialisé', { url: supabaseUrl });

module.exports = supabase;
