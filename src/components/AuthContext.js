// UPDATE: Modify the AuthProvider in AuthContext.js to persist authentication state across sessions.

import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check if the user is authenticated when the provider mounts
    const user = localStorage.getItem('user');
    return !!user;
  });

  useEffect(() => {
    // Optionally, listen for changes in authentication state
    const handleStorageChange = () => {
      const user = localStorage.getItem('user');
      setIsAuthenticated(!!user);
    };

    window.addEventListener('storage', handleStorageChange);

    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
