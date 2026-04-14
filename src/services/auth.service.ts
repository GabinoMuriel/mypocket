import { supabase } from "@/lib/supabase";

export const authService = {
    /**
     * Fetches the extended profile including the role name
     */
    async getUserProfile(userId: string) {
        const { data, error } = await supabase
            .from("profiles")
            .select(`
        *,
        roles (
          name
        )
      `)
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
    }
};