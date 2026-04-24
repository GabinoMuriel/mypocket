import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface DateNavigatorProps {
  currentDate: Date;
  viewMode: "day" | "month" | "year";
  onPrev: () => void;
  onNext: () => void;
}

export function DateNavigator({
  currentDate,
  viewMode,
  onPrev,
  onNext,
}: DateNavigatorProps) {
  // Dynamically format the text based on the view mode
  const getFormattedDate = () => {
    if (viewMode === "day")
      return format(currentDate, "d 'de' MMMM yyyy", { locale: es });
    if (viewMode === "month")
      return format(currentDate, "MMMM yyyy", { locale: es });
    return format(currentDate, "yyyy", { locale: es });
  };

  return (
    <div className="flex items-center justify-between bg-card p-4 rounded-lg border shadow-sm">
      <Button variant="ghost" size="icon" onClick={onPrev}>
        <ChevronLeft className="w-5 h-5" />
      </Button>
      <h2 className="text-xl font-semibold capitalize">{getFormattedDate()}</h2>
      <Button variant="ghost" size="icon" onClick={onNext}>
        <ChevronRight className="w-5 h-5" />
      </Button>
    </div>
  );
}
