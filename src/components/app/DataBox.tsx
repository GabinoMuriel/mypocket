import type { Transaction } from "@/services/transaction.service";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { useTranslation } from "react-i18next";

interface DataBoxProps {
  transactions: Transaction[];
}

export function DataBox({ transactions }: DataBoxProps) {
  const { t, i18n } = useTranslation();

  // 1. Calculate Income (Sum of all 'income' transactions)
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  // 2. Calculate Expenses (Sum of all 'expense' transactions)
  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  // 3. Calculate Net Total
  const netTotal = totalIncome - totalExpenses;

  // Formatting helper for euros
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat(i18n.language === "en" ? "en-US" : "es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(amount);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
      {/* Income Card */}
      <div className="flex items-center p-4 bg-card border rounded-lg shadow-sm">
        <div className="p-3 bg-green-100 text-[var(--secondary)] rounded-full mr-4">
          <TrendingUp className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">{t('DATA_BOX.INCOMES')}</p>
          <h3 className="text-2xl font-bold text-[var(--secondary)]">
            {formatCurrency(totalIncome)}
          </h3>
        </div>
      </div>

      {/* Expenses Card */}
      <div className="flex items-center p-4 bg-card border rounded-lg shadow-sm">
        <div className="p-3 bg-red-100 text-[var(--destructive)] rounded-full mr-4">
          <TrendingDown className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">{t('DATA_BOX.EXPENSES')}</p>
          <h3 className="text-2xl font-bold text-[var(--destructive)]">
            {formatCurrency(totalExpenses)}
          </h3>
        </div>
      </div>

      {/* Net Total Card */}
      <div className="flex items-center p-4 bg-card border rounded-lg shadow-sm">
        <div className="p-3 bg-blue-100 text-[var(--primary)] rounded-full mr-4">
          <Wallet className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">{t('DATA_BOX.TOTAL')}</p>
          <h3
            className={`text-2xl font-bold ${netTotal >= 0 ? "text-[var(--secondary)]" : "text-[var(--destructive)]"}`}
          >
            {formatCurrency(netTotal)}
          </h3>
        </div>
      </div>
    </div>
  );
}
