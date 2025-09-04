import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { saveBadges, loadBadges, saveChallenges, loadChallenges, Badge, Challenge } from '../utils/storage';
import { useAuth } from './AuthContext';

interface TrainingVideo {
  id: string;
  title: string;
  description: string;
  category: 'strength' | 'endurance' | 'flexibility' | 'recovery' | 'speed';
  thumbnail: string;
  duration: string;
  instructor: string;
  youtubeId: string;
}

interface GameContextType {
  badges: Badge[];
  challenges: Challenge[];
  trainingVideos: TrainingVideo[];
  unlockBadge: (badgeId: string) => void;
  updateProgress: (challengeId: string, progress: number) => { xpEarned: number; coinsEarned: number; badgesUnlocked: Badge[] };
  completeChallenge: (challengeId: string) => { xpEarned: number; coinsEarned: number; badgesUnlocked: Badge[] };
  earnXP: (amount: number) => void;
  earnCoins: (amount: number) => void;
  updateBadgeProgress: (badgeId: string, progress: number) => void;
  checkBadgeUnlocks: (activityType: string, count: number) => Badge[];
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const { user, updateUser } = useAuth();

  // Initialize data on mount
  useEffect(() => {
    const savedBadges = loadBadges();
    const savedChallenges = loadChallenges();

    if (savedBadges) {
      setBadges(savedBadges);
    } else {
      setBadges(getInitialBadges());
    }

    if (savedChallenges) {
      setChallenges(savedChallenges);
    } else {
      setChallenges(getInitialChallenges());
    }
  }, []);

  // Save to storage whenever data changes
  useEffect(() => {
    if (badges.length > 0) {
      saveBadges(badges);
    }
  }, [badges]);

  useEffect(() => {
    if (challenges.length > 0) {
      saveChallenges(challenges);
    }
  }, [challenges]);

  const trainingVideos: TrainingVideo[] = [
    {
      id: 'strength-basics',
      title: 'Strength Training Basics',
      description: 'Learn fundamental strength training techniques for beginners',
      category: 'strength',
      thumbnail: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=400',
      duration: '15:30',
      instructor: 'Coach Arjun',
      youtubeId: 'IODxDxX7oi4'
    },
    {
      id: 'endurance-running',
      title: 'Endurance Training (Running Tips)',
      description: 'Improve your running endurance and cardiovascular fitness',
      category: 'endurance',
      thumbnail: 'https://images.pexels.com/photos/2294361/pexels-photo-2294361.jpeg?auto=compress&cs=tinysrgb&w=400',
      duration: '12:45',
      instructor: 'Coach Priya',
      youtubeId: 'kVnyY17VS9Y'
    },
    {
      id: 'speed-drills',
      title: 'Speed Drills for Athletes',
      description: 'Advanced speed and agility training techniques',
      category: 'speed',
      thumbnail: 'https://images.pexels.com/photos/2803158/pexels-photo-2803158.jpeg?auto=compress&cs=tinysrgb&w=400',
      duration: '18:20',
      instructor: 'Coach Sanjay',
      youtubeId: 'R2_Mn-qRKjA'
    },
    {
      id: 'flexibility-routine',
      title: 'Flexibility & Stretching Routine',
      description: 'Essential stretches for athletes to prevent injury and improve mobility',
      category: 'flexibility',
      thumbnail: 'https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg?auto=compress&cs=tinysrgb&w=400',
      duration: '10:15',
      instructor: 'Coach Meena',
      youtubeId: 'g_tea8ZNk5A'
    },
    {
      id: 'recovery-prevention',
      title: 'Recovery & Injury Prevention',
      description: 'Learn proper recovery techniques and injury prevention strategies',
      category: 'recovery',
      thumbnail: 'https://images.pexels.com/photos/3822864/pexels-photo-3822864.jpeg?auto=compress&cs=tinysrgb&w=400',
      duration: '14:10',
      instructor: 'Coach Rahul',
      youtubeId: 'tkH2-_jMCSk'
    },
    {
      id: 'pushup-form',
      title: 'Perfect Push-Up Form',
      description: 'Master the proper push-up technique for maximum effectiveness',
      category: 'strength',
      thumbnail: 'https://images.pexels.com/photos/416809/pexels-photo-416809.jpeg?auto=compress&cs=tinysrgb&w=400',
      duration: '8:45',
      instructor: 'Coach Arjun',
      youtubeId: 'IODxDxX7oi4'
    },
    {
      id: 'jump-training',
      title: 'Vertical Jump Training',
      description: 'Improve your vertical jump with these proven techniques',
      category: 'speed',
      thumbnail: 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=400',
      duration: '11:30',
      instructor: 'Coach Sanjay',
      youtubeId: 'R2_Mn-qRKjA'
    },
    {
      id: 'core-strength',
      title: 'Core Strengthening Exercises',
      description: 'Build a strong core with these effective exercises',
      category: 'strength',
      thumbnail: 'https://images.pexels.com/photos/3768916/pexels-photo-3768916.jpeg?auto=compress&cs=tinysrgb&w=400',
      duration: '13:20',
      instructor: 'Coach Meena',
      youtubeId: 'g_tea8ZNk5A'
    }
  ];

