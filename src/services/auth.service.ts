import type { SignupFormValues } from "@/components/app/forms/SignupForm";
import { supabase } from "@/lib/supabase";
import type { Profile } from "@/store/useAuthStore";

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

  async updateProfile(userId: string, data: Partial<Profile>) {
    const { error } = await supabase
      .from("profiles")
      .update(data)
      .eq("id", userId);

    if (error) throw error;

    return this.getUserProfile(userId);
  },

  async updatePassword(password: string) {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
  },

  async uploadAvatar(userId: string, file: File) {
    const fileExt = file.name.split('.').pop();
    // Unique file name to avoid caching issues when replacing avatars
    const filePath = `${userId}/avatar-${Math.random()}.${fileExt}`;

    // 1. Upload to the 'avatars' bucket
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });

    if (uploadError) throw uploadError;

    // 2. Get the public URL of the uploaded image
    const { data: publicUrlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    // 3. Update the profile with the new URL
    return this.updateProfile(userId, { avatar_url: publicUrlData.publicUrl });
  },
};
