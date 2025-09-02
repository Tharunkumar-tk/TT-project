import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'athlete' | 'coach';
  avatar?: string;
  xp?: number;
  level?: number;
  coins?: number;
  streak?: number;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: 'athlete' | 'coach') => Promise<void>;
  signup: (email: string, password: string, name: string, role: 'athlete' | 'coach') => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string, role: 'athlete' | 'coach') => {
    // Mock login - in real app, this would call an API
    const mockUser: User = {
      id: '1',
      email,
      name: email.split('@')[0],
      role,
      avatar: `https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150`,
      ...(role === 'athlete' && {
        xp: 1250,
        level: 5,
        coins: 340,
        streak: 12
      })
    };
    setUser(mockUser);
  };

  const signup = async (email: string, password: string, name: string, role: 'athlete' | 'coach') => {
    // Mock signup
    const mockUser: User = {
      id: '1',
      email,
      name,
      role,
      avatar: `https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150`,
      ...(role === 'athlete' && {
        xp: 0,
        level: 1,
        coins: 50,
        streak: 0
      })
    };
    setUser(mockUser);
  };

  const logout = () => {
    setUser(null);
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  const value = {
    user,
    login,
    signup,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};