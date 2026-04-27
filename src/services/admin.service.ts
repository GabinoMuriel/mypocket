import { supabase } from "@/lib/supabase";
import type { ProfileFormValues } from "@/types/profile.schema";

// Define the strict TypeScript interface for the Admin view of a user
export interface AdminUserProfile {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  birthdate: string | null;
  created_at: string;
  role_name: string;
}

export interface GlobalStatistics {
  totalUsers: number;
  totalNormalUsers: number;
  totalPremiumUsers: number;
  totalAdminUsers: number;
}

export interface DailyStat {
  date: string;
  stat: number;
}

export const adminService = {
  async getAllUsers(): Promise<AdminUserProfile[]> {
    const { data, error } = await supabase.rpc("admin_get_users_with_emails");

    if (error) {
      console.error("Error fetching admin users:", error.message);
      throw error;
    }

    return data as AdminUserProfile[];
  },

  async deleteUser(userId: string): Promise<void> {
    const { error } = await supabase.rpc("admin_delete_user", {
      target_user_id: userId,
    });

    if (error) {
      console.error("Error deleting user:", error.message);
      throw error;
    }
  },

  async getGlobalStatistics(): Promise<GlobalStatistics> {
    const { data, error } = await supabase.rpc("admin_get_global_user_stats");

    if (error) {
      console.error("Error fetching global user stats:", error);
      throw error;
    }

    // The RPC returns an array with a single row, so we extract the first element
    const stats = data && data.length > 0 ? data[0] : null;

    return {
      totalUsers: Number(stats.total_users),
      totalNormalUsers: Number(stats.total_normal_users),
      totalPremiumUsers: Number(stats.total_premium_users),
      totalAdminUsers: Number(stats.total_admin_users),
    };
  },

  async updateUser(
    userId: string,
    data: Partial<ProfileFormValues>,
  ): Promise<boolean> {
    const { error } = await supabase.rpc("admin_update_user", {
      target_user_id: userId,
      p_first_name: data.first_name || null,
      p_last_name: data.last_name || null,
      p_phone: data.phone || null,
      p_address: data.address || null,
      p_city: data.city || null,
      p_postal_code: data.postal_code || null,
      p_birthdate: data.birthdate || null,
      p_role_name: data.role_name || null,
    });

    if (error) {
      console.error("Error in admin_update_user RPC:", error);
      throw error;
    }

    return true;
  },

  async getDailyLoginStats(month: number, year: number): Promise<DailyStat[]> {
    // Note: ensure your month parameter is 1-indexed (1-12) to match PostgreSQL
    const { data, error } = await supabase.rpc("admin_get_daily_login_stats", {
      target_month: month,
      target_year: year,
    });

    if (error) {
      console.error("Error fetching daily login stats:", error);
      throw error;
    }

    return data || [];
  },

  async getDailySignupStats(month: number, year: number): Promise<DailyStat[]> {
    // Note: ensure your month parameter is 1-indexed (1-12) to match PostgreSQL
    const { data, error } = await supabase.rpc("admin_get_daily_signup_stats", {
      target_month: month,
      target_year: year,
    });

    if (error) {
      console.error("Error fetching daily signup stats:", error);
      throw error;
    }

    return data || [];
  },
};
