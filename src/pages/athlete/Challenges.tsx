import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useGame } from '../../contexts/GameContext';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import ProgressBar from '../../components/UI/ProgressBar';
import { Target, Clock, Trophy, Zap, Users, Calendar } from 'lucide-react';

type ChallengeFilter = 'all' | 'daily' | 'weekly' | 'team' | 'seasonal';

const Challenges: React.FC = () => {
  const navigate = useNavigate();
  const { updateUser, user } = useAuth();
  const { challenges, updateProgress, completeChallenge } = useGame();
  const [activeFilter, setActiveFilter] = useState<ChallengeFilter>('all');

  const filters: { id: ChallengeFilter; name: string; icon: any; color: string }[] = [
    { id: 'all', name: 'All Challenges', icon: Target, color: 'gray' },
    { id: 'daily', name: 'Daily', icon: Clock, color: 'yellow' },
    { id: 'weekly', name: 'Weekly', icon: Calendar, color: 'blue' },
    { id: 'team', name: 'Team', icon: Users, color: 'green' },
    { id: 'seasonal', name: 'Seasonal', icon: Trophy, color: 'purple' },
  ];

  const filteredChallenges = activeFilter === 'all' 
    ? challenges 
    : challenges.filter(c => c.type === activeFilter);

  const mockChallenges = [
    {
      id: 'daily-pushups',
      title: 'Power Push-ups',
      description: 'Complete 25 push-ups with proper form',
      type: 'daily' as const,
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
      type: 'weekly' as const,
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
      id: 'team-village',
      title: 'Village Championship',
      description: 'Help your village win the monthly fitness challenge',
      type: 'team' as const,
      progress: 450,
      maxProgress: 1000,
      xpReward: 300,
      coinReward: 100,
      deadline: '2025-01-31T23:59:59',
      completed: false,
      difficulty: 'Epic',
      category: 'Community'
    },
    {
      id: 'seasonal-winter',
      title: 'Winter Warrior',
      description: 'Complete 15 different exercise types this month',
      type: 'seasonal' as const,
      progress: 8,
      maxProgress: 15,
      xpReward: 500,
      coinReward: 150,
      deadline: '2025-01-31T23:59:59',
      completed: false,
      difficulty: 'Legendary',
      category: 'Variety'
    }
  ];

  const allChallenges = [...challenges, ...mockChallenges];

  const handleChallengeUpdate = (challenge: any) => {
    // Special case for Distance Destroyer - direct coin reward
    if (challenge.id === 'weekly-run' || challenge.title === 'Distance Destroyer') {
      const progressIncrement = 1; // 1km increment
      const result = updateProgress(challenge.id, challenge.progress + progressIncrement);
      
      if (user) {
        updateUser({
          coins: (user.coins || 0) + 25, // Immediate reward for updating progress
          xp: (user.xp || 0) + 30
        });
      }
      return;
    }

    // For other challenges, redirect to video upload with pre-selected activity
    const activityType = challenge.activityType || challenge.id.split('-')[1]; // fallback to extract from ID
    navigate(`/athlete/upload?activity=${activityType}&challenge=${challenge.id}&challengeName=${encodeURIComponent(challenge.title)}`);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'hard': return 'text-orange-400';
      case 'epic': return 'text-purple-400';
      case 'legendary': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'daily': return Clock;
      case 'weekly': return Calendar;
      case 'team': return Users;
      case 'seasonal': return Trophy;
      default: return Target;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Challenges</h1>
          <p className="text-gray-400 mt-1">Complete challenges to earn XP, coins, and unlock badges</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-400">Active Challenges</div>
          <div className="text-2xl font-bold text-purple-400">
            {allChallenges.filter(c => !c.completed).length}
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <Card>
        <div className="flex flex-wrap gap-1 sm:gap-2">
          {filters.map(filter => {
            const Icon = filter.icon;
            return (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition-colors touch-manipulation text-xs sm:text-sm ${
                  activeFilter === filter.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">{filter.name}</span>
                <span className="sm:hidden">{filter.name.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Challenges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
        {(activeFilter === 'all' ? allChallenges : allChallenges.filter(c => c.type === activeFilter))
          .map((challenge) => {
            const TypeIcon = getTypeIcon(challenge.type);
            const isCompleted = challenge.completed || challenge.progress >= challenge.maxProgress;
            const progressPercent = (challenge.progress / challenge.maxProgress) * 100;

            return (
              <Card key={challenge.id} className={`${isCompleted ? 'border-green-500' : ''}`}>
                <div className="space-y-3 sm:space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                      <div className={`p-2 rounded-lg ${
                        challenge.type === 'daily' ? 'bg-yellow-600/20' :
                        challenge.type === 'weekly' ? 'bg-blue-600/20' :
                        challenge.type === 'team' ? 'bg-green-600/20' :
                        'bg-purple-600/20'
                      }`}>
                        <TypeIcon className={`w-4 h-4 sm:w-5 sm:h-5 ${
                          challenge.type === 'daily' ? 'text-yellow-400' :
                          challenge.type === 'weekly' ? 'text-blue-400' :
                          challenge.type === 'team' ? 'text-green-400' :
                          'text-purple-400'
                        }`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm sm:text-base md:text-lg font-bold text-white truncate">{challenge.title}</h3>
                        <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm">
                          <span className="text-gray-400 capitalize">{challenge.type}</span>
                          <span className={`font-medium ${'difficulty' in challenge ? getDifficultyColor(challenge.difficulty as string) : 'text-gray-400'}`}>
                            {'difficulty' in challenge ? challenge.difficulty : 'Standard'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      {isCompleted && (
                        <div className="flex items-center space-x-1 bg-green-600/20 px-2 py-1 rounded-full text-xs">
                          <Trophy className="w-3 h-3 text-green-400" />
                          <span className="text-green-400">✓</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Description - Mobile optimized */}
                  <div className="sm:hidden">
                    <p className="text-gray-300 text-xs line-clamp-2">{challenge.description}</p>
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-gray-300 text-sm">{challenge.description}</p>
                  </div>

                  {/* Progress */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs sm:text-sm text-gray-400">Progress</span>
                      <span className="text-xs sm:text-sm text-white">
                        {challenge.progress}{challenge.type === 'weekly-run' ? 'km' : ''} / {challenge.maxProgress}{challenge.type === 'weekly-run' ? 'km' : ''}
                      </span>
                    </div>
                    <ProgressBar
                      progress={challenge.progress}
                      max={challenge.maxProgress}
                      showText={false}
                      color={progressPercent >= 100 ? 'green' : 'purple'}
                    />
                  </div>

                  {/* Rewards and Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                    <div className="flex items-center space-x-2 sm:space-x-4">
                      <div className="flex items-center space-x-1 text-xs sm:text-sm">
                        <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
                        <span className="text-yellow-400">+{challenge.xpReward}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-xs sm:text-sm">
                        <span className="text-green-400">+{challenge.coinReward} 🪙</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between sm:justify-end">
                      {challenge.type === 'daily' && (
                        <span className="text-xs text-orange-400 flex items-center sm:mr-2">
                          <Clock className="w-3 h-3 mr-1" />
                          <span>Today</span>
                        </span>
                      )}
                      {!isCompleted && (
                        <Button 
                          size="sm"
                          className="text-xs sm:text-sm px-2 sm:px-3"
                          onClick={() => handleChallengeUpdate(challenge)}
                          disabled={progressPercent >= 100}
                        >
                          {progressPercent >= 100 ? 'Done' : 
                           challenge.title === 'Distance Destroyer' ? 'Update' : 'Upload'}
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Category Tag */}
                  {'category' in challenge && (
                    <div className="pt-2 border-t border-gray-700">
                      <span className="text-xs text-purple-400 font-medium">{challenge.category as string}</span>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
      </div>

      {filteredChallenges.length === 0 && (
        <Card>
          <div className="text-center py-12">
            <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No challenges found</h3>
            <p className="text-gray-400">Try selecting a different filter or check back later for new challenges.</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Challenges;