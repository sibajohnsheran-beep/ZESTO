
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";

import { LogOut } from "lucide-react";

import App from "./App";
import AdminLogin from "./components/admin/AdminLogin";
import AdminDashboard from "./components/admin/AdminDashboard";

import "./index.css";

// ========================================
// DEMO SESSION
// This is NOT production authentication.
// ========================================

const DEMO_SESSION_KEY = "zesto-admin-demo-access";

// ========================================
// ADMIN DASHBOARD DEMO ROUTE
// ========================================

function DemoAdminDashboardRoute() {
  const navigate = useNavigate();

  const isDemoSignedIn =
    sessionStorage.getItem(DEMO_SESSION_KEY) === "true";

  if (!isDemoSignedIn) {
    return (
      <Navigate
        to="/admin/login"
        replace
      />
    );
  }

  const handleLogout = () => {
    sessionStorage.removeItem(DEMO_SESSION_KEY);

    navigate("/admin/login", {
      replace: true,
    });
  };

  return (
    <div style={{ position: "relative" }}>
      <AdminDashboard />

      {/* TEMPORARY DEMO LOGOUT BUTTON */}

      <button
        type="button"
        onClick={handleLogout}
        aria-label="Log out of admin demo"
        style={{
          position: "fixed",
          right: "22px",
          bottom: "20px",
          zIndex: 300,
          display: "flex",
          alignItems: "center",
          gap: "9px",
          padding: "12px 17px",
          color: "#fff0df",
          background: "#a7251b",
          border: "1px solid #eb6549",
          borderRadius: "12px",
          cursor: "pointer",
          fontSize: "12px",
          fontWeight: 700,
          boxShadow: "0 12px 28px rgba(0,0,0,0.3)",
        }}
      >
        <LogOut size={16} />
        Logout Demo
      </button>
    </div>
  );
}

// ========================================
// MAIN REACT APPLICATION
// ========================================

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>

        {/* CUSTOMER WEBSITE */}

        <Route
          path="/"
          element={<App />}
        />

        {/* ADMIN ROOT */}

        <Route
          path="/admin"
          element={
            <Navigate
              to="/admin/login"
              replace
            />
          }
        />

        {/* ADMIN LOGIN */}

        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />

        {/* ADMIN DASHBOARD - DEMO ACCESS */}

        <Route
          path="/admin/dashboard"
          element={<DemoAdminDashboardRoute />}
        />

        {/* UNKNOWN ROUTES */}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  </StrictMode>
);
