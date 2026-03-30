import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

const isSessionValid = () => {
  const user = localStorage.getItem('user');
  const loginAt = localStorage.getItem('loginAt');
  if (!user || !loginAt) return false;
  return Date.now() - parseInt(loginAt, 10) < SESSION_DURATION;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => isSessionValid());

  const logout = useCallback(() => {
    localStorage.removeItem('user');
    localStorage.removeItem('loginAt');
    setIsAuthenticated(false);
  }, []);

  // Check session expiry on mount and every minute
  useEffect(() => {
    if (isAuthenticated && !isSessionValid()) {
      logout();
    }
    const interval = setInterval(() => {
      if (!isSessionValid()) logout();
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, [isAuthenticated, logout]);

  // Sync across tabs
  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(isSessionValid());
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('loginAt', Date.now().toString());
    setIsAuthenticated(true);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};