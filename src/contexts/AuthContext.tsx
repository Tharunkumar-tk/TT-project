import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { saveUser, loadUser, UserProfile, saveTutorialComplete, loadTutorialComplete } from '../utils/storage';

interface AuthContextType {
  user: UserProfile | null;
  login: (email: string, password: string, role: 'athlete' | 'coach') => Promise<void>;
  signup: (email: string, password: string, name: string, role: 'athlete' | 'coach') => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<UserProfile>) => void;
  showTutorial: boolean;
  setShowTutorial: (show: boolean) => void;
  showOnboarding: boolean;
  setShowOnboarding: (show: boolean) => void;
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
  const [user, setUser] = useState<UserProfile | null>(null);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Load user from storage on app start
  useEffect(() => {
    const savedUser = loadUser();
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

  const login = async (email: string, password: string, role: 'athlete' | 'coach') => {
    // Check if user exists in storage
    const existingUser = loadUser();
    
    if (existingUser && existingUser.email === email) {
      setUser(existingUser);
      return;
    }

    // Create new user
    const newUser: UserProfile = {
      id: Date.now().toString(),
      email,
      name: email.split('@')[0],
      role,
      avatar: getRandomIndianAvatar(),
      onboardingComplete: false,
      profileComplete: false,
      ...(role === 'athlete' && {
        xp: 0,
        level: 1,
        coins: 50,
        streak: 0
      })
    };

    setUser(newUser);
    saveUser(newUser);

    // Show tutorial for new users
    const tutorialComplete = loadTutorialComplete();
    if (!tutorialComplete) {
      setShowTutorial(true);
    } else if (!newUser.onboardingComplete) {
      setShowOnboarding(true);
    }
  };

  const signup = async (email: string, password: string, name: string, role: 'athlete' | 'coach') => {
    const newUser: UserProfile = {
      id: Date.now().toString(),
      email,
      name,
      role,
      avatar: getRandomIndianAvatar(),
      onboardingComplete: false,
      profileComplete: false,
      ...(role === 'athlete' && {
        xp: 0,
        level: 1,
        coins: 50,
        streak: 0
      })
    };

    setUser(newUser);
    saveUser(newUser);
    setShowTutorial(true);
  };

  const logout = () => {
    setUser(null);
    setShowTutorial(false);
    setShowOnboarding(false);
  };

  const updateUser = (updates: Partial<UserProfile>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      saveUser(updatedUser);
    }
  };

  const getRandomIndianAvatar = () => {
    const avatars = [
      'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
      'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
      'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150',
      'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
      'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150'
    ];
    return avatars[Math.floor(Math.random() * avatars.length)];
  };

  const value = {
    user,
    login,
    signup,
    logout,
    updateUser,
    showTutorial,
    setShowTutorial,
    showOnboarding,
    setShowOnboarding
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};