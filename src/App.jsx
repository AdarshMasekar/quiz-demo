import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Stats from './components/Stats';
import DarkModeToggle from './components/DarkModeToggle';
import AdminDashboard from './components/admin_panel/AdminDashboard';
import { ThemeProvider } from './context/ThemeContext';

// Lazy load components
const Home = lazy(() => import('./components/Home'));
const Register = lazy(() => import('./components/Register'));
const Login = lazy(() => import('./components/Login'));
const Dashboard = lazy(() => import('./components/Dashboard'));
const Quiz = lazy(() => import('./components/Quiz'));
const Result = lazy(() => import('./components/Result'));
const PastResults = lazy(() => import('./components/PastResults'));

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const savedMode = localStorage.getItem('darkMode');
      return savedMode ? JSON.parse(savedMode) : false;
    } catch (error) {
      console.error('Error reading darkMode from localStorage:', error);
      return false;
    }
  });

  // Update token handling to be more secure
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const token = localStorage.getItem('token');
    return token && token !== 'undefined' && token !== 'null';
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Add check for initial load
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    try {
      localStorage.setItem('darkMode', JSON.stringify(darkMode));
    } catch (error) {
      console.error('Error saving darkMode to localStorage:', error);
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prevMode => !prevMode);

  const handleLoginSuccess = () => setIsLoggedIn(true);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  // Update quiz result handling for better error management
  const saveQuizResult = (result) => {
    try {
      const pastResults = JSON.parse(localStorage.getItem('quizResults')) || [];
      // Add timestamp and unique ID to results
      const resultWithMeta = {
        ...result,
        timestamp: new Date().toISOString(),
        id: crypto.randomUUID()
      };
      pastResults.push(resultWithMeta);
      localStorage.setItem('quizResults', JSON.stringify(pastResults));
    } catch (error) {
      console.error('Error saving quiz result:', error);
      // Consider adding user notification here
    }
  };

  const NavbarWrapper = () => {
    const location = useLocation();
    const hideNavbarPaths = ['/register', '/login'];
    
    return hideNavbarPaths.includes(location.pathname) ? null : (
      <div className="sticky top-0 z-50">
        <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      </div>
    );
  };

  return (
    <ThemeProvider>
      <Router>
        <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark' : ''}`}>
          <NavbarWrapper />
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
              <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900 dark:border-white"></div>
            </div>
          }>
            {isLoading ? (
              <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900 dark:border-white"></div>
              </div>
            ) : (
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/quiz/:id" element={<Quiz saveQuizResult={saveQuizResult} />} />
                <Route path="/result/:id" element={<Result />} />
                <Route path="/past-results" element={<PastResults />} />
                <Route path="/stats" element={<Stats />} />
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
              </Routes>
            )}
          </Suspense>
          <DarkModeToggle darkMode={darkMode} setDarkMode={toggleDarkMode} />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
