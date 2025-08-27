import React, { useState, useEffect } from 'react';
import { Toaster } from 'sonner';
import { ThemeProvider } from './pages/config/ThemeContext.js';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import Login from './pages/Login';
import './App.css';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const logged = localStorage.getItem('isLoggedIn');
    if (logged === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
  };

  return (
    <ThemeProvider>
      <Toaster position="top-center" size={44} />
      {!isLoggedIn ? (
        <Login onLogin={handleLogin} />
      ) : (
        <div className="app-layout">
          <Sidebar onLogout={handleLogout} />
          <MainContent />
        </div>
      )}
    </ThemeProvider>
  );
}