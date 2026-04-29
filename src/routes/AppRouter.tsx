import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import Navbar from "@/components/app/navbar/Navbar";

// Updated Page Imports reflecting the new folder architecture

import TransactionsPage from "@/pages/transactions/TransactionsPage";
import GraphsPage from "@/pages/graphs/GraphsPage";
import EditProfilePage from "@/pages/edit-profile/EditProfilePage";
import UsersPanelPage from "@/pages/admin/users-panel/UsersPanelPage";
import StatisticsPage from "@/pages/admin/stadistics/StatisticsPage";
import HomePage from "@/pages/home/HomePage";
import { RootRedirect } from "./Rootredirect";

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
          {/* Guest Route */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<HomePage />} />
          </Route>

          {/* Logged In Only Routes */}
          <Route element={<ProtectedRoute isLogged={true} />}>
            <Route path="/profile" element={<EditProfilePage />} />
          </Route>

          {/* User Only Routes */}
          <Route element={<ProtectedRoute isLogged={true} userOnly={true} />}>
            <Route
              path="/transactions/:period"
              element={<TransactionsPage />}
            />
            <Route path="/graphs/:period" element={<GraphsPage />} />
          </Route>

          {/* Admin Only Routes */}
          <Route element={<ProtectedRoute isLogged={true} adminOnly={true} />}>
            <Route path="/admin/users" element={<UsersPanelPage />} />
            <Route path="/admin/statistics" element={<StatisticsPage />} />
          </Route>

          {/* Redirect Route */}
          <Route path="*" element={<RootRedirect />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
