import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/useAuthStore";
import { authService } from "@/services/auth.service";
import { AppRouter } from "@/routes/AppRouter"; // <-- Import your router

export default function App() {
  const setUser = useAuthStore((state) => state.setUser);
  const setSession = useAuthStore((state) => state.setSession);
  const setProfile = useAuthStore((state) => state.setProfile);
  const setIsLoading = useAuthStore((state) => state.setIsLoading);

  useEffect(() => {
    
    const initializeApp = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        setSession(session);
        setUser(session.user);
        try {
          const profileData = await authService.getUserProfile(session.user.id);
          setProfile(profileData);
        } catch (error) {
          console.error("Error fetching profile on mount:", error);
        }
      }

      // ALWAYS turn off loading after the first check finishes!
      setIsLoading(false);
    };

    initializeApp();


    // This listener fires on initial load, login, logout, and token refresh
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      
      if (event === 'INITIAL_SESSION') return;

      setSession(session);
      setUser(session?.user || null);

      if (session?.user) {
        try {
          const profileData = await authService.getUserProfile(session.user.id);
          setProfile(profileData);
        } catch (error) {
          console.error("Error fetching profile on app load:", error);
        }
      } else {
        // Clear profile on logout
        setProfile(null);
      }

      // Stop the initial loading screen
      setIsLoading(false);
    });

    // Fallback: Ensure loading stops if there is no active session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setSession, setUser, setProfile, setIsLoading]);

  return <AppRouter />;
}