  const unlockBadge = (badgeId: string) => {
    setBadges(prev => prev.map(badge => 
      badge.id === badgeId ? { ...badge, unlocked: true, progress: badge.maxProgress } : badge
    ));
  };

  const updateProgress = (challengeId: string, progress: number) => {
    let xpEarned = 0;
    let coinsEarned = 0;
    let badgesUnlocked: Badge[] = [];
    
    setChallenges(prev => prev.map(challenge => {
      if (challenge.id === challengeId) {
        const newProgress = Math.min(progress, challenge.maxProgress);
        const wasCompleted = challenge.completed;
        const isNowCompleted = newProgress >= challenge.maxProgress;
        
        // Award XP and coins if challenge is newly completed
        if (!wasCompleted && isNowCompleted) {
          xpEarned = challenge.xpReward;
          coinsEarned = challenge.coinReward;
          
          // Check for badge unlocks based on activity type and progress
          badgesUnlocked = checkBadgeUnlocks(challenge.activityType, newProgress);
          
          // Update user stats
          if (user) {
            updateUser({
              xp: (user.xp || 0) + xpEarned,
              coins: (user.coins || 0) + coinsEarned,
              streak: Math.max((user.streak || 0), (user.streak || 0) + 1)
            });
          }
        }
        
        return { 
          ...challenge, 
          progress: newProgress,
          completed: isNowCompleted
        };
      }
      return challenge;
    }));
    
    return { xpEarned, coinsEarned, badgesUnlocked };
  };

  const updateBadgeProgress = (badgeId: string, progress: number) => {
    setBadges(prev => prev.map(badge =>
      badge.id === badgeId 
        ? { ...badge, progress: Math.min(progress, badge.maxProgress) }
        : badge
    ));
  };

  const completeChallenge = (challengeId: string) => {
    let xpEarned = 0;
    let coinsEarned = 0;
    let badgesUnlocked: Badge[] = [];
    
    setChallenges(prev => prev.map(challenge => {
      if (challenge.id === challengeId && !challenge.completed) {
        xpEarned = challenge.xpReward;
        coinsEarned = challenge.coinReward;
        
        // Check for badge unlocks
        badgesUnlocked = checkBadgeUnlocks(challenge.activityType, challenge.maxProgress);
        
        // Update user stats
        if (user) {
          updateUser({
            xp: (user.xp || 0) + xpEarned,
            coins: (user.coins || 0) + coinsEarned,
            streak: Math.max((user.streak || 0), (user.streak || 0) + 1)
          });
        }
        
        return { ...challenge, completed: true, progress: challenge.maxProgress };
      }
      return challenge;
    }));
    
    return { xpEarned, coinsEarned, badgesUnlocked };
  };

