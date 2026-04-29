import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Import the LucideIcon type and the specific icons you used in your categories
import {
  type LucideIcon,
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
} from "lucide-react";

import type { Category } from "@/services/transaction.service";
import { useTranslation } from "react-i18next";

/**
 * We map the string names from your categories.ts to the actual Lucide components.
 * This is necessary because you can't render a string like "utensils" directly as a component.
 */
const IconMap: Record<string, LucideIcon> = {
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
};

interface CategorySelectProps {
  value: string;
  onChange: (val: string) => void;
  type: "income" | "expense";
  categories: Category[];
}

export function CategorySelect({
  value,
  onChange,
  type,
  categories,
}: CategorySelectProps) {
  // Filter the DB categories based on the active transaction type
  const activeCategories = categories.filter((c) => c.type === type);
  
  const { t } = useTranslation();

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={t('CATEGORY_SELECT.PLACEHOLDER')} />
      </SelectTrigger>
      <SelectContent>
        {activeCategories.map((cat) => {
          const IconComponent = cat.icon ? IconMap[cat.icon] : null;
          return (
            <SelectItem key={cat.id} value={cat.id}>
              <div className="flex items-center gap-2">
                {IconComponent && (
                  <IconComponent
                    className="w-4 h-4"
                    style={{ color: cat.color || "inherit" }}
                  />
                )}
                <span>{cat.name}</span>
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
