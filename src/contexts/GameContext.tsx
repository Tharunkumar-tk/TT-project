import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Badge {
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

interface Challenge {
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

interface LeaderboardEntry {
  id: string;
  name: string;
  avatar: string;
  score: number;
  rank: number;
  xp: number;
}

interface TrainingVideo {
  id: string;
  title: string;
  description: string;
  category: 'strength' | 'endurance' | 'flexibility' | 'recovery';
  thumbnail: string;
  duration: string;
  instructor: string;
}

interface GameContextType {
  badges: Badge[];
  challenges: Challenge[];
  leaderboard: LeaderboardEntry[];
  trainingVideos: TrainingVideo[];
  unlockBadge: (badgeId: string) => void;
  updateProgress: (challengeId: string, progress: number) => void;
  completeChallenge: (challengeId: string) => void;
  earnXP: (amount: number) => void;
  earnCoins: (amount: number) => void;
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
  const [badges, setBadges] = useState<Badge[]>([
    // Consistency Badges
    {
      id: 'day-one-champ',
      name: 'Day One Champ',
      description: 'Complete your first challenge',
      category: 'consistency',
      icon: '🏆',
      unlocked: true,
      progress: 1,
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
      progress: 5,
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
      progress: 12,
      maxProgress: 30,
      xpReward: 500,
      coinReward: 150,
      requirements: 'Maintain 30-day streak'
    },
    {
      id: 'night-owl',
      name: 'Night Owl',
      description: 'Train after 10 PM for 5 days',
      category: 'consistency',
      icon: '🦉',
      unlocked: false,
      progress: 2,
      maxProgress: 5,
      xpReward: 150,
      coinReward: 30,
      requirements: 'Train after 10 PM for 5 days'
    },
    {
      id: 'early-bird',
      name: 'Early Bird',
      description: 'Train before 6 AM for 5 days',
      category: 'consistency',
      icon: '🐦',
      unlocked: false,
      progress: 0,
      maxProgress: 5,
      xpReward: 150,
      coinReward: 30,
      requirements: 'Train before 6 AM for 5 days'
    },

    // Strength Badges
    {
      id: 'pushup-pro',
      name: 'Push-up Pro',
      description: 'Complete 50 push-ups in a single session',
      category: 'strength',
      icon: '💪',
      unlocked: false,
      progress: 28,
      maxProgress: 50,
      xpReward: 200,
      coinReward: 40,
      requirements: '50 push-ups in one session',
      linkedChallenge: 'daily-pushups'
    },
    {
      id: 'core-crusher',
      name: 'Core Crusher',
      description: 'Complete 100 sit-ups',
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
      id: 'iron-arms',
      name: 'Iron Arms',
      description: 'Do 200 push-ups total across sessions',
      category: 'strength',
      icon: '🦾',
      unlocked: false,
      progress: 85,
      maxProgress: 200,
      xpReward: 300,
      coinReward: 60,
      requirements: '200 total push-ups'
    },
    {
      id: 'abs-of-steel',
      name: 'Abs of Steel',
      description: '300 sit-ups total',
      category: 'strength',
      icon: '⚙️',
      unlocked: false,
      progress: 120,
      maxProgress: 300,
      xpReward: 400,
      coinReward: 80,
      requirements: '300 total sit-ups'
    },
    {
      id: 'muscle-machine',
      name: 'Muscle Machine',
      description: 'Reach a combined 1000 push-ups + sit-ups',
      category: 'strength',
      icon: '🤖',
      unlocked: false,
      progress: 205,
      maxProgress: 1000,
      xpReward: 750,
      coinReward: 200,
      requirements: '1000 combined push-ups and sit-ups'
    },

    // Endurance Badges
    {
      id: 'shuttle-starter',
      name: 'Shuttle Starter',
      description: 'Complete 10 shuttle runs',
      category: 'endurance',
      icon: '🏃',
      unlocked: false,
      progress: 3,
      maxProgress: 10,
      xpReward: 150,
      coinReward: 30,
      requirements: 'Complete 10 shuttle runs'
    },
    {
      id: 'distance-destroyer',
      name: 'Distance Destroyer',
      description: 'Run 2 km nonstop',
      category: 'endurance',
      icon: '🎯',
      unlocked: false,
      progress: 0,
      maxProgress: 1,
      xpReward: 300,
      coinReward: 75,
      requirements: 'Run 2km without stopping',
      linkedChallenge: 'weekly-run'
    },
    {
      id: 'marathon-mindset',
      name: 'Marathon Mindset',
      description: 'Run 5 km total across challenges',
      category: 'endurance',
      icon: '🧠',
      unlocked: false,
      progress: 3.2,
      maxProgress: 5,
      xpReward: 400,
      coinReward: 100,
      requirements: '5km total distance'
    },
    {
      id: 'never-stopper',
      name: 'Never Stopper',
      description: 'Run 10 km total across sessions',
      category: 'endurance',
      icon: '🚀',
      unlocked: false,
      progress: 3.2,
      maxProgress: 10,
      xpReward: 600,
      coinReward: 150,
      requirements: '10km total distance'
    },
    {
      id: 'endurance-elite',
      name: 'Endurance Elite',
      description: 'Run 20 km total across sessions',
      category: 'endurance',
      icon: '👑',
      unlocked: false,
      progress: 3.2,
      maxProgress: 20,
      xpReward: 1000,
      coinReward: 300,
      requirements: '20km total distance'
    },

    // Speed Badges
    {
      id: 'sprint-rookie',
      name: 'Sprint Rookie',
      description: 'Complete your first sprint challenge',
      category: 'speed',
      icon: '🏃‍♂️',
      unlocked: false,
      progress: 0,
      maxProgress: 1,
      xpReward: 100,
      coinReward: 20,
      requirements: 'Complete first sprint challenge'
    },
    {
      id: 'speed-demon',
      name: 'Speed Demon',
      description: 'Finish a shuttle run under benchmark time',
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
      id: 'quick-feet',
      name: 'Quick Feet',
      description: 'Improve shuttle run time by 20%',
      category: 'speed',
      icon: '🦶',
      unlocked: false,
      progress: 0,
      maxProgress: 1,
      xpReward: 300,
      coinReward: 75,
      requirements: 'Improve shuttle time by 20%'
    },
    {
      id: 'flash-runner',
      name: 'Flash Runner',
      description: 'Sprint 100m in benchmark time',
      category: 'speed',
      icon: '⚡',
      unlocked: false,
      progress: 0,
      maxProgress: 1,
      xpReward: 350,
      coinReward: 90,
      requirements: 'Sprint 100m under 15 seconds'
    },
    {
      id: 'lightning-bolt',
      name: 'Lightning Bolt',
      description: 'Win 5 speed-based challenges',
      category: 'speed',
      icon: '🌩️',
      unlocked: false,
      progress: 1,
      maxProgress: 5,
      xpReward: 500,
      coinReward: 125,
      requirements: 'Win 5 speed challenges'
    },

    // Special Badges
    {
      id: 'video-verified',
      name: 'Video Verified',
      description: 'Successfully upload your first verified video',
      category: 'special',
      icon: '📹',
      unlocked: true,
      progress: 1,
      maxProgress: 1,
      xpReward: 75,
      coinReward: 15,
      requirements: 'Upload first verified video'
    },
    {
      id: 'cheat-buster',
      name: 'Cheat Buster',
      description: 'Pass AI cheat detection 10 times in a row',
      category: 'special',
      icon: '🛡️',
      unlocked: false,
      progress: 3,
      maxProgress: 10,
      xpReward: 300,
      coinReward: 80,
      requirements: 'Pass cheat detection 10 times'
    },
    {
      id: 'perfect-form',
      name: 'Perfect Form',
      description: 'Receive a coach\'s "excellent form" rating',
      category: 'special',
      icon: '✨',
      unlocked: false,
      progress: 0,
      maxProgress: 1,
      xpReward: 200,
      coinReward: 50,
      requirements: 'Get excellent form rating from coach'
    },
    {
      id: 'challenge-crusher',
      name: 'Challenge Crusher',
      description: 'Complete 10 different challenges',
      category: 'special',
      icon: '🔨',
      unlocked: false,
      progress: 7,
      maxProgress: 10,
      xpReward: 400,
      coinReward: 100,
      requirements: 'Complete 10 different challenges'
    },
    {
      id: 'badge-collector',
      name: 'Badge Collector',
      description: 'Unlock 10 badges',
      category: 'special',
      icon: '🎖️',
      unlocked: false,
      progress: 2,
      maxProgress: 10,
      xpReward: 500,
      coinReward: 150,
      requirements: 'Unlock 10 badges'
    },
    {
      id: 'ultimate-athlete',
      name: 'Ultimate Athlete',
      description: 'Unlock all 30 badges',
      category: 'special',
      icon: '🌟',
      unlocked: false,
      progress: 2,
      maxProgress: 30,
      xpReward: 2000,
      coinReward: 500,
      requirements: 'Unlock all badges'
    },
    {
      id: 'festival-hero',
      name: 'Festival Hero',
      description: 'Participate in a special seasonal event',
      category: 'special',
      icon: '🎉',
      unlocked: false,
      progress: 0,
      maxProgress: 1,
      xpReward: 300,
      coinReward: 100,
      requirements: 'Join seasonal event'
    },
    {
      id: 'community-player',
      name: 'Community Player',
      description: 'Share a training tip in community section',
      category: 'special',
      icon: '🤝',
      unlocked: false,
      progress: 0,
      maxProgress: 1,
      xpReward: 150,
      coinReward: 40,
      requirements: 'Share training tip'
    },
    {
      id: 'most-improved',
      name: 'Most Improved',
      description: 'Earn a coach-recommended badge',
      category: 'special',
      icon: '📈',
      unlocked: false,
      progress: 0,
      maxProgress: 1,
      xpReward: 400,
      coinReward: 120,
      requirements: 'Get coach recommendation'
    },
    {
      id: 'champion-of-champions',
      name: 'Champion of Champions',
      description: 'Top the overall challenge scoreboard for a week',
      category: 'special',
      icon: '👑',
      unlocked: false,
      progress: 0,
      maxProgress: 1,
      xpReward: 1000,
      coinReward: 300,
      requirements: 'Top leaderboard for 1 week'
    }
  ]);

  const [challenges, setChallenges] = useState<Challenge[]>([
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
      id: 'weekly-endurance',
      title: 'Distance Destroyer',
      description: 'Complete 3 endurance tests this week',
      type: 'weekly',
      activityType: 'general',
      progress: 1,
      maxProgress: 3,
      xpReward: 200,
      coinReward: 40,
      deadline: '2025-01-19T23:59:59',
      completed: false
    },
    {
      id: 'daily-pushups',
      title: 'Power Push-ups',
      description: 'Complete 25 push-ups with proper form',
      type: 'daily',
      activityType: 'pushup',
      progress: 18,
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
      progress: 3.2,
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
      progress: 2,
      maxProgress: 5,
      xpReward: 300,
      coinReward: 75,
      deadline: '2025-01-19T23:59:59',
      completed: false,
      difficulty: 'Hard',
      category: 'Speed'
    }
  ]);

  const [trainingVideos] = useState<TrainingVideo[]>([
    {
      id: 'strength-basics',
      title: 'Strength Training Fundamentals',
      description: 'Learn the basics of building strength safely and effectively',
      category: 'strength',
      thumbnail: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=400',
      duration: '12:30',
      instructor: 'Coach Sarah'
    },
    {
      id: 'endurance-training',
      title: 'Building Cardiovascular Endurance',
      description: 'Techniques to improve your stamina and running performance',
      category: 'endurance',
      thumbnail: 'https://images.pexels.com/photos/2294361/pexels-photo-2294361.jpeg?auto=compress&cs=tinysrgb&w=400',
      duration: '15:45',
      instructor: 'Coach Mike'
    },
    {
      id: 'flexibility-routine',
      title: 'Dynamic Stretching Routine',
      description: 'Essential stretches for athletes to prevent injury',
      category: 'flexibility',
      thumbnail: 'https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg?auto=compress&cs=tinysrgb&w=400',
      duration: '8:20',
      instructor: 'Coach Emma'
    },
    {
      id: 'recovery-methods',
      title: 'Recovery and Rest Techniques',
      description: 'Learn how to recover properly between training sessions',
      category: 'recovery',
      thumbnail: 'https://images.pexels.com/photos/3822864/pexels-photo-3822864.jpeg?auto=compress&cs=tinysrgb&w=400',
      duration: '10:15',
      instructor: 'Coach Alex'
    }
  ]);

  const [leaderboard] = useState<LeaderboardEntry[]>([
    {
      id: '1',
      name: 'Alex Champion',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
      score: 2450,
      rank: 1,
      xp: 2450
    },
    {
      id: '2',
      name: 'Sarah Speedster',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
      score: 2280,
      rank: 2,
      xp: 2280
    },
    {
      id: '3',
      name: 'Mike Muscle',
      avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150',
      score: 2150,
      rank: 3,
      xp: 2150
    }
  ]);

  const unlockBadge = (badgeId: string) => {
    setBadges(prev => prev.map(badge => 
      badge.id === badgeId ? { ...badge, unlocked: true, progress: badge.maxProgress } : badge
    ));
  };

  const updateProgress = (challengeId: string, progress: number) => {
    setChallenges(prev => prev.map(challenge =>
      challenge.id === challengeId 
        ? { ...challenge, progress: Math.min(progress, challenge.maxProgress) }
        : challenge
    ));
  };

  const completeChallenge = (challengeId: string) => {
    setChallenges(prev => prev.map(challenge =>
      challenge.id === challengeId 
        ? { ...challenge, completed: true, progress: challenge.maxProgress }
        : challenge
    ));
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
    leaderboard,
    trainingVideos,
    unlockBadge,
    updateProgress,
    completeChallenge,
    earnXP,
    earnCoins
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};