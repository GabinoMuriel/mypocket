import { z } from "zod";
import i18n from "@/locales/i18n";

/**
 * Zod schema for Profile validation.
 * Used in the Profile Form and for type inference.
 */
export const profileSchema = z.object({
  first_name: z
    .string()
    .min(2, i18n.t("VALIDATION.PROFILE.FIRST_NAME_MIN"))
    .max(50, i18n.t("VALIDATION.PROFILE.FIRST_NAME_MAX"))
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, i18n.t("VALIDATION.PROFILE.FIRST_NAME_REGEX")),

  last_name: z
    .string()
    .min(2, i18n.t("VALIDATION.PROFILE.LAST_NAME_MIN"))
    .max(100, i18n.t("VALIDATION.PROFILE.LAST_NAME_MAX"))
    .regex(
      /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/,
      i18n.t("VALIDATION.PROFILE.LAST_NAME_REGEX"),
    )
    .or(z.literal(""))
    .optional(),

  birthdate: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: i18n.t("VALIDATION.PROFILE.BIRTHDATE_INVALID"),
    })
    .or(z.literal(""))
    .optional(),

  phone: z
    .string()
    .regex(/^\+?[0-9]{9,15}$/, i18n.t("VALIDATION.PROFILE.PHONE_INVALID"))
    .or(z.literal(""))
    .optional(),

  address: z
    .string()
    .min(5, i18n.t("VALIDATION.PROFILE.ADDRESS_MIN"))
    .max(200, i18n.t("VALIDATION.PROFILE.ADDRESS_MAX"))
    .refine((val) => /[a-zA-ZáéíóúÁÉÍÓÚñÑ]/.test(val), {
      message: i18n.t("VALIDATION.PROFILE.ADDRESS_LETTERS"),
    })
    .or(z.literal(""))
    .optional(),

  city: z
    .string()
    .min(2, i18n.t("VALIDATION.PROFILE.CITY_MIN"))
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/, i18n.t("VALIDATION.PROFILE.CITY_REGEX"))
    .or(z.literal(""))
    .optional(),

  postal_code: z
    .string()
    .regex(/^[0-9]{5}$/, i18n.t("VALIDATION.PROFILE.POSTAL_CODE_INVALID"))
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
