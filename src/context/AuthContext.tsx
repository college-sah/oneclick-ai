import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  switchDemoRole: (role: 'user' | 'pro' | 'admin') => void;
  deductCredit: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default guest demo user if not logged in
const DEFAULT_DEMO_USER: User = {
  id: 'usr_demo_1',
  name: 'Alex Johnson',
  email: 'alex@example.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  role: 'user',
  plan: 'pro',
  credits: 245,
  totalCreditsUsed: 55,
  storageUsedBytes: 42 * 1024 * 1024,
  createdAt: '2026-01-15T10:00:00Z',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(DEFAULT_DEMO_USER);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const savedToken = localStorage.getItem('oneclickbg_token');
    if (savedToken) {
      api.getProfile()
        .then(res => {
          if (res.user) setUser(res.user);
        })
        .catch(() => {
          // Keep demo user
        });
    }
  }, []);

  const login = async (email: string, password?: string) => {
    setIsLoading(true);
    try {
      const res = await api.login(email, password);
      localStorage.setItem('oneclickbg_token', res.token);
      setUser(res.user);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await api.register(name, email, password);
      localStorage.setItem('oneclickbg_token', res.token);
      setUser(res.user);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch {
      // ignore
    } finally {
      localStorage.removeItem('oneclickbg_token');
      // Set to free tier guest user
      setUser({
        id: 'guest_' + Date.now(),
        name: 'Guest Creator',
        email: 'guest@oneclickbg.com',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        role: 'user',
        plan: 'free',
        credits: 5,
        totalCreditsUsed: 0,
        storageUsedBytes: 0,
        createdAt: new Date().toISOString(),
      });
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return;
    try {
      const res = await api.updateProfile(updates);
      setUser(res.user);
    } catch {
      setUser(prev => (prev ? { ...prev, ...updates } : null));
    }
  };

  const switchDemoRole = (role: 'user' | 'pro' | 'admin') => {
    if (role === 'admin') {
      const adminUser: User = {
        id: 'usr_admin_1',
        name: 'Admin Developer',
        email: 'admin@oneclickbg.com',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        role: 'admin',
        plan: 'business',
        credits: 9999,
        totalCreditsUsed: 3120,
        storageUsedBytes: 256 * 1024 * 1024,
        createdAt: '2025-11-01T08:00:00Z',
      };
      localStorage.setItem('oneclickbg_token', adminUser.id);
      setUser(adminUser);
    } else if (role === 'pro') {
      const proUser: User = {
        id: 'usr_demo_1',
        name: 'Alex Johnson (Pro)',
        email: 'alex@example.com',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        role: 'user',
        plan: 'pro',
        credits: 245,
        totalCreditsUsed: 55,
        storageUsedBytes: 42 * 1024 * 1024,
        createdAt: '2026-01-15T10:00:00Z',
      };
      localStorage.setItem('oneclickbg_token', proUser.id);
      setUser(proUser);
    } else {
      const freeUser: User = {
        id: 'usr_free_1',
        name: 'Sarah Parker (Free)',
        email: 'sarah@example.com',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        role: 'user',
        plan: 'free',
        credits: 3,
        totalCreditsUsed: 7,
        storageUsedBytes: 8 * 1024 * 1024,
        createdAt: '2026-02-01T12:00:00Z',
      };
      localStorage.setItem('oneclickbg_token', freeUser.id);
      setUser(freeUser);
    }
  };

  const deductCredit = () => {
    setUser(prev => {
      if (!prev) return null;
      return {
        ...prev,
        credits: Math.max(0, prev.credits - 1),
        totalCreditsUsed: prev.totalCreditsUsed + 1,
      };
    });
  };

  const refreshUser = async () => {
    try {
      const res = await api.getProfile();
      if (res.user) setUser(res.user);
    } catch {
      // ignore
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateUser,
        switchDemoRole,
        deductCredit,
        refreshUser,
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
