import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const Navbar = React.memo(({ isLoggedIn, onLogout }) => {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    onLogout();
    navigate('/');
  }, [onLogout, navigate]);

  useEffect(() => {
    if (isLoggedIn) {
      const storedUsername = localStorage.getItem('username');
      if (storedUsername) {
        setUsername(storedUsername);
      }
    } else {
      setUsername('');
    }
  }, [isLoggedIn]);

  return (
    <nav className="bg-gradient-to-r from-primary-100 to-secondary-100 dark:from-gray-800 dark:to-gray-900 text-primary-900 dark:text-primary-100 backdrop-blur-sm p-4 transition-colors duration-300 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-primary-600 dark:text-primary-400">QuizMaster</Link>
        <div className="flex items-center space-x-8">
          {isLoggedIn ? (
            <>
              <Link to="/dashboard" className="hover:text-secondary-500 transition-colors duration-300">Dashboard</Link>
              <Link to="/stats" className="hover:text-secondary-500 transition-colors duration-300">View Stats</Link>
              {username && <span className="text-primary-700 dark:text-primary-300">Welcome, {username}</span>}
              <button onClick={handleLogout} className="hover:text-secondary-500 transition-colors duration-300">Logout</button>
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

Navbar.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  onLogout: PropTypes.func.isRequired,
};

Navbar.displayName = 'Navbar';

export default Navbar;