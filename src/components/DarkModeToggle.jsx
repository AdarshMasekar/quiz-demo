import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { SunIcon, MoonIcon } from '@heroicons/react/solid';

const DarkModeToggle = ({ darkMode, setDarkMode }) => {
  useEffect(() => {
    if (darkMode) { 
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleToggle = useCallback(() => {
    setDarkMode((prevMode) => {
      const newMode = !prevMode;
      try {
        localStorage.setItem('darkMode', JSON.stringify(newMode));
        document.documentElement.classList.toggle('dark', newMode);
      } catch (error) {
        console.error('Error saving darkMode to localStorage:', error);
      }
      return newMode;
    });
  }, [setDarkMode]);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={handleToggle}
        className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 transition-colors duration-200 hover:bg-gray-300 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
        aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {darkMode ? (
          <SunIcon className="h-6 w-6 text-yellow-400" aria-hidden="true" />
        ) : (
          <MoonIcon className="h-6 w-6 text-white" aria-hidden="true" />
        )}
      </button>
    </div>
  );
};

DarkModeToggle.propTypes = {
  darkMode: PropTypes.bool.isRequired,
  setDarkMode: PropTypes.func.isRequired,
};

export default React.memo(DarkModeToggle);
