import React, { useState } from 'react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import ProgressBar from '../../components/UI/ProgressBar';
import { BarChart3, TrendingUp, Users, Target, Calendar, Award, Filter } from 'lucide-react';

type AnalyticsFilter = 'week' | 'month' | 'quarter' | 'year';

const CoachAnalytics: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<AnalyticsFilter>('month');

  const filters = [
    { id: 'week' as AnalyticsFilter, name: 'This Week' },
    { id: 'month' as AnalyticsFilter, name: 'This Month' },
    { id: 'quarter' as AnalyticsFilter, name: 'This Quarter' },
    { id: 'year' as AnalyticsFilter, name: 'This Year' },
  ];

  const challengeStats = [
    { name: 'Push-ups', completed: 45, total: 60, category: 'Strength' },
    { name: 'Shuttle Run', completed: 32, total: 45, category: 'Speed' },
    { name: 'Endurance Run', completed: 28, total: 40, category: 'Endurance' },
    { name: 'Sit-ups', completed: 38, total: 55, category: 'Strength' },
    { name: 'Jump Test', completed: 42, total: 50, category: 'Power' }
  ];

  const athletePerformance = [
    { name: 'Arjun Sharma', improvement: 25, challenges: 15, badges: 8, trend: 'up' },
    { name: 'Priya Patel', improvement: 18, challenges: 12, badges: 5, trend: 'up' },
    { name: 'Sanjay Kumar', improvement: 32, challenges: 20, badges: 12, trend: 'up' },
    { name: 'Meena Singh', improvement: 12, challenges: 8, badges: 3, trend: 'stable' },
    { name: 'Rahul Verma', improvement: 22, challenges: 14, badges: 6, trend: 'up' }
  ];

  const stateDistribution = [
    { state: 'Maharashtra', athletes: 12, percentage: 30 },
    { state: 'Karnataka', athletes: 8, percentage: 20 },
    { state: 'Gujarat', athletes: 7, percentage: 17.5 },
    { state: 'Tamil Nadu', athletes: 6, percentage: 15 },
    { state: 'Punjab', athletes: 4, percentage: 10 },
    { state: 'Others', athletes: 3, percentage: 7.5 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Analytics Dashboard</h1>
          <p className="text-gray-400 mt-1">Track athlete performance and engagement metrics</p>
        </div>
        <div className="flex gap-2">
          {filters.map(filter => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeFilter === filter.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {filter.name}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <Users className="w-5 h-5 text-blue-400" />
                <span className="text-gray-400 text-sm">Total Athletes</span>
              </div>
              <div className="text-2xl font-bold text-white">40</div>
              <div className="text-sm text-green-400 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                +8 this month
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <Target className="w-5 h-5 text-green-400" />
                <span className="text-gray-400 text-sm">Avg Completion</span>
              </div>
              <div className="text-2xl font-bold text-white">78%</div>
              <div className="text-sm text-green-400">Challenge success rate</div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <Award className="w-5 h-5 text-yellow-400" />
                <span className="text-gray-400 text-sm">Badges Awarded</span>
              </div>
              <div className="text-2xl font-bold text-white">156</div>
              <div className="text-sm text-yellow-400">This month</div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <BarChart3 className="w-5 h-5 text-purple-400" />
                <span className="text-gray-400 text-sm">Avg Improvement</span>
              </div>
              <div className="text-2xl font-bold text-white">+22%</div>
              <div className="text-sm text-purple-400">Performance gain</div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Challenge Completion Stats */}
        <Card>
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <Target className="w-6 h-6 text-green-500 mr-2" />
            Challenge Completion Rates
          </h3>
          <div className="space-y-4">
            {challengeStats.map((challenge, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-white font-medium">{challenge.name}</span>
                    <span className="text-gray-400 text-sm ml-2">({challenge.category})</span>
                  </div>
                  <span className="text-gray-300 text-sm">
                    {challenge.completed}/{challenge.total}
                  </span>
                </div>
                <ProgressBar 
                  progress={challenge.completed} 
                  max={challenge.total} 
                  showText={false}
                  color={challenge.completed / challenge.total > 0.8 ? 'green' : 
                         challenge.completed / challenge.total > 0.6 ? 'yellow' : 'purple'}
                />
                <div className="text-xs text-gray-400">
                  {Math.round((challenge.completed / challenge.total) * 100)}% completion rate
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Athlete Performance */}
        <Card>
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <TrendingUp className="w-6 h-6 text-blue-500 mr-2" />
            Athlete Performance
          </h3>
          <div className="space-y-3">
            {athletePerformance.map((athlete, index) => (
              <div key={index} className="bg-gray-700 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">{athlete.name}</span>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className={`w-4 h-4 ${
                      athlete.trend === 'up' ? 'text-green-400' : 'text-gray-400'
                    }`} />
                    <span className="text-green-400 font-medium">+{athlete.improvement}%</span>
                  </div>
                </div>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>{athlete.challenges} challenges</span>
                  <span>{athlete.badges} badges</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Geographic Distribution */}
        <Card>
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <Users className="w-6 h-6 text-orange-500 mr-2" />
            Geographic Distribution
          </h3>
          <div className="space-y-3">
            {stateDistribution.map((state, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-white">{state.state}</span>
                  <span className="text-gray-300">{state.athletes} athletes</span>
                </div>
                <ProgressBar 
                  progress={state.percentage} 
                  max={100} 
                  showText={false}
                  color="blue"
                />
                <div className="text-xs text-gray-400">{state.percentage}% of total</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Achievements */}
        <Card>
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <Award className="w-6 h-6 text-yellow-500 mr-2" />
            Recent Achievements
          </h3>
          <div className="space-y-3">
            {[
              { athlete: 'Arjun Sharma', badge: 'Push-up Pro', time: '2 hours ago' },
              { athlete: 'Sanjay Kumar', badge: 'Streak Master', time: '1 day ago' },
              { athlete: 'Priya Patel', badge: 'Quick Feet', time: '2 days ago' },
              { athlete: 'Rahul Verma', badge: 'Iron Core', time: '3 days ago' },
            ].map((achievement, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
                <span className="text-2xl">🏆</span>
                <div className="flex-1">
                  <div className="text-white font-medium">{achievement.athlete}</div>
                  <div className="text-sm text-gray-400">Earned "{achievement.badge}"</div>
                </div>
                <div className="text-xs text-gray-400">{achievement.time}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CoachAnalytics;