import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserIcon } from '@heroicons/react/outline'; // Import the user icon
import { clearAuthData, getAuthData, isAuthenticated } from '../utils/auth';

const Navbar = React.memo(() => {
  const { username } = getAuthData();
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    clearAuthData();
    setIsLoggedIn(false);
    navigate('/');
  }, [navigate]);

  useEffect(() => {
    const syncAuthState = () => setIsLoggedIn(isAuthenticated());

    window.addEventListener('storage', syncAuthState);
    return () => {
      window.removeEventListener('storage', syncAuthState);
    };
  }, []);

  return (
    <nav className="bg-gradient-to-r from-primary-100 to-secondary-100 dark:from-gray-800 dark:to-gray-900 text-primary-900 dark:text-primary-100 backdrop-blur-sm p-4 transition-colors duration-300 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-primary-600 dark:text-primary-400">QuizMaster</Link>
        <div className="flex items-center space-x-8">
          {isLoggedIn ? (
            <>
              <Link to="/dashboard" className="hover:text-secondary-500 transition-colors duration-300">Dashboard</Link>
              <Link to="/stats" className="hover:text-secondary-500 transition-colors duration-300">View Stats</Link>
              <div className="relative group flex items-center space-x-2 cursor-pointer">
                {/* User Icon and Username */}
                <UserIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                {username && (
                  <span className="text-red-800 dark:text-primary-600">{username.charAt(0).toUpperCase() + username.slice(1)}</span>
                )}

                {/* Logout button styled as a card */}
                <div
                  className="absolute left-0 top-3 mt-8 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                >
                  <button
                    onClick={handleLogout}
                    className="w-full text-center text-primary-600 dark:text-primary-400 hover:text-secondary-500"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/register" className="hover:text-secondary-500 transition-colors duration-300">Register</Link>
              <Link to="/login" className="hover:text-secondary-500 transition-colors duration-300">Login</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
});

Navbar.displayName = 'Navbar';

export default Navbar;
