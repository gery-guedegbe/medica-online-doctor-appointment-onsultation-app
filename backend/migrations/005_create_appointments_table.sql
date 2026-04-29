-- 🎯 MIGRATION: Créer table appointments
-- 📌 OBJECTIF:
-- Stocker les rendez-vous confirmés
-- Lien patient <-> doctor
--
-- ⚠️ RÈGLES CRITIQUES:
-- - ⚠️ CONTRAINTE: Aucun overlap sur time range (exclusion constraint)
-- - status: booked | completed | cancelled
-- - start_time et end_time obligatoires
-- - Isolation par RLS
--
-- 📘 Voir: /docs/GUIDELINES_DOCS.md - Section 3 & 4

CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL,
  patient_id UUID NOT NULL,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'booked' 
    CHECK (status IN ('booked', 'completed', 'cancelled')),
  cancellation_reason TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
  FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Index sur doctor_id pour les requêtes docteur
CREATE INDEX IF NOT EXISTS appointments_doctor_id_idx ON appointments(doctor_id);

-- Index sur patient_id pour les requêtes patient
CREATE INDEX IF NOT EXISTS appointments_patient_id_idx ON appointments(patient_id);

-- Index sur status
CREATE INDEX IF NOT EXISTS appointments_status_idx ON appointments(status);

-- Index sur time ranges (pour les requêtes de chevauchement)
CREATE INDEX IF NOT EXISTS appointments_time_range_idx 
ON appointments(doctor_id, start_time, end_time) 
WHERE status != 'cancelled';

-- ⚠️ CONTRAINTE CRITIQUE: Pas de double booking
-- Exclusion constraint: Un doctor ne peut avoir qu'un RDV par slot
ALTER TABLE appointments
ADD CONSTRAINT no_overlapping_appointments 
EXCLUDE USING gist (
  doctor_id WITH =,
  tsrange(start_time, end_time) WITH &&
) WHERE (status != 'cancelled');

-- Row Level Security
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Policy: Patient voit ses RDV
CREATE POLICY IF NOT EXISTS patient_can_view_own_appointments
ON appointments FOR SELECT
USING (patient_id = auth.uid());

-- Policy: Doctor voit ses RDV
CREATE POLICY IF NOT EXISTS doctor_can_view_own_appointments
ON appointments FOR SELECT
USING (doctor_id IN (SELECT id FROM doctors WHERE user_id = auth.uid()));

-- Policy: Patient peut créer un RDV
CREATE POLICY IF NOT EXISTS patient_can_create_appointment
ON appointments FOR INSERT
WITH CHECK (patient_id = auth.uid());

-- Policy: Doctor peut modifier ses RDV
CREATE POLICY IF NOT EXISTS doctor_can_update_own_appointments
ON appointments FOR UPDATE
USING (doctor_id IN (SELECT id FROM doctors WHERE user_id = auth.uid()));

-- Trigger pour updated_at
CREATE TRIGGER update_appointments_updated_at
BEFORE UPDATE ON appointments
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
