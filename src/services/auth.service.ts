import type { SignupFormValues } from "@/components/app/forms/SignupForm";
import { supabase } from "@/lib/supabase";
import { useAuthStore, type Profile } from "@/store/useAuthStore";

export const authService = {
  async signup(data: SignupFormValues) {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error("No se pudo crear el usuario");

    return authData;
  },

  async login(credentials: { email: string; password: string }) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) throw error;
    return data;
  },

  async signout() {
    useAuthStore.getState().setUser(null);
    useAuthStore.getState().setSession(null);
    useAuthStore.getState().setProfile(null);

    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Supabase silent signout error:", error);
    }
  },

  async updateProfile(userId: string, data: Partial<Profile>) {
    const { error } = await supabase
      .from("profiles")
      .update(data)
      .eq("id", userId);

    if (error) throw error;

    return this.getUserProfile(userId);
  },

  /* GET PROFILE */
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

  /* EDIT PROFILE */

  async updatePassword(password: string) {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
  },

  async uploadAvatar(userId: string, file: File) {
    const fileExt = file.name.split(".").pop();
    const filePath = `${userId}/avatar.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data: publicUrlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    const finalUrl = `${publicUrlData.publicUrl}?t=${Date.now()}`;

    return this.updateProfile(userId, { avatar_url: finalUrl });
  },
};
