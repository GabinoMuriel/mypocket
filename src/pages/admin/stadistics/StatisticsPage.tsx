import { useState, useEffect } from "react";
import {
  adminService,
  type DailyStat,
  type GlobalStatistics,
} from "@/services/admin.service";
import { Users, Loader2 } from "lucide-react";
import { subMonths, addMonths } from "date-fns";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { DateNavigator } from "@/components/app/DateNavigator";

export default function StatisticsPage() {
  const [stats, setStats] = useState<GlobalStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [loginData, setLoginData] = useState<DailyStat[]>([]);
  const [signupData, setSignupData] = useState<DailyStat[]>([]);

  const handlePrev = () => setCurrentDate((prev) => subMonths(prev, 1));
  const handleNext = () => setCurrentDate((prev) => addMonths(prev, 1));

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminService.getGlobalStatistics();
        setStats(data);
      } catch (err: unknown) {
        setError("Error al cargar las estadísticas globales.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        // JS getMonth() is 0-indexed (0-11), so we add 1 for Postgres (1-12)
        const targetMonth = currentDate.getMonth() + 1;
        const targetYear = currentDate.getFullYear();

        const loginStats = await adminService.getDailyLoginStats(
          targetMonth,
          targetYear,
        );
        const signupStats = await adminService.getDailySignupStats(
          targetMonth,
          targetYear,
        );
        setLoginData(loginStats);
        setSignupData(signupStats);
      } catch (error) {
        console.error("Failed to load statistics", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [currentDate]);

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
        <h1 className="text-3xl font-bold text-foreground">
          Estadísticas Globales
        </h1>
        <p className="text-muted-foreground mt-1 mb-6">
          Visión general del rendimiento y uso de la plataforma MyPocket.
        </p>
        <DateNavigator
          currentDate={currentDate}
          viewMode="month"
          onPrev={handlePrev}
          onNext={handleNext}
          onReset={function (): void {
            throw new Error("Function not implemented.");
          }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users Card */}
        <div className="bg-card border rounded-lg shadow-sm p-6 flex items-center gap-4">
          <div className="p-4 bg-[var(--general-background)] text-[var(--general)] rounded-full">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total</p>
            <h3 className="text-3xl font-bold text-foreground">
              {stats.totalUsers}
            </h3>
          </div>
        </div>

        <div className="bg-card border rounded-lg shadow-sm p-6 flex items-center gap-4">
          <div className="p-4 bg-[var(--user-background)] text-[var(--user)] rounded-full">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Normal</p>
            <h3 className="text-3xl font-bold text-foreground">
              {stats.totalNormalUsers}
            </h3>
          </div>
        </div>
        <div className="bg-card border rounded-lg shadow-sm p-6 flex items-center gap-4">
          <div className="p-4 bg-[var(--premium-background)] text-[var(--premium)] rounded-full">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Premium</p>
            <h3 className="text-3xl font-bold text-foreground">
              {stats.totalPremiumUsers}
            </h3>
          </div>
        </div>
        <div className="bg-card border rounded-lg shadow-sm p-6 flex items-center gap-4">
          <div className="p-4 bg-[var(--admin-background)] text-[var(--admin)] rounded-full">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Administradores
            </p>
            <h3 className="text-3xl font-bold text-foreground">
              {stats.totalAdminUsers}
            </h3>
          </div>
        </div>
      </div>

      {/* Unique Logins Graph Panel */}
      <div className="bg-card border rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-6">
          Inicios de Sesión Únicos por Día
        </h2>

        {isLoading ? (
          <div className="h-[300px] flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : loginData.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            No hay datos registrados para este mes.
          </div>
        ) : (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={loginData}
                margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e5e7eb"
                />
                <XAxis
                  dataKey="date"
                  tickFormatter={(val) => {
                    // Extracts just the day from 'YYYY-MM-DD' for a cleaner X-axis
                    return val.split("-")[2];
                  }}
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  labelFormatter={(label) => `Fecha: ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="unique_logins"
                  name="Usuarios Únicos"
                  stroke="var(--admin)" // A nice violet color matching your admin badges
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
        <div />
      </div>
      {/* Signups Graph Panel */}
      <div className="bg-card border rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-6">
          Registros de usuarios por Día
        </h2>
        {isLoading ? (
          <div className="h-[300px] flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : signupData.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            No hay datos registrados para este mes.
          </div>
        ) : (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={signupData}
                margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e5e7eb"
                />
                <XAxis
                  dataKey="date"
                  tickFormatter={(val) => {
                    // Extracts just the day from 'YYYY-MM-DD' for a cleaner X-axis
                    return val.split("-")[2];
                  }}
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  labelFormatter={(label) => `Fecha: ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="new_signups"
                  name="Registros"
                  stroke="var(--admin)" // A nice violet color matching your admin badges
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
