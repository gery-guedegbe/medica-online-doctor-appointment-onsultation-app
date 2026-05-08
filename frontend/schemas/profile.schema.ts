import { z } from "zod";

// ─── Fill Your Profile ────────────────────────────────────────

/**
 * Champs visibles dans la maquette Figma (écran 16/17):
 *  - Avatar    → upload séparé via POST /api/users/avatar
 *  - Full Name → requis
 *  - Nickname  → requis, unique (vérifié côté backend)
 *  - Date of Birth → optionnel, format ISO YYYY-MM-DD envoyé à l'API
 *                    (affiché en MM/DD/YYYY dans le DatePicker)
 *  - Email     → pré-rempli depuis l'auth, read-only (non envoyé dans ce form)
 *  - Gender    → optionnel, valeurs backend: male | female | other
 */
export const fillProfileSchema = z.object({
  full_name: z
    .string()
    .min(2, "Minimum 2 caractères")
    .max(255, "Maximum 255 caractères"),

  nickname: z
    .string()
    .min(2, "Minimum 2 caractères")
    .max(100, "Maximum 100 caractères")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Lettres, chiffres et _ uniquement"
    ),

  date_of_birth: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}$/,
      "Format attendu : YYYY-MM-DD"
    )
    .optional()
    .or(z.literal("")),

  gender: z
    .enum(["male", "female", "other"], {
      errorMap: () => ({ message: "Sélectionnez un genre" }),
    })
    .optional(),
});

export type FillProfileFormData = z.infer<typeof fillProfileSchema>;

// Valeurs par défaut pour useForm
export const fillProfileDefaults: FillProfileFormData = {
  full_name: "",
  nickname: "",
  date_of_birth: "",
  gender: undefined,
};

// ─── Create New PIN ───────────────────────────────────────────

/**
 * Maquette Figma (écran 18):
 *  - Pavé numérique custom (0-9 + delete)
 *  - 4 chiffres exacts, affichés en dots
 *  - Pas de champ de confirmation visible → validé sur longueur uniquement
 *
 * Le PIN est hashé côté backend (bcrypt).
 * Ne jamais stocker le PIN en clair dans l'app.
 */
export const createPinSchema = z.object({
  pin: z
    .string()
    .length(4, "Le PIN doit contenir exactement 4 chiffres")
    .regex(/^\d{4}$/, "Chiffres uniquement (0-9)"),
});

export type CreatePinFormData = z.infer<typeof createPinSchema>;

// ─── Helpers ──────────────────────────────────────────────────

/**
 * Convertit une Date JS en YYYY-MM-DD pour l'API.
 * Utiliser avec le DatePicker qui retourne un objet Date.
 *
 * @example
 * const dateStr = dateToISO(new Date("12/27/1995")); // "1995-12-27"
 */
export const dateToISO = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

/**
 * Convertit YYYY-MM-DD en Date JS pour initialiser le DatePicker.
 */
export const isoToDate = (iso: string): Date => new Date(iso + "T12:00:00");

/**
 * Normalise la valeur du dropdown gender (ex: "Male" → "male").
 */
export const normalizeGender = (
  value: string
): "male" | "female" | "other" | undefined => {
  const v = value.toLowerCase();
  if (v === "male" || v === "female" || v === "other") return v;
  return undefined;
};
