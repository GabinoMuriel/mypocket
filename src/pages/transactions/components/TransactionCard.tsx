import { TransactionModal } from "@/components/app/forms/TransactionModal";
import type { Transaction } from "@/services/transaction.service";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Utensils,
  Car,
  Gift,
  Users,
  ShoppingBag,
  HeartPulse,
  MoreHorizontal,
  Banknote,
  Laptop,
  TrendingUp,
  PlusCircle,
  MinusCircle,
  HelpCircle,
  Edit,
} from "lucide-react";

// Icon mapping (same as the one you used in CategorySelect)
const IconMap: Record<string, React.ElementType> = {
  utensils: Utensils,
  car: Car,
  gift: Gift,
  users: Users,
  "shopping-bag": ShoppingBag,
  "heart-pulse": HeartPulse,
  "more-horizontal": MoreHorizontal,
  banknote: Banknote,
  laptop: Laptop,
  "trending-up": TrendingUp,
  "plus-circle": PlusCircle,
  "minus-circle": MinusCircle,
};

interface TransactionCardProps {
  transaction: Transaction;
}

export function TransactionCard({ transaction }: TransactionCardProps) {
  const isIncome = transaction.type === "income";

  // Format the absolute amount
  const formattedAmount = new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(Number(transaction.amount));

  // Dynamically resolve the icon, fallback to HelpCircle if not found
  const IconComponent = transaction.categories?.icon
    ? IconMap[transaction.categories.icon]
    : HelpCircle;
  const iconColor = transaction.categories?.color || "#6b7280"; // Default gray

  return (
    <div className="flex items-center justify-between p-4 bg-card border rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        {/* Category Icon */}
        <div
          className="p-3 rounded-full flex items-center justify-center bg-opacity-20"
          style={{ backgroundColor: `${iconColor}20`, color: iconColor }}
        >
          <IconComponent className="w-5 h-5" />
        </div>

        {/* Details */}
        <div>
          <p className="font-semibold text-foreground">
            {transaction.categories?.name || "Sin Categoría"}
          </p>
          {transaction.description && (
            <p className="text-sm text-muted-foreground line-clamp-1">
              {transaction.description}
            </p>
          )}
        </div>
      </div>

      {/* Amount & Date */}
      <div className="text-right flex items-center gap-4">
        <div>
          <p className={`font-bold ${isIncome ? "text-[var(--secondary)]" : "text-[var(--destructive)]"}`}>
            {isIncome ? "+" : "-"}{formattedAmount}
          </p>
          <p className="text-xs text-muted-foreground">
            {format(new Date(transaction.date), "d MMM yyyy", { locale: es })}
          </p>
        </div>
        
        {/* 🚀 NEW: Edit Button triggering the Modal */}
        <TransactionModal 
          initialData={transaction}
          trigger={
            <button className="p-2 text-muted-foreground hover:text-primary transition-colors bg-muted/50 rounded-md">
              <Edit className="w-4 h-4" />
            </button>
          }
        />
      </div>
    </div>
  );
}
