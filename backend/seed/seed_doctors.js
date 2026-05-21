/**
 * SEED: Doctors
 *
 * Peuple la base de données avec 22 médecins de test.
 *
 * Ce que le script fait pour chaque médecin :
 *  1. Crée un utilisateur dans Supabase Auth (auth.admin.createUser)
 *  2. Upload la photo depuis frontend/assets/doctors/ vers le bucket Storage "avatars"
 *     → Si l'image est absente, utilise un avatar généré (ui-avatars.com)
 *  3. Insère dans la table `users` (role = 'doctor')
 *  4. Insère dans la table `doctors`
 *  5. Insère les `availability_rules` (horaires habituels)
 *  6. Insère les `doctor_packages` (types de consultation)
 *
 * IDEMPOTENT : si un email existe déjà, le médecin est ignoré (pas de doublon).
 *
 * Usage :
 *   node backend/seed/seed_doctors.js
 *
 * Prérequis :
 *   - .env avec SUPABASE_URL et SUPABASE_SERVICE_KEY renseignés
 *   - Photos dans frontend/assets/doctors/doctor_01.jpg … doctor_22.jpg (optionnel)
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// Client Supabase avec la SERVICE KEY (contourne le RLS — backend only)
// ---------------------------------------------------------------------------
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const IMAGES_DIR = path.join(__dirname, '../../frontend/assets/doctors');
const STORAGE_BUCKET = 'avatars';
const DEFAULT_PASSWORD = 'MedicaDoctor2025!';

// ---------------------------------------------------------------------------
// Données des 22 médecins
// ---------------------------------------------------------------------------
const DOCTORS = [
  {
    full_name: 'Dr. Amara Diallo',
    nickname: 'Dr. Amara',
    email: 'amara.diallo@medica-seed.com',
    date_of_birth: '1982-06-14',
    gender: 'female',
    phone_number: '+22901000001',
    specialty: 'Cardiologist',
    experience_years: 15,
    rating: 4.9,
    bio: 'Cardiologue spécialisée dans les maladies cardiovasculaires et l\'insuffisance cardiaque. Ancienne cheffe de clinique au CHU de Cotonou.',
    hospital_name: 'CHU de Cotonou',
    hospital_address: 'Avenue Jean-Paul II, Cotonou',
    hospital_country: 'Bénin',
    patients_count: 4200,
    image: 'doctor_01.jpg',
    availability_days: [1, 2, 3, 4, 5], // Lun-Ven
    availability_start: '09:00',
    availability_end: '17:00',
    packages: [
      { type: 'messaging', price: 20, duration_minutes: 30 },
      { type: 'video',     price: 50, duration_minutes: 30 },
      { type: 'voice',     price: 90, duration_minutes: 45 },
    ],
  },
  {
    full_name: 'Dr. Jean-Baptiste Martin',
    nickname: 'Dr. Jean-Baptiste',
    email: 'jb.martin@medica-seed.com',
    date_of_birth: '1978-11-03',
    gender: 'male',
    phone_number: '+22901000002',
    specialty: 'General Practitioner',
    experience_years: 20,
    rating: 4.7,
    bio: 'Médecin généraliste avec une approche holistique de la santé. Spécialisé dans le suivi des maladies chroniques.',
    hospital_name: 'Hôpital Lariboisière',
    hospital_address: '2 Rue Ambroise Paré, 75010 Paris',
    hospital_country: 'France',
    patients_count: 6800,
    image: 'doctor_02.jpg',
    availability_days: [1, 2, 3, 4, 5],
    availability_start: '08:00',
    availability_end: '18:00',
    packages: [
      { type: 'messaging', price: 15, duration_minutes: 20 },
      { type: 'video', price: 35, duration_minutes: 30 },
      { type: 'voice', price: 60, duration_minutes: 30 },
    ],
  },
  {
    full_name: 'Dr. Sofia Rodriguez',
    nickname: 'Dr. Sofia',
    email: 'sofia.rodriguez@medica-seed.com',
    date_of_birth: '1988-04-22',
    gender: 'female',
    phone_number: '+22901000003',
    specialty: 'Dermatologist',
    experience_years: 10,
    rating: 4.8,
    bio: 'Dermatologue spécialisée dans les maladies de la peau, l\'acné et la dermatologie esthétique.',
    hospital_name: 'Hospital Universitario La Paz',
    hospital_address: 'Paseo de la Castellana 261, Madrid',
    hospital_country: 'Espagne',
    patients_count: 3100,
    image: 'doctor_03.jpg',
    availability_days: [1, 3, 5], // Lun, Mer, Ven
    availability_start: '09:00',
    availability_end: '16:00',
    packages: [
      { type: 'messaging', price: 25, duration_minutes: 30 },
      { type: 'video', price: 55, duration_minutes: 30 },
      { type: 'voice', price: 85, duration_minutes: 30 },
    ],
  },
  {
    full_name: 'Dr. Marcus Johnson',
    nickname: 'Dr. Marcus',
    email: 'marcus.johnson@medica-seed.com',
    date_of_birth: '1975-08-17',
    gender: 'male',
    phone_number: '+22901000004',
    specialty: 'Neurologist',
    experience_years: 22,
    rating: 4.9,
    bio: 'Neurologue expert en épilepsie, migraines et maladies neurodégénératives. Ancien chercheur à l\'Université de Paris.',
    hospital_name: 'Johns Hopkins Hospital',
    hospital_address: '1800 Orleans St, Baltimore, MD 21287',
    hospital_country: 'États-Unis',
    patients_count: 5500,
    image: 'doctor_04.jpg',
    availability_days: [2, 4], // Mar, Jeu
    availability_start: '10:00',
    availability_end: '17:00',
    packages: [
      { type: 'messaging', price: 30, duration_minutes: 30 },
      { type: 'video', price: 70, duration_minutes: 45 },
      { type: 'voice', price: 110, duration_minutes: 60 },
    ],
  },
  {
    full_name: 'Dr. Fatima Al-Hassan',
    nickname: 'Dr. Fatima',
    email: 'fatima.alhassan@medica-seed.com',
    date_of_birth: '1985-01-30',
    gender: 'female',
    phone_number: '+22901000005',
    specialty: 'Gynecologist',
    experience_years: 13,
    rating: 4.8,
    bio: 'Gynécologue obstétricienne spécialisée dans le suivi de grossesse et la santé reproductive féminine.',
    hospital_name: 'King Faisal Specialist Hospital',
    hospital_address: 'Zahrawi St, Al Andalus, Jeddah',
    hospital_country: 'Arabie Saoudite',
    patients_count: 3900,
    image: 'doctor_05.jpg',
    availability_days: [1, 2, 3, 4, 5],
    availability_start: '09:00',
    availability_end: '17:00',
    packages: [
      { type: 'messaging', price: 20, duration_minutes: 30 },
      { type: 'video', price: 55, duration_minutes: 30 },
      { type: 'voice', price: 80, duration_minutes: 45 },
    ],
  },
  {
    full_name: 'Dr. Pierre Dubois',
    nickname: 'Dr. Pierre',
    email: 'pierre.dubois@medica-seed.com',
    date_of_birth: '1980-09-05',
    gender: 'male',
    phone_number: '+22901000006',
    specialty: 'Orthopedist',
    experience_years: 18,
    rating: 4.6,
    bio: 'Orthopédiste spécialisé dans la chirurgie du genou, de la hanche et les traumatismes sportifs.',
    hospital_name: 'Hôpital Cochin',
    hospital_address: '27 Rue du Faubourg Saint-Jacques, 75014 Paris',
    hospital_country: 'France',
    patients_count: 4700,
    image: 'doctor_06.jpg',
    availability_days: [1, 2, 3, 4, 5],
    availability_start: '08:30',
    availability_end: '16:30',
    packages: [
      { type: 'messaging', price: 25, duration_minutes: 30 },
      { type: 'video', price: 60, duration_minutes: 30 },
      { type: 'voice', price: 95, duration_minutes: 45 },
    ],
  },
  {
    full_name: 'Dr. Emma Watson',
    nickname: 'Dr. Emma',
    email: 'emma.watson@medica-seed.com',
    date_of_birth: '1987-12-11',
    gender: 'female',
    phone_number: '+22901000007',
    specialty: 'Psychiatrist',
    experience_years: 11,
    rating: 4.9,
    bio: 'Psychiatre spécialisée dans les troubles anxieux, la dépression et les thérapies cognitivo-comportementales.',
    hospital_name: 'Maudsley Hospital',
    hospital_address: 'Denmark Hill, London SE5 8AZ',
    hospital_country: 'Royaume-Uni',
    patients_count: 2800,
    image: 'doctor_07.jpg',
    availability_days: [1, 2, 3, 4, 5],
    availability_start: '10:00',
    availability_end: '18:00',
    packages: [
      { type: 'messaging', price: 30, duration_minutes: 30 },
      { type: 'video', price: 65, duration_minutes: 45 },
      { type: 'voice', price: 100, duration_minutes: 60 },
    ],
  },
  {
    full_name: 'Dr. Kwame Asante',
    nickname: 'Dr. Kwame',
    email: 'kwame.asante@medica-seed.com',
    date_of_birth: '1983-03-28',
    gender: 'male',
    phone_number: '+22901000008',
    specialty: 'Ophthalmologist',
    experience_years: 14,
    rating: 4.7,
    bio: 'Ophtalmologue spécialisé dans la chirurgie réfractive, la cataracte et les maladies de la rétine.',
    hospital_name: 'Korle Bu Teaching Hospital',
    hospital_address: 'Guggisberg Ave, Accra',
    hospital_country: 'Ghana',
    patients_count: 3600,
    image: 'doctor_08.jpg',
    availability_days: [1, 3, 5],
    availability_start: '09:00',
    availability_end: '15:00',
    packages: [
      { type: 'messaging', price: 20, duration_minutes: 20 },
      { type: 'video', price: 50, duration_minutes: 30 },
      { type: 'voice', price: 80, duration_minutes: 30 },
    ],
  },
  {
    full_name: 'Dr. Marie Nguyen',
    nickname: 'Dr. Marie',
    email: 'marie.nguyen@medica-seed.com',
    date_of_birth: '1990-07-19',
    gender: 'female',
    phone_number: '+22901000009',
    specialty: 'Pediatrician',
    experience_years: 8,
    rating: 4.9,
    bio: 'Pédiatre passionnée par la santé de l\'enfant. Spécialisée dans le développement de l\'enfant et les maladies infantiles.',
    hospital_name: 'Hôpital Necker – Enfants Malades',
    hospital_address: '149 Rue de Sèvres, 75015 Paris',
    hospital_country: 'France',
    patients_count: 5200,
    image: 'doctor_09.jpg',
    availability_days: [1, 2, 3, 4, 5],
    availability_start: '08:00',
    availability_end: '17:00',
    packages: [
      { type: 'messaging', price: 18, duration_minutes: 20 },
      { type: 'video', price: 40, duration_minutes: 30 },
      { type: 'voice', price: 65, duration_minutes: 30 },
    ],
  },
  {
    full_name: 'Dr. Ahmed Benali',
    nickname: 'Dr. Ahmed',
    email: 'ahmed.benali@medica-seed.com',
    date_of_birth: '1979-05-07',
    gender: 'male',
    phone_number: '+22901000010',
    specialty: 'Dentist',
    experience_years: 19,
    rating: 4.6,
    bio: 'Chirurgien-dentiste spécialisé en implantologie, orthodontie et esthétique dentaire.',
    hospital_name: 'Clinique Dentaire Benali',
    hospital_address: '14 Rue Didouche Mourad, Alger',
    hospital_country: 'Algérie',
    patients_count: 7100,
    image: 'doctor_10.jpg',
    availability_days: [1, 2, 3, 4, 5, 6], // Lun-Sam
    availability_start: '09:00',
    availability_end: '18:00',
    packages: [
      { type: 'messaging', price: 15, duration_minutes: 20 },
      { type: 'video', price: 35, duration_minutes: 30 },
      { type: 'voice', price: 70, duration_minutes: 45 },
    ],
  },
  {
    full_name: 'Dr. Laura Chen',
    nickname: 'Dr. Laura',
    email: 'laura.chen@medica-seed.com',
    date_of_birth: '1986-10-24',
    gender: 'female',
    phone_number: '+22901000011',
    specialty: 'Endocrinologist',
    experience_years: 12,
    rating: 4.8,
    bio: 'Endocrinologue spécialisée dans le diabète, les maladies thyroïdiennes et les troubles hormonaux.',
    hospital_name: 'National University Hospital',
    hospital_address: '5 Lower Kent Ridge Rd, Singapore 119074',
    hospital_country: 'Singapour',
    patients_count: 3400,
    image: 'doctor_11.jpg',
    availability_days: [1, 2, 3, 4, 5],
    availability_start: '09:00',
    availability_end: '17:00',
    packages: [
      { type: 'messaging', price: 25, duration_minutes: 30 },
      { type: 'video', price: 55, duration_minutes: 30 },
      { type: 'voice', price: 85, duration_minutes: 45 },
    ],
  },
  {
    full_name: 'Dr. David Okafor',
    nickname: 'Dr. David',
    email: 'david.okafor@medica-seed.com',
    date_of_birth: '1977-02-16',
    gender: 'male',
    phone_number: '+22901000012',
    specialty: 'Gastroenterologist',
    experience_years: 21,
    rating: 4.7,
    bio: 'Gastro-entérologue expert en endoscopie digestive, maladies inflammatoires de l\'intestin et hépatologie.',
    hospital_name: 'Lagos University Teaching Hospital',
    hospital_address: 'Ishaga Rd, Idi-Araba, Lagos',
    hospital_country: 'Nigeria',
    patients_count: 4900,
    image: 'doctor_12.jpg',
    availability_days: [2, 3, 4],
    availability_start: '10:00',
    availability_end: '17:00',
    packages: [
      { type: 'messaging', price: 28, duration_minutes: 30 },
      { type: 'video', price: 60, duration_minutes: 45 },
      { type: 'voice', price: 95, duration_minutes: 60 },
    ],
  },
  {
    full_name: 'Dr. Isabelle Moreau',
    nickname: 'Dr. Isabelle',
    email: 'isabelle.moreau@medica-seed.com',
    date_of_birth: '1984-08-09',
    gender: 'female',
    phone_number: '+22901000013',
    specialty: 'Pulmonologist',
    experience_years: 14,
    rating: 4.8,
    bio: 'Pneumologue spécialisée dans l\'asthme, la BPCO et les maladies respiratoires chroniques.',
    hospital_name: 'Hôpital Erasme',
    hospital_address: 'Route de Lennik 808, 1070 Bruxelles',
    hospital_country: 'Belgique',
    patients_count: 3200,
    image: 'doctor_13.jpg',
    availability_days: [1, 2, 3, 4, 5],
    availability_start: '09:00',
    availability_end: '17:00',
    packages: [
      { type: 'messaging', price: 22, duration_minutes: 30 },
      { type: 'video', price: 52, duration_minutes: 30 },
      { type: 'voice', price: 82, duration_minutes: 45 },
    ],
  },
  {
    full_name: 'Dr. Carlos Santos',
    nickname: 'Dr. Carlos',
    email: 'carlos.santos@medica-seed.com',
    date_of_birth: '1981-11-27',
    gender: 'male',
    phone_number: '+22901000014',
    specialty: 'Urologist',
    experience_years: 17,
    rating: 4.6,
    bio: 'Urologue spécialisé dans les troubles urinaires, la lithiase rénale et l\'oncologie urologique.',
    hospital_name: 'Hospital das Clínicas',
    hospital_address: 'Av. Dr. Enéas Carvalho de Aguiar, 255, São Paulo',
    hospital_country: 'Brésil',
    patients_count: 4100,
    image: 'doctor_14.jpg',
    availability_days: [1, 2, 3, 4, 5],
    availability_start: '08:30',
    availability_end: '16:30',
    packages: [
      { type: 'messaging', price: 25, duration_minutes: 30 },
      { type: 'video', price: 58, duration_minutes: 30 },
      { type: 'voice', price: 90, duration_minutes: 45 },
    ],
  },
  {
    full_name: 'Dr. Nadia Kowalski',
    nickname: 'Dr. Nadia',
    email: 'nadia.kowalski@medica-seed.com',
    date_of_birth: '1989-04-03',
    gender: 'female',
    phone_number: '+22901000015',
    specialty: 'Allergist',
    experience_years: 9,
    rating: 4.7,
    bio: 'Allergologue et immunologue spécialisée dans le traitement des allergies alimentaires, respiratoires et cutanées.',
    hospital_name: 'Charité – Universitätsmedizin Berlin',
    hospital_address: 'Charitéplatz 1, 10117 Berlin',
    hospital_country: 'Allemagne',
    patients_count: 2600,
    image: 'doctor_15.jpg',
    availability_days: [1, 3, 5],
    availability_start: '09:00',
    availability_end: '16:00',
    packages: [
      { type: 'messaging', price: 20, duration_minutes: 30 },
      { type: 'video', price: 48, duration_minutes: 30 },
      { type: 'voice', price: 75, duration_minutes: 30 },
    ],
  },
  {
    full_name: 'Dr. Samuel Mensah',
    nickname: 'Dr. Samuel',
    email: 'samuel.mensah@medica-seed.com',
    date_of_birth: '1986-07-21',
    gender: 'male',
    phone_number: '+22901000016',
    specialty: 'Nutritionist',
    experience_years: 12,
    rating: 4.8,
    bio: 'Nutritionniste et diététicien spécialisé dans la nutrition sportive, la perte de poids et les régimes thérapeutiques.',
    hospital_name: 'Komfo Anokye Teaching Hospital',
    hospital_address: 'Okomfo Anokye Rd, Kumasi',
    hospital_country: 'Ghana',
    patients_count: 3800,
    image: 'doctor_16.jpg',
    availability_days: [1, 2, 3, 4, 5],
    availability_start: '10:00',
    availability_end: '18:00',
    packages: [
      { type: 'messaging', price: 18, duration_minutes: 30 },
      { type: 'video', price: 40, duration_minutes: 45 },
      { type: 'voice', price: 65, duration_minutes: 45 },
    ],
  },
  {
    full_name: 'Dr. Camille Bernard',
    nickname: 'Dr. Camille',
    email: 'camille.bernard@medica-seed.com',
    date_of_birth: '1983-01-14',
    gender: 'female',
    phone_number: '+22901000017',
    specialty: 'Rheumatologist',
    experience_years: 15,
    rating: 4.7,
    bio: 'Rhumatologue spécialisée dans la polyarthrite rhumatoïde, les spondylarthropathies et les maladies auto-immunes.',
    hospital_name: 'Hôpital Pitié-Salpêtrière',
    hospital_address: '47-83 Bd de l\'Hôpital, 75013 Paris',
    hospital_country: 'France',
    patients_count: 3300,
    image: 'doctor_17.jpg',
    availability_days: [2, 3, 4],
    availability_start: '09:00',
    availability_end: '17:00',
    packages: [
      { type: 'messaging', price: 25, duration_minutes: 30 },
      { type: 'video', price: 58, duration_minutes: 45 },
      { type: 'voice', price: 88, duration_minutes: 45 },
    ],
  },
  {
    full_name: 'Dr. Victor Tran',
    nickname: 'Dr. Victor',
    email: 'victor.tran@medica-seed.com',
    date_of_birth: '1980-09-08',
    gender: 'male',
    phone_number: '+22901000018',
    specialty: 'ENT Specialist',
    experience_years: 18,
    rating: 4.6,
    bio: 'Oto-rhino-laryngologiste expert en pathologies ORL, chirurgie de la thyroïde et troubles de l\'audition.',
    hospital_name: 'Cho Ray Hospital',
    hospital_address: '201B Nguyen Chi Thanh, Ho Chi Minh City',
    hospital_country: 'Viêt Nam',
    patients_count: 4500,
    image: 'doctor_18.jpg',
    availability_days: [1, 2, 3, 4, 5],
    availability_start: '09:00',
    availability_end: '17:00',
    packages: [
      { type: 'messaging', price: 22, duration_minutes: 30 },
      { type: 'video', price: 50, duration_minutes: 30 },
      { type: 'voice', price: 80, duration_minutes: 30 },
    ],
  },
  {
    full_name: 'Dr. Yasmine Bouali',
    nickname: 'Dr. Yasmine',
    email: 'yasmine.bouali@medica-seed.com',
    date_of_birth: '1987-05-31',
    gender: 'female',
    phone_number: '+22901000019',
    specialty: 'Nephrologist',
    experience_years: 11,
    rating: 4.8,
    bio: 'Néphrologue spécialisée dans les maladies rénales chroniques, l\'hypertension et la dialyse.',
    hospital_name: 'Hôpital Charles Nicolle',
    hospital_address: 'Blvd du 9 Avril 1938, Tunis',
    hospital_country: 'Tunisie',
    patients_count: 2900,
    image: 'doctor_19.jpg',
    availability_days: [1, 2, 3, 4, 5],
    availability_start: '09:00',
    availability_end: '17:00',
    packages: [
      { type: 'messaging', price: 28, duration_minutes: 30 },
      { type: 'video', price: 60, duration_minutes: 45 },
      { type: 'voice', price: 92, duration_minutes: 45 },
    ],
  },
  {
    full_name: 'Dr. Thomas Anderson',
    nickname: 'Dr. Thomas',
    email: 'thomas.anderson@medica-seed.com',
    date_of_birth: '1973-12-02',
    gender: 'male',
    phone_number: '+22901000020',
    specialty: 'Oncologist',
    experience_years: 25,
    rating: 4.9,
    bio: 'Oncologue médical expert en cancers digestifs et thoraciques. Coordonnateur de recherche clinique.',
    hospital_name: 'Mayo Clinic',
    hospital_address: '200 First St SW, Rochester, MN 55905',
    hospital_country: 'États-Unis',
    patients_count: 6200,
    image: 'doctor_20.jpg',
    availability_days: [2, 4],
    availability_start: '10:00',
    availability_end: '18:00',
    packages: [
      { type: 'messaging', price: 35, duration_minutes: 30 },
      { type: 'video', price: 80, duration_minutes: 60 },
      { type: 'voice', price: 130, duration_minutes: 60 },
    ],
  },
  {
    full_name: 'Dr. Aisha Ibrahim',
    nickname: 'Dr. Aisha',
    email: 'aisha.ibrahim@medica-seed.com',
    date_of_birth: '1991-03-17',
    gender: 'female',
    phone_number: '+22901000021',
    specialty: 'General Practitioner',
    experience_years: 7,
    rating: 4.7,
    bio: 'Médecin généraliste disponible et à l\'écoute. Spécialisée dans la médecine préventive et le suivi des patients chroniques.',
    hospital_name: 'Kenyatta National Hospital',
    hospital_address: 'Hospital Rd, Nairobi',
    hospital_country: 'Kenya',
    patients_count: 4300,
    image: 'doctor_21.jpg',
    availability_days: [1, 2, 3, 4, 5],
    availability_start: '08:00',
    availability_end: '17:00',
    packages: [
      { type: 'messaging', price: 15, duration_minutes: 20 },
      { type: 'video', price: 35, duration_minutes: 30 },
      { type: 'voice', price: 55, duration_minutes: 30 },
    ],
  },
  {
    full_name: 'Dr. Luca Ferrari',
    nickname: 'Dr. Luca',
    email: 'luca.ferrari@medica-seed.com',
    date_of_birth: '1976-10-09',
    gender: 'male',
    phone_number: '+22901000022',
    specialty: 'Cardiologist',
    experience_years: 23,
    rating: 4.8,
    bio: 'Cardiologue interventionnel spécialisé dans le cathétérisme cardiaque et le traitement des cardiopathies ischémiques.',
    hospital_name: 'Ospedale San Raffaele',
    hospital_address: 'Via Olgettina, 60, 20132 Milano',
    hospital_country: 'Italie',
    patients_count: 5800,
    image: 'doctor_22.jpg',
    availability_days: [1, 2, 3, 4, 5],
    availability_start: '09:00',
    availability_end: '17:00',
    packages: [
      { type: 'messaging', price: 30, duration_minutes: 30 },
      { type: 'video', price: 65, duration_minutes: 45 },
      { type: 'voice', price: 105, duration_minutes: 60 },
    ],
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function log(icon, msg, detail = '') {
  const d = detail ? ` — ${detail}` : '';
  console.log(`${icon}  ${msg}${d}`);
}

async function ensureStorageBucket() {
  const { data: buckets } = await supabase.storage.listBuckets();
  const exists = buckets?.some((b) => b.name === STORAGE_BUCKET);
  if (!exists) {
    const { error } = await supabase.storage.createBucket(STORAGE_BUCKET, { public: true });
    if (error) throw new Error(`Impossible de créer le bucket "${STORAGE_BUCKET}": ${error.message}`);
    log('🪣', `Bucket "${STORAGE_BUCKET}" créé`);
  } else {
    log('✅', `Bucket "${STORAGE_BUCKET}" déjà présent`);
  }
}

async function uploadImage(filename, fullName) {
  const filePath = path.join(IMAGES_DIR, filename);

  if (!fs.existsSync(filePath)) {
    // Pas de photo locale → avatar généré avec les initiales
    const encoded = encodeURIComponent(fullName.replace('Dr. ', ''));
    const fallbackUrl = `https://ui-avatars.com/api/?name=${encoded}&background=0B6FE8&color=fff&size=256&bold=true`;
    log('🖼️ ', `Image absente, avatar généré pour ${fullName}`);
    return fallbackUrl;
  }

  const fileBuffer = fs.readFileSync(filePath);
  const ext = path.extname(filename).toLowerCase();
  const mimeType = ext === '.png' ? 'image/png' : 'image/jpeg';
  const storagePath = `doctors/${filename}`;

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(storagePath, fileBuffer, { contentType: mimeType, upsert: true });

  if (error) throw new Error(`Upload "${filename}" échoué: ${error.message}`);

  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(storagePath);
  log('📤', `Image uploadée: ${storagePath}`);
  return data.publicUrl;
}

// ---------------------------------------------------------------------------
// Seed d'un médecin
// ---------------------------------------------------------------------------

async function seedDoctor(doctor, index) {
  const label = `[${String(index + 1).padStart(2, '0')}/22] ${doctor.full_name}`;

  // 1. Vérifier si l'email existe déjà dans la table users
  const { data: existing } = await supabase
    .from('users')
    .select('id')
    .eq('email', doctor.email)
    .maybeSingle();

  if (existing) {
    // Reprise partielle : vérifier si les packages sont manquants
    const { data: doctorRow } = await supabase
      .from('doctors')
      .select('id')
      .eq('user_id', existing.id)
      .maybeSingle();

    if (doctorRow) {
      const { data: pkgs } = await supabase
        .from('doctor_packages')
        .select('id')
        .eq('doctor_id', doctorRow.id);

      if (!pkgs || pkgs.length === 0) {
        const packages = doctor.packages.map((pkg) => ({
          doctor_id: doctorRow.id,
          type: pkg.type,
          price: pkg.price,
          duration_minutes: pkg.duration_minutes,
          is_active: true,
        }));
        const { error: pkgError } = await supabase.from('doctor_packages').insert(packages);
        if (pkgError) throw new Error(`doctor_packages (reprise) "${doctor.email}": ${pkgError.message}`);
        log('🔧', `${label} — packages ajoutés (reprise partielle)`);
        return 'fixed';
      }
    }

    log('⏭️ ', `${label} — déjà complet, ignoré`);
    return 'skipped';
  }

  // 2. Upload de la photo
  const avatarUrl = await uploadImage(doctor.image, doctor.full_name);

  // 3. Création de l'utilisateur Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: doctor.email,
    password: DEFAULT_PASSWORD,
    email_confirm: true,
    user_metadata: { full_name: doctor.full_name, role: 'doctor' },
  });

  if (authError) throw new Error(`Auth "${doctor.email}": ${authError.message}`);
  const userId = authData.user.id;

  // 4. Insertion dans la table `users`
  const { error: userError } = await supabase.from('users').insert({
    id: userId,
    email: doctor.email,
    role: 'doctor',
    full_name: doctor.full_name,
    nickname: doctor.nickname,
    date_of_birth: doctor.date_of_birth,
    gender: doctor.gender,
    phone_number: doctor.phone_number,
    avatar_url: avatarUrl,
  });

  if (userError) throw new Error(`Table users "${doctor.email}": ${userError.message}`);

  // 5. Insertion dans la table `doctors`
  const { data: doctorRow, error: doctorError } = await supabase
    .from('doctors')
    .insert({
      user_id: userId,
      specialty: doctor.specialty,
      experience_years: doctor.experience_years,
      rating: doctor.rating,
      bio: doctor.bio,
      hospital_name: doctor.hospital_name,
      hospital_address: doctor.hospital_address,
      hospital_country: doctor.hospital_country,
      patients_count: doctor.patients_count,
    })
    .select('id')
    .single();

  if (doctorError) throw new Error(`Table doctors "${doctor.email}": ${doctorError.message}`);
  const doctorId = doctorRow.id;

  // 6. Insertion des `availability_rules`
  const availabilityRules = doctor.availability_days.map((day) => ({
    doctor_id: doctorId,
    day_of_week: day,
    start_time: doctor.availability_start,
    end_time: doctor.availability_end,
  }));

  const { error: availError } = await supabase.from('availability_rules').insert(availabilityRules);
  if (availError) throw new Error(`availability_rules "${doctor.email}": ${availError.message}`);

  // 7. Insertion des `doctor_packages`
  const packages = doctor.packages.map((pkg) => ({
    doctor_id: doctorId,
    type: pkg.type,
    price: pkg.price,
    duration_minutes: pkg.duration_minutes,
    is_active: true,
  }));

  const { error: pkgError } = await supabase.from('doctor_packages').insert(packages);
  if (pkgError) throw new Error(`doctor_packages "${doctor.email}": ${pkgError.message}`);

  log('✅', `${label} — créé avec succès`, `doctorId: ${doctorId}`);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('\n🚀  Démarrage du seed médecins...\n');

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
    console.error('❌  SUPABASE_URL ou SUPABASE_SERVICE_KEY manquant dans .env');
    process.exit(1);
  }

  await ensureStorageBucket();
  console.log('');

  let success = 0;
  let fixed   = 0;
  let skipped = 0;
  let errors  = 0;

  for (let i = 0; i < DOCTORS.length; i++) {
    try {
      const result = await seedDoctor(DOCTORS[i], i);
      if (result === 'fixed')   fixed++;
      else if (result === 'skipped') skipped++;
      else success++;
    } catch (err) {
      errors++;
      log('❌', `Erreur pour ${DOCTORS[i].full_name}`, err.message);
    }
  }

  console.log('\n─────────────────────────────────────────');
  console.log(`✅  Créés    : ${success}`);
  console.log(`🔧  Repris   : ${fixed}`);
  console.log(`⏭️   Ignorés  : ${skipped}`);
  console.log(`❌  Erreurs  : ${errors}`);
  console.log('─────────────────────────────────────────\n');

  if (errors > 0) process.exit(1);
}

main();
