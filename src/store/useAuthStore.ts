import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Session, User } from "@supabase/supabase-js";

// Strictly typed based on your public.profiles table columns
export interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  birthdate: string | null;
  role_id: string | null;
  avatar_url: string | null; // <-- Ready for your future avatar feature!
}

interface AuthState {
  user: User | null;
  session: Session | null;
  role: string | null;
  profile: Profile | null;
  isLoading: boolean;

  // Handy action for when a user edits their profile via your UI
  updateProfileState: (updates: Partial<Profile>) => void;

  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setProfile: (profile: Profile | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setRole: (role: string | null) => void; 
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      session: null,
      role: null,
      profile: null,
      isLoading: true,

      updateProfileState: (updates) =>
        set((state) => ({
          profile: state.profile ? { ...state.profile, ...updates } : null,
        })),

      setUser: (user) => set({ user }),
      setSession: (session) => set({ session }),
      setProfile: (profile) => set({ profile }),
      setIsLoading: (isLoading) => set({ isLoading }),
      setRole: (role) => set({ role }),
    }),
    {
      name: "mypocket-auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        session: state.session,
        user: state.user,
        role: state.role,
        profile: state.profile,
      }),
    },
  ),
);
