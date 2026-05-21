/**
 * Utilitaire : exécute un fichier SQL de migration via le client Supabase
 * Usage : node backend/seed/run_migration.js <chemin_fichier_sql>
 * Exemple : node backend/seed/run_migration.js backend/migrations/006_add_hospital_fields_to_doctors.sql
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function main() {
  const sqlFile = process.argv[2];
  if (!sqlFile) {
    console.error('Usage: node run_migration.js <chemin_fichier_sql>');
    process.exit(1);
  }

  const absolutePath = path.resolve(process.cwd(), sqlFile);
  if (!fs.existsSync(absolutePath)) {
    console.error(`Fichier introuvable : ${absolutePath}`);
    process.exit(1);
  }

  const sql = fs.readFileSync(absolutePath, 'utf8');
  console.log(`\n🚀  Exécution de ${path.basename(absolutePath)}...\n`);

  const { error } = await supabase.rpc('exec_sql', { sql_query: sql }).single();

  // Fallback : certaines instances Supabase n'ont pas exec_sql → utiliser l'API REST directement
  if (error) {
    // Essayer via l'API /rest/v1/rpc ou afficher les instructions manuelles
    console.log('⚠️  exec_sql non disponible. Applique manuellement dans le SQL Editor Supabase :\n');
    console.log('─'.repeat(60));
    console.log(sql);
    console.log('─'.repeat(60));
    console.log('\n→ Dashboard Supabase → SQL Editor → Colle et exécute le SQL ci-dessus\n');
    return;
  }

  console.log('✅  Migration appliquée avec succès\n');
}

main();
