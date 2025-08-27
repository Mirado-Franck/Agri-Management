import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    const applyTheme = () => {
      const selectedTheme = theme === 'system'
        ? window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        : theme;
      document.documentElement.setAttribute('data-theme', selectedTheme);
      localStorage.setItem('theme', theme);
    };

    applyTheme();

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = (e) => {
      if (theme === 'system') {
        document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
      }
    };
    mediaQuery.addEventListener('change', handleSystemChange);

    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, [theme]);

  const updateTheme = (newTheme) => {
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};