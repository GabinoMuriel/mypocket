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
import FormInput from "./FormInput";
import { z } from "zod";
import { CategorySelect } from "./CategorySelect";

const transactionSchema = z.object({
    type: z.enum(["income", "expense"]),
    description: z.string().min(1, "Obligatorio"),
    amount: z.number().positive("Debe ser mayor a 0"),
    date: z.string().min(1, "Obligatorio"),
    categoryId: z.string().uuid("Categoría inválida"), // Updated to match userId/categoryId style
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

export function TransactionModal({ trigger }: { trigger: React.ReactNode }) {
    const [open, setOpen] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm<TransactionFormValues>({
        resolver: zodResolver(transactionSchema),
        defaultValues: {
            type: "income",
            amount: 0,
            description: "",
            date: new Date().toISOString().split("T")[0],
            categoryId: "11111111-1111-1111-1111-111111111111", // Use a real UUID mock
        },
    });

    const currentType = watch("type");

    // Logic to switch default categories based on type
    useEffect(() => {
        const defaultCategory = currentType === "income"
            ? "11111111-1111-1111-1111-111111111111" // Mock Income UUID
            : "22222222-2222-2222-2222-222222222222"; // Mock Expense UUID
        setValue("categoryId", defaultCategory);
    }, [currentType, setValue]);

    const onSubmit = (data: TransactionFormValues) => {
        console.log("Transacción lista para Supabase:", data);
        // Here you would call your repository: userRepository.createTransaction(data)
        setOpen(false);
        reset();
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center">
                        Nueva Transacción
                    </DialogTitle>
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
                        {...register("amount", { valueAsNumber: true })}
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
                            value={watch("categoryId")}
                            onChange={(val) => setValue("categoryId", val, { shouldValidate: true })}
                        />
                        {errors.categoryId && (
                            <p className="text-destructive text-xs">{errors.categoryId.message}</p>
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