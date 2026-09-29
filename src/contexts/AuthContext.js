import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/auth.service';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check local storage for auth token on mount
    const token = localStorage.getItem('auth_token');
    if (!token) return setLoading(false);
    authService.me()
      .then(({ data }) => {
        setUser(data);
        setIsAuthenticated(true);
      })
      .catch(() => {
        localStorage.removeItem('auth_token');
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (identifier, password) => {
    const result = await authService.login(identifier, password);
    localStorage.setItem('auth_token', result.data.tokens.accessToken);
    setUser(result.data.user);
    setIsAuthenticated(true);
    return result;
  };

  const logout = async () => {
    try {
      if (localStorage.getItem('auth_token')) await authService.logout();
    } finally {
      localStorage.removeItem('auth_token');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  if (loading) {
    return null; // Or a loading spinner
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
