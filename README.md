# MyPocket - Master Technical Documentation

## 1. Project Identity & Vision
**MyPocket** is a professional personal finance tracker tailored for the Spanish-speaking market. It allows users to manage daily transactions, categorize spending, and view financial health analytics through a role-based access system.

## 2. Technical Stack (React 19 + Vite 8)
* **Frontend:** React 19 (Strict Mode, Functional Components, Hooks).
* **Build Tool:** Vite 8.
* **Language:** TypeScript (Strict typing required).
* **Styling:** Tailwind CSS v4 (Utility-first, no custom CSS files).
* **Components:** shadcn/ui (Radix UI primitives).
* **Icons:** `lucide-react` (Primary) & `@remixicon/react` (Secondary).
* **Backend/Auth:** Supabase.
* **State Management:** Zustand (Slices for Auth, Config, and Transactions).
* **Forms & Validation:** `react-hook-form` + `zod`.

## 3. Directory Structure (Architecture)
The project uses the `@/` path alias for clean imports.

```text
src/
├── assets/             # Logos, landing images, and global CSS
├── components/         # React components
│   ├── forms/          # Domain-specific forms (Zod + react-hook-form)
│   ├── landing/        # Sections for the marketing home page
│   ├── layout/         # Wrappers: Navbar, Sidebar, ProtectedRoute
│   └── ui/             # shadcn/ui primitives (Buttons, Inputs, etc.)
├── hooks/              # Reusable UI logic and event listeners
├── lib/                # Config: supabaseClient.ts, utils.ts (cn helper)
├── pages/              # Main Views: Landing, Dashboard, Profile, Admin
├── routes/             # AppRoutes.tsx using react-router-dom
├── services/           # DB Logic: authService.ts, financeService.ts
├── store/              # Zustand: useAuthStore, useConfigStore, useTransactionStore
├── types/              # TS Interfaces & Zod Schemas (auth.ts, finance.ts)
└── utils/              # formatters.ts, constants.ts (fallback categories)
```

## 4. Linguistic & Coding Standards
To maintain professional consistency between the logic and the user interface:

* **Logic (English):** All variables, function names, state keys, and database columns must be in English.
    * *Example:* `const [balance, setBalance] = useState(0);`
* **UI (Spanish):** All user-facing text, placeholders, labels, and aria-labels must be in Spanish.
    * *Example:* `<Button>Guardar Transacción</Button>`
* **Validation (Spanish):** Zod error messages must be written in Spanish to be piped directly to the UI.
    * *Example:* `z.string().min(1, { message: "El monto es obligatorio" })`

## 5. Database Schema & Roles
We use a relational structure in Supabase to support scaling and Admin-level analytics.

### 5.1 Tables
* **`profiles`**: Extended user data.
    * `id (uuid)`, `first_name`, `last_name`, `phone`, `address`, `city`, `postal_code`, `birthdate`, `role_id`, `created_at`, `last_login`.
* **`roles`**: RBAC system.
    * `id (uuid)`, `name` ('user', 'premium', 'admin').
* **`categories`**: Financial categories (Synced from DB to Store).
    * `id`, `name` (English), `type` (income/expense), `icon` (Lucide name), `color`, `is_active`.
* **`transactions`**: The core movement records.
    * `id`, `user_id`, `type`, `category_id`, `amount`, `description`, `date`.

### 5.1 Table Relations
* **`roles`**: Defines access levels. Columns: `id (uuid)`, `name (text)`.
* **`profiles`**: Linked to `auth.users`. Contains `role_id` as a Foreign Key to `roles.id`. 
* **Logic:** The `useAuthStore` must fetch the profile joined with the role name to handle UI permissions.

## 6. State Management Logic (Zustand)
1.  **`useAuthStore` (Persistent):**
    * Stores `user`, `session`, and `role`.
    * Contains computed booleans: `isLogged` and `isAdmin`.
2.  **`useConfigStore` (Persistent):**
    * Stores `theme` (dark/light), `currency` (EUR/USD), and language preferences.
3.  **`useTransactionStore` (Non-Persistent):**
    * Hydrates `categories[]` from the database upon application mount.
    * Stores the current view of `transactions[]` based on active filters.

## 7. Development Patterns
* **Service Layer:** Components **must not** call Supabase directly. Use `src/services/` for all async data fetching.
* **Route Guards:** Use a wrapper component pattern in `src/routes/` to check `isLogged` and `role` before rendering protected pages.
* **Component Modularity:** Large forms must be broken down into reusable pieces (e.g., `FormInput`, `CategoryPicker`) located in `src/components/forms/`.