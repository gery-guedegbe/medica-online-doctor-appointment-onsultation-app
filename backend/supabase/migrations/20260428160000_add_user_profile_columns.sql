-- ============================================================
-- MIGRATION: Ajouter colonnes profil à la table users
-- Contexte: Écran "Fill Your Profile" de la maquette Figma
--
-- Colonnes ajoutées:
--   full_name, nickname (unique), date_of_birth, gender,
--   phone_number, avatar_url, pin_hash
--
-- NOTE: Toutes nullable car créées après le login initial
-- ============================================================

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS full_name     VARCHAR(255),
  ADD COLUMN IF NOT EXISTS nickname      VARCHAR(100),
  ADD COLUMN IF NOT EXISTS date_of_birth DATE,
  ADD COLUMN IF NOT EXISTS gender        VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
  ADD COLUMN IF NOT EXISTS phone_number  VARCHAR(20),
  ADD COLUMN IF NOT EXISTS avatar_url    TEXT,
  ADD COLUMN IF NOT EXISTS pin_hash      VARCHAR(255);

-- Index unique sur nickname (recherche rapide + unicité)
CREATE UNIQUE INDEX IF NOT EXISTS users_nickname_unique_idx
  ON users(nickname)
  WHERE nickname IS NOT NULL;
