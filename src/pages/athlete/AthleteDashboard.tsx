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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Welcome back, {user.name}! 🚀</h1>
          <p className="text-gray-400 mt-1">Ready to crush some challenges today?</p>
        </div>
        <div className="flex gap-3">
          <Link to="/athlete/upload">
            <Button icon={Upload} size="lg">Upload Video</Button>
          </Link>
          <Link to="/athlete/challenges">
            <Button variant="secondary" icon={Target}>View Challenges</Button>
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-1 md:space-x-2 mb-1">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span className="text-gray-400 text-xs md:text-sm hidden sm:block">Total XP</span>
                <span className="text-gray-400 text-xs md:text-sm sm:hidden">XP</span>
              </div>
              <div className="text-xl md:text-2xl font-bold text-white">{user.xp}</div>
              <div className="text-xs md:text-sm text-green-400 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                <span className="hidden sm:inline">+125 this week</span>
                <span className="sm:hidden">+125</span>
              </div>
            </div>
            <div className="bg-yellow-600/20 p-2 md:p-3 rounded-lg hidden md:block">
              <Zap className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-1 md:space-x-2 mb-1">
                <span className="text-green-400">🪙</span>
                <span className="text-gray-400 text-xs md:text-sm">Coins</span>
              </div>
              <div className="text-xl md:text-2xl font-bold text-white">{user.coins}</div>
              <div className="text-xs md:text-sm text-green-400 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                <span className="hidden sm:inline">+45 this week</span>
                <span className="sm:hidden">+45</span>
              </div>
            </div>
            <div className="bg-green-600/20 p-2 md:p-3 rounded-lg hidden md:block">
              <span className="text-2xl">🪙</span>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-1 md:space-x-2 mb-1">
                <span className="text-orange-400">🔥</span>
                <span className="text-gray-400 text-xs md:text-sm">Streak</span>
              </div>
              <div className="text-xl md:text-2xl font-bold text-white">{user.streak} days</div>
              <div className="text-xs md:text-sm text-orange-400">
                <span className="hidden sm:inline">Keep it up!</span>
                <span className="sm:hidden">🚀</span>
              </div>
            </div>
            <div className="bg-orange-600/20 p-2 md:p-3 rounded-lg hidden md:block">
              <span className="text-2xl">🔥</span>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-1 md:space-x-2 mb-1">
                <Award className="w-5 h-5 text-purple-400" />
                <span className="text-gray-400 text-xs md:text-sm">Badges</span>
              </div>
              <div className="text-xl md:text-2xl font-bold text-white">{badges.filter(b => b.unlocked).length}</div>
              <div className="text-xs md:text-sm text-purple-400">
                <span className="hidden sm:inline">Unlocked</span>
                <span className="sm:hidden">🏆</span>
              </div>
            </div>
            <div className="bg-purple-600/20 p-2 md:p-3 rounded-lg hidden md:block">
              <Award className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 md:gap-6">
        {/* Active Challenges */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white flex items-center">
                <Target className="w-6 h-6 text-green-500 mr-2" />
                Active Challenges
              </h2>
              <Link to="/athlete/challenges" className="hidden sm:block">
                <Button variant="secondary" size="sm">View All</Button>
              </Link>
            </div>
            
            <div className="space-y-4">
              {activeChallenges.slice(0, 3).map((challenge) => (
                <div key={challenge.id} className="bg-gray-700 rounded-lg p-3 md:p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-white font-medium text-sm md:text-base">{challenge.title}</h3>
                      <p className="text-gray-400 text-xs md:text-sm">{challenge.description}</p>
                    </div>
                    <div className="flex items-center space-x-1 text-xs md:text-sm">
                      <Clock className="w-4 h-4 text-yellow-400" />
                      <span className="text-yellow-400 hidden sm:inline">
                        {challenge.type === 'daily' ? 'Today' : challenge.type === 'weekly' ? 'This week' : '5 days left'}
                      </span>
                      <span className="text-yellow-400 sm:hidden">
                        {challenge.type === 'daily' ? '1d' : challenge.type === 'weekly' ? '7d' : '5d'}
                      </span>
                    </div>
                  </div>
                  
                  <ProgressBar 
                    progress={challenge.progress} 
                    max={challenge.maxProgress}
                    className="mb-3"
                  />
                  
                  <div className="flex justify-between items-center">
                    <div className="text-xs md:text-sm text-gray-400">
                      Progress: {challenge.progress}/{challenge.maxProgress}
                    </div>
                    <div className="flex items-center space-x-2 md:space-x-3 text-xs md:text-sm">
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