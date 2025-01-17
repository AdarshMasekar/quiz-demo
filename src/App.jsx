import React, { lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Stats from "./components/Stats";
import DarkModeToggle from "./components/DarkModeToggle";
import AdminDashboard from "./components/admin_panel/AdminDashboard";
import { useTheme } from "./context/ThemeContext";
import { isAuthenticated, clearAuthData, getAuthData } from "./utils/auth";

// Lazy import components to improve performance
const Home = lazy(() => import("./components/Home"));
const Register = lazy(() => import("./components/Register"));
const Login = lazy(() => import("./components/Login"));
const Dashboard = lazy(() => import("./components/Dashboard"));
const Quiz = lazy(() => import("./components/Quiz"));
const Result = lazy(() => import("./components/Result"));
const PastResults = lazy(() => import("./components/PastResults"));
const PageNotFound = lazy(() => import("./components/PageNotFound"));

function App() {
  const { theme } = useTheme();
  const location = useLocation();
  const isLoggedIn = isAuthenticated();

  const NavbarWrapper = () => {
    const hideNavbarPaths = ["/register", "/login"];
    return hideNavbarPaths.includes(location.pathname) ? null : (
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>
    );
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-600 ${theme === "dark" ? "dark" : "light"}`}
    >
      <NavbarWrapper />
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900 dark:border-white"></div>
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Home />} />
          <Route path="/quiz/:id" element={isLoggedIn ? <Quiz /> : <Home />} />
          <Route path="/result/:id" element={<Result />} />
          <Route path="/past-results" element={<PastResults />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Suspense>
      <DarkModeToggle />
    </div>
  );
}

export default App;
