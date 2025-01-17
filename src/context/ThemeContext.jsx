import { useContext, useEffect, createContext, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    const root = document.documentElement; // Refers to the HTML element
    root.classList.remove("light", "dark"); // Remove existing theme classes
    root.classList.add(theme); // Add the new theme class
    localStorage.setItem("theme", theme); // Save the current theme to localStorage
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("The theme must be used within the ThemeProvider");
  }
  return context;
};
