-- Ajouter les tables manquantes: availability_rules et appointments

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

CREATE INDEX IF NOT EXISTS availability_rules_doctor_id_idx ON availability_rules(doctor_id);
CREATE INDEX IF NOT EXISTS availability_rules_lookup_idx ON availability_rules(doctor_id, day_of_week);

ALTER TABLE availability_rules ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS doctor_can_manage_own_availability ON availability_rules;
CREATE POLICY doctor_can_manage_own_availability
ON availability_rules FOR ALL
USING (doctor_id IN (SELECT id FROM doctors WHERE user_id = auth.uid()));

DROP TRIGGER IF EXISTS update_availability_rules_updated_at ON availability_rules;
CREATE TRIGGER update_availability_rules_updated_at
BEFORE UPDATE ON availability_rules
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- TABLE: availability_exceptions
-- ============================================================
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

CREATE INDEX IF NOT EXISTS availability_exceptions_doctor_date_idx ON availability_exceptions(doctor_id, date);

ALTER TABLE availability_exceptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS doctor_can_manage_own_exceptions ON availability_exceptions;
CREATE POLICY doctor_can_manage_own_exceptions
ON availability_exceptions FOR ALL
USING (doctor_id IN (SELECT id FROM doctors WHERE user_id = auth.uid()));

DROP TRIGGER IF EXISTS update_availability_exceptions_updated_at ON availability_exceptions;
CREATE TRIGGER update_availability_exceptions_updated_at
BEFORE UPDATE ON availability_exceptions
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

CREATE INDEX IF NOT EXISTS appointments_doctor_id_idx ON appointments(doctor_id);
CREATE INDEX IF NOT EXISTS appointments_patient_id_idx ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS appointments_status_idx ON appointments(status);
CREATE INDEX IF NOT EXISTS appointments_time_range_idx ON appointments(doctor_id, start_time, end_time) WHERE status != 'cancelled';

-- Contrainte d'exclusion GIST: Pas de double booking (conditionnel)
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

DROP POLICY IF EXISTS patient_can_view_own_appointments ON appointments;
CREATE POLICY patient_can_view_own_appointments
ON appointments FOR SELECT
USING (patient_id = auth.uid());

DROP POLICY IF EXISTS doctor_can_view_own_appointments ON appointments;
CREATE POLICY doctor_can_view_own_appointments
ON appointments FOR SELECT
USING (doctor_id IN (SELECT id FROM doctors WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS patient_can_create_appointment ON appointments;
CREATE POLICY patient_can_create_appointment
ON appointments FOR INSERT
WITH CHECK (patient_id = auth.uid());

DROP POLICY IF EXISTS doctor_can_update_own_appointments ON appointments;
CREATE POLICY doctor_can_update_own_appointments
ON appointments FOR UPDATE
USING (doctor_id IN (SELECT id FROM doctors WHERE user_id = auth.uid()));

DROP TRIGGER IF EXISTS update_appointments_updated_at ON appointments;
CREATE TRIGGER update_appointments_updated_at
BEFORE UPDATE ON appointments
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
