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
import { transactionService, type Transaction } from "@/services/transaction.service";
import { useTransactionStore } from "@/store/useTransactionStore";
import i18n from "@/locales/i18n";
import { useTranslation } from "react-i18next";

const transactionSchema = z.object({
  type: z.enum(["income", "expense"]),
  description: z
    .string()
    .min(1, i18n.t("VALIDATION.TRANSACTION.REQUIRED"))
    .max(100, i18n.t("VALIDATION.TRANSACTION.DESCRIPTION_MAX"))
    .optional(),
  amount: z.number().positive(i18n.t("VALIDATION.TRANSACTION.AMOUNT_POSITIVE")),
  date: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: i18n.t("VALIDATION.TRANSACTION.DATE_INVALID"),
    })
    .or(z.literal(""))
    .optional(),
  category_id: z.string().uuid(i18n.t("VALIDATION.TRANSACTION.CATEGORY_INVALID")),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

interface TransactionModalProps {
  trigger: React.ReactNode;
  initialData?: Transaction;
}

export function TransactionModal({ trigger, initialData }: TransactionModalProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useTranslation();

  const categories = useTransactionStore((state) => state.categories);

  const refreshTransactions = useTransactionStore((state) => state.refreshTransactions);

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

  useEffect(() => {
    if (initialData && open) {
      reset({
        type: initialData.type, // Map DB column to form
        amount: Number(initialData.amount),
        description: initialData.description || "",
        category_id: initialData.category_id || "",
        date: initialData.date ? new Date(initialData.date).toISOString().split("T")[0] : "",
      });
    } else if (!open && !initialData) {
      reset({ type: "expense", amount: 0, description: "", category_id: "" });
    }
  }, [initialData, open, reset]);

  const onSubmit = async (data: TransactionFormValues) => {
    setIsSubmitting(true);
    try {
      const payload = {
        type: data.type,
        amount: data.amount,
        description: data.description,
        category_id: data.category_id || undefined,
        date: data.date || new Date().toISOString(),
      };

      if (initialData) {
        // Edit Mode
        await transactionService.updateTransaction(initialData.id, payload);
      } else {
        const user = useAuthStore.getState().user; // Ensure you have access to the user
        if (!user) return;

        await transactionService.addTransaction({
          user_id: user.id,
          ...payload
        });
      }

      setOpen(false);

      await refreshTransactions();

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
            {initialData ? t('TRANSACTION_MODAL.EDIT_TITLE') : t('TRANSACTION_MODAL.NEW_TITLE')}
          </DialogTitle>
        </DialogHeader>

        <div className="flex p-1 bg-muted rounded-lg gap-1">
          <Button
            type="button"
            variant={currentType === "expense" ? "default" : "ghost"}
            className="flex-1"
            onClick={() => setValue("type", "expense")}
          >
            {t('TRANSACTION_MODAL.EXPENSE')}
          </Button>
          <Button
            type="button"
            variant={currentType === "income" ? "default" : "ghost"}
            className="flex-1"
            onClick={() => setValue("type", "income")}
          >
            {t('TRANSACTION_MODAL.INCOME')}
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormInput
            label={t('TRANSACTION_MODAL.DESCRIPTION_LABEL')}
            placeholder={t('TRANSACTION_MODAL.DESCRIPTION_PLACEHOLDER')}
            {...register("description")}
            error={errors.description?.message}
          />

          <FormInput
            label={t('TRANSACTION_MODAL.AMOUNT_LABEL')}
            type="number"
            step="0.01"
            placeholder="0.00"
            {...register("amount", { valueAsNumber: true })}
            error={errors.amount?.message}
          />

          <FormInput
            label={t('TRANSACTION_MODAL.DATE_LABEL')}
            type="date"
            {...register("date")}
            error={errors.date?.message}
          />

          <div className="space-y-2">
            <label className="text-sm font-medium">{t('TRANSACTION_MODAL.CATEGORY_LABEL')}</label>
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
            {isSubmitting ? t('TRANSACTION_MODAL.SUBMITTING') : t('TRANSACTION_MODAL.SUBMIT')}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
