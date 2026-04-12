import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import FormInput from "./form-input";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/utils/categories";
import { z } from "zod";
import { CategorySelect } from "./category-select";

const transactionSchema = z.object({
    type: z.enum(["income", "expense"]),
    description: z.string().min(1, "Obligatorio"),
    amount: z.coerce.number().positive("Debe ser mayor a 0"), // Coerce is key here
    date: z.string().min(1, "Obligatorio"),
    category: z.string().min(1, "Obligatorio"),
});

// 1. Infer the types correctly from the schema
export type TransactionSchemaType = z.infer<typeof transactionSchema>;

export function TransactionModal({ trigger }: { trigger: React.ReactNode }) {
    const [open, setOpen] = useState(false);

    // 2. Pass BOTH the schema type and the internal form type to useForm
    // Format: useForm<SchemaType>()
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm<TransactionSchemaType>({
        // 3. Explicitly type the zodResolver to match the schema
        resolver: zodResolver(transactionSchema) as any,
        defaultValues: {
            type: "income",
            amount: 0,
            description: "", // Explicitly add empty strings for strings
            date: new Date().toISOString().split("T")[0],
            category: "inc-4",
        },
    });

    const currentType = watch("type");

    useEffect(() => {
        const otherId = currentType === "income" ? "inc-4" : "exp-7";
        setValue("category", otherId);
    }, [currentType, setValue]);

    // 4. Update the handler type to match the Schema output
    const onSubmit = (data: TransactionSchemaType) => {
        console.log("Transacción guardada:", data);
        setOpen(false);
        reset();
    };

    const categories = currentType === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center">Nueva Transacción</DialogTitle>
                </DialogHeader>

                <div className="flex p-1 bg-muted rounded-lg gap-1">
                    <Button
                        type="button"
                        variant={currentType === "income" ? "default" : "ghost"}
                        className="flex-1"
                        onClick={() => setValue("type", "income")}
                    >
                        Ingreso
                    </Button>
                    <Button
                        type="button"
                        variant={currentType === "expense" ? "default" : "ghost"}
                        className="flex-1"
                        onClick={() => setValue("type", "expense")}
                    >
                        Gasto
                    </Button>
                </div>

                {/* 5. Wrap handleSubmit correctly */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
                    <FormInput
                        label="Descripción"
                        placeholder="Ej: Compra supermercado"
                        {...register("description")}
                        error={errors.description?.message}
                    />

                    <FormInput
                        label="Monto"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...register("amount")}
                        error={errors.amount?.message}
                    />

                    <FormInput
                        label="Fecha"
                        type="date"
                        {...register("date")}
                        error={errors.date?.message}
                    />

                    <div className="space-y-2">
                        <CategorySelect
                            type={currentType}
                            value={watch("category")}
                            onChange={(val) => setValue("category", val, { shouldValidate: true })}
                        />
                        {errors.category && (
                            <p className="text-destructive text-xs">{errors.category.message}</p>
                        )}
                    </div>

                    <Button type="submit" className="w-full mt-4">
                        Guardar {currentType === "income" ? "Ingreso" : "Gasto"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}