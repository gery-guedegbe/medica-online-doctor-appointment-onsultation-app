-- Corriger les policies et triggers pour les tables existantes

-- ============================================================
-- AVAILABILITY_EXCEPTIONS: Nettoyer et recréer les policies
-- ============================================================
DROP POLICY IF EXISTS doctor_can_manage_own_exceptions ON availability_exceptions;

CREATE POLICY doctor_can_manage_own_exceptions
ON availability_exceptions FOR ALL
USING (doctor_id IN (SELECT id FROM doctors WHERE user_id = auth.uid()));

-- Créer le trigger s'il n'existe pas
DROP TRIGGER IF EXISTS update_availability_exceptions_updated_at ON availability_exceptions;

CREATE TRIGGER update_availability_exceptions_updated_at
BEFORE UPDATE ON availability_exceptions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- APPOINTMENTS: Nettoyer et recréer les policies
-- ============================================================
DROP POLICY IF EXISTS patient_can_view_own_appointments ON appointments;
DROP POLICY IF EXISTS doctor_can_view_own_appointments ON appointments;
DROP POLICY IF EXISTS patient_can_create_appointment ON appointments;
DROP POLICY IF EXISTS doctor_can_update_own_appointments ON appointments;

CREATE POLICY patient_can_view_own_appointments
ON appointments FOR SELECT
USING (patient_id = auth.uid());

CREATE POLICY doctor_can_view_own_appointments
ON appointments FOR SELECT
USING (doctor_id IN (SELECT id FROM doctors WHERE user_id = auth.uid()));

CREATE POLICY patient_can_create_appointment
ON appointments FOR INSERT
WITH CHECK (patient_id = auth.uid());

CREATE POLICY doctor_can_update_own_appointments
ON appointments FOR UPDATE
USING (doctor_id IN (SELECT id FROM doctors WHERE user_id = auth.uid()));

-- Créer le trigger s'il n'existe pas
DROP TRIGGER IF EXISTS update_appointments_updated_at ON appointments;

CREATE TRIGGER update_appointments_updated_at
BEFORE UPDATE ON appointments
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- AVAILABILITY_RULES: Nettoyer et recréer les policies
-- ============================================================
DROP POLICY IF EXISTS doctor_can_manage_own_availability ON availability_rules;

CREATE POLICY doctor_can_manage_own_availability
ON availability_rules FOR ALL
USING (doctor_id IN (SELECT id FROM doctors WHERE user_id = auth.uid()));

-- Créer le trigger s'il n'existe pas
DROP TRIGGER IF EXISTS update_availability_rules_updated_at ON availability_rules;

CREATE TRIGGER update_availability_rules_updated_at
BEFORE UPDATE ON availability_rules
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
