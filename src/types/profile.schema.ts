import { z } from "zod";

/**
 * Zod schema for Profile validation.
 * Used in the Profile Form and for type inference.
 */
export const profileSchema = z.object({
  first_name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre es demasiado largo")
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "El nombre solo puede contener letras"),

  last_name: z
    .string()
    .min(2, "El apellidodebe tener al menos 2 caracteres")
    .max(100, "El campo es demasiado largo")
    .regex(
      /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/,
      "El apellido solo puede contener letras",
    )
    .or(z.literal(""))
    .optional(),

  birthdate: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Fecha de nacimiento inválida",
    })
    .or(z.literal(""))
    .optional(),

  phone: z
    .string()
    .regex(/^\+?[0-9]{9,15}$/, "Número de teléfono inválido (ej: 600123456)")
    .or(z.literal(""))
    .optional(),

  address: z
    .string()
    .min(5, "La dirección debe ser más específica")
    .max(200, "La dirección es demasiado larga")
    .refine((val) => /[a-zA-ZáéíóúÁÉÍÓÚñÑ]/.test(val), {
      message: "La dirección debe contener al menos una letra",
    })
    .or(z.literal(""))
    .optional(),

  city: z
    .string()
    .min(2, "El nombre de la ciudad es demasiado corto")
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/, "La ciudad solo puede contener letras")
    .or(z.literal(""))
    .optional(),

  postal_code: z
    .string()
    .regex(/^[0-9]{5}$/, "El código postal debe tener 5 dígitos")
    .or(z.literal(""))
    .optional(),

  role_name: z.enum(["user", "premium"]).default("user").optional(),
});

/**
 * TypeScript type inferred from the schema.
 * Use this for your form state and function props.
 */
export type RoleName = z.infer<typeof profileSchema>["role_name"];
export type ProfileFormValues = z.infer<typeof profileSchema>;
