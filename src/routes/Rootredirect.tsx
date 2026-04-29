import { Navigate } from "react-router-dom";
import LogoLoader from "@/components/app/LogoLoader";
import { useAuthStore } from "@/store/useAuthStore";

export const RootRedirect = () => {
  const user = useAuthStore((state) => state.user);
  const role = useAuthStore((state) => state.role);
  const isLoading = useAuthStore((state) => state.isLoading);

  if (isLoading) return <LogoLoader />;

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (role === "admin") {
    return <Navigate to="/admin/statistics" replace />;
  }

  return <Navigate to="/transactions/month" replace />;
};