  const checkBadgeUnlocks = (activityType: string, count: number): Badge[] => {
    const unlockedBadges: Badge[] = [];
    
    setBadges(prev => prev.map(badge => {
      if (!badge.unlocked) {
        let shouldUnlock = false;
        
        // Check specific badge unlock conditions
        switch (badge.id) {
          case 'day-one-champ':
            shouldUnlock = true; // First challenge completion
            break;
          case 'rookie-runner':
            shouldUnlock = activityType === 'pushup' || activityType === 'situp';
            break;
          case 'pushup-pro':
            shouldUnlock = activityType === 'pushup' && count >= 50;
            break;
          case 'iron-core':
            shouldUnlock = activityType === 'situp' && count >= 100;
            break;
          case 'stamina-starter':
            shouldUnlock = activityType === 'endurance';
            break;
          case 'sprint-rookie':
            shouldUnlock = activityType === 'shuttle';
            break;
          case 'video-verified':
            shouldUnlock = true; // Any video upload
            break;
          // Add more badge unlock conditions as needed
        }
        
        if (shouldUnlock) {
          unlockedBadges.push({ ...badge, unlocked: true, progress: badge.maxProgress });
          
          // Award badge XP and coins to user
          if (user) {
            updateUser({
              xp: (user.xp || 0) + badge.xpReward,
              coins: (user.coins || 0) + badge.coinReward
            });
          }
          
          return { ...badge, unlocked: true, progress: badge.maxProgress };
        }
        
        // Update progress for badges that track cumulative progress
        if (badge.id === 'iron-arms' && activityType === 'pushup') {
          const newProgress = Math.min(badge.progress + count, badge.maxProgress);
          if (newProgress >= badge.maxProgress && !badge.unlocked) {
            unlockedBadges.push({ ...badge, unlocked: true, progress: badge.maxProgress });
            if (user) {
              updateUser({
                xp: (user.xp || 0) + badge.xpReward,
                coins: (user.coins || 0) + badge.coinReward
              });
            }
            return { ...badge, unlocked: true, progress: badge.maxProgress };
          }
          return { ...badge, progress: newProgress };
        }
        
        if (badge.id === 'abs-of-steel' && activityType === 'situp') {
          const newProgress = Math.min(badge.progress + count, badge.maxProgress);
          if (newProgress >= badge.maxProgress && !badge.unlocked) {
            unlockedBadges.push({ ...badge, unlocked: true, progress: badge.maxProgress });
            if (user) {
              updateUser({
                xp: (user.xp || 0) + badge.xpReward,
                coins: (user.coins || 0) + badge.coinReward
              });
            }
            return { ...badge, unlocked: true, progress: badge.maxProgress };
          }
          return { ...badge, progress: newProgress };
        }
      }
      return badge;
    }));
    
    return unlockedBadges;
  };

  const earnXP = (amount: number) => {
    console.log(`Earned ${amount} XP!`);
  };

  const earnCoins = (amount: number) => {
    console.log(`Earned ${amount} coins!`);
  };

