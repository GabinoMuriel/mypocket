import { supabase } from "@/lib/supabase";

// Define the strict TypeScript interface for the Admin view of a user
export interface AdminUserProfile {
    id: string;
    email: string;
    first_name: string | null;
    last_name: string | null;
    phone: string | null;
    created_at: string;
    role_name: string;
}

export interface GlobalStatistics {
    totalUsers: number;
    totalTransactions: number;
    totalIncomeVolume: number;
    totalExpenseVolume: number;
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
    }
};