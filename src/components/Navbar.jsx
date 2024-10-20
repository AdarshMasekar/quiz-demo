import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SunIcon, MoonIcon } from '@heroicons/react/solid';
import PropTypes from 'prop-types';

const Navbar = React.memo(({ darkMode, setDarkMode, isLoggedIn, onLogout }) => {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleDarkModeToggle = useCallback(() => {
    setDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem('darkMode', JSON.stringify(newMode));
      return newMode;
    });
  }, [setDarkMode]);

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

  useEffect(() => {
    const storedDarkMode = JSON.parse(localStorage.getItem('darkMode'));
    if (storedDarkMode !== null) {
      setDarkMode(storedDarkMode);
    }
  }, [setDarkMode]);

  return (
    <nav className={`${darkMode ? 'bg-[var(--color-primary-900)] text-white' : 'bg-[var(--color-primary-50)] text-[var(--color-primary-900)]'} backdrop-blur-sm p-4 transition-colors duration-300`}>
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">QuizMaster</Link>
        <div className="flex items-center space-x-8">
          {isLoggedIn ? (
            <>
              <Link to="/dashboard" className="hover:text-[var(--color-secondary-500)] transition-colors duration-300">Dashboard</Link>
              <Link to="/stats" className="hover:text-[var(--color-secondary-500)] transition-colors duration-300">View Stats</Link>
              {username && <span className="hover:text-[var(--color-secondary-500)] transition-colors duration-300">Welcome, {username}</span>}
              <button onClick={handleLogout} className="hover:text-[var(--color-secondary-500)] transition-colors duration-300">Logout</button>
            </>
          ) : (
            <>
              <Link to="/register" className="hover:text-[var(--color-secondary-500)] transition-colors duration-300">Register</Link>
              <Link to="/login" className="hover:text-[var(--color-secondary-500)] transition-colors duration-300">Login</Link>
            </>
          )}
          {/* Dark mode toggle button commented out due to bugginess
          <button
            onClick={handleDarkModeToggle}
            className="p-2 rounded-full hover:bg-[var(--color-primary-400)] transition-colors duration-300 ml-4 relative"
            aria-label="Toggle Dark Mode"
          >
            <div 
              className={`absolute inset-0 ${darkMode ? 'bg-[var(--color-primary-700)]' : 'bg-[var(--color-primary-200)]'} rounded-full transition-all duration-300 ${darkMode ? 'scale-100' : 'scale-0'}`}
              aria-hidden="true"
            />
            <div className="flex items-center justify-between relative z-10">
              <SunIcon className={`h-6 w-6 ${darkMode ? 'text-[var(--color-accent-400)]' : 'text-[var(--color-primary-300)]'} transition-colors duration-300`} aria-hidden="true" />
              <MoonIcon className={`h-6 w-6 ml-2 ${darkMode ? 'text-[var(--color-primary-300)]' : 'text-[var(--color-secondary-500)]'} transition-colors duration-300`} aria-hidden="true" />
              <div 
                className={`absolute inset-0 ${darkMode ? 'bg-[var(--color-primary-700)]' : 'bg-[var(--color-accent-200)]'} rounded-full transition-all duration-300 ${darkMode ? 'translate-x-full' : 'translate-x-0'}`}
                style={{ width: '50%' }}
                aria-hidden="true"
              />
            </div>
          </button>
          */}
        </div>
      </div>
    </nav>
  );
});

Navbar.propTypes = {
  darkMode: PropTypes.bool.isRequired,
  setDarkMode: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  onLogout: PropTypes.func.isRequired,
};

Navbar.displayName = 'Navbar';

export default Navbar;