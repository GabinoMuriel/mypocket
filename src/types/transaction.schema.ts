import { z } from "zod";
import i18n from "@/locales/i18n";

export const TRANSACTION_TYPES = ["income", "expense"] as const;

const currencyValidation = (val: number) => {
  const parts = val.toString().split(".");
  return parts.length === 1 || parts[1].length <= 2;
};

export const transactionSchema = z.object({
  // Use z.enum(ARRAY) instead of calling .enum on an object
  type: z
    .enum(TRANSACTION_TYPES)
    .refine((val) => val !== undefined, {
      message: i18n.t("VALIDATION.TRANSACTION.TYPE_REQUIRED"),
    })
    .default("expense"),

  amount: z.coerce
    .number()
    .positive(i18n.t("VALIDATION.TRANSACTION.AMOUNT_POSITIVE"))
    .refine(currencyValidation, i18n.t("VALIDATION.TRANSACTION.AMOUNT_DECIMALS")),

  category_id: z
    .string()
    .min(1, i18n.t("VALIDATION.TRANSACTION.CATEGORY_REQUIRED"))
    .uuid(i18n.t("VALIDATION.TRANSACTION.CATEGORY_INVALID")),

  description: z
    .string()
    .max(100, i18n.t("VALIDATION.TRANSACTION.DESCRIPTION_MAX"))
    .optional()
    .or(z.literal("")),

  date: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: i18n.t("VALIDATION.TRANSACTION.DATE_INVALID"),
    })
    .default(() => new Date().toISOString().split("T")[0]),
});

export type TransactionFormValues = z.infer<typeof transactionSchema>;
