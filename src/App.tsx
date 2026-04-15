import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/useAuthStore";
import { authService } from "@/services/auth.service";
import { AppRouter } from "@/routes/AppRouter"; // <-- Import your router

export default function App() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  useEffect(() => {
    // 1. Check active session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        handleAuthChange(session);
      }
    });

    // 2. Listen for auth changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
          handleAuthChange(session);
        } else {
          clearAuth();
        }
      }
    );

    async function handleAuthChange(session: any) {
      const user = session.user;
      // Fetch the role from our custom profiles table
      const profile = await authService.getUserProfile(user.id);

      // Update our Zustand store
      // We assume the profile query returns { roles: { name: 'admin' } }
      const roleName = profile?.roles?.name || 'user';

      setAuth(session, user, roleName);
    }

    return () => {
      subscription.unsubscribe();
    };
  }, [setAuth, clearAuth]);

  // 3. Render the application router
  return <AppRouter />;
}