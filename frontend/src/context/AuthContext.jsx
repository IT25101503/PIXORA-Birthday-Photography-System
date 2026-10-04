import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('pixora_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('pixora_user');
      const savedToken = localStorage.getItem('pixora_token');
      if (savedUser && savedToken) {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
      }
    } catch (e) {
      console.error('Failed to parse saved auth state', e);
      localStorage.removeItem('pixora_user');
      localStorage.removeItem('pixora_token');
    } finally {
      setLoading(false);
    }
  }, []);

  const saveAuthData = (authData) => {
    const userData = {
      userId: authData.userId,
      email: authData.email,
      fullName: authData.fullName,
      role: authData.role,
      accountStatus: authData.accountStatus,
    };
    setUser(userData);
    setToken(authData.token);
    localStorage.setItem('pixora_token', authData.token);
    localStorage.setItem('pixora_user', JSON.stringify(userData));
    return userData;
  };

  const login = async (email, password) => {
    const res = await api.post('/api/auth/login', { email, password });
    return saveAuthData(res.data);
  };

  const register = async (data) => {
    const res = await api.post('/api/auth/register', data);
    return saveAuthData(res.data);
  };

  const applyPhotographer = async (data) => {
    const res = await api.post('/api/auth/photographer-apply', data);
    return res.data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('pixora_token');
    localStorage.removeItem('pixora_user');
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    role: user?.role || null,
    isAdmin: user?.role === 'ADMIN',
    isClient: user?.role === 'CLIENT',
    isPhotographer: user?.role === 'PHOTOGRAPHER',
    login,
    register,
    applyPhotographer,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
