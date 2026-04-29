-- 🎯 MIGRATION: Créer table availability_rules
-- 📌 OBJECTIF:
-- Définir les horaires habituels d'un médecin
-- Récurrent (ex: tous les lundi 9h-17h)
--
-- ⚠️ RÈGLES CRITIQUES:
-- - day_of_week: 0=lundi à 6=dimanche
-- - start_time, end_time: HH:MM
-- - FK vers doctors
-- - RLS pour isolation
--
-- 📘 Voir: /docs/GUIDELINES_DOCS.md - Section 3 & 4

CREATE TABLE IF NOT EXISTS availability_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL,
  day_of_week INT NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
);

-- Index sur doctor_id
CREATE INDEX IF NOT EXISTS availability_rules_doctor_id_idx ON availability_rules(doctor_id);

-- Index composite pour requête typique
CREATE INDEX IF NOT EXISTS availability_rules_lookup_idx 
ON availability_rules(doctor_id, day_of_week);

-- Row Level Security
ALTER TABLE availability_rules ENABLE ROW LEVEL SECURITY;

-- Policy: Doctor gère ses règles
CREATE POLICY IF NOT EXISTS doctor_can_manage_own_availability
ON availability_rules FOR ALL
USING (doctor_id IN (SELECT id FROM doctors WHERE user_id = auth.uid()));

-- Trigger pour updated_at
CREATE TRIGGER update_availability_rules_updated_at
BEFORE UPDATE ON availability_rules
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
