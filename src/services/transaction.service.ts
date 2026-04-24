import { supabase } from "@/lib/supabase";

export interface Category {
  id: string;
  name: string;
  type: "income" | "expense";
  is_system: boolean;
  icon: string | null;
  color: string | null;
  is_active: boolean;
}

export interface TransactionInsert {
  user_id: string;
  category_id?: string;
  type: "income" | "expense";
  amount: number;
  description?: string;
  date?: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  category_id: string | null;
  type: "income" | "expense";
  amount: number; // Absolute positive number
  description: string | null;
  date: string;

  // The joined data from the public.categories table
  categories?: {
    name: string;
    icon: string | null;
    color: string | null;
  } | null;
}

export const transactionService = {
  async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("is_active", true); // Only fetch active categories

    if (error) {
      console.error("Error fetching categories:", error.message);
      return [];
    }
    return data as Category[];
  },

  async addTransaction(transaction: TransactionInsert) {
    const { data, error } = await supabase
      .from("transactions")
      .insert([transaction])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getTransactions(
    startDate: string,
    endDate: string,
  ): Promise<Transaction[]> {
    const { data, error } = await supabase
      .from("transactions")
      .select(
        `
        *,
        categories (
          name,
          icon,
          color
        )
      `,
      )
      .gte("date", startDate)
      .lte("date", endDate)
      .order("date", { ascending: false }); // Show newest transactions first

    if (error) {
      console.error("Error fetching transactions:", error.message);
      throw error;
    }

    return data as Transaction[];
  },
};
