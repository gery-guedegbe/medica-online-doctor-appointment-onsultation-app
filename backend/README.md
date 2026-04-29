# 🏥 Medica Backend

Backend Node.js + Express.js pour l'application de prise de rendez-vous médicaux.

## 📋 Stack

- **Runtime** : Node.js 18+
- **Framework** : Express.js
- **Base de données** : Supabase (PostgreSQL)
- **Auth** : JWT + Supabase Auth (Google OAuth)
- **Validation** : Zod
- **Documentation** : Swagger/OpenAPI
- **Langage** : JavaScript (ES6+)

## 🚀 Installation

### Prérequis

- Node.js 18+
- npm ou yarn
- Supabase CLI : `npm install -g supabase`

### 1. Cloner le projet

```bash
cd backend
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Créer un projet Supabase

1. Aller sur [console.supabase.io](https://console.supabase.io)
2. Créer un nouveau projet
3. Noter les credentials :
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_KEY`

### 4. Configurer les variables d'environnement

```bash
# Copier le template
cp .env.example .env

# Éditer .env et remplir:
# - SUPABASE_URL
# - SUPABASE_SERVICE_KEY
# - NODE_ENV=development
# - PORT=3000
```

### 5. Initialiser la base de données

```bash
# Lier Supabase CLI au projet
supabase login
supabase link --project-ref YOUR_PROJECT_REF

# Appliquer les migrations
supabase db push
```

### 6. Démarrer le serveur

```bash
# Mode développement (avec hot-reload)
npm run dev

# Mode production
npm start
```

Le serveur écoute sur `http://localhost:3000`

---

## 📚 Documentation

- **Swagger/OpenAPI** : http://localhost:3000/docs
- **Health Check** : http://localhost:3000/health

---

## 🧪 Tests Manuels

Utiliser Postman pour tester les endpoints :

1. Importer les collections depuis `tests/`
2. Lire le guide : [tests/POSTMAN_GUIDE.md](./tests/POSTMAN_GUIDE.md)
3. Tester chaque feature étape par étape

---

## 📁 Structure du Projet

```
backend/
├── src/
│   ├── modules/           # Features (auth, users, doctors, appointments, etc.)
│   │   ├── auth/
│   │   ├── users/
│   │   ├── doctors/
│   │   ├── availability/
│   │   └── appointments/
│   ├── shared/            # Code partagé
│   │   ├── errors/        # AppError (classe centralisée)
│   │   ├── middlewares/   # auth, validation, errorHandler
│   │   ├── utils/         # logger, helpers
│   │   └── config/        # supabase, constants
│   ├── app.js             # Configuration Express
│   └── server.js          # Point d'entrée
├── migrations/            # Fichiers SQL Supabase
├── tests/                 # Collections Postman + guide
├── package.json
├── .env.example
└── README.md
```

---

## 🧱 Principes Architecture

### Chaque feature = Module isolé

Structure d'une feature :

```
auth/
├── auth.controller.js    # Logique de requête (très léger)
├── auth.service.js       # Logique métier (cœur)
├── auth.model.js         # Interaction BD
├── auth.routes.js        # Définition endpoints + Swagger
└── auth.validation.js    # Schémas Zod
```

### Règles critiques

✅ **Faire** :

- Logique métier dans les services
- Validation dans les modèles/services
- Erreurs via `AppError`
- RLS Supabase pour la sécurité
- Logs aux points critiques

❌ **Pas faire** :

- Logique métier dans les routes
- Pas de try/catch partout (middleware les gère)
- Pas de données sensibles dans les logs
- Pas de sur-ingénierie

---

## 🔐 Sécurité

### Authentication

- JWT généré par Supabase
- Vérification côté backend (middleware)
- Google OAuth via Supabase

### Row Level Security (RLS)

Toutes les tables ont RLS activé :

- Patient voit ses RDV uniquement
- Doctor voit ses RDV uniquement
- Pas d'accès croisé

### Validation

Zod pour valider tous les inputs frontend :

- Pas de confiance au client
- Messages d'erreur explicites

---

## 📊 Base de Données

### Tables principales

1. **users** : authentification + rôles
2. **doctors** : données médecins
3. **availability_rules** : horaires habituels
4. **availability_exceptions** : jours fermés/spéciaux
5. **appointments** : rendez-vous confirmés

### Contrainte critique

⚠️ Aucun double booking (exclusion constraint PostgreSQL)

---

## 🚨 Gestion d'Erreurs

Format standardisé pour TOUTES les erreurs :

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Description claire"
  }
}
```

Codes d'erreur courants :

- `VALIDATION_ERROR` (400)
- `MISSING_TOKEN` (401)
- `INVALID_TOKEN` (401)
- `FORBIDDEN` (403)
- `NOT_FOUND` (404)
- `CONFLICT` (409)
- `INTERNAL_ERROR` (500)

---

## 📝 Logs

Logs simples et explicites :

```
[2026-04-27T10:00:00.000Z] [INFO] Patient créé rendez-vous {"doctor_id": "...", "patient_id": "..."}
[2026-04-27T10:00:05.000Z] [ERROR] Erreur BD {"error": "Connection lost"}
```

---

## 🔄 Workflow Développement

Pour chaque feature :

1. ✅ Définir le cas d'usage et règles métier
2. ✅ Créer migration SQL (`migrations/`)
3. ✅ Appliquer avec Supabase CLI
4. ✅ Coder le module (model, service, controller, routes)
5. ✅ Tester manuellement avec Postman
6. ✅ Documenter le guide test

---

## 📞 Support

Lire les directives d'architecture : `/docs/GUIDELINES_DOCS.md`

---

**Auteur** : Ingénieur Backend Senior

**License** : MIT
