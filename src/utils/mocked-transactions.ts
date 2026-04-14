import type { Transaction } from "@/interfaces/TransactionRecord";

export const MOCKED_TRANSACTIONS: Transaction[] = [
    // --- USER 1 (UUID: 7b2d1... ) ---
    {
        id: '550e8400-e29b-41d4-a716-446655440001',
        userId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        categoryId: 'a1b2c3d4-e5f6-4g7h-8i9j-k1l2m3n4o5p6',
        amount: 2500,
        date: '2026-03-30',
        description: 'Monthly Salary',
        type: 'income'
    },
    {
        id: '550e8400-e29b-41d4-a716-446655440002',
        userId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        categoryId: 'b2c3d4e5-f6g7-h8i9-j0k1-l2m3n4o5p6q7',
        amount: 45.50,
        date: '2026-04-01',
        description: 'Dinner at Pizzeria',
        type: 'expense'
    },
    {
        id: '550e8400-e29b-41d4-a716-446655440003',
        userId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        categoryId: 'c3d4e5f6-g7h8-i9j0-k1l2-m3n4o5p6q7r8',
        amount: 30.00,
        date: '2026-04-02',
        description: 'Gasoline',
        type: 'expense'
    },
    {
        id: '550e8400-e29b-41d4-a716-446655440004',
        userId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        categoryId: 'd4e5f6g7-h8i9-j0k1-l2m3-n4o5p6q7r8s9',
        amount: 89.99,
        date: '2026-04-03',
        description: 'Running Shoes',
        type: 'expense'
    },
    {
        id: '550e8400-e29b-41d4-a716-446655440005',
        userId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        categoryId: 'e5f6g7h8-i9j0-k1l2-m3n4-o5p6q7r8s9t0',
        amount: 400.00,
        date: '2026-04-05',
        description: 'Logo Design Project',
        type: 'income'
    },
    {
        id: '550e8400-e29b-41d4-a716-446655440006',
        userId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        categoryId: 'b2c3d4e5-f6g7-h8i9-j0k1-l2m3n4o5p6q7',
        amount: 12.00,
        date: '2026-04-06',
        description: 'Office Lunch',
        type: 'expense'
    },
    {
        id: '550e8400-e29b-41d4-a716-446655440007',
        userId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        categoryId: 'f6g7h8i9-j0k1-l2m3-n4o5-p6q7r8s9t0u1',
        amount: 25.00,
        date: '2026-04-07',
        description: 'Movie Tickets',
        type: 'expense'
    },
    {
        id: '550e8400-e29b-41d4-a716-446655440008',
        userId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        categoryId: 'g7h8i9j0-k1l2-m3n4-o5p6-q7r8s9t0u1v2',
        amount: 60.00,
        date: '2026-04-08',
        description: 'Pharmacy',
        type: 'expense'
    },
    {
        id: '550e8400-e29b-41d4-a716-446655440009',
        userId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        categoryId: 'c3d4e5f6-g7h8-i9j0-k1l2-m3n4o5p6q7r8',
        amount: 1.50,
        date: '2026-04-09',
        description: 'Bus Ticket',
        type: 'expense'
    },
    {
        id: '550e8400-e29b-41d4-a716-446655440010',
        userId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        categoryId: 'h8i9j0k1-l2m3-n4o5-p6q7-r8s9t0u1v2w3',
        amount: 15.20,
        date: '2026-04-10',
        description: 'Stock Dividends',
        type: 'income'
    },

    // --- USER 2 (UUID: a1b2c... ) ---
    {
        id: '550e8400-e29b-41d4-a716-446655440021',
        userId: 'a1b2c3d4-e5f6-4g7h-8i9j-k1l2m3n4o5p6',
        categoryId: 'a1b2c3d4-e5f6-4g7h-8i9j-k1l2m3n4o5p6',
        amount: 3200,
        date: '2026-03-31',
        description: 'Salary March',
        type: 'income'
    },
    {
        id: '550e8400-e29b-41d4-a716-446655440022',
        userId: 'a1b2c3d4-e5f6-4g7h-8i9j-k1l2m3n4o5p6',
        categoryId: 'b2c3d4e5-f6g7-h8i9-j0k1-l2m3n4o5p6q7',
        amount: 200.00,
        date: '2026-04-05',
        description: 'Fancy Restaurant',
        type: 'expense'
    }
];