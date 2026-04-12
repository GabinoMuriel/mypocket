import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
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
    PlusCircle
} from "lucide-react";

import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/utils/categories";

/**
 * We map the string names from your categories.ts to the actual Lucide components.
 * This is necessary because you can't render a string like "utensils" directly as a component.
 */
const IconMap: Record<string, LucideIcon> = {
    "utensils": Utensils,
    "car": Car,
    "gift": Gift,
    "users": Users,
    "shopping-bag": ShoppingBag,
    "heart-pulse": HeartPulse,
    "more-horizontal": MoreHorizontal,
    "banknote": Banknote,
    "laptop": Laptop,
    "trending-up": TrendingUp,
    "plus-circle": PlusCircle,
};

interface CategorySelectProps {
    value: string;
    onChange: (val: string) => void;
    type: "income" | "expense";
}

export function CategorySelect({ value, onChange, type }: CategorySelectProps) {
    const categories = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

    return (
        <div className="space-y-2">
            <label className="text-sm font-medium">Categoría</label>
            <Select value={value} onValueChange={onChange}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                    {categories.map((cat) => {
                        // Get the component from the map, fallback to a generic icon if not found
                        const Icon = IconMap[cat.icon] || MoreHorizontal;

                        return (
                            <SelectItem key={cat.id} value={cat.id}>
                                <div className="flex items-center gap-3">
                                    {/* The colored circle */}
                                    <div
                                        className="size-3 rounded-full shrink-0"
                                        style={{ backgroundColor: cat.color }}
                                    />
                                    {/* The Icon component */}
                                    <Icon className="size-4 text-muted-foreground shrink-0" />
                                    {/* The Category Name */}
                                    <span>{cat.name}</span>
                                </div>
                            </SelectItem>
                        );
                    })}
                </SelectContent>
            </Select>
        </div>
    );
}