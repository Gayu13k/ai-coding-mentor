import React, { createContext, useState, useEffect } from 'react';
import { setApiToken } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    token: null,
    name: null,
    email: null,
    streak: null,
  });

  const login = (userData) => {
    setUser(userData);
    setApiToken(userData.token);
  };

  const logout = () => {
    setUser({ token: null, name: null, email: null, streak: null });
    setApiToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
