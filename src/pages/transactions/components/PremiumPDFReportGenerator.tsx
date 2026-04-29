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
import { es } from "date-fns/locale";
import MiniLogoLoader from "@/components/app/MiniLogoLoader";

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

  const isYear = viewMode === "year";
  const reportTitle = isYear
    ? `Informe Anual PDF - ${format(currentDate, "yyyy")}`
    : `Informe Mensual PDF - ${format(currentDate, "MMMM yyyy", { locale: es })}`;
  const downloadFileName = isYear
    ? `MyPocket_Reporte_Anual_${format(currentDate, "yyyy")}.pdf`
    : `MyPocket_Reporte_Mensual_${format(currentDate, "MM_yyyy")}.pdf`;

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
                  <h4 className="font-semibold text-sm">Informe Exclusivo</h4>
                  <p className="text-xs mt-0.5">
                    Actualiza a Premium para generar y descargar tus informes.
                  </p>
                </div>
              </div>
              <button
                disabled
                className="px-3 py-1.5 bg-amber-200 text-amber-800 rounded-md text-sm opacity-50 cursor-not-allowed"
              >
                Bloqueado
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
                    ? "Ocultar Previsualización"
                    : "Previsualizar PDF"}
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
                          <span>Generando...</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          <span>Descargar Archivo</span>
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
