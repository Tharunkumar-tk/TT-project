import React, { useState } from 'react';
import { useGame } from '../../contexts/GameContext';
import Card from '../../components/UI/Card';
import ProgressBar from '../../components/UI/ProgressBar';
import { Trophy, Lock, Star, Zap } from 'lucide-react';

type BadgeCategory = 'all' | 'consistency' | 'strength' | 'endurance' | 'speed' | 'special';

const Roadmap: React.FC = () => {
  const { badges } = useGame();
  const [activeCategory, setActiveCategory] = useState<BadgeCategory>('all');
  const [selectedBadge, setSelectedBadge] = useState<string | null>(null);

  const categories = [
    { id: 'all' as BadgeCategory, name: 'All Badges', icon: Trophy, color: 'gray' },
    { id: 'consistency' as BadgeCategory, name: 'Consistency', icon: '🔥', color: 'orange' },
    { id: 'strength' as BadgeCategory, name: 'Strength', icon: '💪', color: 'red' },
    { id: 'endurance' as BadgeCategory, name: 'Endurance', icon: '🏃', color: 'blue' },
    { id: 'speed' as BadgeCategory, name: 'Speed', icon: '⚡', color: 'yellow' },
    { id: 'special' as BadgeCategory, name: 'Special', icon: '🌟', color: 'purple' },
  ];

  const filteredBadges = activeCategory === 'all' 
    ? badges 
    : badges.filter(b => b.category === activeCategory);

  const unlockedCount = badges.filter(b => b.unlocked).length;
  const totalBadges = badges.length;

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'consistency': return 'border-orange-500 bg-orange-600/20';
      case 'strength': return 'border-red-500 bg-red-600/20';
      case 'endurance': return 'border-blue-500 bg-blue-600/20';
      case 'speed': return 'border-yellow-500 bg-yellow-600/20';
      case 'special': return 'border-purple-500 bg-purple-600/20';
      default: return 'border-gray-500 bg-gray-600/20';
    }
  };

  const getCategoryTextColor = (category: string) => {
    switch (category) {
      case 'consistency': return 'text-orange-400';
      case 'strength': return 'text-red-400';
      case 'endurance': return 'text-blue-400';
      case 'speed': return 'text-yellow-400';
      case 'special': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Badge Roadmap</h1>
          <p className="text-gray-400">Track your progress through all 30 available achievements</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-400">Progress</div>
          <div className="text-2xl font-bold text-purple-400">
            {unlockedCount}/{totalBadges}
          </div>
          <div className="w-32">
            <ProgressBar 
              progress={unlockedCount} 
              max={totalBadges} 
              color="purple"
              showText={false}
            />
          </div>
        </div>
      </div>

      {/* Overall Progress */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Overall Progress</h2>
          <div className="text-purple-400 font-bold">{Math.round((unlockedCount / totalBadges) * 100)}% Complete</div>
        </div>
        <ProgressBar 
          progress={unlockedCount} 
          max={totalBadges} 
          color="purple"
          className="mb-4"
        />
        <div className="grid grid-cols-5 gap-4 text-center">
          {categories.slice(1).map(category => {
            const categoryBadges = badges.filter(b => b.category === category.id);
            const unlockedInCategory = categoryBadges.filter(b => b.unlocked).length;
            const Icon = typeof category.icon === 'string' ? () => <span>{category.icon}</span> : category.icon;
            
            return (
              <div key={category.id} className="bg-gray-700 rounded-lg p-3">
                <Icon className="w-6 h-6 mx-auto mb-2" />
                <div className="text-white font-medium text-sm">{category.name}</div>
                <div className="text-xs text-gray-400">{unlockedInCategory}/{categoryBadges.length}</div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Category Filters */}
      <Card>
        <div className="flex flex-wrap gap-2">
          {categories.map(category => {
            const Icon = typeof category.icon === 'string' ? () => <span>{category.icon}</span> : category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeCategory === category.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{category.name}</span>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Badge Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
        {filteredBadges.map((badge) => {
          const isUnlocked = badge.unlocked;
          const hasProgress = badge.progress > 0;
          const progressPercent = (badge.progress / badge.maxProgress) * 100;

          return (
            <Card 
              key={badge.id}
              className={`relative cursor-pointer transition-all duration-300 p-3 md:p-4 ${
                isUnlocked 
                  ? `${getCategoryColor(badge.category)} shadow-lg transform hover:scale-105` 
                  : hasProgress 
                    ? 'border-gray-600 hover:border-gray-500' 
                    : 'border-gray-700 opacity-75'
              } ${selectedBadge === badge.id ? 'ring-2 ring-purple-500' : ''}`}
              onClick={() => setSelectedBadge(selectedBadge === badge.id ? null : badge.id)}
            >
              {/* Unlock Animation Effect */}
              {isUnlocked && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse rounded-xl"></div>
              )}

              <div className="text-center">
                <div className={`text-2xl md:text-4xl mb-2 md:mb-3 ${isUnlocked ? 'animate-bounce' : hasProgress ? '' : 'grayscale opacity-50'}`}>
                  {badge.icon}
                </div>
                
                <h3 className={`text-sm md:text-base font-bold mb-1 md:mb-2 ${isUnlocked ? 'text-white' : hasProgress ? 'text-gray-300' : 'text-gray-500'}`}>
                  {badge.name}
                </h3>
                
                <p className={`text-xs md:text-sm mb-2 md:mb-3 ${isUnlocked ? 'text-gray-200' : hasProgress ? 'text-gray-400' : 'text-gray-500'} line-clamp-2`}>
                  {badge.description}
                </p>

                {/* Progress Bar */}
                {!isUnlocked && (
                  <div className="mb-3">
                    <ProgressBar 
                      progress={badge.progress} 
                      max={badge.maxProgress}
                      color={badge.category === 'consistency' ? 'yellow' : 
                             badge.category === 'strength' ? 'green' : 
                             badge.category === 'endurance' ? 'blue' : 'purple'}
                      showText={false}
                    />
                    <div className="text-xs text-gray-400 mt-1 hidden md:block">
                      {badge.progress}/{badge.maxProgress}
                    </div>
                  </div>
                )}

                {/* Rewards */}
                <div className="flex justify-center space-x-2 md:space-x-3 text-xs">
                  <div className="flex items-center space-x-1">
                    <Zap className="w-3 h-3 text-yellow-400" />
                    <span className="text-yellow-400 hidden sm:inline">+{badge.xpReward}</span>
                    <span className="text-yellow-400 sm:hidden">{badge.xpReward}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-green-400 hidden sm:inline">+{badge.coinReward} 🪙</span>
                    <span className="text-green-400 sm:hidden">🪙{badge.coinReward}</span>
                  </div>
                </div>

                {/* Category Tag */}
                <div className="mt-2 hidden md:block">
                  <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(badge.category)} ${getCategoryTextColor(badge.category)}`}>
                    {badge.category}
                  </span>
                </div>

                {/* Lock Icon for Locked Badges */}
                {!isUnlocked && !hasProgress && (
                  <div className="absolute top-2 right-2">
                    <Lock className="w-4 h-4 text-gray-500" />
                  </div>
                )}

                {/* Star Icon for Unlocked Badges */}
                {isUnlocked && (
                  <div className="absolute top-2 right-2">
                    <Star className="w-4 h-4 text-yellow-400 animate-pulse" />
                  </div>
                )}
              </div>

              {/* Expanded Details */}
              {selectedBadge === badge.id && (
                <div className="mt-4 pt-4 border-t border-gray-600">
                  <div className="text-left space-y-2">
                    <div>
                      <span className="text-gray-400 text-xs">Requirements:</span>
                      <p className="text-white text-sm">{badge.requirements}</p>
                    </div>
                    {badge.linkedChallenge && (
                      <div>
                        <span className="text-gray-400 text-xs">Linked Challenge:</span>
                        <p className="text-purple-400 text-sm">{badge.linkedChallenge}</p>
                      </div>
                    )}
                    {!isUnlocked && hasProgress && (
                      <div>
                        <span className="text-gray-400 text-xs">Progress:</span>
                        <p className="text-green-400 text-sm">{progressPercent.toFixed(0)}% Complete</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Legend */}
      <Card>
        <h3 className="text-lg font-bold text-white mb-4">Badge Legend</h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Star className="w-4 h-4 text-yellow-400" />
            <span className="text-gray-300">Unlocked & Earned</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-purple-600 rounded"></div>
            <span className="text-gray-300">In Progress</span>
          </div>
          <div className="flex items-center space-x-2">
            <Lock className="w-4 h-4 text-gray-500" />
            <span className="text-gray-300">Locked</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Roadmap;