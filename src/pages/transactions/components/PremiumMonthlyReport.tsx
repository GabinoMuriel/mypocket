import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { Download, Eye, Star, EyeOff, FileText, ChevronDown, ChevronUp } from "lucide-react";
import { format } from "date-fns";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { MyDedicatedPDF } from "./MonthlyReportPDF";

interface MonthlyReportButtonProps {
    currentMonth: Date;
    transactionsData: any[];
}

export function PremiumMonthlyReport({ currentMonth, transactionsData }: MonthlyReportButtonProps) {
    const role = useAuthStore((state) => state.role);
    const hasPremiumAccess = role === "premium" || role === "admin";

    const [isOpen, setIsOpen] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    return (
        <div className="space-y-4">
            {/* Main Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full p-4 bg-card border rounded-lg shadow-sm hover:bg-accent transition-colors"
            >
                <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    <span className="font-semibold text-foreground">
                        Informe Mensual PDF - {format(currentMonth, 'MMMM yyyy')}
                    </span>
                </div>
                {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>

            {/* Expandable Content Area */}
            {isOpen && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">

                    {!hasPremiumAccess ? (
                        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Star className="w-5 h-5 text-amber-500" />
                                <div>
                                    <h4 className="font-semibold text-sm">Informe Exclusivo</h4>
                                    <p className="text-xs mt-0.5">Actualiza a Premium para generar y descargar tus informes.</p>
                                </div>
                            </div>
                            <button disabled className="px-3 py-1.5 bg-amber-200 text-amber-800 rounded-md text-sm opacity-50 cursor-not-allowed">
                                Bloqueado
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4 p-4 border rounded-lg bg-card mt-2">
                            {/* Active UI for Premium/Admin Users */}
                            <div className="flex flex-wrap items-center gap-4">

                                <button
                                    onClick={() => setShowPreview(!showPreview)}
                                    className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-md shadow-sm hover:opacity-90 transition-opacity"
                                >
                                    {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    {showPreview ? "Ocultar Previsualización" : "Previsualizar PDF"}
                                </button>

                                <PDFDownloadLink
                                    document={<MyDedicatedPDF data={transactionsData} />}
                                    fileName={`MiBolsillo_Reporte_${format(currentMonth, 'MM_yyyy')}.pdf`}
                                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md shadow-sm hover:opacity-90 transition-opacity"
                                >
                                    {({ loading }) => (
                                        <>
                                            <Download className="w-4 h-4" />
                                            {loading ? "Generando..." : `Descargar Archivo`}
                                        </>
                                    )}
                                </PDFDownloadLink>
                            </div>

                            {/* PDF Viewer */}
                            {showPreview && (
                                <div className="w-full h-[600px] border rounded-lg overflow-hidden shadow-sm mt-4 animate-in fade-in duration-300">
                                    <PDFViewer width="100%" height="100%">
                                        <MyDedicatedPDF data={transactionsData} />
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