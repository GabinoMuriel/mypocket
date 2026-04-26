import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

export const PublicRoute = () => {
    // Pulling exact properties from your updated AuthState interface
    const { user, isLoading } = useAuthStore();

    if (isLoading) {
        return <div className="flex min-h-screen items-center justify-center">Cargando...</div>;
    }

    if (user) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};