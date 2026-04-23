import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/useAuthStore";
import { authService } from "@/services/auth.service";
import { AppRouter } from "@/routes/AppRouter"; // <-- Import your router

export default function App() {
  const setUser = useAuthStore((state) => state.setUser);
  const setSession = useAuthStore((state) => state.setSession);
  const setIsLoading = useAuthStore((state) => state.setIsLoading);
  const user = useAuthStore((state) => state.user);
  const setProfile = useAuthStore((state) => state.setProfile);
  const setRole = useAuthStore((state) => state.setRole);


  // 1. First Effect: Handle ONLY Supabase Authentication & Session
  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      // It's safe to set this to true here, but ensure your store defaults to true as well
      setIsLoading(true);

      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (isMounted) {
          setSession(session);
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error("Session fetch error:", error);
      } finally {
        // 🚨 BULLETPROOF GUARANTEE: Turns off the loader unconditionally!
        setIsLoading(false);
      }
    };

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (isMounted) {
          setSession(session);
          setUser(session?.user ?? null);
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // 2. Second Effect: Handle ONLY Profile & Role fetching based on User state
  useEffect(() => {
    let isActive = true;

    if (!user) {
      setProfile(null);
      setRole(null); // Use the action instead of setState
      return;
    }

    const fetchProfile = async () => {
      try {
        const profileData = await authService.getUserProfile(user.id);

        if (!isActive) return; // Abort if the component unmounted or user changed

        if (profileData) {
          const { roles, ...profileFields } = profileData;
          setProfile(profileFields);
          setRole(roles?.name || 'user');
        }
      } catch (error) {
        console.error("Profile fetch error:", error);
      }
    };

    fetchProfile();

    return () => {
      isActive = false; // Cleanup function to prevent race conditions
    };
  }, [user, setProfile, setRole]);

  return <AppRouter />;
}
