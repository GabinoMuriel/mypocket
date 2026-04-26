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
    totalTransactions: number;
    totalIncomeVolume: number;
    totalExpenseVolume: number;
}

export interface DailyLoginStat {
    date: string;
    unique_logins: number;
}

export const adminService = {
    async getAllUsers(): Promise<AdminUserProfile[]> {
        const { data, error } = await supabase.rpc('admin_get_users_with_emails');

        if (error) {
            console.error("Error fetching admin users:", error.message);
            throw error;
        }

        return data as AdminUserProfile[];
    },

    async deleteUser(userId: string): Promise<void> {
        const { error } = await supabase.rpc('admin_delete_user', {
            target_user_id: userId
        });

        if (error) {
            console.error("Error deleting user:", error.message);
            throw error;
        }
    },

    async getGlobalStatistics(): Promise<GlobalStatistics> {
        // 1. Efficiently count total users without downloading rows
        const { count: totalUsers, error: usersError } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true });

        if (usersError) throw usersError;

        // 2. Fetch all transaction amounts and types to calculate volume
        // As an admin, RLS allows you to see everyone's transactions!
        const { data: transactions, error: txError } = await supabase
            .from('transactions')
            .select('amount, type');

        if (txError) throw txError;

        let totalIncomeVolume = 0;
        let totalExpenseVolume = 0;

        transactions?.forEach(tx => {
            // Grouping by the transaction_type column we added earlier
            if (tx.type === 'income') {
                totalIncomeVolume += Number(tx.amount);
            } else {
                totalExpenseVolume += Number(tx.amount);
            }
        });

        return {
            totalUsers: totalUsers || 0,
            totalTransactions: transactions?.length || 0,
            totalIncomeVolume,
            totalExpenseVolume
        };
    },

    async updateUser(userId: string, data: Partial<ProfileFormValues>): Promise<boolean> {
        console.log("holi")
        const { error } = await supabase.rpc('admin_update_user', {
            target_user_id: userId,
            p_first_name: data.first_name || null,
            p_last_name: data.last_name || null,
            p_phone: data.phone || null,
            p_address: data.address || null,
            p_city: data.city || null,
            p_postal_code: data.postal_code || null,
            p_birthdate: data.birthdate || null
        });

        if (error) {
            console.error("Error in admin_update_user RPC:", error);
            throw error;
        }

        return true;
    },

    async getDailyLoginStats(month: number, year: number): Promise<DailyLoginStat[]> {
    // Note: ensure your month parameter is 1-indexed (1-12) to match PostgreSQL
    const { data, error } = await supabase.rpc('admin_get_daily_login_stats', {
        target_month: month,
        target_year: year
    });

    if (error) {
        console.error("Error fetching daily login stats:", error);
        throw error;
    }

    return data || [];
}
};