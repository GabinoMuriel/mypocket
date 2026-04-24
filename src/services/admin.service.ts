import { supabase } from "@/lib/supabase";

// Define the strict TypeScript interface for the Admin view of a user
export interface AdminUserProfile {
    id: string;
    first_name: string | null;
    last_name: string | null;
    phone: string | null;
    created_at: string;
    // Relational join from the public.roles table
    roles: {
        name: string;
    } | null;
}

export interface GlobalStatistics {
    totalUsers: number;
    totalTransactions: number;
    totalIncomeVolume: number;
    totalExpenseVolume: number;
}

export const adminService = {
    /**
     * Fetches all registered users and their assigned roles.
     * Only succeeds if the requesting user has the 'admin' role, thanks to RLS.
     */
    async getAllUsers(): Promise<AdminUserProfile[]> {
        const { data, error } = await supabase
            .from('profiles')
            .select(`
        id,
        first_name,
        last_name,
        phone,
        created_at,
        roles (
          name
        )
      `)
            .order('created_at', { ascending: false }); // Newest users first

        if (error) {
            console.error("Error fetching all users for admin panel:", error.message);
            throw error;
        }

        // Because 'roles' is a many-to-one relationship (profile -> role), 
        // Supabase returns it as a single object which perfectly matches our interface.
        return data as unknown as AdminUserProfile[];
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