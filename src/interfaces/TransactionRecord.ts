// types/transaction.ts

export type TransactionType = 'income' | 'expense';

export interface Transaction {
    // All IDs are strings because UUIDs are represented as strings in JS
    id: string;
    userId: string;
    categoryId: string;

    // Data fields
    amount: number;
    description: string;
    date: string;         // Format: YYYY-MM-DD
    type: TransactionType;

    // Optional metadata (common in Supabase)
    createdAt?: string;
}

/**
 * Used for the React Hook Form when creating a new record.
 * We Omit 'id' and 'userId' because:
 * 1. The DB generates the 'id' (UUID).
 * 2. Supabase Auth handles the 'userId' automatically on the backend.
 */
export type CreateTransactionInput = Omit<Transaction, 'id' | 'userId' | 'createdAt'>;

/**
 * Used for updates. 
 * Requires the 'id' but makes everything else optional.
 */
export interface UpdateTransactionInput extends Partial<CreateTransactionInput> {
    id: string;
}