import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import LayoutColumns from "./components/layout/LayoutColumns";

import HomePage from "./pages/HomePage";
import { AuthProvider } from "./context/AuthProvider";
import LoginPage from "./pages/LoginPage";
import RegistrationPage from "./pages/RegistrationPage";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/routes/ProtectedRoute";
import NewLogPage from "./pages/NewLogPage";
import EditLogPage from "./pages/EditLogPage";
import LogDetailsPage from "./pages/LogDetailsPage";
import StatisticsPage from "./pages/StatisticsPage";
import ProfileDetailsPage from "./pages/ProfileDetailsPage";
import BirdsCatalogPage from "./pages/BirdsCatalogPage";
import BirdDetails from "./pages/BirdDetails";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Layout wraps all pages */}
          <Route path="/" element={<Layout />}>
            {/* Public routes */}
            <Route index element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="users/register" element={<RegistrationPage />} />
          </Route>

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<LayoutColumns />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/savelog" element={<NewLogPage />} />
              <Route path="/logs/:id" element={<LogDetailsPage />} />
              <Route path="/logs/:id/edit" element={<EditLogPage />} />
              <Route path="/statistics" element={<StatisticsPage />} />
              <Route path="/myinfo" element={<ProfileDetailsPage />} />
              <Route path="/birds" element={<BirdsCatalogPage />} />
              <Route path="/birds/:id" element={<BirdDetails />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
