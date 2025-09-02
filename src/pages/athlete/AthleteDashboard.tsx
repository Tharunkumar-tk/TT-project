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
  Users,
  Clock,
  Award
} from 'lucide-react';

const AthleteDashboard: React.FC = () => {
  const { user } = useAuth();
  const { challenges, badges, leaderboard } = useGame();

  if (!user) return null;

  const activeChallenges = challenges.filter(c => !c.completed);
  const recentBadges = badges.filter(b => b.unlocked).slice(0, 3);
  const userRank = Math.floor(Math.random() * 50) + 1;

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
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span className="text-gray-400 text-sm">Total XP</span>
              </div>
              <div className="text-2xl font-bold text-white">{user.xp}</div>
              <div className="text-sm text-green-400 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                +125 this week
              </div>
            </div>
            <div className="bg-yellow-600/20 p-3 rounded-lg">
              <Zap className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-green-400">🪙</span>
                <span className="text-gray-400 text-sm">Coins</span>
              </div>
              <div className="text-2xl font-bold text-white">{user.coins}</div>
              <div className="text-sm text-green-400 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                +45 this week
              </div>
            </div>
            <div className="bg-green-600/20 p-3 rounded-lg">
              <span className="text-2xl">🪙</span>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-orange-400">🔥</span>
                <span className="text-gray-400 text-sm">Streak</span>
              </div>
              <div className="text-2xl font-bold text-white">{user.streak} days</div>
              <div className="text-sm text-orange-400">Keep it up!</div>
            </div>
            <div className="bg-orange-600/20 p-3 rounded-lg">
              <span className="text-2xl">🔥</span>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <Trophy className="w-5 h-5 text-purple-400" />
                <span className="text-gray-400 text-sm">Rank</span>
              </div>
              <div className="text-2xl font-bold text-white">#{userRank}</div>
              <div className="text-sm text-purple-400">National</div>
            </div>
            <div className="bg-purple-600/20 p-3 rounded-lg">
              <Trophy className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Active Challenges */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white flex items-center">
                <Target className="w-6 h-6 text-green-500 mr-2" />
                Active Challenges
              </h2>
              <Link to="/athlete/challenges">
                <Button variant="secondary" size="sm">View All</Button>
              </Link>
            </div>
            
            <div className="space-y-4">
              {activeChallenges.slice(0, 3).map((challenge) => (
                <div key={challenge.id} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-white font-medium">{challenge.title}</h3>
                      <p className="text-gray-400 text-sm">{challenge.description}</p>
                    </div>
                    <div className="flex items-center space-x-1 text-sm">
                      <Clock className="w-4 h-4 text-yellow-400" />
                      <span className="text-yellow-400">
                        {challenge.type === 'daily' ? 'Today' : challenge.type === 'weekly' ? 'This week' : '5 days left'}
                      </span>
                    </div>
                  </div>
                  
                  <ProgressBar 
                    progress={challenge.progress} 
                    max={challenge.maxProgress}
                    className="mb-3"
                  />
                  
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-400">
                      Progress: {challenge.progress}/{challenge.maxProgress}
                    </div>
                    <div className="flex items-center space-x-3 text-sm">
                      <span className="text-yellow-400">+{challenge.xpReward} XP</span>
                      <span className="text-green-400">+{challenge.coinReward} 🪙</span>
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

          {/* Quick Leaderboard */}
          <Card>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
              <Trophy className="w-5 h-5 text-purple-500 mr-2" />
              Top Performers
            </h3>
            <div className="space-y-3">
              {leaderboard.slice(0, 3).map((entry, index) => (
                <div key={entry.id} className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-600'
                  }`}>
                    {entry.rank}
                  </div>
                  <img src={entry.avatar} alt={entry.name} className="w-8 h-8 rounded-full" />
                  <div className="flex-1">
                    <div className="text-white font-medium text-sm">{entry.name}</div>
                    <div className="text-xs text-gray-400">{entry.xp} XP</div>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/athlete/leaderboard" className="block mt-3">
              <Button variant="secondary" size="sm" className="w-full">
                View Full Leaderboard
              </Button>
            </Link>
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