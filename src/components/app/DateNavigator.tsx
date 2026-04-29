import { ChevronLeft, ChevronRight, CalendarSync } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { useTranslation } from "react-i18next";

interface DateNavigatorProps {
  currentDate: Date;
  viewMode: 'day' | 'month' | 'year';
  onPrev: () => void;
  onNext: () => void;
  onReset: () => void;
}

export function DateNavigator({ currentDate, viewMode, onPrev, onNext, onReset }: DateNavigatorProps) {
  const { t, i18n } = useTranslation();
  const dateLocale = i18n.language === "en" ? enUS : es;

  const getFormattedDate = () => {
    if (viewMode === 'day') return format(currentDate, i18n.language === "en" ? "MMMM do, yyyy" : "d 'de' MMMM yyyy", { locale: dateLocale });
    if (viewMode === 'month') return format(currentDate, "MMMM yyyy", { locale: dateLocale });
    return format(currentDate, "yyyy", { locale: dateLocale });
  };

  return (
    <div className="flex items-center justify-between bg-card p-4 rounded-lg border shadow-sm">
      <Button variant="ghost" size="icon" onClick={onPrev}>
        <ChevronLeft className="w-5 h-5" />
      </Button>

      <div className="flex items-center gap-3">
        <h2 className="text-xl font-semibold capitalize">{getFormattedDate()}</h2>
        {/* Return to Today Button */}
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-primary"
          onClick={onReset}
          title={t('DATE_NAVIGATOR.BACK_TO_TODAY')}
        >
          <CalendarSync className="w-4 h-4" />
        </Button>
      </div>

      <Button variant="ghost" size="icon" onClick={onNext}>
        <ChevronRight className="w-5 h-5" />
      </Button>
    </div>
  );
}