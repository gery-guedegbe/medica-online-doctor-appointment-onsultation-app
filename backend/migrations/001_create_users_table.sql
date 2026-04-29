-- 🎯 MIGRATION: Créer table users
-- 📌 OBJECTIF:
-- Stocker les utilisateurs de l'app
-- Inclut patients ET docteurs
--
-- ⚠️ RÈGLES CRITIQUES:
-- - UUID auto-généré
-- - Email unique
-- - Role: patient | doctor | admin
-- - RLS activé pour sécurité
--
-- 📘 Voir: /docs/GUIDELINES_DOCS.md - Section 4

-- Créer table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('patient', 'doctor', 'admin')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index sur email (recherche rapide)
CREATE INDEX IF NOT EXISTS users_email_idx ON users(email);

-- Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy: Users voient leurs propres données
CREATE POLICY IF NOT EXISTS users_can_view_own_data
ON users FOR SELECT
USING (id = auth.uid());

-- Policy: Admin voit tout
CREATE POLICY IF NOT EXISTS admin_can_view_all_users
ON users FOR SELECT
USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

-- Trigger pour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
