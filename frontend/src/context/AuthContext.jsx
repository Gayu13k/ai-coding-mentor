import React, { createContext, useState, useEffect, useCallback } from 'react';
import { setApiToken, setLogoutCallback } from '../services/api';

export const AuthContext = createContext();

const STORAGE_KEY = 'ai_mentor_auth';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.token) {
          setApiToken(parsed.token);
        }
        return parsed;
      }
    } catch (e) {
      // Ignore corrupted storage
    }
    return { token: null, name: null, email: null, streak: null };
  });

  const logout = useCallback(() => {
    const empty = { token: null, name: null, email: null, streak: null };
    setUser(empty);
    setApiToken(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // Register the logout callback so axios interceptor can trigger it on 401/403
  useEffect(() => {
    setLogoutCallback(logout);
  }, [logout]);

  const login = (userData) => {
    setUser(userData);
    setApiToken(userData.token);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
