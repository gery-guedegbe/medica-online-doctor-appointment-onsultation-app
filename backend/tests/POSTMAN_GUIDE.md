# 📘 Guide Postman - Tests Manuels

## 📋 Configuration Initiale

### 1. Importer les collections

- Ouvrir Postman
- `File > Import` → Sélectionner les fichiers `.json` dans ce dossier
- Les collections apparaissent dans le sidebar

### 2. Configuration des variables

- Cliquer sur l'icône roue dentée (Settings)
- Créer un nouvel environnement "Medica Dev"
- Ajouter les variables :

```
base_url: http://localhost:3000
token: <remplir après login>
user_id: <remplir après login>
doctor_id: <remplir après inscription doctor>
```

### 3. Tester la connexion

- Sélectionner la collection "Health Check"
- Envoyer
- Vous devriez voir `{"success": true, "message": "Serveur actif"}`

---

## 🧪 Procédure de Test pour Chaque Feature

### Phase 1 : Auth (Login/Signup)

#### Cas 1 : Login avec Google ✅

```
POST /api/auth/google
Body: {
  "token": "<google_id_token>"
}
Résultat attendu: 200
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@gmail.com",
      "role": "patient"
    },
    "token": "jwt_token"
  }
}
```

**Actions après** :

- Copier le `token` dans les variables Postman
- Copier le `user.id` dans `user_id`

#### Cas 2 : Erreur - Token invalide ❌

```
POST /api/auth/google
Body: {
  "token": "invalid_token"
}
Résultat attendu: 401
{
  "success": false,
  "error": {
    "code": "INVALID_GOOGLE_TOKEN",
    "message": "Token Google invalide"
  }
}
```

---

## 📌 Format Standard Postman

Chaque requête doit avoir :

### 1. **Onglet "Tests"** (vérification automatique)

```javascript
pm.test('Status correct', function () {
  pm.response.to.have.status(200); // Adapter au code attendu
});

pm.test('Format réponse', function () {
  var jsonData = pm.response.json();
  pm.expect(jsonData).to.have.property('success');
});
```

### 2. **Documentation** (Description)

- Cas d'usage
- Body/Params attendus
- Résultat attendu (code + JSON)
- Cas d'erreur associés

### 3. **Headers**

```
Authorization: Bearer {{token}}
Content-Type: application/json
```

---

## 🔍 Exemple Détaillé : Créer Rendez-vous

```
POST /api/appointments
Authorization: Bearer {{token}}
Content-Type: application/json

Body:
{
  "doctor_id": "{{doctor_id}}",
  "start_time": "2026-05-15T14:00:00Z",
  "end_time": "2026-05-15T14:30:00Z"
}

✅ Succès (201):
{
  "success": true,
  "data": {
    "id": "uuid",
    "doctor_id": "{{doctor_id}}",
    "patient_id": "{{user_id}}",
    "start_time": "2026-05-15T14:00:00Z",
    "end_time": "2026-05-15T14:30:00Z",
    "status": "booked",
    "created_at": "2026-04-27T10:00:00Z"
  }
}

❌ Erreur - Slot déjà occupé (409):
{
  "success": false,
  "error": {
    "code": "SLOT_TAKEN",
    "message": "Créneau déjà réservé"
  }
}

❌ Erreur - Authentification (401):
{
  "success": false,
  "error": {
    "code": "MISSING_TOKEN",
    "message": "Token manquant"
  }
}

❌ Erreur - Validation (400):
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "start_time est requis"
  }
}
```

---

## 📊 Cas à Tester pour Chaque Feature

### ✅ Cas Normaux

- Requête valide avec données correctes
- Vérifier code 200/201/204
- Vérifier format JSON réponse

### ❌ Cas d'Erreur

- Données manquantes → 400 VALIDATION_ERROR
- Token invalide/absent → 401 MISSING_TOKEN/INVALID_TOKEN
- Ressource non trouvée → 404 NOT_FOUND
- Conflit métier (ex: double booking) → 409 CONFLICT
- Erreur interne → 500 INTERNAL_ERROR

### 🔐 Cas de Sécurité

- Requête sans token → 401
- Token expiré → 401
- User A accède données User B → 403 FORBIDDEN
- Admin check → vérifier role correctement

---

## 📝 Template : Créer une Nouvelle Requête

```
REQUEST_NAME: [ENDPOINT] [METHOD]

Pre-request Script:
// Ajouter du code JS si besoin (ex: timestamp)

Body (raw JSON):
{
  "field1": "value",
  "field2": 123
}

Tests:
pm.test('Status {{expected_status}}', function () {
    pm.response.to.have.status({{expected_status}});
});

pm.test('Format correct', function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.eql(true);
});

Description:
✅ Cas: Décrire le cas
❌ Erreur 1: ...
❌ Erreur 2: ...
```

---

## 🚀 Workflow Complet de Test

1. Démarrer serveur : `npm run dev`
2. Ouvrir Postman
3. Sélectionner collection
4. Cliquer "Runner" (bouton bas-gauche)
5. Sélectionner la collection
6. Cliquer "Start Run"
7. Vérifier tous les tests passent ✅

---

## 🐛 Troubleshooting Postman

**Problème**: "Request failed: connect ECONNREFUSED"
→ Serveur non lancé : `npm run dev`

**Problème**: "Unauthorized 401"
→ Token expiré ou manquant, vérifier `{{token}}` variable

**Problème**: "Invalid JSON response"
→ Serveur retourne HTML (erreur 500) : vérifier logs serveur

**Problème**: Variables pas remplacées
→ Vérifier syntaxe `{{variable_name}}` (double accolades)