  const value = {
    badges,
    challenges,
    trainingVideos,
    unlockBadge,
    updateProgress,
    completeChallenge,
    earnXP,
    earnCoins,
    updateBadgeProgress,
    checkBadgeUnlocks
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};

// Initial data functions
const getInitialBadges = (): Badge[] => [
  // Consistency Badges (6)
  {
    id: 'day-one-champ',
    name: 'Day One Champ',
    description: 'Complete your first challenge',
    category: 'consistency',
    icon: '🏆',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    xpReward: 50,
    coinReward: 10,
    requirements: 'Complete any challenge'
  },
  {
    id: 'weekly-warrior',
    name: 'Weekly Warrior',
    description: 'Log in for 7 consecutive days',
    category: 'consistency',
    icon: '🔥',
    unlocked: false,
    progress: 0,
    maxProgress: 7,
    xpReward: 200,
    coinReward: 50,
    requirements: 'Login for 7 consecutive days'
  },
  {
    id: 'streak-master',
    name: 'Streak Master',
    description: 'Maintain a 30-day activity streak',
    category: 'consistency',
    icon: '⚡',
    unlocked: false,
    progress: 0,
    maxProgress: 30,
    xpReward: 500,
    coinReward: 150,
    requirements: 'Maintain 30-day streak'
  },
  {
    id: 'consistency-king',
    name: 'Consistency King',
    description: 'Complete challenges for 60 consecutive days',
    category: 'consistency',
    icon: '👑',
    unlocked: false,
    progress: 0,
    maxProgress: 60,
    xpReward: 1000,
    coinReward: 300,
    requirements: 'Complete challenges for 60 days'
  },
  {
    id: 'early-bird',
    name: 'Early Bird',
    description: 'Train before 6 AM for 10 days',
    category: 'consistency',
    icon: '🐦',
    unlocked: false,
    progress: 0,
    maxProgress: 10,
    xpReward: 250,
    coinReward: 60,
    requirements: 'Train before 6 AM for 10 days'
  },
  {
    id: 'night-owl',
    name: 'Night Owl',
    description: 'Train after 10 PM for 10 days',
    category: 'consistency',
    icon: '🦉',
    unlocked: false,
    progress: 0,
    maxProgress: 10,
    xpReward: 250,
    coinReward: 60,
    requirements: 'Train after 10 PM for 10 days'
  },

  // Strength Badges (8)
  {
    id: 'rookie-runner',
    name: 'Rookie Runner',
    description: 'Complete your first strength exercise',
    category: 'strength',
    icon: '🏃‍♂️',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    xpReward: 75,
    coinReward: 15,
    requirements: 'Complete first strength exercise'
  },
  {
    id: 'pushup-pro',
    name: 'Push-up Pro',
    description: 'Complete 50 push-ups in a single session',
    category: 'strength',
    icon: '💪',
    unlocked: false,
    progress: 0,
    maxProgress: 50,
    xpReward: 200,
    coinReward: 40,
    requirements: '50 push-ups in one session'
  },
  {
    id: 'iron-core',
    name: 'Iron Core',
    description: 'Complete 100 sit-ups in one session',
    category: 'strength',
    icon: '🔥',
    unlocked: false,
    progress: 0,
    maxProgress: 100,
    xpReward: 250,
    coinReward: 50,
    requirements: '100 sit-ups in one session'
  },
  {
    id: 'strength-seeker',
    name: 'Strength Seeker',
    description: 'Complete 10 different strength challenges',
    category: 'strength',
    icon: '🔍',
    unlocked: false,
    progress: 0,
    maxProgress: 10,
    xpReward: 300,
    coinReward: 75,
    requirements: 'Complete 10 strength challenges'
  },
  {
    id: 'iron-arms',
    name: 'Iron Arms',
    description: 'Do 500 push-ups total across sessions',
    category: 'strength',
    icon: '🦾',
    unlocked: false,
    progress: 0,
    maxProgress: 500,
    xpReward: 400,
    coinReward: 100,
    requirements: '500 total push-ups'
  },
  {
    id: 'abs-of-steel',
    name: 'Abs of Steel',
    description: '1000 sit-ups total across sessions',
    category: 'strength',
    icon: '⚙️',
    unlocked: false,
    progress: 0,
    maxProgress: 1000,
    xpReward: 500,
    coinReward: 125,
    requirements: '1000 total sit-ups'
  },
  {
    id: 'muscle-machine',
    name: 'Muscle Machine',
    description: 'Reach combined 2000 push-ups + sit-ups',
    category: 'strength',
    icon: '🤖',
    unlocked: false,
    progress: 0,
    maxProgress: 2000,
    xpReward: 750,
    coinReward: 200,
    requirements: '2000 combined exercises'
  },
  {
    id: 'strength-legend',
    name: 'Strength Legend',
    description: 'Master all strength-based challenges',
    category: 'strength',
    icon: '🌟',
    unlocked: false,
    progress: 0,
    maxProgress: 15,
    xpReward: 1000,
    coinReward: 300,
    requirements: 'Complete all strength challenges'
  },

  // Endurance Badges (8)
  {
    id: 'stamina-starter',
    name: 'Stamina Starter',
    description: 'Complete your first endurance challenge',
    category: 'endurance',
    icon: '🏃',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    xpReward: 75,
    coinReward: 15,
    requirements: 'Complete first endurance challenge'
  },
  {
    id: 'distance-destroyer',
    name: 'Distance Destroyer',
    description: 'Run 5 km total across challenges',
    category: 'endurance',
    icon: '🎯',
    unlocked: false,
    progress: 0,
    maxProgress: 5,
    xpReward: 200,
    coinReward: 50,
    requirements: '5km total distance'
  },
  {
    id: 'marathon-mindset',
    name: 'Marathon Mindset',
    description: 'Run 10 km total across sessions',
    category: 'endurance',
    icon: '🧠',
    unlocked: false,
    progress: 0,
    maxProgress: 10,
    xpReward: 300,
    coinReward: 75,
    requirements: '10km total distance'
  },
  {
    id: 'endurance-explorer',
    name: 'Endurance Explorer',
    description: 'Complete 15 endurance challenges',
    category: 'endurance',
    icon: '🗺️',
    unlocked: false,
    progress: 0,
    maxProgress: 15,
    xpReward: 400,
    coinReward: 100,
    requirements: 'Complete 15 endurance challenges'
  },
  {
    id: 'never-stopper',
    name: 'Never Stopper',
    description: 'Run 25 km total across sessions',
    category: 'endurance',
    icon: '🚀',
    unlocked: false,
    progress: 0,
    maxProgress: 25,
    xpReward: 600,
    coinReward: 150,
    requirements: '25km total distance'
  },
  {
    id: 'cardio-champion',
    name: 'Cardio Champion',
    description: 'Complete 30 cardio-based activities',
    category: 'endurance',
    icon: '❤️',
    unlocked: false,
    progress: 0,
    maxProgress: 30,
    xpReward: 700,
    coinReward: 175,
    requirements: '30 cardio activities'
  },
  {
    id: 'endurance-elite',
    name: 'Endurance Elite',
    description: 'Run 50 km total across sessions',
    category: 'endurance',
    icon: '👑',
    unlocked: false,
    progress: 0,
    maxProgress: 50,
    xpReward: 1000,
    coinReward: 250,
    requirements: '50km total distance'
  },
  {
    id: 'ultra-runner',
    name: 'Ultra Runner',
    description: 'Complete the ultimate endurance challenge',
    category: 'endurance',
    icon: '🌟',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    xpReward: 1500,
    coinReward: 400,
    requirements: 'Run 100km total'
  },

  // Speed Badges (8)
  {
    id: 'sprint-rookie',
    name: 'Sprint Rookie',
    description: 'Complete your first sprint challenge',
    category: 'speed',
    icon: '🏃‍♂️',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    xpReward: 75,
    coinReward: 15,
    requirements: 'Complete first sprint challenge'
  },
  {
    id: 'quick-feet',
    name: 'Quick Feet',
    description: 'Complete 10 shuttle runs',
    category: 'speed',
    icon: '🦶',
    unlocked: false,
    progress: 0,
    maxProgress: 10,
    xpReward: 200,
    coinReward: 40,
    requirements: 'Complete 10 shuttle runs'
  },
  {
    id: 'speed-demon',
    name: 'Speed Demon',
    description: 'Finish shuttle run under 12 seconds',
    category: 'speed',
    icon: '👹',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    xpReward: 250,
    coinReward: 60,
    requirements: 'Shuttle run under 12 seconds'
  },
  {
    id: 'agility-ace',
    name: 'Agility Ace',
    description: 'Complete 20 agility-based challenges',
    category: 'speed',
    icon: '🎯',
    unlocked: false,
    progress: 0,
    maxProgress: 20,
    xpReward: 350,
    coinReward: 85,
    requirements: '20 agility challenges'
  },
  {
    id: 'flash-runner',
    name: 'Flash Runner',
    description: 'Sprint 100m under 15 seconds',
    category: 'speed',
    icon: '⚡',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    xpReward: 400,
    coinReward: 100,
    requirements: 'Sprint 100m under 15 seconds'
  },
  {
    id: 'lightning-bolt',
    name: 'Lightning Bolt',
    description: 'Win 10 speed-based challenges',
    category: 'speed',
    icon: '🌩️',
    unlocked: false,
    progress: 0,
    maxProgress: 10,
    xpReward: 500,
    coinReward: 125,
    requirements: 'Win 10 speed challenges'
  },
  {
    id: 'velocity-master',
    name: 'Velocity Master',
    description: 'Achieve top speed in 5 different activities',
    category: 'speed',
    icon: '🚄',
    unlocked: false,
    progress: 0,
    maxProgress: 5,
    xpReward: 600,
    coinReward: 150,
    requirements: 'Top speed in 5 activities'
  },
  {
    id: 'speed-legend',
    name: 'Speed Legend',
    description: 'Master all speed and agility challenges',
    category: 'speed',
    icon: '🌟',
    unlocked: false,
    progress: 0,
    maxProgress: 25,
    xpReward: 1200,
    coinReward: 350,
    requirements: 'Complete all speed challenges'
  },

  // Special Badges (8)
  {
    id: 'video-verified',
    name: 'Video Verified',
    description: 'Successfully upload your first verified video',
    category: 'special',
    icon: '📹',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    xpReward: 75,
    coinReward: 15,
    requirements: 'Upload first verified video'
  },
  {
    id: 'perfect-form',
    name: 'Perfect Form',
    description: 'Receive excellent form rating 5 times',
    category: 'special',
    icon: '✨',
    unlocked: false,
    progress: 0,
    maxProgress: 5,
    xpReward: 300,
    coinReward: 75,
    requirements: 'Get 5 excellent form ratings'
  },
  {
    id: 'challenge-crusher',
    name: 'Challenge Crusher',
    description: 'Complete 25 different challenges',
    category: 'special',
    icon: '🔨',
    unlocked: false,
    progress: 0,
    maxProgress: 25,
    xpReward: 500,
    coinReward: 125,
    requirements: 'Complete 25 different challenges'
  },
  {
    id: 'district-champ',
    name: 'District Champ',
    description: 'Rank #1 in your district leaderboard',
    category: 'special',
    icon: '🏅',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    xpReward: 750,
    coinReward: 200,
    requirements: 'Rank #1 in district'
  },
  {
    id: 'state-champion',
    name: 'State Champion',
    description: 'Rank in top 10 of your state',
    category: 'special',
    icon: '🎖️',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    xpReward: 1000,
    coinReward: 300,
    requirements: 'Top 10 in state ranking'
  },
  {
    id: 'national-hero',
    name: 'National Hero',
    description: 'Rank in top 100 nationally',
    category: 'special',
    icon: '🇮🇳',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    xpReward: 1500,
    coinReward: 500,
    requirements: 'Top 100 national ranking'
  },
  {
    id: 'mentor-badge',
    name: 'Mentor',
    description: 'Help 10 other athletes improve',
    category: 'special',
    icon: '🤝',
    unlocked: false,
    progress: 0,
    maxProgress: 10,
    xpReward: 600,
    coinReward: 150,
    requirements: 'Help 10 athletes'
  },
  {
    id: 'ultimate-athlete',
    name: 'Ultimate Athlete',
    description: 'Unlock all other 29 badges',
    category: 'special',
    icon: '🌟',
    unlocked: false,
    progress: 0,
    maxProgress: 29,
    xpReward: 2000,
    coinReward: 1000,
    requirements: 'Unlock all other badges'
  }
];

const getInitialChallenges = (): Challenge[] => [
  {
    id: 'daily-jump',
    title: 'Daily Leap',
    description: 'Complete a jump test today',
    type: 'daily',
    activityType: 'jump',
    progress: 0,
    maxProgress: 1,
    xpReward: 50,
    coinReward: 10,
    deadline: '2025-01-13T23:59:59',
    completed: false
  },
  {
    id: 'daily-pushups',
    title: 'Power Push-ups',
    description: 'Complete 25 push-ups with proper form',
    type: 'daily',
    activityType: 'pushup',
    progress: 0,
    maxProgress: 25,
    xpReward: 60,
    coinReward: 12,
    deadline: '2025-01-13T23:59:59',
    completed: false,
    difficulty: 'Medium',
    category: 'Strength'
  },
  {
    id: 'weekly-run',
    title: 'Distance Destroyer',
    description: 'Run a total of 10km this week',
    type: 'weekly',
    activityType: 'endurance',
    progress: 0,
    maxProgress: 10,
    xpReward: 200,
    coinReward: 50,
    deadline: '2025-01-19T23:59:59',
    completed: false,
    difficulty: 'Hard',
    category: 'Endurance'
  },
  {
    id: 'shuttle-sprint',
    title: 'Shuttle Sprint Challenge',
    description: 'Complete 5 shuttle runs under 13 seconds each',
    type: 'weekly',
    activityType: 'shuttle',
    progress: 0,
    maxProgress: 5,
    xpReward: 300,
    coinReward: 75,
    deadline: '2025-01-19T23:59:59',
    completed: false,
    difficulty: 'Hard',
    category: 'Speed'
  },
  {
    id: 'core-crusher',
    title: 'Core Crusher',
    description: 'Complete 50 sit-ups today',
    type: 'daily',
    activityType: 'situp',
    progress: 0,
    maxProgress: 50,
    xpReward: 70,
    coinReward: 14,
    deadline: '2025-01-13T23:59:59',
    completed: false,
    difficulty: 'Medium',
    category: 'Strength'
  }
];