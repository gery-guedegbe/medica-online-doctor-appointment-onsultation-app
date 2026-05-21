/**
 * SEED: Mise à jour des champs hôpital sur les médecins existants
 * Usage : node backend/seed/update_hospital_fields.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Même données que seed_doctors.js — uniquement les champs hôpital
const HOSPITAL_DATA = [
  { email: 'amara.diallo@medica-seed.com',    hospital_name: 'CHU de Cotonou',                        hospital_address: 'Avenue Jean-Paul II, Cotonou',                    hospital_country: 'Bénin',          patients_count: 4200 },
  { email: 'jb.martin@medica-seed.com',       hospital_name: 'Hôpital Lariboisière',                  hospital_address: '2 Rue Ambroise Paré, 75010 Paris',                hospital_country: 'France',         patients_count: 6800 },
  { email: 'sofia.rodriguez@medica-seed.com', hospital_name: 'Hospital Universitario La Paz',         hospital_address: 'Paseo de la Castellana 261, Madrid',              hospital_country: 'Espagne',        patients_count: 3100 },
  { email: 'marcus.johnson@medica-seed.com',  hospital_name: 'Johns Hopkins Hospital',                hospital_address: '1800 Orleans St, Baltimore, MD 21287',            hospital_country: 'États-Unis',     patients_count: 5500 },
  { email: 'fatima.alhassan@medica-seed.com', hospital_name: 'King Faisal Specialist Hospital',       hospital_address: 'Zahrawi St, Al Andalus, Jeddah',                  hospital_country: 'Arabie Saoudite',patients_count: 3900 },
  { email: 'pierre.dubois@medica-seed.com',   hospital_name: 'Hôpital Cochin',                        hospital_address: '27 Rue du Faubourg Saint-Jacques, 75014 Paris',   hospital_country: 'France',         patients_count: 4700 },
  { email: 'emma.watson@medica-seed.com',     hospital_name: 'Maudsley Hospital',                     hospital_address: 'Denmark Hill, London SE5 8AZ',                    hospital_country: 'Royaume-Uni',    patients_count: 2800 },
  { email: 'kwame.asante@medica-seed.com',    hospital_name: 'Korle Bu Teaching Hospital',            hospital_address: 'Guggisberg Ave, Accra',                           hospital_country: 'Ghana',          patients_count: 3600 },
  { email: 'marie.nguyen@medica-seed.com',    hospital_name: 'Hôpital Necker – Enfants Malades',      hospital_address: '149 Rue de Sèvres, 75015 Paris',                  hospital_country: 'France',         patients_count: 5200 },
  { email: 'ahmed.benali@medica-seed.com',    hospital_name: 'Clinique Dentaire Benali',               hospital_address: '14 Rue Didouche Mourad, Alger',                   hospital_country: 'Algérie',        patients_count: 7100 },
  { email: 'laura.chen@medica-seed.com',      hospital_name: 'National University Hospital',          hospital_address: '5 Lower Kent Ridge Rd, Singapore 119074',         hospital_country: 'Singapour',      patients_count: 3400 },
  { email: 'david.okafor@medica-seed.com',    hospital_name: 'Lagos University Teaching Hospital',    hospital_address: 'Ishaga Rd, Idi-Araba, Lagos',                     hospital_country: 'Nigeria',        patients_count: 4900 },
  { email: 'isabelle.moreau@medica-seed.com', hospital_name: 'Hôpital Erasme',                        hospital_address: 'Route de Lennik 808, 1070 Bruxelles',             hospital_country: 'Belgique',       patients_count: 3200 },
  { email: 'carlos.santos@medica-seed.com',   hospital_name: 'Hospital das Clínicas',                 hospital_address: 'Av. Dr. Enéas Carvalho de Aguiar, 255, São Paulo', hospital_country: 'Brésil',         patients_count: 4100 },
  { email: 'nadia.kowalski@medica-seed.com',  hospital_name: 'Charité – Universitätsmedizin Berlin',  hospital_address: 'Charitéplatz 1, 10117 Berlin',                    hospital_country: 'Allemagne',      patients_count: 2600 },
  { email: 'samuel.mensah@medica-seed.com',   hospital_name: 'Komfo Anokye Teaching Hospital',        hospital_address: 'Okomfo Anokye Rd, Kumasi',                        hospital_country: 'Ghana',          patients_count: 3800 },
  { email: 'camille.bernard@medica-seed.com', hospital_name: 'Hôpital Pitié-Salpêtrière',             hospital_address: "47-83 Bd de l'Hôpital, 75013 Paris",             hospital_country: 'France',         patients_count: 3300 },
  { email: 'victor.tran@medica-seed.com',     hospital_name: 'Cho Ray Hospital',                      hospital_address: '201B Nguyen Chi Thanh, Ho Chi Minh City',         hospital_country: 'Viêt Nam',       patients_count: 4500 },
  { email: 'yasmine.bouali@medica-seed.com',  hospital_name: 'Hôpital Charles Nicolle',               hospital_address: 'Blvd du 9 Avril 1938, Tunis',                    hospital_country: 'Tunisie',        patients_count: 2900 },
  { email: 'thomas.anderson@medica-seed.com', hospital_name: 'Mayo Clinic',                           hospital_address: '200 First St SW, Rochester, MN 55905',            hospital_country: 'États-Unis',     patients_count: 6200 },
  { email: 'aisha.ibrahim@medica-seed.com',   hospital_name: 'Kenyatta National Hospital',            hospital_address: 'Hospital Rd, Nairobi',                            hospital_country: 'Kenya',          patients_count: 4300 },
  { email: 'luca.ferrari@medica-seed.com',    hospital_name: 'Ospedale San Raffaele',                 hospital_address: 'Via Olgettina, 60, 20132 Milano',                 hospital_country: 'Italie',         patients_count: 5800 },
];

async function main() {
  console.log('\n🏥  Mise à jour des champs hôpital...\n');

  let success = 0;
  let errors  = 0;

  for (const entry of HOSPITAL_DATA) {
    // Trouver le user_id via l'email
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('email', entry.email)
      .maybeSingle();

    if (!user) {
      console.log(`⚠️   ${entry.email} — introuvable, ignoré`);
      continue;
    }

    const { error } = await supabase
      .from('doctors')
      .update({
        hospital_name:    entry.hospital_name,
        hospital_address: entry.hospital_address,
        hospital_country: entry.hospital_country,
        patients_count:   entry.patients_count,
      })
      .eq('user_id', user.id);

    if (error) {
      console.error(`❌  ${entry.email} — ${error.message}`);
      errors++;
    } else {
      console.log(`✅  ${entry.hospital_name} → ${entry.email}`);
      success++;
    }
  }

  console.log('\n─────────────────────────────────────────');
  console.log(`✅  Mis à jour : ${success}`);
  console.log(`❌  Erreurs   : ${errors}`);
  console.log('─────────────────────────────────────────\n');
}

main();
