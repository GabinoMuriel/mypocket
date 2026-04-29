import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import {
  Download,
  Eye,
  Star,
  EyeOff,
  FileText,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { format } from "date-fns";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { PremiumPDFReport, type ReportData } from "./PremiumPDFReport";
import { es, enUS } from "date-fns/locale";
import MiniLogoLoader from "@/components/app/MiniLogoLoader";
import { useTranslation } from "react-i18next";

interface PremiumPDFReportProps {
  currentDate: Date;
  transactionsData: ReportData;
  viewMode: "month" | "year";
}

export function PremiumPDFReportGenerator({
  currentDate,
  transactionsData,
  viewMode,
}: PremiumPDFReportProps) {
  const role = useAuthStore((state) => state.role);
  const hasPremiumAccess = role === "premium" || role === "admin";

  const [isOpen, setIsOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const { t, i18n } = useTranslation();
  const dateLocale = i18n.language === "en" ? enUS : es;

  const isYear = viewMode === "year";
  const reportTitle = isYear
    ? `${t('PREMIUM_PDF_GENERATOR.TITLE_YEARLY')} - ${format(currentDate, "yyyy")}`
    : `${t('PREMIUM_PDF_GENERATOR.TITLE_MONTHLY')} - ${format(currentDate, "MMMM yyyy", { locale: dateLocale })}`;
  
  const downloadFileName = isYear
    ? `MyPocket_Report_${format(currentDate, "yyyy")}.pdf`
    : `MyPocket_Report_${format(currentDate, "MM_yyyy")}.pdf`;

  return (
    <div className="space-y-4">
      {/* Main Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full p-4 bg-card border rounded-lg shadow-sm hover:bg-accent transition-colors"
      >
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-[var(--premium)]" />
          <span className="font-semibold text-[var(--premium)]">
            {reportTitle}
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5" />
        ) : (
          <ChevronDown className="w-5 h-5" />
        )}
      </button>

      {isOpen && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
          {!hasPremiumAccess ? (
            <div className="p-4 bg-[var(--premium-background)] border border-[var(--premium)] rounded-lg text-[var(--premium)] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500" />
                <div>
                  <h4 className="font-semibold text-sm">{t('PREMIUM_PDF_GENERATOR.EXCLUSIVE_REPORT')}</h4>
                  <p className="text-xs mt-0.5">
                    {t('PREMIUM_PDF_GENERATOR.UPGRADE_PROMPT')}
                  </p>
                </div>
              </div>
              <button
                disabled
                className="px-3 py-1.5 bg-amber-200 text-amber-800 rounded-md text-sm opacity-50 cursor-not-allowed"
              >
                {t('PREMIUM_PDF_GENERATOR.LOCKED')}
              </button>
            </div>
          ) : (
            <div className="space-y-4 p-4 border rounded-lg bg-card mt-2">
              <div className="flex flex-wrap items-center gap-4">
                {/* 2- Preview Button with Loader logic */}
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex items-center gap-2 px-4 py-2 bg-[var(--premium-background)] text-[var(--premium)] border border-[var(--premium)] rounded-md shadow-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {showPreview ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                  {showPreview
                    ? t('PREMIUM_PDF_GENERATOR.HIDE_PREVIEW')
                    : t('PREMIUM_PDF_GENERATOR.SHOW_PREVIEW')}
                </button>

                {/* 1- Download Link with Loader and Disabled State */}
                <PDFDownloadLink
                  document={<PremiumPDFReport data={transactionsData} />}
                  fileName={downloadFileName}
                  style={{ textDecoration: "none" }}
                >
                  {({ loading }) => (
                    <button
                      disabled={loading}
                      className={`flex items-center gap-2 px-4 py-2 bg-[var(--premium-background)] text-[var(--premium)] border border-[var(--premium)] rounded-md shadow-sm transition-opacity ${
                        loading
                          ? "bg-[var(--premium-background)]/50 text-[var(--premium)]/50 border border-[var(--premium)]/50 cursor-not-allowed"
                          : "bg-[var(--premium-background)] text-[var(--premium)] border border-[var(--premium)]"
                      }`}
                    >
                      {loading ? (
                        <>
                          <MiniLogoLoader className="w-4 h-4" />
                          <span>{t('PREMIUM_PDF_GENERATOR.GENERATING')}</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          <span>{t('PREMIUM_PDF_GENERATOR.DOWNLOAD_FILE')}</span>
                        </>
                      )}
                    </button>
                  )}
                </PDFDownloadLink>
              </div>

              {/* PDF Viewer with its own internal loading state */}
              {showPreview && (
                <div className="w-full h-[600px] border rounded-lg overflow-hidden shadow-sm mt-4 animate-in fade-in duration-300 relative">
                  <PDFViewer
                    width="100%"
                    height="100%"
                    showToolbar={true}
                    className="border-none"
                  >
                    <PremiumPDFReport data={transactionsData} />
                  </PDFViewer>

                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
