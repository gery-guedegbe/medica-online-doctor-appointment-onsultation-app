-- 🎯 MIGRATION: Créer table exceptions d'availability
-- 📌 OBJECTIF:
-- Gérer les jours fermés (congés, exceptions)
-- Ou les jours extraordinaires
--
-- ⚠️ RÈGLES CRITIQUES:
-- - is_available: true=travaille ce jour, false=fermé
-- - Une entrée par date spéciale
-- - FK vers doctors
--
-- 📘 Voir: /docs/GUIDELINES_DOCS.md - Section 4

CREATE TABLE IF NOT EXISTS availability_exceptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL,
  date DATE NOT NULL,
  is_available BOOLEAN NOT NULL DEFAULT FALSE,
  start_time TIME,
  end_time TIME,
  reason TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
  UNIQUE(doctor_id, date)
);

-- Index sur doctor_id et date
CREATE INDEX IF NOT EXISTS availability_exceptions_doctor_date_idx 
ON availability_exceptions(doctor_id, date);

-- Row Level Security
ALTER TABLE availability_exceptions ENABLE ROW LEVEL SECURITY;

-- Policy: Doctor gère ses exceptions
CREATE POLICY IF NOT EXISTS doctor_can_manage_own_exceptions
ON availability_exceptions FOR ALL
USING (doctor_id IN (SELECT id FROM doctors WHERE user_id = auth.uid()));

-- Trigger pour updated_at
CREATE TRIGGER update_availability_exceptions_updated_at
BEFORE UPDATE ON availability_exceptions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
