import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Session, User } from '@supabase/supabase-js';

interface AuthState {
    user: User | null;
    session: Session | null;
    role: string | null; // e.g., 'admin', 'user', 'premium'
    isLoading: boolean;

    // Actions
    setAuth: (session: Session | null, user: User | null, role?: string | null) => void;
    clearAuth: () => void;

    // Computed (Getters)
    isLogged: () => boolean;
    isAdmin: () => boolean;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            session: null,
            role: null,
            isLoading: true,

            setAuth: (session, user, role = null) =>
                set({
                    session,
                    user,
                    role: role || get().role,
                    isLoading: false
                }),

            clearAuth: () =>
                set({
                    session: null,
                    user: null,
                    role: null,
                    isLoading: false
                }),

            // We use functions for computed values to ensure they react to state changes
            isLogged: () => !!get().session && !!get().user,

            isAdmin: () => get().role === 'admin',
        }),
        {
            name: 'mypocket-auth-storage', // Key in localStorage
            storage: createJSONStorage(() => localStorage),
            // We only persist the session and role, not the loading state
            partialize: (state) => ({
                session: state.session,
                user: state.user,
                role: state.role
            }),
        }
    )
);