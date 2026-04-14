import { z } from "zod";

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
            message: "Selecciona si es un ingreso o un gasto",
        })
        .default("expense"),

    amount: z.coerce
        .number()
        .positive("El monto debe ser mayor a 0")
        .refine(currencyValidation, "Máximo 2 decimales permitidos"),

    categoryId: z
        .string()
        .min(1, "Debes seleccionar una categoría")
        .uuid("Categoría inválida"),

    description: z
        .string()
        .min(3, "La descripción debe tener al menos 3 caracteres")
        .max(100, "La descripción es demasiado larga"),

    date: z
        .string()
        .refine((date) => !isNaN(Date.parse(date)), {
            message: "Fecha inválida",
        })
        .default(() => new Date().toISOString().split("T")[0]),

    notes: z
        .string()
        .max(500, "Las notas no pueden exceder los 500 caracteres")
        .optional(),
});

export type TransactionFormValues = z.infer<typeof transactionSchema>;