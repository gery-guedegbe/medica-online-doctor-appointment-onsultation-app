-- ============================================================
-- MIGRATION: Créer les tables manquantes
-- Tables: availability_rules, appointments
--
-- RAISON: Migration précédente a échoué à cause de la contrainte
-- GIST qui nécessite l'extension btree_gist non activée.
--
-- APPROCHE SÉCURISÉE:
-- - CREATE TABLE IF NOT EXISTS (idempotent)
-- - Contrainte GIST ajoutée via bloc conditionnel DO $$
-- ============================================================

-- Extension requise pour la contrainte EXCLUDE USING gist
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- ============================================================
-- TABLE: availability_rules
-- ============================================================
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

CREATE INDEX IF NOT EXISTS availability_rules_doctor_id_idx
  ON availability_rules(doctor_id);

CREATE INDEX IF NOT EXISTS availability_rules_lookup_idx
  ON availability_rules(doctor_id, day_of_week);

ALTER TABLE availability_rules ENABLE ROW LEVEL SECURITY;

-- Policy: Doctor gère ses propres règles de disponibilité
DROP POLICY IF EXISTS doctor_can_manage_own_availability ON availability_rules;
CREATE POLICY doctor_can_manage_own_availability
  ON availability_rules FOR ALL
  USING (doctor_id IN (SELECT id FROM doctors WHERE user_id = auth.uid()));

-- Trigger updated_at
DROP TRIGGER IF EXISTS update_availability_rules_updated_at ON availability_rules;
CREATE TRIGGER update_availability_rules_updated_at
  BEFORE UPDATE ON availability_rules
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- TABLE: appointments
-- ============================================================
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

CREATE INDEX IF NOT EXISTS appointments_doctor_id_idx
  ON appointments(doctor_id);

CREATE INDEX IF NOT EXISTS appointments_patient_id_idx
  ON appointments(patient_id);

CREATE INDEX IF NOT EXISTS appointments_status_idx
  ON appointments(status);

CREATE INDEX IF NOT EXISTS appointments_time_range_idx
  ON appointments(doctor_id, start_time, end_time)
  WHERE status != 'cancelled';

-- Contrainte GIST: Aucun double booking pour un même doctor
-- Bloc conditionnel pour éviter l'erreur si contrainte existe déjà
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'no_overlapping_appointments'
  ) THEN
    ALTER TABLE appointments
    ADD CONSTRAINT no_overlapping_appointments
    EXCLUDE USING gist (
      doctor_id WITH =,
      tsrange(start_time, end_time) WITH &&
    ) WHERE (status != 'cancelled');
  END IF;
END $$;

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Policy: Patient voit uniquement ses rendez-vous
DROP POLICY IF EXISTS patient_can_view_own_appointments ON appointments;
CREATE POLICY patient_can_view_own_appointments
  ON appointments FOR SELECT
  USING (patient_id = auth.uid());

-- Policy: Doctor voit uniquement ses rendez-vous
DROP POLICY IF EXISTS doctor_can_view_own_appointments ON appointments;
CREATE POLICY doctor_can_view_own_appointments
  ON appointments FOR SELECT
  USING (doctor_id IN (SELECT id FROM doctors WHERE user_id = auth.uid()));

-- Policy: Patient peut créer un rendez-vous
DROP POLICY IF EXISTS patient_can_create_appointment ON appointments;
CREATE POLICY patient_can_create_appointment
  ON appointments FOR INSERT
  WITH CHECK (patient_id = auth.uid());

-- Policy: Doctor peut modifier ses rendez-vous
DROP POLICY IF EXISTS doctor_can_update_own_appointments ON appointments;
CREATE POLICY doctor_can_update_own_appointments
  ON appointments FOR UPDATE
  USING (doctor_id IN (SELECT id FROM doctors WHERE user_id = auth.uid()));

-- Trigger updated_at
DROP TRIGGER IF EXISTS update_appointments_updated_at ON appointments;
CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON appointments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
