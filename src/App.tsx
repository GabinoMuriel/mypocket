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
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (isMounted && session) {
          setSession(session);
          setUser(session.user);

          // 2. Use your existing service method!
          const profileData = await authService.getUserProfile(session.user.id);

          if (profileData) {
            // 3. Separate the joined 'roles' object from the rest of the profile fields
            const { roles, ...profileFields } = profileData;

            setProfile(profileFields); // Strictly matches your Profile interface

            // Directly update the role state in Zustand (assuming you don't have a specific setRole action)
            useAuthStore.setState({ role: roles?.name || 'user' });
          }
        }
      } catch (error) {
        console.error("Session initialization error:", error);
      } finally {
        setIsLoading(false); // Bulletproof guarantee
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (isMounted) {
          setSession(session);
          setUser(session?.user ?? null);

          // Keep synced during login/signup events
          if (session?.user) {
            const profileData = await authService.getUserProfile(session.user.id);
            if (profileData) {
              const { roles, ...profileFields } = profileData;
              setProfile(profileFields);
              useAuthStore.setState({ role: roles?.name || 'user' });
            }
          } else {
            // Clear memory on logout
            setProfile(null);
            useAuthStore.setState({ role: null });
          }
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [setSession, setUser, setProfile, setIsLoading]);

  return <AppRouter />;
}
