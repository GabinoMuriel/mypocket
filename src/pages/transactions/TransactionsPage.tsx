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
import { FloatingAddButton } from "./components/FloatingAddButton";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { TransactionModal } from "@/components/app/forms/TransactionModal";
import { PremiumMonthlyReport } from "./components/PremiumMonthlyReport";
import { es } from "date-fns/locale";

export default function TransactionsPage() {
  const { period } = useParams();
  const navigate = useNavigate();
  const viewMode = period === "month" || period === "year" ? period : "day";
  const [currentDate, setCurrentDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");

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
      // 1. Check Date Range
      const txDate = new Date(tx.date);
      let matchesDate = false;
      if (viewMode === 'day') matchesDate = isSameDay(txDate, currentDate);
      else if (viewMode === 'month') matchesDate = isSameMonth(txDate, currentDate);
      else matchesDate = isSameYear(txDate, currentDate);

      // 2. Check Search String
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm ||
        (tx.description?.toLowerCase().includes(searchLower)) ||
        (tx.categories?.name.toLowerCase().includes(searchLower));

      return matchesDate && matchesSearch;
    });
  }, [allTransactions, currentDate, viewMode, searchTerm]);

  const handleViewChange = (newMode: "day" | "month" | "year") => {
    navigate(`/transactions/${newMode}`);
  };

  const monthlyReportData = useMemo(() => {
    // 1. Force filter all transactions strictly for the current month
    const monthlyTxs = allTransactions.filter((tx) =>
      isSameMonth(new Date(tx.date), currentDate)
    );

    // 2. Initialize aggregators
    let totalIncome = 0;
    let totalExpense = 0;
    const categoryMap = new Map();

    // 3. Calculate totals and group by category AND type
    monthlyTxs.forEach((tx) => {
      const amount = Number(tx.amount);
      const catName = tx.categories?.name || "Other";

      if (tx.type === "income") {
        totalIncome += amount;
      } else {
        totalExpense += amount;
      }

      // FIX: Create a unique key merging type and category name
      const uniqueKey = `${tx.type}-${catName}`;

      const existing = categoryMap.get(uniqueKey) || { amount: 0, type: tx.type, name: catName };

      categoryMap.set(uniqueKey, {
        amount: existing.amount + amount,
        type: tx.type,
        name: catName // We store the clean name here to use it later
      });
    });

    // 4. Return the exact structure expected by MyDedicatedPDF
    return {
      monthName: format(currentDate, "MMMM yyyy", { locale: es }).replace(/^\w/, c => c.toUpperCase()),
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,

      // FIX: We now map over categoryMap.values() instead of entries()
      categories: Array.from(categoryMap.values()).map((data) => ({
        name: data.name,
        amount: data.amount,
        type: data.type,
        percentage: data.type === "income"
          ? (totalIncome > 0 ? (data.amount / totalIncome) * 100 : 0)
          : (totalExpense > 0 ? (data.amount / totalExpense) * 100 : 0),
      })),
      logoUrl: "/assets/logos/logo_small_ts.png"
    };
  }, [allTransactions, currentDate]);

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
        onNext={handleNext} onReset={() => setCurrentDate(new Date())} />

      <DataBox transactions={activeTransactions} />

      {/* Transactions List Area */}
      <div className="pt-6 space-y-4">
        <h3 className="text-lg font-bold text-foreground ">
          {viewMode === "day"
            ? "Transacciones del Día"
            : "Historial de Transacciones"}
        </h3>
        {viewMode === "month" && <PremiumMonthlyReport currentMonth={currentDate} transactionsData={monthlyReportData} />}

        {/* Search Input */}
        <div className="relative w-full sm:w-100">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar por categoría o descripción..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

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
      <FloatingAddButton component={TransactionModal} />
    </div>
  );
}
