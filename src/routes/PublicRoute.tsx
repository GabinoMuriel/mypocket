import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

export const PublicRoute = () => {
    // Pulling exact properties from your updated AuthState interface
    const { user, isLoading } = useAuthStore();

    // Prevent redirects while checking session. (UI in Spanish!)
    if (isLoading) {
        return <div className="flex min-h-screen items-center justify-center">Cargando...</div>;
    }

    // If a user exists, they are logged in. Redirect to dashboard.
    if (user) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};