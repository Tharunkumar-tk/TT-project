import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { saveUser, loadUser, UserProfile, saveTutorialComplete, loadTutorialComplete } from '../utils/storage';

interface AuthError {
  type: 'account_not_found' | 'incorrect_password' | 'general';
  message: string;
}

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
  authError: AuthError | null;
  clearAuthError: () => void;
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
  const [authError, setAuthError] = useState<AuthError | null>(null);

  // Load user from storage on app start
  useEffect(() => {
    const savedUser = loadUser();
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

  const login = async (email: string, password: string, role: 'athlete' | 'coach') => {
    setAuthError(null);
    
    // Load all registered users from storage
    const registeredUsers = JSON.parse(localStorage.getItem('talent_track_all_users') || '[]');
    
    // Find user by email
    const existingUser = registeredUsers.find((u: UserProfile) => u.email.toLowerCase() === email.toLowerCase());
    
    if (!existingUser) {
      setAuthError({
        type: 'account_not_found',
        message: 'Account does not exist. Please check your email or sign up for a new account.'
      });
      throw new Error('Account not found');
    }

    // Check password (in real app, this would be hashed)
    const storedPassword = localStorage.getItem(`talent_track_password_${existingUser.id}`);
    if (storedPassword !== password) {
      setAuthError({
        type: 'incorrect_password',
        message: 'Incorrect password. Please try again.'
      });
      throw new Error('Incorrect password');
    }

    // Check role matches
    if (existingUser.role !== role) {
      setAuthError({
        type: 'general',
        message: `This account is registered as a ${existingUser.role}. Please select the correct role.`
      });
      throw new Error('Role mismatch');
    }

    // Login successful
    if (existingUser) {
      setUser(existingUser);
      saveUser(existingUser);
      return;
    }
  };

  const signup = async (email: string, password: string, name: string, role: 'athlete' | 'coach') => {
    setAuthError(null);
    
    // Check if email already exists
    const registeredUsers = JSON.parse(localStorage.getItem('talent_track_all_users') || '[]');
    const existingUser = registeredUsers.find((u: UserProfile) => u.email.toLowerCase() === email.toLowerCase());
    
    if (existingUser) {
      setAuthError({
        type: 'general',
        message: 'An account with this email already exists. Please sign in instead.'
      });
      throw new Error('Account already exists');
    }

    const newUser: UserProfile = {
      id: Date.now().toString(),
      email: email.toLowerCase(),
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

    // Save user to both current user and all users list
    setUser(newUser);
    saveUser(newUser);
    
    // Save to all users list
    const updatedUsers = [...registeredUsers, newUser];
    localStorage.setItem('talent_track_all_users', JSON.stringify(updatedUsers));
    
    // Save password (in real app, this would be hashed)
    localStorage.setItem(`talent_track_password_${newUser.id}`, password);
    
    setShowTutorial(true);
  };

  const logout = () => {
    setUser(null);
    setShowTutorial(false);
    setShowOnboarding(false);
    setAuthError(null);
  };

  const updateUser = (updates: Partial<UserProfile>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      saveUser(updatedUser);
      
      // Update in all users list too
      const registeredUsers = JSON.parse(localStorage.getItem('talent_track_all_users') || '[]');
      const updatedUsers = registeredUsers.map((u: UserProfile) => 
        u.id === user.id ? updatedUser : u
      );
      localStorage.setItem('talent_track_all_users', JSON.stringify(updatedUsers));
    }
  };

  const clearAuthError = () => {
    setAuthError(null);
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
    setShowOnboarding,
    authError,
    clearAuthError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};