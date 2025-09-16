import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext(undefined);
const AUTH_STORAGE_KEY = 'auth_user_v1';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(AUTH_STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (user) localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      else localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {
      // ignore
    }
  }, [user]);

  const login = (email, password) => {
    // Mock login: accept any non-empty credentials
    if (!email || !password) throw new Error('Email si parola sunt obligatorii');
    const newUser = { id: Date.now().toString(), email, name: email.split('@')[0] };
    setUser(newUser);
    return newUser;
  };

  const register = (name, email, password) => {
    if (!name || !email || !password) throw new Error('Completeaza toate campurile');
    const newUser = { id: Date.now().toString(), email, name };
    setUser(newUser);
    return newUser;
  };

  const logout = () => setUser(null);

  const value = useMemo(() => ({ user, login, register, logout, isAuthenticated: !!user }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};



