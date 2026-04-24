import { useState, useEffect, useMemo } from "react";
import { DateNavigator } from "@/components/app/DateNavigator";
import { Button } from "@/components/ui/button";
import { useTransactionStore } from "@/store/useTransactionStore";
import {
  addDays,
  subDays,
  addMonths,
  subMonths,
  addYears,
  subYears,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  format,
  isSameDay,
  isSameMonth,
  isSameYear,
} from "date-fns";
import { DataBox } from "@/components/app/DataBox";
import { TransactionCard } from "./components/TransactionCard";
import { useNavigate, useParams } from "react-router-dom";

/* const getModeFromUrl = (period?: string): 'day' | 'month' | 'year' => {
  if (period === 'mensuales') return 'month';
  if (period === 'anuales') return 'year';
  return 'day'; // Default fallback for 'diarias'
}; */

export default function TransactionsPage() {
  const { period } = useParams();
  const navigate = useNavigate();
  const viewMode = period === "month" || period === "year" ? period : "day";
  const [currentDate, setCurrentDate] = useState(new Date());

  const fetchTransactions = useTransactionStore(
    (state) => state.fetchTransactions,
  );
  const allTransactions = useTransactionStore((state) => state.transactions);

  // 1. Arrow Navigation Logic
  const handlePrev = () => {
    if (viewMode === "day") setCurrentDate((prev) => subDays(prev, 1));
    else if (viewMode === "month") setCurrentDate((prev) => subMonths(prev, 1));
    else setCurrentDate((prev) => subYears(prev, 1));
  };

  const handleNext = () => {
    if (viewMode === "day") setCurrentDate((prev) => addDays(prev, 1));
    else if (viewMode === "month") setCurrentDate((prev) => addMonths(prev, 1));
    else setCurrentDate((prev) => addYears(prev, 1));
  };

  // 2. Dynamic Range-Based Fetching Logic
  useEffect(() => {
    let start: Date;
    let end: Date;

    // Determine the boundaries based on the view mode
    if (viewMode === "year") {
      start = startOfYear(currentDate);
      end = endOfYear(currentDate);
    } else {
      // Both 'day' and 'month' modes download the whole month for local caching!
      start = startOfMonth(currentDate);
      end = endOfMonth(currentDate);
    }

    // Pass the formatted YYYY-MM-DD strings to the store
    fetchTransactions(format(start, "yyyy-MM-dd"), format(end, "yyyy-MM-dd"));
  }, [
    viewMode,
    currentDate.getMonth(),
    currentDate.getFullYear(),
    fetchTransactions,
  ]);

  const activeTransactions = useMemo(() => {
    return allTransactions.filter((tx) => {
      const txDate = new Date(tx.date);
      if (viewMode === "day") return isSameDay(txDate, currentDate);
      if (viewMode === "month") return isSameMonth(txDate, currentDate);
      return isSameYear(txDate, currentDate);
    });
  }, [allTransactions, currentDate, viewMode]);

  const handleViewChange = (newMode: "day" | "month" | "year") => {
    navigate(`/transactions/${newMode}`);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
      {/* View Mode Selector */}
      <div className="flex justify-center gap-2">
        <Button
          variant={viewMode === "day" ? "default" : "outline"}
          onClick={() => handleViewChange("day")}
        >
          Día
        </Button>
        <Button
          variant={viewMode === "month" ? "default" : "outline"}
          onClick={() => handleViewChange("month")}
        >
          Mes
        </Button>
        <Button
          variant={viewMode === "year" ? "default" : "outline"}
          onClick={() => handleViewChange("year")}
        >
          Año
        </Button>
      </div>

      {/* Date Navigator Header */}
      <DateNavigator
        currentDate={currentDate}
        viewMode={viewMode}
        onPrev={handlePrev}
        onNext={handleNext}
      />

      <DataBox transactions={activeTransactions} />

      {/* Transactions List Area */}
      <div className="pt-6 space-y-4">
        <h3 className="text-lg font-bold text-foreground">
          {viewMode === "day"
            ? "Transacciones del Día"
            : "Historial de Transacciones"}
        </h3>

        {activeTransactions.length === 0 ? (
          <div className="text-center py-10 bg-card border rounded-lg border-dashed">
            <p className="text-muted-foreground">
              No hay transacciones registradas en esta fecha.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {activeTransactions.map((tx) => (
              <TransactionCard key={tx.id} transaction={tx} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
