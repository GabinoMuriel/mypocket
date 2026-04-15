import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

interface ProtectedRouteProps {
    adminOnly?: boolean;
}

export const ProtectedRoute = ({ adminOnly = false }: ProtectedRouteProps) => {
    // Using user and role from the store instead of computed booleans
    const { user, role, isLoading } = useAuthStore();

    // 1. Wait for Supabase to finish checking auth state
    if (isLoading) {
        return <div className="flex min-h-screen items-center justify-center">Cargando...</div>;
    }

    // 2. Unauthenticated users are kicked to the login screen
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // 3. Protect Admin-only routes by checking the explicit 'admin' string
    if (adminOnly && role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    // 4. Authorized users get to see the requested route
    return <Outlet />;
};