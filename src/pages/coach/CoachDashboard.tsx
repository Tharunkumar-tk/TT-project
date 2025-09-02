import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import ProgressBar from '../../components/UI/ProgressBar';
import { 
  Users, 
  BarChart3, 
  Award, 
  MessageSquare, 
  Plus,
  TrendingUp,
  Calendar,
  Star,
  Target
} from 'lucide-react';

interface Athlete {
  id: string;
  name: string;
  avatar: string;
  xp: number;
  level: number;
  streak: number;
  lastActive: string;
  progress: number;
}

interface TrainingPlan {
  id: string;
  title: string;
  description: string;
  duration: string;
  athletes: number;
  created: string;
}

const CoachDashboard: React.FC = () => {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState<'overview' | 'athletes' | 'plans' | 'analytics'>('overview');

  const mockAthletes: Athlete[] = [
    {
      id: '1',
      name: 'Arjun Sharma',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
      xp: 1250,
      level: 5,
      streak: 12,
      lastActive: '2 hours ago',
      progress: 75
    },
    {
      id: '2',
      name: 'Priya Patel',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
      xp: 980,
      level: 4,
      streak: 8,
      lastActive: '1 day ago',
      progress: 60
    },
    {
      id: '3',
      name: 'Sanjay Kumar',
      avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150',
      xp: 1450,
      level: 6,
      streak: 15,
      lastActive: '30 minutes ago',
      progress: 85
    },
    {
      id: '4',
      name: 'Meena Singh',
      avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150',
      xp: 750,
      level: 3,
      streak: 5,
      lastActive: '3 hours ago',
      progress: 45
    }
  ];

  const mockTrainingPlans: TrainingPlan[] = [
    {
      id: '1',
      title: 'Beginner Strength Program',
      description: '4-week program focusing on basic strength movements',
      duration: '4 weeks',
      athletes: 12,
      created: '2025-01-01'
    },
    {
      id: '2',
      title: 'Speed & Agility Training',
      description: 'Advanced program for improving speed and reaction time',
      duration: '6 weeks',
      athletes: 8,
      created: '2025-01-05'
    }
  ];

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Coach Dashboard</h1>
          <p className="text-gray-400 mt-1">Manage your athletes and create training programs</p>
        </div>
        <div className="flex gap-3">
          <Button icon={Plus} variant="primary">Create Plan</Button>
          <Button icon={Target} variant="secondary">Create Challenge</Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <Users className="w-5 h-5 text-blue-400" />
                <span className="text-gray-400 text-sm">Active Athletes</span>
              </div>
              <div className="text-2xl font-bold text-white">{mockAthletes.length}</div>
              <div className="text-sm text-green-400 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                +2 this month
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <Calendar className="w-5 h-5 text-green-400" />
                <span className="text-gray-400 text-sm">Training Plans</span>
              </div>
              <div className="text-2xl font-bold text-white">{mockTrainingPlans.length}</div>
              <div className="text-sm text-blue-400">Active programs</div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <Star className="w-5 h-5 text-yellow-400" />
                <span className="text-gray-400 text-sm">Coach Rating</span>
              </div>
              <div className="text-2xl font-bold text-white">4.8</div>
              <div className="text-sm text-yellow-400">⭐⭐⭐⭐⭐</div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <Award className="w-5 h-5 text-purple-400" />
                <span className="text-gray-400 text-sm">Badges Awarded</span>
              </div>
              <div className="text-2xl font-bold text-white">47</div>
              <div className="text-sm text-purple-400">This month</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Tab Navigation */}
      <Card>
        <div className="flex space-x-1 bg-gray-700 rounded-lg p-1">
          {[
            { id: 'overview', name: 'Overview', icon: BarChart3 },
            { id: 'athletes', name: 'Athletes', icon: Users },
            { id: 'plans', name: 'Training Plans', icon: Calendar },
            { id: 'analytics', name: 'Analytics', icon: BarChart3 }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md transition-colors ${
                  selectedTab === tab.id 
                    ? 'bg-purple-600 text-white' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.name}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Tab Content */}
      {selectedTab === 'overview' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {[
                { athlete: 'Arjun Sharma', action: 'Completed Jump Test', time: '2 hours ago', result: '52cm' },
                { athlete: 'Priya Patel', action: 'Uploaded Push-up Video', time: '4 hours ago', result: '25 reps' },
                { athlete: 'Sanjay Kumar', action: 'Finished Shuttle Run', time: '1 day ago', result: '11.8s' },
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                  <div>
                    <div className="text-white font-medium">{activity.athlete}</div>
                    <div className="text-sm text-gray-400">{activity.action}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-green-400 font-medium">{activity.result}</div>
                    <div className="text-xs text-gray-400">{activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="text-xl font-bold text-white mb-4">Performance Trends</h3>
            <div className="space-y-4">
              <div className="bg-green-600/20 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-green-400 font-medium">Average Improvement</span>
                  <TrendingUp className="w-5 h-5 text-green-400" />
                </div>
                <div className="text-2xl font-bold text-white">+15%</div>
                <div className="text-sm text-green-300">Across all athletes this month</div>
              </div>
              <div className="bg-blue-600/20 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-blue-400 font-medium">Engagement Rate</span>
                  <Users className="w-5 h-5 text-blue-400" />
                </div>
                <div className="text-2xl font-bold text-white">92%</div>
                <div className="text-sm text-blue-300">Athletes active this week</div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {selectedTab === 'athletes' && (
        <Card>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white">Your Athletes</h3>
            <Button variant="secondary" size="sm">Add Athlete</Button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockAthletes.map((athlete) => (
              <div key={athlete.id} className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <img src={athlete.avatar} alt={athlete.name} className="w-12 h-12 rounded-full" />
                  <div>
                    <div className="text-white font-medium">{athlete.name}</div>
                    <div className="text-sm text-gray-400">Level {athlete.level}</div>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-white">{athlete.progress}%</span>
                  </div>
                  <ProgressBar progress={athlete.progress} max={100} showText={false} />
                </div>

                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="text-yellow-400">{athlete.xp} XP</span>
                    <span className="text-orange-400">{athlete.streak}🔥</span>
                  </div>
                  <span className="text-gray-400">{athlete.lastActive}</span>
                </div>

                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="secondary" className="flex-1">
                    View Progress
                  </Button>
                  <Button size="sm" variant="primary" icon={MessageSquare}>
                    Message
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {selectedTab === 'plans' && (
        <Card>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white">Training Plans</h3>
            <Button variant="primary" icon={Plus}>Create New Plan</Button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {mockTrainingPlans.map((plan) => (
              <div key={plan.id} className="bg-gray-700 rounded-lg p-4">
                <h4 className="text-white font-bold mb-2">{plan.title}</h4>
                <p className="text-gray-300 text-sm mb-3">{plan.description}</p>
                <div className="flex justify-between items-center text-sm mb-3">
                  <span className="text-gray-400">Duration: {plan.duration}</span>
                  <span className="text-blue-400">{plan.athletes} athletes</span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary" className="flex-1">Edit Plan</Button>
                  <Button size="sm" variant="primary">Assign</Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {selectedTab === 'analytics' && (
        <Card>
          <h3 className="text-xl font-bold text-white mb-6">Quick Analytics</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-green-600/20 rounded-lg p-4">
              <h4 className="text-green-400 font-medium mb-2">Most Active Athletes</h4>
              <div className="space-y-2">
                {mockAthletes.slice(0, 3).map((athlete, index) => (
                  <div key={athlete.id} className="flex justify-between items-center">
                    <span className="text-white text-sm">{athlete.name}</span>
                    <span className="text-green-400 text-sm">{athlete.streak} days</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-purple-600/20 rounded-lg p-4">
              <h4 className="text-purple-400 font-medium mb-2">Top Performers</h4>
              <div className="space-y-2">
                {mockAthletes.sort((a, b) => b.xp - a.xp).slice(0, 3).map((athlete, index) => (
                  <div key={athlete.id} className="flex justify-between items-center">
                    <span className="text-white text-sm">{athlete.name}</span>
                    <span className="text-purple-400 text-sm">{athlete.xp} XP</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default CoachDashboard;