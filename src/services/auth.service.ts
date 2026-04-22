import type { SignupFormValues } from "@/components/app/forms/SignupForm";
import { supabase } from "@/lib/supabase";

export const authService = {
  /**
   * Fetches the extended profile including the role name
   */
  async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from("profiles")
      .select(
        `
        *,
        roles (
          name
        )
      `,
      )
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching profile:", error.message);
      return null;
    }

    return data;
  },

  async signOut() {
    await supabase.auth.signOut();
  },

  async login(credentials: { email: string; password: string }) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) throw error;
    return data;
  },

  async signup(data: SignupFormValues) {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error("No se pudo crear el usuario");

    // Profile UPDATE removed to respect RLS constraints before email verification
    return authData;
  },
};
