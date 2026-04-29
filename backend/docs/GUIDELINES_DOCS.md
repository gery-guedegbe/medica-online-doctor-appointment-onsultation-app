contrôlés

📘 0. PRINCIPES D’ARCHITECTURE (NON NÉGOCIABLES)
🎯 Objectifs
Cohérence métier
Scalabilité (≥ 1000 users)
Sécurité par défaut
Lisibilité du code
🔒 Règles globales
❗ Backend = source de vérité (jamais le frontend)
❗ Toute action critique validée en DB
❗ Une feature = un module isolé
❗ Aucun fichier > 300 lignes
❗ Pas de logique métier dans les routes
🧱 Stack
DB + Auth : Supabase
Backend : Node.js + Express.js
Cache / Lock : Redis
Temps réel (phase 2+) : WebSocket / Supabase Realtime
🗺️ 1. ROADMAP STRUCTURÉE
🟢 PHASE 1 — CORE SYSTEM (OBLIGATOIRE)

👉 livrable fonctionnel

Features :
Auth (Google + email)
Users / Doctors
Availability
Booking
Appointments management
🟡 PHASE 2 — AMÉLIORATION
Notifications
Cache Redis
Pagination / perf
🔵 PHASE 3 — TEMPS RÉEL
Chat texte
🔴 PHASE 4 — AVANCÉ
Paiement
WebRTC
👤 2. USER FLOWS (SIMPLIFIÉS MAIS RÉELS)
🔹 AUTH
user login (Google)
backend récupère user
crée si inexistant
retourne session
🔹 BOOKING
user choisit médecin
récupère slots dispo
sélectionne slot
backend tente création RDV
DB valide ou rejette
🔹 ANNULATION
user demande annulation
backend vérifie délai
update statut
⚖️ 3. RÈGLES MÉTIER (CRITIQUES)
📅 Booking
un médecin = 1 RDV par slot
durée fixe (30 min MVP)
timezone = UTC uniquement
❗ Annulation
possible ≥ 2h avant
❗ Reprogrammation
max 1 fois
❗ Sécurité
un user ne voit que ses RDV
un doctor ne voit que les siens
🧱 4. DATA MODEL (PROPRE & MINIMAL)
👤 users
id (uuid)
email
role (patient | doctor | admin)
created_at
👨‍⚕️ doctors
id
user_id (FK)
specialty
experience
rating
📅 availability_rules
id
doctor_id
day_of_week (0-6)
start_time
end_time
🚫 exceptions
id
doctor_id
date
is_available
📌 appointments
id
doctor_id
patient_id
start_time
end_time
status
created_at
⚠️ CONTRAINTE CRITIQUE

👉 empêcher overlap (PostgreSQL)

exclusion constraint sur time range
🔐 5. SÉCURITÉ (SUPABASE)
RLS (Row Level Security)
appointments
patient → ses RDV
doctor → ses RDV
Validation backend
JOI / Zod
jamais faire confiance au client

⚙️ 6. ARCHITECTURE BACKEND

model, controllers, routes, middleware (si nécessaire), service (si nécessaire)
👉 Bonne approche. On la garde lean :

src/
modules/
appointments/
appointment.model.js
appointment.controller.js
appointment.service.js
appointment.routes.js
shared/
errors/
middlewares/
utils/
logger/

🌐 7. API DESIGN (EXEMPLE)
POST /appointments
crée RDV
GET /appointments
liste user
PATCH /appointments/:id/cancel
annule
❗ STANDARD RESPONSE
{
"success": true,
"data": {}
}
❗ ERROR
{
"success": false,
"error": {
"code": "SLOT_TAKEN",
"message": "Slot already booked"
}
}
📘 8. SWAGGER (OBLIGATOIRE)

👉 uniquement dans les routes

Chaque endpoint doit documenter :

