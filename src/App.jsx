import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Stats from './components/Stats';

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

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem('token');
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    try {
      localStorage.setItem('darkMode', JSON.stringify(darkMode));
    } catch (error) {
      console.error('Error saving darkMode to localStorage:', error);
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prevMode => !prevMode);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  const saveQuizResult = (result) => {
    try {
      const pastResults = JSON.parse(localStorage.getItem('quizResults')) || [];
      pastResults.push(result);
      localStorage.setItem('quizResults', JSON.stringify(pastResults));
    } catch (error) {
      console.error('Error saving quiz result to localStorage:', error);
    }
  };

  return (
    <Router>
      <div className="min-h-screen transition-colors duration-300">
        <div className="sticky top-0 z-50">
          <Navbar darkMode={darkMode} setDarkMode={toggleDarkMode} isLoggedIn={isLoggedIn} onLogout={handleLogout} />
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/quiz/:id" element={<Quiz saveQuizResult={saveQuizResult} />} />
            <Route path="/result/:id" element={<Result />} />
            <Route path="/past-results" element={<PastResults />} />
            <Route path="/stats" element={<Stats />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;