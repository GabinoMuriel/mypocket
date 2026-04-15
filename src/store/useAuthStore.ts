import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Session, User } from '@supabase/supabase-js';

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
    // avatar_url: string | null; // <-- Ready for your future avatar feature!
}

interface AuthState {
    user: User | null;
    session: Session | null;
    role: string | null;
    profile: Profile | null; // Added your extended profile data
    isLoading: boolean;

    // Actions updated to accept the profile
    setAuth: (session: Session | null, user: User | null, role?: string | null, profile?: Profile | null) => void;
    clearAuth: () => void;

    // Handy action for when a user edits their profile via your UI
    updateProfileState: (updates: Partial<Profile>) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            session: null,
            role: null,
            profile: null,
            isLoading: true,

            setAuth: (session, user, role = null, profile = null) =>
                set({
                    session,
                    user,
                    role: role || get().role,
                    profile: profile || get().profile,
                    isLoading: false
                }),

            clearAuth: () =>
                set({
                    session: null,
                    user: null,
                    role: null,
                    profile: null, // Clear profile on logout
                    isLoading: false
                }),

            updateProfileState: (updates) => set((state) => ({
                profile: state.profile ? { ...state.profile, ...updates } : null
            })),
        }),
        {
            name: 'mypocket-auth-storage',
            storage: createJSONStorage(() => localStorage),
            // Cache the profile alongside session and role so it survives page reloads
            partialize: (state) => ({
                session: state.session,
                user: state.user,
                role: state.role,
                profile: state.profile
            }),
        }
    )
);