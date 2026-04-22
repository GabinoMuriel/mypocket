import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { ProtectedRoute } from '@/routes/ProtectedRoute';
import Navbar from '@/components/app/navbar/Navbar';

// Updated Page Imports reflecting the new folder architecture

import TransactionsPage from '@/pages/transactions/TransactionsPage';
import GraphsPage from '@/pages/graphs/GraphsPage';
import EditProfilePage from '@/pages/edit-profile/EditProfilePage';
import UsersPanelPage from '@/pages/admin/users-panel/UsersPanelPage';
import StatisticsPage from '@/pages/admin/stadistics/StatisticsPage';
import HomePage from '@/pages/home/HomePage';

const GlobalLayout = () => (
    <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1">
            <Outlet />
        </main>
    </div>
);

export const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<GlobalLayout />}>

                    {/* Public Route */}
                    <Route path="/" element={<HomePage />} />

                    {/* User Routes (Protected) */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/transactions" element={<TransactionsPage />} />
                        <Route path="/graphs" element={<GraphsPage />} />
                        <Route path="/profile" element={<EditProfilePage />} />

                        {/* Admin Only Routes (Strictly Protected) */}
                        <Route element={<ProtectedRoute adminOnly={true} />}>
                            <Route path="/admin/users" element={<UsersPanelPage />} />
                            <Route path="/admin/statistics" element={<StatisticsPage />} />
                        </Route>
                    </Route>

                </Route>
            </Routes>
        </BrowserRouter>
    );
};