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

  activeStartDate: string | null;
  activeEndDate: string | null;

  fetchTransactions: (startDate: string, endDate: string) => Promise<void>;
  refreshTransactions: () => Promise<void>;
}

export const useTransactionStore = create<TransactionState>()((set, get) => ({
  categories: [],
  isLoadingCategories: false,
  transactions: [],
  isLoadingTransactions: false,

  activeStartDate: null,
  activeEndDate: null,

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
    // Save the dates to the store so we can reuse them later
    set({ isLoadingTransactions: true, activeStartDate: startDate, activeEndDate: endDate });
    try {
      const transactions = await transactionService.getTransactions(startDate, endDate);
      set({ transactions });
    } catch (error) {
      console.error("Failed to load transactions:", error);
    } finally {
      set({ isLoadingTransactions: false });
    }
  },

  refreshTransactions: async () => {
    const { activeStartDate, activeEndDate, fetchTransactions } = get();
    if (activeStartDate && activeEndDate) {
      await fetchTransactions(activeStartDate, activeEndDate);
    }
  }
}));
