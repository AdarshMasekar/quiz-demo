import React from "react";
import { SunIcon, MoonIcon } from "@heroicons/react/solid";
import { useTheme } from "../context/ThemeContext";

const DarkModeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={toggleTheme}
        className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 
                   transition-all duration-200 hover:bg-gray-300 dark:hover:bg-gray-700 
                   focus:outline-none focus:ring-2 focus:ring-offset-2 
                   focus:ring-offset-gray-100 dark:focus:ring-offset-gray-900 focus:ring-blue-500"
        aria-label={
          theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
        }
        title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      >
        {theme === "dark" ? (
          <SunIcon
            className="h-6 w-6 text-yellow-400"
            aria-hidden="true"
          />
        ) : (
          <MoonIcon
            className="h-6 w-6 text-white"
            aria-hidden="true"
          />
        )}
      </button>
    </div>
  );
};

export default React.memo(DarkModeToggle);
