import { useState, useEffect } from "react";
import { adminService, type GlobalStatistics } from "@/services/admin.service";
import { Users, TrendingUp, TrendingDown, ArrowLeftRight, Loader2 } from "lucide-react";

export default function StatisticsPage() {
    const [stats, setStats] = useState<GlobalStatistics | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await adminService.getGlobalStatistics();
                setStats(data);
            } catch (err: any) {
                setError("Error al cargar las estadísticas globales.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, []);

    // Helper function to format global money volumes
    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(amount);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !stats) {
        return (
            <div className="max-w-4xl mx-auto py-8 px-4">
                <div className="text-center text-red-600 p-4 bg-red-50 rounded-lg border border-red-200">
                    {error || "Datos no disponibles."}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto py-8 px-4 space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-foreground">Estadísticas Globales</h1>
                <p className="text-muted-foreground mt-1">
                    Visión general del rendimiento y uso de la plataforma MyPocket.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Users Card */}
                <div className="bg-card border rounded-lg shadow-sm p-6 flex items-center gap-4">
                    <div className="p-4 bg-blue-100 text-blue-600 rounded-full">
                        <Users className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Usuarios Totales</p>
                        <h3 className="text-3xl font-bold text-foreground">{stats.totalUsers}</h3>
                    </div>
                </div>

                {/* Total Transactions Card */}
                <div className="bg-card border rounded-lg shadow-sm p-6 flex items-center gap-4">
                    <div className="p-4 bg-violet-100 text-violet-600 rounded-full">
                        <ArrowLeftRight className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Transacciones</p>
                        <h3 className="text-3xl font-bold text-foreground">{stats.totalTransactions}</h3>
                    </div>
                </div>

                {/* Global Income Volume Card */}
                <div className="bg-card border rounded-lg shadow-sm p-6 flex items-center gap-4">
                    <div className="p-4 bg-green-100 text-green-600 rounded-full">
                        <TrendingUp className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Volumen de Ingresos</p>
                        <h3 className="text-2xl font-bold text-green-600">
                            {formatCurrency(stats.totalIncomeVolume)}
                        </h3>
                    </div>
                </div>

                {/* Global Expense Volume Card */}
                <div className="bg-card border rounded-lg shadow-sm p-6 flex items-center gap-4">
                    <div className="p-4 bg-red-100 text-red-600 rounded-full">
                        <TrendingDown className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Volumen de Gastos</p>
                        <h3 className="text-2xl font-bold text-red-600">
                            {formatCurrency(stats.totalExpenseVolume)}
                        </h3>
                    </div>
                </div>
            </div>
        </div>
    );
}