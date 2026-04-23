import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";

interface ProtectedRouteProps {
  adminOnly?: boolean;
}

export const ProtectedRoute = ({ adminOnly = false }: ProtectedRouteProps) => {
  const user = useAuthStore((state) => state.user);
  const profile = useAuthStore((state) => state.profile);
  const role = useAuthStore((state) => state.role);
  const isLoading = useAuthStore((state) => state.isLoading);
  const location = useLocation();

  // 1. Wait for Supabase to finish checking auth state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Cargando...
      </div>
    );
  }

  // 2. Unauthenticated users are kicked to the login screen
  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (profile && !profile.first_name && location.pathname !== "/profile") {
    return <Navigate to="/profile" replace />;
  }

  // 3. Protect Admin-only routes by checking the explicit 'admin' string
  if (adminOnly && role !== "admin") {
    return <Navigate to="/transactions" replace />;
  }

  // 4. Authorized users get to see the requested route
  return <Outlet />;
};
