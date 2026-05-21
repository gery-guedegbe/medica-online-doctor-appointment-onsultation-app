/**
 * SEED: Téléchargement des photos de profil des médecins
 *
 * Télécharge 22 photos réalistes depuis l'API randomuser.me
 * et les enregistre dans frontend/assets/doctors/doctor_XX.jpg
 *
 * Usage :
 *   node backend/seed/download_doctor_images.js
 *
 * Aucune dépendance externe — utilise uniquement les modules Node.js natifs.
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '../../frontend/assets/doctors');

// Correspondance index → genre (basé sur les données du seed)
const DOCTORS = [
  { file: 'doctor_01.jpg', gender: 'female', name: 'Dr. Amara Diallo' },
  { file: 'doctor_02.jpg', gender: 'male',   name: 'Dr. Jean-Baptiste Martin' },
  { file: 'doctor_03.jpg', gender: 'female', name: 'Dr. Sofia Rodriguez' },
  { file: 'doctor_04.jpg', gender: 'male',   name: 'Dr. Marcus Johnson' },
  { file: 'doctor_05.jpg', gender: 'female', name: 'Dr. Fatima Al-Hassan' },
  { file: 'doctor_06.jpg', gender: 'male',   name: 'Dr. Pierre Dubois' },
  { file: 'doctor_07.jpg', gender: 'female', name: 'Dr. Emma Watson' },
  { file: 'doctor_08.jpg', gender: 'male',   name: 'Dr. Kwame Asante' },
  { file: 'doctor_09.jpg', gender: 'female', name: 'Dr. Marie Nguyen' },
  { file: 'doctor_10.jpg', gender: 'male',   name: 'Dr. Ahmed Benali' },
  { file: 'doctor_11.jpg', gender: 'female', name: 'Dr. Laura Chen' },
  { file: 'doctor_12.jpg', gender: 'male',   name: 'Dr. David Okafor' },
  { file: 'doctor_13.jpg', gender: 'female', name: 'Dr. Isabelle Moreau' },
  { file: 'doctor_14.jpg', gender: 'male',   name: 'Dr. Carlos Santos' },
  { file: 'doctor_15.jpg', gender: 'female', name: 'Dr. Nadia Kowalski' },
  { file: 'doctor_16.jpg', gender: 'male',   name: 'Dr. Samuel Mensah' },
  { file: 'doctor_17.jpg', gender: 'female', name: 'Dr. Camille Bernard' },
  { file: 'doctor_18.jpg', gender: 'male',   name: 'Dr. Victor Tran' },
  { file: 'doctor_19.jpg', gender: 'female', name: 'Dr. Yasmine Bouali' },
  { file: 'doctor_20.jpg', gender: 'male',   name: 'Dr. Thomas Anderson' },
  { file: 'doctor_21.jpg', gender: 'female', name: 'Dr. Aisha Ibrahim' },
  { file: 'doctor_22.jpg', gender: 'male',   name: 'Dr. Luca Ferrari' },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error('JSON invalide: ' + e.message)); }
      });
    }).on('error', reject);
  });
}

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    https.get(url, (res) => {
      // Suivre les redirections (302/301)
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        fs.unlinkSync(destPath);
        return downloadFile(res.headers.location, destPath).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        file.close();
        fs.unlinkSync(destPath);
        return reject(new Error(`HTTP ${res.statusCode} pour ${url}`));
      }
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
      file.on('error', (err) => { fs.unlinkSync(destPath); reject(err); });
    }).on('error', reject);
  });
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// ---------------------------------------------------------------------------
// Récupération des URLs depuis randomuser.me
// ---------------------------------------------------------------------------

async function fetchPhotoUrls(gender, count) {
  // nat=fr,gb,us : photos diverses mais reconnaissables comme professionnelles
  const url = `https://randomuser.me/api/?results=${count}&gender=${gender}&nat=fr,gb,us,au,ca&inc=picture&noinfo`;
  const json = await fetchJson(url);
  return json.results.map((r) => r.picture.large); // 128×128 JPEG
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('\n📸  Téléchargement des photos de profil médecins...\n');

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Séparer par genre
  const females = DOCTORS.filter((d) => d.gender === 'female');
  const males   = DOCTORS.filter((d) => d.gender === 'male');

  console.log(`🌐  Récupération des URLs (${females.length} femmes, ${males.length} hommes)...`);

  let femaleUrls, maleUrls;
  try {
    [femaleUrls, maleUrls] = await Promise.all([
      fetchPhotoUrls('female', females.length),
      fetchPhotoUrls('male',   males.length),
    ]);
  } catch (err) {
    console.error('❌  Impossible de contacter randomuser.me:', err.message);
    console.error('    Vérifie ta connexion internet et réessaie.');
    process.exit(1);
  }

  console.log('✅  URLs récupérées\n');

  // Téléchargement individuel
  let success = 0;
  let skipped = 0;
  let errors  = 0;

  const allDoctors = [
    ...females.map((d, i) => ({ ...d, photoUrl: femaleUrls[i] })),
    ...males.map((d, i)   => ({ ...d, photoUrl: maleUrls[i] })),
  ].sort((a, b) => a.file.localeCompare(b.file));

  for (const doctor of allDoctors) {
    const destPath = path.join(OUTPUT_DIR, doctor.file);

    if (fs.existsSync(destPath)) {
      console.log(`⏭️   ${doctor.file}  — déjà présent, ignoré (${doctor.name})`);
      skipped++;
      continue;
    }

    try {
      await downloadFile(doctor.photoUrl, destPath);
      const size = Math.round(fs.statSync(destPath).size / 1024);
      console.log(`✅  ${doctor.file}  — ${doctor.name} (${size} KB)`);
      success++;
      await sleep(100); // politesse envers l'API
    } catch (err) {
      console.error(`❌  ${doctor.file}  — ${doctor.name}: ${err.message}`);
      errors++;
    }
  }

  console.log('\n─────────────────────────────────────────');
  console.log(`✅  Téléchargés : ${success}`);
  console.log(`⏭️   Ignorés     : ${skipped}`);
  console.log(`❌  Erreurs     : ${errors}`);
  console.log(`📁  Dossier     : ${OUTPUT_DIR}`);
  console.log('─────────────────────────────────────────\n');

  if (errors > 0) process.exit(1);
}

main();
