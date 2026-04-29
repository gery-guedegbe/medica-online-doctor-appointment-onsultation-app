/**
 * CONSTANTS: Valeurs Globales
 * RESPONSABILITÉ:
 * Centraliser les constantes métier
 * Éviter les "magic numbers"
 *
 * Voir: /docs/GUIDELINES_DOCS.md - Section 3
 */

// Rôles utilisateurs
const ROLES = {
  PATIENT: 'patient',
  DOCTOR: 'doctor',
  ADMIN: 'admin',
};

// Statuts de rendez-vous
const APPOINTMENT_STATUS = {
  BOOKED: 'booked',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

// Disponibilité
const DAY_OF_WEEK = {
  MONDAY: 0,
  TUESDAY: 1,
  WEDNESDAY: 2,
  THURSDAY: 3,
  FRIDAY: 4,
  SATURDAY: 5,
  SUNDAY: 6,
};

// Durée rendez-vous (en minutes)
const APPOINTMENT_DURATION_MINUTES = 30;

// Délai minimum pour annulation (en heures)
const CANCELLATION_MIN_HOURS = 2;

module.exports = {
  ROLES,
  APPOINTMENT_STATUS,
  DAY_OF_WEEK,
  APPOINTMENT_DURATION_MINUTES,
  CANCELLATION_MIN_HOURS,
};
