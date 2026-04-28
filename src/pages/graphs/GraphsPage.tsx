import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DateNavigator } from "@/components/app/DateNavigator";
import { Button } from "@/components/ui/button";
import { useTransactionStore } from "@/store/useTransactionStore";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import {
  addMonths,
  subMonths,
  addYears,
  subYears,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  format,
  isSameMonth,
  isSameYear,
} from "date-fns";
import type {
  Formatter,
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import { FloatingAddButton } from "../transactions/components/FloatingAddButton";
import { TransactionModal } from "@/components/app/forms/TransactionModal";
import { DataBox } from "@/components/app/DataBox";

export default function GraphsPage() {
  const { period } = useParams();
  const navigate = useNavigate();

  // 1. Restrict viewMode to ONLY month or year
  const viewMode = period === "year" ? "year" : "month";
  const [currentDate, setCurrentDate] = useState(new Date());

  const fetchTransactions = useTransactionStore(
    (state) => state.fetchTransactions,
  );
  const allTransactions = useTransactionStore((state) => state.transactions);

  // 2. Navigation Handlers
  const handleViewChange = (newMode: "month" | "year") => {
    navigate(`/graphs/${newMode}`);
  };

  const handlePrev = () => {
    setCurrentDate((prev) =>
      viewMode === "month" ? subMonths(prev, 1) : subYears(prev, 1),
    );
  };

  const handleNext = () => {
    setCurrentDate((prev) =>
      viewMode === "month" ? addMonths(prev, 1) : addYears(prev, 1),
    );
  };

  // 3. Dynamic Fetching (Same high-performance strategy)
  useEffect(() => {
    const start =
      viewMode === "year"
        ? startOfYear(currentDate)
        : startOfMonth(currentDate);
    const end =
      viewMode === "year" ? endOfYear(currentDate) : endOfMonth(currentDate);
    fetchTransactions(format(start, "yyyy-MM-dd"), format(end, "yyyy-MM-dd"));
  }, [viewMode, fetchTransactions, currentDate]);

  // 4. Local Filtering
  const activeTransactions = useMemo(() => {
    return allTransactions.filter((tx) => {
      const txDate = new Date(tx.date);
      return viewMode === "month"
        ? isSameMonth(txDate, currentDate)
        : isSameYear(txDate, currentDate);
    });
  }, [allTransactions, currentDate, viewMode]);

  // 🚀 5. DATA AGGREGATION FOR THE GRAPHS
  const { expensesData, incomesData, totalsData } = useMemo(() => {
    const expenses: Record<string, any> = {};
    const incomes: Record<string, any> = {};
    let totalExp = 0;
    let totalInc = 0;

    activeTransactions.forEach((t) => {
      const amount = Number(t.amount);
      const catName = t.categories?.name || "Otros";
      const color = t.categories?.color || "#8884d8"; // Fallback color

      if (t.type === "expense") {
        totalExp += amount;
        if (!expenses[catName])
          expenses[catName] = { name: catName, value: 0, color: color };
        expenses[catName].value += amount;
      } else {
        totalInc += amount;
        if (!incomes[catName])
          incomes[catName] = { name: catName, value: 0, color: color };
        incomes[catName].value += amount;
      }
    });

    return {
      expensesData: Object.values(expenses),
      incomesData: Object.values(incomes),
      totalsData: [
        { name: "Gastos", value: totalExp, color: "#ef4444" }, // Tailwind red-500
        { name: "Ingresos", value: totalInc, color: "#22c55e" }, // Tailwind green-500
      ],
    };
  }, [activeTransactions]);

  // Custom Formatter for the Tooltip
  const formatCurrency: Formatter<ValueType, NameType> = (value, name) => {
    const numericValue = typeof value === "number" ? value : Number(value) || 0;

    return [
      new Intl.NumberFormat("es-ES", {
        style: "currency",
        currency: "EUR",
      }).format(numericValue),
      name,
    ];
  };

  const renderCustomLabel = ({ percent }: any) => {
    if (percent < 0.01) {
      return "<1%";
    }
    return `${(percent * 100).toFixed(1)}%`;
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-8">
      {/* View Mode Selector (No 'Day' Option) */}
      <div className="flex justify-center gap-2">
        <Button
          variant={viewMode === "month" ? "default" : "outline"}
          onClick={() => handleViewChange("month")}
        >
          Mensual
        </Button>
        <Button
          variant={viewMode === "year" ? "default" : "outline"}
          onClick={() => handleViewChange("year")}
        >
          Anual
        </Button>
      </div>

      <DateNavigator
        currentDate={currentDate}
        viewMode={viewMode}
        onPrev={handlePrev}
        onNext={handleNext}
        onReset={() => setCurrentDate(new Date())}
      />

      <DataBox transactions={activeTransactions} />

      {/* 🚀 THE 3 CIRCULAR GRAPHS */}
      {activeTransactions.length === 0 ? (
        <div className="text-center py-10 bg-card border rounded-lg border-dashed">
          <p className="text-muted-foreground">
            No hay datos para mostrar en este periodo.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 2. Incomes by Category */}
          <div className="bg-card border rounded-lg shadow-sm p-4 flex flex-col items-center">
            <h3 className="text-lg font-bold mb-4">Ingresos por Categoría</h3>
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={incomesData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={0}
                    outerRadius={70}
                    label={renderCustomLabel}
                    labelLine={true}
                    cornerRadius={5}
                    minAngle={10}
                  >
                    {incomesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={formatCurrency} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 1. Expenses by Category */}
          <div className="bg-card border rounded-lg shadow-sm p-4 flex flex-col items-center">
            <h3 className="text-lg font-bold mb-4">Gastos por Categoría</h3>
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expensesData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={0}
                    outerRadius={70}
                    label={renderCustomLabel}
                    labelLine={true}
                    cornerRadius={5}
                    minAngle={10}
                  >
                    {expensesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={formatCurrency} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 3. Total Expenses vs Total Incomes */}
          <div className="bg-card border rounded-lg shadow-sm p-4 flex flex-col items-center">
            <h3 className="text-lg font-bold mb-4">Balance Total</h3>
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={totalsData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={0}
                    outerRadius={70}
                    label={renderCustomLabel}
                    labelLine={true}
                    cornerRadius={5}
                    minAngle={10}
                  >
                    {totalsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={formatCurrency} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
      <FloatingAddButton component={TransactionModal} />
    </div>
  );
}
