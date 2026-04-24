import { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
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
import { useAuthStore } from "@/store/useAuthStore";
import { transactionService } from "@/services/transaction.service";
import { useTransactionStore } from "@/store/useTransactionStore";

const transactionSchema = z.object({
  type: z.enum(["income", "expense"]),
  description: z
    .string()
    .min(1, "Obligatorio")
    .max(100, "La descripción es demasiado larga")
    .optional(),
  amount: z.number().positive("Debe ser mayor a 0"),
  date: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Fecha de nacimiento inválida",
    })
    .or(z.literal(""))
    .optional(),
  category_id: z.string().uuid("Categoría inválida"),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

export function TransactionModal({ trigger }: { trigger: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const user = useAuthStore((state) => state.user);
  const categories = useTransactionStore((state) => state.categories);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: "expense",
      amount: 0,
      description: "",
      date: new Date().toISOString().split("T")[0],
      category_id: "",
    },
  });

  const currentType = watch("type");

  useEffect(() => {
    const defaultCat = categories.find(
      (c) => c.type === currentType && c.is_system && c.name === "Other",
    );
    if (defaultCat) {
      setValue("category_id", defaultCat.id);
    } else {
      setValue("category_id", "");
    }
  }, [currentType, categories, setValue]);

  const onSubmit = async (data: TransactionFormValues) => {
    if (!user) return;
    setIsSubmitting(true);

    try {
      await transactionService.addTransaction({
        user_id: user.id,
        type: data.type,
        amount: data.amount,
        description: data.description,
        date: data.date,
        category_id: data.category_id || undefined,
      });

      setOpen(false);
      reset();

      // TODO: Tell the store to refetch
    } catch (error) {
      console.error("Error al guardar la transacción:", error);
    } finally {
      setIsSubmitting(false);
    }
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
            variant={currentType === "expense" ? "default" : "ghost"}
            className="flex-1"
            onClick={() => setValue("type", "expense")}
          >
            Gasto
          </Button>
          <Button
            type="button"
            variant={currentType === "income" ? "default" : "ghost"}
            className="flex-1"
            onClick={() => setValue("type", "income")}
          >
            Ingreso
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            <label className="text-sm font-medium">Categoría</label>
            <Controller
              name="category_id"
              control={control}
              render={({ field }) => (
                <CategorySelect
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  type={currentType}
                  categories={categories}
                />
              )}
            />
            {errors.category_id && (
              <span className="text-red-500 text-sm">
                {errors.category_id.message}
              </span>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : "Guardar Transacción"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
