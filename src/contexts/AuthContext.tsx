import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { saveUser, loadUser, UserProfile, saveTutorialComplete, loadTutorialComplete } from '../utils/storage';
import CoinNotification from '../components/UI/CoinNotification';

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
  showCoinNotification: (amount: number) => void;
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
  const [coinNotification, setCoinNotification] = useState<number | null>(null);

  // Load user from storage on app start
  useEffect(() => {
    const savedUser = loadUser();
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

  const login = async (email: string, password: string, role: 'athlete' | 'coach') => {
    setAuthError(null);
    
    try {
      // Simple login - create user with provided credentials
      const newUser: UserProfile = {
        id: Date.now().toString(),
        email: email.toLowerCase(),
        name: email.split('@')[0], // Use email prefix as name
        role,
        avatar: getDefaultAvatar(email.split('@')[0], undefined, Date.now().toString()),
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
      
      // Clear any existing errors
      setAuthError(null);
    } catch (error) {
      // Re-throw to be handled by the calling component
      throw error;
    }
  };

  const signup = async (email: string, password: string, name: string, role: 'athlete' | 'coach') => {
    setAuthError(null);
    
    try {
      // Check if email already exists
      const registeredUsers = JSON.parse(localStorage.getItem('talent_track_all_users') || '[]');
      const existingUser = registeredUsers.find((u: UserProfile) => 
        u.email.toLowerCase() === email.toLowerCase()
      );
      
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
        avatar: getDefaultAvatar(name, undefined, Date.now().toString()),
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
      
      // Show tutorial for athletes only
      if (role === 'athlete') {
        setShowTutorial(true);
      }
      
      // Clear any existing errors
      setAuthError(null);
    } catch (error) {
      // Re-throw to be handled by the calling component
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setShowTutorial(false);
    setShowOnboarding(false);
    setAuthError(null);
  };

  const updateUser = (updates: Partial<UserProfile>) => {
    if (user) {
      // Update avatar based on gender if gender is being updated and no custom avatar is set
      if (updates.gender && (user.avatar === 'default' || user.avatar?.startsWith('data:image/svg+xml'))) {
        updates.avatar = getDefaultAvatar(user.name, updates.gender, user.id);
      }
      
      const updatedUser = { ...user, ...updates };
      
      // Check if coins increased and show notification
      if (updates.coins && user.coins && updates.coins > user.coins) {
        const coinsGained = updates.coins - user.coins;
        setCoinNotification(coinsGained);
      }
      
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

  const showCoinNotification = (amount: number) => {
    setCoinNotification(amount);
  };

  const getRandomIndianAvatar = () => {
    // Return a placeholder that will be replaced by getDefaultAvatar
    return 'default';
  };

  const getDefaultAvatar = (name: string, gender?: string, userId?: string) => {
    if (gender === 'male') {
      return '/src/assets/6997484.png';
    } else if (gender === 'female') {
      return '/src/assets/6833605.png';
    } else {
      // Generate avatar with first letter of name
      const firstLetter = name.charAt(0).toUpperCase();
      const colors = ['bg-purple-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500', 'bg-indigo-500'];
      const colorIndex = userId ? parseInt(userId) % colors.length : Math.floor(Math.random() * colors.length);
      return `data:image/svg+xml,${encodeURIComponent(`
        <svg width="150" height="150" xmlns="http://www.w3.org/2000/svg">
          <rect width="150" height="150" fill="${colors[colorIndex] === 'bg-purple-500' ? '#8b5cf6' : colors[colorIndex] === 'bg-blue-500' ? '#3b82f6' : colors[colorIndex] === 'bg-green-500' ? '#10b981' : colors[colorIndex] === 'bg-yellow-500' ? '#f59e0b' : colors[colorIndex] === 'bg-red-500' ? '#ef4444' : '#6366f1'}"/>
          <text x="75" y="85" font-family="Arial, sans-serif" font-size="60" font-weight="bold" text-anchor="middle" fill="white">${firstLetter}</text>
        </svg>
      `)}`;
    }
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
    clearAuthError,
    showCoinNotification
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      {coinNotification && (
        <CoinNotification
          amount={coinNotification}
          onComplete={() => setCoinNotification(null)}
        />
      )}
    </AuthContext.Provider>
  );
};