body
params
response
erreurs
🔄 9. PROCESS POUR CHAQUE FEATURE
🧠 Étape 1 — Compréhension
définir use case
définir règles métier
🧱 Étape 2 — DB
créer table si besoin
ajouter contraintes
🔐 Étape 3 — sécurité
RLS
validation
⚙️ Étape 4 — backend
repository
service
controller
🌐 Étape 5 — routes + Swagger
🧪 Étape 6 — tests
cas normal
cas erreur
edge cases
📦 Étape 7 — review
lisibilité
performance
sécurité
⚡ 10. BONNES PRATIQUES CRITIQUES
✔️ DB > logique JS
✔️ transactions pour opérations critiques
✔️ pagination
✔️ index DB
✔️ logs
✔️ DRY sans sur-abstraction
🚫 11. ERREURS À ÉVITER

❌ logique dans routes
❌ duplication
❌ endpoints trop spécifiques UI
❌ absence de contraintes DB
❌ sur-ingénierie

🎯 12. CRITÈRES DE QUALITÉ

Ton backend est prêt si :

aucun double booking possible
API cohérente
sécurité appliquée
code lisible
ajout feature simple

13. GESTION DES ERREURS (STRUCTURÉE)
    🎯 Objectif
    centraliser
    standardiser
    éviter les try/catch partout
    🧱 13.1 Classe d’erreur custom
    // shared/errors/AppError.js
    class AppError extends Error {
    constructor(message, statusCode = 500, code = "INTERNAL_ERROR") {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    }
    }

module.exports = AppError;
🧱 13.2 Middleware global
// shared/middlewares/errorHandler.js
module.exports = (err, req, res, next) => {
const status = err.statusCode || 500;

res.status(status).json({
success: false,
error: {
code: err.code || "INTERNAL_ERROR",
message: err.message || "Something went wrong"
}
});
};
🧠 13.3 Usage (très propre)

Dans un service :

const AppError = require("../../shared/errors/AppError");

if (!slotAvailable) {
throw new AppError("Slot already booked", 409, "SLOT_TAKEN");
}

👉 Aucun res.status() ici
👉 logique métier uniquement

15. LOGS (simples mais efficaces)

🎯 Objectif
comprendre ce qui se passe
debug rapide
traçabilité

❌ À éviter
spam de logs inutiles
logs sensibles (mot de passe, token)

🧾 16. STANDARD DE RÉPONSE API
✅ Succès
{
"success": true,
"data": {}
}
❌ Erreur
{
"success": false,
"error": {
"code": "SLOT_TAKEN",
"message": "Slot already booked"
}
}

👉 Toujours le même format
👉 frontend simplifié

🧠 17. CONTROLLERS (très légers)
🎯 Rôle
recevoir req
appeler service
renvoyer réponse

Exemple
// appointment.controller.js
const service = require("./appointment.service");

exports.createAppointment = async (req, res, next) => {
try {
const data = await service.create(req.body, req.user);
res.json({ success: true, data });
} catch (err) {
next(err);
}
};

👉 Pas de logique métier ici

🧠 18. SERVICES (cœur du système)
🎯 Rôle
logique métier
validation avancée
orchestration
Exemple
// appointment.service.js
const AppError = require("../../shared/errors/AppError");

exports.create = async (payload, user) => {
// logique métier

if (!payload.start_time) {
throw new AppError("Missing start time", 400, "VALIDATION_ERROR");
}

// appel DB
};
🧠 19. MIDDLEWARES (UTILISER AVEC DISCIPLINE)
✔️ utiles
auth (JWT)
validation (Zod)
error handler
❌ à éviter
logique métier
sur-utilisation

🧠 20. RECOMMANDATIONS SENIOR
✔️ 1. Simplicité > abstraction
✔️ 2. Une responsabilité par fichier
✔️ 3. Nom explicite
appointment.service.js
auth.middleware.js
✔️ 4. Limiter dépendances
✔️ 5. Toujours penser “debuggable”

🚫 21. ERREURS CLASSIQUES

❌ try/catch partout
❌ logique dans routes
❌ logs inutiles
❌ erreurs incohérentes
❌ messages vagues

🎯 22. RÉSULTAT

Avec cette approche :

✔️ code lisible
✔️ erreurs propres
✔️ logs exploitables
✔️ architecture maintenable
