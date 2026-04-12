import { type TransactionSchemaType } from "@/components/forms/transaction-modal";

// Extending the form type to include database-specific fields
export interface TransactionRecord extends TransactionSchemaType {
    idTransaction: string;
    idUser: string;
    idCategory: string;
}

export const MOCKED_TRANSACTIONS: TransactionRecord[] = [
    // --- USER 1 (20 Transactions) ---
    { idTransaction: 't1', idUser: '1', idCategory: 'inc-1', amount: 2500, date: '2026-03-30', description: 'Monthly Salary', type: 'income', category: 'inc-1' },
    { idTransaction: 't2', idUser: '1', idCategory: 'exp-1', amount: 45.50, date: '2026-04-01', description: 'Dinner at Pizzeria', type: 'expense', category: 'exp-1' },
    { idTransaction: 't3', idUser: '1', idCategory: 'exp-2', amount: 30.00, date: '2026-04-02', description: 'Gasoline', type: 'expense', category: 'exp-2' },
    { idTransaction: 't4', idUser: '1', idCategory: 'exp-5', amount: 89.99, date: '2026-04-03', description: 'Running Shoes', type: 'expense', category: 'exp-5' },
    { idTransaction: 't5', idUser: '1', idCategory: 'inc-2', amount: 400.00, date: '2026-04-05', description: 'Logo Design Project', type: 'income', category: 'inc-2' },
    { idTransaction: 't6', idUser: '1', idCategory: 'exp-1', amount: 12.00, date: '2026-04-06', description: 'Office Lunch', type: 'expense', category: 'exp-1' },
    { idTransaction: 't7', idUser: '1', idCategory: 'exp-4', amount: 25.00, date: '2026-04-07', description: 'Movie Tickets', type: 'expense', category: 'exp-4' },
    { idTransaction: 't8', idUser: '1', idCategory: 'exp-6', amount: 60.00, date: '2026-04-08', description: 'Pharmacy', type: 'expense', category: 'exp-6' },
    { idTransaction: 't9', idUser: '1', idCategory: 'exp-2', amount: 1.50, date: '2026-04-09', description: 'Bus Ticket', type: 'expense', category: 'exp-2' },
    { idTransaction: 't10', idUser: '1', idCategory: 'inc-3', amount: 15.20, date: '2026-04-10', description: 'Stock Dividends', type: 'income', category: 'inc-3' },
    { idTransaction: 't11', idUser: '1', idCategory: 'exp-3', amount: 120.00, date: '2026-04-11', description: 'Birthday Gift Mom', type: 'expense', category: 'exp-3' },
    { idTransaction: 't12', idUser: '1', idCategory: 'exp-7', amount: 9.99, date: '2026-04-11', description: 'Spotify Subscription', type: 'expense', category: 'exp-7' },
    { idTransaction: 't13', idUser: '1', idCategory: 'exp-5', amount: 35.00, date: '2026-04-12', description: 'New T-shirt', type: 'expense', category: 'exp-5' },
    { idTransaction: 't14', idUser: '1', idCategory: 'exp-1', amount: 110.00, date: '2026-04-13', description: 'Weekly Groceries', type: 'expense', category: 'exp-1' },
    { idTransaction: 't15', idUser: '1', idCategory: 'inc-2', amount: 250.00, date: '2026-04-13', description: 'Consulting Session', type: 'income', category: 'inc-2' },
    { idTransaction: 't16', idUser: '1', idCategory: 'exp-4', amount: 18.00, date: '2026-04-14', description: 'Drinks with friends', type: 'expense', category: 'exp-4' },
    { idTransaction: 't17', idUser: '1', idCategory: 'exp-2', amount: 20.00, date: '2026-04-15', description: 'Parking fee', type: 'expense', category: 'exp-2' },
    { idTransaction: 't18', idUser: '1', idCategory: 'exp-1', amount: 8.50, date: '2026-04-15', description: 'Coffee and Muffin', type: 'expense', category: 'exp-1' },
    { idTransaction: 't19', idUser: '1', idCategory: 'exp-7', amount: 45.00, date: '2026-04-16', description: 'Internet Bill', type: 'expense', category: 'exp-7' },
    { idTransaction: 't20', idUser: '1', idCategory: 'inc-4', amount: 50.00, date: '2026-04-17', description: 'Sold old chair', type: 'income', category: 'inc-4' },

    // --- USER 2 (5 Transactions) ---
    { idTransaction: 't21', idUser: '2', idCategory: 'inc-1', amount: 3200, date: '2026-03-31', description: 'Salary March', type: 'income', category: 'inc-1' },
    { idTransaction: 't22', idUser: '2', idCategory: 'exp-1', amount: 200.00, date: '2026-04-05', description: 'Fancy Restaurant', type: 'expense', category: 'exp-1' },
    { idTransaction: 't23', idUser: '2', idCategory: 'exp-5', amount: 450.00, date: '2026-04-10', description: 'New iPad', type: 'expense', category: 'exp-5' },
    { idTransaction: 't24', idUser: '2', idCategory: 'exp-2', amount: 55.00, date: '2026-04-12', description: 'Train Tickets', type: 'expense', category: 'exp-2' },
    { idTransaction: 't25', idUser: '2', idCategory: 'inc-3', amount: 1200.00, date: '2026-04-15', description: 'Crypto Profit', type: 'income', category: 'inc-3' },
];