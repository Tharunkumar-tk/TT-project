import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useGame } from '../../contexts/GameContext';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import ProgressBar from '../../components/UI/ProgressBar';
import { 
  Upload, 
  Trophy, 
  Target, 
  Zap, 
  TrendingUp, 
  Calendar,
  Star,
  Clock,
  Award
} from 'lucide-react';

const AthleteDashboard: React.FC = () => {
  const { user } = useAuth();
  const { challenges, badges } = useGame();

  if (!user) return null;

  const activeChallenges = challenges.filter(c => !c.completed);
  const recentBadges = badges.filter(b => b.unlocked).slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">Welcome back, {user.name}! 🚀</h1>
          <p className="text-gray-400 mt-1 text-sm sm:text-base">Ready to crush some challenges today?</p>
        </div>
        <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
          <Link to="/athlete/upload">
            <Button icon={Upload} size="md" className="flex-1 sm:flex-none">
              <span className="hidden sm:inline">Upload Video</span>
              <span className="sm:hidden">Upload</span>
            </Button>
          </Link>
          <Link to="/athlete/challenges">
            <Button variant="secondary" icon={Target} size="md" className="flex-1 sm:flex-none">
              <span className="hidden sm:inline">View Challenges</span>
              <span className="sm:hidden">Challenges</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-1 mb-1">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                <span className="text-gray-400 text-xs sm:text-sm">XP</span>
              </div>
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-white">{user.xp}</div>
              <div className="text-xs sm:text-sm text-green-400 flex items-center">
                <TrendingUp className="w-3 h-3 mr-0.5 sm:mr-1" />
                <span>+125</span>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-1 mb-1">
                <span className="text-green-400">🪙</span>
                <span className="text-gray-400 text-xs sm:text-sm">Coins</span>
              </div>
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-white">{user.coins}</div>
              <div className="text-xs sm:text-sm text-green-400 flex items-center">
                <TrendingUp className="w-3 h-3 mr-0.5 sm:mr-1" />
                <span>+45</span>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-1 mb-1">
                <span className="text-orange-400">🔥</span>
                <span className="text-gray-400 text-xs sm:text-sm">Streak</span>
              </div>
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-white">{user.streak}</div>
              <div className="text-xs sm:text-sm text-orange-400">
                <span>days</span>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-1 mb-1">
                <Award className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                <span className="text-gray-400 text-xs sm:text-sm">Badges</span>
              </div>
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-white">{badges.filter(b => b.unlocked).length}</div>
              <div className="text-xs sm:text-sm text-purple-400">
                <span>unlocked</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        {/* Active Challenges */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center">
                <Target className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 mr-2" />
                Active Challenges
              </h2>
              <Link to="/athlete/challenges">
                <Button variant="secondary" size="sm">View All</Button>
              </Link>
            </div>
            
            <div className="space-y-3 sm:space-y-4">
              {activeChallenges.slice(0, 3).map((challenge) => (
                <div key={challenge.id} className="bg-gray-700 rounded-lg p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0 mb-3">
                    <div>
                      <h3 className="text-white font-medium text-sm sm:text-base">{challenge.title}</h3>
                      <p className="text-gray-400 text-xs sm:text-sm line-clamp-2">{challenge.description}</p>
                    </div>
                    <div className="flex items-center space-x-1 text-xs sm:text-sm">
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
                      <span className="text-yellow-400">
                        {challenge.type === 'daily' ? '1d' : challenge.type === 'weekly' ? '7d' : '5d'}
                      </span>
                    </div>
                  </div>
                  
                  <ProgressBar 
                    progress={challenge.progress} 
                    max={challenge.maxProgress}
                    className="mb-2 sm:mb-3"
                  />
                  
                  <div className="flex justify-between items-center">
                    <div className="text-xs sm:text-sm text-gray-400">
                      Progress: {challenge.progress}/{challenge.maxProgress}
                    </div>
                    <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm">
                      <span className="text-yellow-400">+{challenge.xpReward}</span>
                      <span className="text-green-400">+{challenge.coinReward}🪙</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Recent Badges */}
          <Card>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
              <Award className="w-5 h-5 text-yellow-500 mr-2" />
              Recent Badges
            </h3>
            {recentBadges.length > 0 ? (
              <div className="space-y-3">
                {recentBadges.map((badge) => (
                  <div key={badge.id} className="flex items-center space-x-3 p-2 bg-gray-700 rounded-lg">
                    <span className="text-xl">{badge.icon}</span>
                    <div>
                      <div className="text-white font-medium text-sm">{badge.name}</div>
                      <div className="text-xs text-gray-400">{badge.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-400 py-4">
                <Star className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Complete challenges to earn badges!</p>
              </div>
            )}
          </Card>

          {/* Progress Overview */}
          <Card>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
              <Trophy className="w-5 h-5 text-purple-500 mr-2" />
              Progress Overview
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Badges Unlocked</span>
                <span className="text-purple-400 font-medium">
                  {badges.filter(b => b.unlocked).length}/30
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Challenges Completed</span>
                <span className="text-green-400 font-medium">
                  {challenges.filter(c => c.completed).length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Current Streak</span>
                <span className="text-orange-400 font-medium">{user.streak} days</span>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card>
            <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Link to="/athlete/upload" className="block">
                <Button variant="primary" className="w-full justify-start" icon={Upload}>
                  Upload Performance
                </Button>
              </Link>
              <Link to="/athlete/challenges" className="block">
                <Button variant="secondary" className="w-full justify-start" icon={Target}>
                  Browse Challenges
                </Button>
              </Link>
              <Link to="/athlete/roadmap" className="block">
                <Button variant="secondary" className="w-full justify-start">
                  🗺️ View Roadmap
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AthleteDashboard;