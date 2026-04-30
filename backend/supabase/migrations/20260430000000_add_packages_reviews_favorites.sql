-- ============================================================
-- MIGRATION: Ajouter tables doctor_packages, reviews, favorites
-- et mettre à jour appointments
--
-- Ordre critique:
-- 1. doctor_packages (référencée par appointments)
-- 2. ALTER appointments (ajoute package_id + champs booking)
-- 3. reviews (référence appointments + users + doctors)
-- 4. favorites (référence users + doctors)
-- 5. Trigger mise à jour rating doctor
-- ============================================================

-- ============================================================
-- 1. TABLE: doctor_packages
-- ============================================================
CREATE TABLE IF NOT EXISTS doctor_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('messaging', 'video', 'voice')),
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  duration_minutes INT NOT NULL CHECK (duration_minutes > 0),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
  UNIQUE(doctor_id, type)
);

CREATE INDEX IF NOT EXISTS doctor_packages_doctor_id_idx ON doctor_packages(doctor_id);

ALTER TABLE doctor_packages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS doctor_can_manage_own_packages ON doctor_packages;
CREATE POLICY doctor_can_manage_own_packages
  ON doctor_packages FOR ALL
  USING (doctor_id IN (SELECT id FROM doctors WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS all_can_view_active_packages ON doctor_packages;
CREATE POLICY all_can_view_active_packages
  ON doctor_packages FOR SELECT
  USING (is_active = TRUE);

DROP TRIGGER IF EXISTS update_doctor_packages_updated_at ON doctor_packages;
CREATE TRIGGER update_doctor_packages_updated_at
  BEFORE UPDATE ON doctor_packages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- 2. ALTER TABLE: appointments — ajout champs booking
-- ============================================================
ALTER TABLE appointments
  ADD COLUMN IF NOT EXISTS package_id UUID REFERENCES doctor_packages(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS problem_description TEXT,
  ADD COLUMN IF NOT EXISTS patient_name VARCHAR(255),
  ADD COLUMN IF NOT EXISTS patient_age INT CHECK (patient_age > 0 AND patient_age <= 120),
  ADD COLUMN IF NOT EXISTS reschedule_reason TEXT,
  ADD COLUMN IF NOT EXISTS reschedule_count INT DEFAULT 0;

-- Policy patient INSERT (déjà existante mais on la recrée proprement)
DROP POLICY IF EXISTS patient_can_create_appointment ON appointments;
CREATE POLICY patient_can_create_appointment
  ON appointments FOR INSERT
  WITH CHECK (patient_id = auth.uid());

-- ============================================================
-- 3. TABLE: reviews
-- ============================================================
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID NOT NULL UNIQUE,
  patient_id UUID NOT NULL,
  doctor_id UUID NOT NULL,
  stars INT NOT NULL CHECK (stars BETWEEN 1 AND 5),
  comment TEXT,
  recommend BOOLEAN,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE,
  FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS reviews_doctor_id_idx ON reviews(doctor_id);
CREATE INDEX IF NOT EXISTS reviews_patient_id_idx ON reviews(patient_id);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS patient_can_create_review ON reviews;
CREATE POLICY patient_can_create_review
  ON reviews FOR INSERT
  WITH CHECK (patient_id = auth.uid());

DROP POLICY IF EXISTS all_can_view_reviews ON reviews;
CREATE POLICY all_can_view_reviews
  ON reviews FOR SELECT
  USING (TRUE);

-- Trigger: recalcule le rating du doctor après chaque review
CREATE OR REPLACE FUNCTION update_doctor_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE doctors
  SET rating = (
    SELECT ROUND(AVG(stars)::NUMERIC, 2)
    FROM reviews
    WHERE doctor_id = NEW.doctor_id
  )
  WHERE id = NEW.doctor_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_doctor_rating_on_review ON reviews;
CREATE TRIGGER update_doctor_rating_on_review
  AFTER INSERT OR UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_doctor_rating();

-- ============================================================
-- 4. TABLE: favorites
-- ============================================================
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL,
  doctor_id UUID NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
  UNIQUE(patient_id, doctor_id)
);

CREATE INDEX IF NOT EXISTS favorites_patient_id_idx ON favorites(patient_id);

ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS patient_can_manage_own_favorites ON favorites;
CREATE POLICY patient_can_manage_own_favorites
  ON favorites FOR ALL
  USING (patient_id = auth.uid());
