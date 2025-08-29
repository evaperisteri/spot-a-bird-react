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
import UserManagement from "./pages/UserManagment";
import ErrorBoundary from "./components/ErrorBoundary";
import EditUserPage from "./pages/EditUserPage";
import { Toaster } from "sonner";

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
              <Route
                path="/users"
                element={
                  <ErrorBoundary
                    fallback={<div>Could not load user management.</div>}
                  >
                    <UserManagement />
                  </ErrorBoundary>
                }
              />
              <Route path="/users/edit/:id" element={<EditUserPage />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
      <Toaster
        position="top-right"
        expand={true}
        richColors // Don't set to false
        closeButton
        toastOptions={{
          className: "rounded-2xl shadow-md font-sans",
          classNames: {
            toast:
              "group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
            success: "bg-sage text-offwhite border-0",
            error: "bg-rose-200 text-purple border border-rose-400",
            info: "bg-lilac text-purple border-0",
            warning: "bg-eggshell text-purple border-0",
          },
        }}
      />
    </BrowserRouter>
  );
}
