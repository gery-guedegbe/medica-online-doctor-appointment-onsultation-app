-- 🎯 MIGRATION: Ajout des champs hôpital et statistiques à la table doctors
-- 📌 OBJECTIF:
-- Enrichir le profil médecin avec les informations de l'établissement
-- et le nombre de patients traités
--
-- ⚠️ RÈGLES: colonnes nullable → pas de breaking change sur les enregistrements existants
--
-- 📘 Voir: /docs/GUIDELINES_DOCS.md - Section 4

ALTER TABLE doctors
  ADD COLUMN IF NOT EXISTS hospital_name    VARCHAR(255),
  ADD COLUMN IF NOT EXISTS hospital_address VARCHAR(255),
  ADD COLUMN IF NOT EXISTS hospital_country VARCHAR(100),
  ADD COLUMN IF NOT EXISTS patients_count   INT DEFAULT 0;

-- Commentaires métier
COMMENT ON COLUMN doctors.hospital_name    IS 'Nom de l''établissement où exerce le médecin';
COMMENT ON COLUMN doctors.hospital_address IS 'Adresse complète de l''établissement';
COMMENT ON COLUMN doctors.hospital_country IS 'Pays de l''établissement';
COMMENT ON COLUMN doctors.patients_count   IS 'Nombre total de patients traités (stat affichée sur le profil)';
