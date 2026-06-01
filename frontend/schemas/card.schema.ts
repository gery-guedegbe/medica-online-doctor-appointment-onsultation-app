import { z } from "zod";

export const cardSchema = z.object({
  cardNumber: z
    .string()
    .min(1, "Card number is required")
    .regex(
      /^\d{4} \d{4} \d{4} \d{4}$/,
      "Format required: XXXX XXXX XXXX XXXX",
    ),

  expiryDate: z
    .string()
    .min(1, "Expiry date is required")
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Format required: MM/YY")
    .refine((val) => {
      const [month, year] = val.split("/").map(Number);
      // On reconstruit une Date au 1er du mois d'expiration
      const cardExp = new Date(2000 + year, month - 1, 1);
      const now = new Date();
      // La carte est valide si son mois d'expiration >= mois actuel
      return cardExp >= new Date(now.getFullYear(), now.getMonth(), 1);
    }, "This card has expired"),

  cvv: z
    .string()
    .min(1, "CVV is required")
    .regex(/^\d{3,4}$/, "CVV must be 3 or 4 digits"),
});

export type CardFormData = z.infer<typeof cardSchema>;
