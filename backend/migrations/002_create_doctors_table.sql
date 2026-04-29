-- 🎯 MIGRATION: Créer table doctors
-- 📌 OBJECTIF:
-- Stocker les informations docteur
-- Lien avec table users
--
-- ⚠️ RÈGLES CRITIQUES:
-- - FK vers users (on delete cascade)
-- - Specialty obligatoire
-- - Rating optionnel
-- - RLS pour isolation doctor
--
-- 📘 Voir: /docs/GUIDELINES_DOCS.md - Section 4

CREATE TABLE IF NOT EXISTS doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  specialty VARCHAR(255) NOT NULL,
  experience_years INT,
  rating DECIMAL(3, 2),
  bio TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Index sur user_id (jointure rapide)
CREATE INDEX IF NOT EXISTS doctors_user_id_idx ON doctors(user_id);

-- Row Level Security
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;

-- Policy: Doctor voit ses propres données
CREATE POLICY IF NOT EXISTS doctors_can_view_own_data
ON doctors FOR SELECT
USING (user_id = auth.uid());

-- Policy: Patients voient tous les doctors (pour chercher)
CREATE POLICY IF NOT EXISTS patients_can_view_all_doctors
ON doctors FOR SELECT
USING (TRUE);

-- Trigger pour updated_at
CREATE TRIGGER update_doctors_updated_at
BEFORE UPDATE ON doctors
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
