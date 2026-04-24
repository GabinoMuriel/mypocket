import { create } from "zustand";
import {
  type Category,
  type Transaction,
  transactionService,
} from "@/services/transaction.service";

interface TransactionState {
  categories: Category[];
  isLoadingCategories: boolean;
  fetchCategories: () => Promise<void>;

  transactions: Transaction[];
  isLoadingTransactions: boolean;
  fetchTransactions: (startDate: string, endDate: string) => Promise<void>;
}

export const useTransactionStore = create<TransactionState>()((set) => ({
  categories: [],
  isLoadingCategories: false,
  transactions: [],
  isLoadingTransactions: false,

  fetchCategories: async () => {
    set({ isLoadingCategories: true });
    try {
      // Fetches only active categories using the service we reviewed earlier
      const categories = await transactionService.getCategories();
      set({ categories });
    } catch (error) {
      console.error("Failed to load categories:", error);
    } finally {
      set({ isLoadingCategories: false });
    }
  },

  fetchTransactions: async (startDate: string, endDate: string) => {
    set({ isLoadingTransactions: true });
    try {
      const transactions = await transactionService.getTransactions(
        startDate,
        endDate,
      );
      set({ transactions });
    } catch (error) {
      console.error("Failed to load transactions:", error);
    } finally {
      set({ isLoadingTransactions: false });
    }
  },
}));
