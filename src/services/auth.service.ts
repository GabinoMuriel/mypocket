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
    // 1. Create the user in auth.users
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error("Error al crear el usuario.");

    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        first_name: data.firstName,
        last_name: data.lastName,
        phone: data.phone || null,
        city: data.city || null,
        postal_code: data.postalCode || null,
        address: data.address || null,
        birthdate: data.birthdate || null,
      })
      .eq("id", authData.user.id);

    if (profileError) throw profileError;

    return authData;
  },
};
