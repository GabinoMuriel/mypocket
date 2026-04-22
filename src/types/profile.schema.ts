import { z } from "zod";

/**
 * Zod schema for Profile validation.
 * Used in the Profile Form and for type inference.
 */
export const profileSchema = z.object({
    firstName: z
        .string()
        .min(2, "El nombre debe tener al menos 2 caracteres")
        .max(50, "El nombre es demasiado largo")
        .optional(),

    lastName: z // Used for DNI or Full Legal Name as per our discussion
        .string()
        .min(2, "El apellido/DNI debe tener al menos 2 caracteres")
        .max(100, "El campo es demasiado largo")
        .optional(),

    birthdate: z
        .string()
        .refine((date) => !isNaN(Date.parse(date)), {
            message: "Fecha de nacimiento inválida",
        })
        .optional(),

    phone: z
        .string()
        .regex(/^\+?[0-9]{9,15}$/, "Número de teléfono inválido (ej: 600123456)")
        .optional(),

    address: z
        .string()
        .min(5, "La dirección debe ser más específica")
        .max(200, "La dirección es demasiado larga")
        .optional(),

    city: z
        .string()
        .min(2, "El nombre de la ciudad es demasiado corto")
        .optional(),

    postalCode: z
        .string()
        .regex(/^[0-9]{5}$/, "El código postal debe tener 5 dígitos")
        .optional(),

    roleId: z.string().uuid("ID de rol inválido").optional(),
});

/**
 * TypeScript type inferred from the schema.
 * Use this for your form state and function props.
 */
export type ProfileFormValues = z.infer<typeof profileSchema>;