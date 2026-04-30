import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import LogoLoader from "@/components/app/LogoLoader";

interface ProtectedRouteProps {
  isLogged?: boolean;
  userOnly?: boolean;
  adminOnly?: boolean;
}

export const ProtectedRoute = ({
  isLogged = false,
  userOnly = false,
  adminOnly = false,
}: ProtectedRouteProps) => {
  const user = useAuthStore((state) => state.user);
  const role = useAuthStore((state) => state.role);
  const isLoading = useAuthStore((state) => state.isLoading);

  if (isLoading || (user && !role)) {
    return <LogoLoader />;
  }

  if (!isLogged && user) {
    if (role === "admin") {
      return <Navigate to="/admin/statistics" replace />;
    } else {
      return <Navigate to="/transactions/month" replace />;
    }
  }

  if ((isLogged || userOnly || adminOnly) && !user) {
    return <Navigate to="/" replace />;
  }

  if (userOnly && role === "admin") {
    return <Navigate to="/admin/statistics" replace />;
  }

  if (adminOnly && role !== "admin") {
    return <Navigate to="/transactions/month" replace />;
  }

  return <Outlet />;
};
