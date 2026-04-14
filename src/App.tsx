import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/useAuthStore";
import { authService } from "@/services/auth.service";

function App() {
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

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Your Router/Pages will go here */}
      <h1 className="p-10 text-2xl font-bold text-center">¡Bienvenido a MyPocket!</h1>
    </div>
  );
}

export default App;