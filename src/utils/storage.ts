// Persistent storage utilities
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'athlete' | 'coach';
  avatar?: string;
  xp?: number;
  level?: number;
  coins?: number;
  streak?: number;
  onboardingComplete?: boolean;
  profileComplete?: boolean;
  // Survey data
  gender?: string;
  mobile?: string;
  state?: string;
  district?: string;
  achievements?: string;
  // Physical stats
  height?: string;
  weight?: string;
  heightProof?: string;
  // Coach specific
  bio?: string;
  expertise?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  category: 'consistency' | 'strength' | 'endurance' | 'speed' | 'special';
  icon: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  xpReward: number;
  coinReward: number;
  requirements: string;
  linkedChallenge?: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'team' | 'seasonal';
  activityType: 'jump' | 'shuttle' | 'pushup' | 'situp' | 'endurance' | 'general';
  progress: number;
  maxProgress: number;
  xpReward: number;
  coinReward: number;
  deadline: string;
  completed: boolean;
  difficulty?: string;
  category?: string;
}

const STORAGE_KEYS = {
  USER: 'talent_track_user',
  BADGES: 'talent_track_badges',
  CHALLENGES: 'talent_track_challenges',
  TUTORIAL_COMPLETE: 'talent_track_tutorial'
};

export const saveToStorage = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save to storage:', error);
  }
};

export const loadFromStorage = (key: string) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to load from storage:', error);
    return null;
  }
};

export const saveUser = (user: UserProfile) => {
  saveToStorage(STORAGE_KEYS.USER, user);
};

export const loadUser = (): UserProfile | null => {
  return loadFromStorage(STORAGE_KEYS.USER);
};

export const saveBadges = (badges: Badge[]) => {
  saveToStorage(STORAGE_KEYS.BADGES, badges);
};

export const loadBadges = (): Badge[] | null => {
  return loadFromStorage(STORAGE_KEYS.BADGES);
};

export const saveChallenges = (challenges: Challenge[]) => {
  saveToStorage(STORAGE_KEYS.CHALLENGES, challenges);
};

export const loadChallenges = (): Challenge[] | null => {
  return loadFromStorage(STORAGE_KEYS.CHALLENGES);
};

export const saveTutorialComplete = (complete: boolean) => {
  saveToStorage(STORAGE_KEYS.TUTORIAL_COMPLETE, complete);
};

export const loadTutorialComplete = (): boolean => {
  return loadFromStorage(STORAGE_KEYS.TUTORIAL_COMPLETE) || false;
};

export const clearStorage = () => {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
};