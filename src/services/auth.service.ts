import type { SignupFormValues } from "@/components/forms/SignupForm";
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
    },

    login: async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            throw error;
        }

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

        // 2. The DB trigger 'on_auth_user_created' just created an empty profile row.
        // We instantly UPDATE that row mapping the camelCase form data to the snake_case DB columns.
        const { error: profileError } = await supabase
            .from('profiles')
            .update({
                first_name: data.firstName,
                last_name: data.lastName,
                phone: data.phone || null,
                city: data.city || null,
                postal_code: data.postalCode || null,
                address: data.address || null,
                birthdate: data.birthdate || null,
            })
            .eq('id', authData.user.id);

        if (profileError) throw profileError;

        return authData;
    },
};