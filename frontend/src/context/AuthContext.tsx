import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUserStats: (newPoints: number, newLevel: number, newStars: number) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('math_crush_token'));
  const [loading, setLoading] = useState<boolean>(true);

  const fetchCurrentUser = async () => {
    try {
      if (!token) {
        setLoading(false);
        return;
      }
      const response = await api.get('/auth/me');
      setUser(response.data.user);
    } catch (err) {
      console.error('Failed to load user session:', err);
      localStorage.removeItem('math_crush_token');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, [token]);

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    const { token: authToken, user: userData } = res.data;
    localStorage.setItem('math_crush_token', authToken);
    setToken(authToken);
    setUser(userData);
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await api.post('/auth/register', { name, email, password });
    const { token: authToken, user: userData } = res.data;
    localStorage.setItem('math_crush_token', authToken);
    setToken(authToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('math_crush_token');
    setToken(null);
    setUser(null);
  };

  const updateUserStats = (newPoints: number, newLevel: number, newStars: number) => {
    if (user) {
      setUser({
        ...user,
        total_points: newPoints,
        current_level: newLevel,
        total_stars: newStars
      });
    }
  };

  const refreshUser = async () => {
    await fetchCurrentUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
        updateUserStats,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
