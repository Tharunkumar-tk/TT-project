import React, { useState } from 'react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import ProgressBar from '../../components/UI/ProgressBar';
import { Users, Search, Filter, MessageSquare, BarChart3, Award, Plus } from 'lucide-react';

interface Athlete {
  id: string;
  name: string;
  avatar: string;
  xp: number;
  level: number;
  streak: number;
  lastActive: string;
  progress: number;
  state: string;
  district: string;
  joinDate: string;
  badges: number;
  challenges: number;
}

const CoachAthletes: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAthlete, setSelectedAthlete] = useState<string | null>(null);

  const mockAthletes: Athlete[] = [
    {
      id: '1',
      name: 'Arjun Sharma',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
      xp: 1250,
      level: 5,
      streak: 12,
      lastActive: '2 hours ago',
      progress: 75,
      state: 'Maharashtra',
      district: 'Mumbai City',
      joinDate: '2024-12-15',
      badges: 8,
      challenges: 15
    },
    {
      id: '2',
      name: 'Priya Patel',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
      xp: 980,
      level: 4,
      streak: 8,
      lastActive: '1 day ago',
      progress: 60,
      state: 'Gujarat',
      district: 'Ahmedabad',
      joinDate: '2024-12-20',
      badges: 5,
      challenges: 12
    },
    {
      id: '3',
      name: 'Sanjay Kumar',
      avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150',
      xp: 1450,
      level: 6,
      streak: 15,
      lastActive: '30 minutes ago',
      progress: 85,
      state: 'Karnataka',
      district: 'Bengaluru Urban',
      joinDate: '2024-11-28',
      badges: 12,
      challenges: 20
    },
    {
      id: '4',
      name: 'Meena Singh',
      avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150',
      xp: 750,
      level: 3,
      streak: 5,
      lastActive: '3 hours ago',
      progress: 45,
      state: 'Punjab',
      district: 'Ludhiana',
      joinDate: '2025-01-02',
      badges: 3,
      challenges: 8
    },
    {
      id: '5',
      name: 'Rahul Verma',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
      xp: 1100,
      level: 4,
      streak: 10,
      lastActive: '5 hours ago',
      progress: 70,
      state: 'Uttar Pradesh',
      district: 'Lucknow',
      joinDate: '2024-12-10',
      badges: 6,
      challenges: 14
    }
  ];

  const filteredAthletes = mockAthletes.filter(athlete =>
    athlete.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    athlete.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
    athlete.district.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedAthleteData = mockAthletes.find(a => a.id === selectedAthlete);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Athletes Management</h1>
          <p className="text-gray-400 mt-1">Monitor and guide your athletes' progress</p>
        </div>
        <Button icon={Plus} variant="primary">
          Add Athlete
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search athletes by name, state, or district..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
            />
          </div>
          <Button variant="secondary" icon={Filter}>
            Filter
          </Button>
        </div>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Athletes List */}
        <div className="lg:col-span-2">
          <Card>
            <h2 className="text-xl font-bold text-white mb-6 flex items-center">
              <Users className="w-6 h-6 text-blue-500 mr-2" />
              Your Athletes ({filteredAthletes.length})
            </h2>
            
            <div className="space-y-4">
              {filteredAthletes.map((athlete) => (
                <div 
                  key={athlete.id} 
                  className={`bg-gray-700 rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedAthlete === athlete.id ? 'ring-2 ring-purple-500' : 'hover:bg-gray-650'
                  }`}
                  onClick={() => setSelectedAthlete(athlete.id)}
                >
                  <div className="flex items-center space-x-4">
                    <img src={athlete.avatar} alt={athlete.name} className="w-12 h-12 rounded-full" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-white font-medium">{athlete.name}</h3>
                        <div className="flex items-center space-x-2 text-sm">
                          <span className="text-yellow-400">{athlete.xp} XP</span>
                          <span className="text-orange-400">{athlete.streak}🔥</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-400 text-sm">📍 {athlete.district}, {athlete.state}</span>
                        <span className="text-gray-400 text-sm">Level {athlete.level}</span>
                      </div>
                      <ProgressBar progress={athlete.progress} max={100} showText={false} className="mb-2" />
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-400">Last active: {athlete.lastActive}</span>
                        <div className="flex space-x-3">
                          <span className="text-purple-400">{athlete.badges} badges</span>
                          <span className="text-green-400">{athlete.challenges} challenges</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Athlete Details */}
        <div>
          {selectedAthleteData ? (
            <Card>
              <div className="text-center mb-6">
                <img 
                  src={selectedAthleteData.avatar} 
                  alt={selectedAthleteData.name}
                  className="w-20 h-20 rounded-full mx-auto mb-3 border-4 border-purple-500"
                />
                <h3 className="text-xl font-bold text-white">{selectedAthleteData.name}</h3>
                <p className="text-gray-400">Level {selectedAthleteData.level}</p>
                <p className="text-sm text-purple-400">📍 {selectedAthleteData.district}, {selectedAthleteData.state}</p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-gray-400 text-sm">Overall Progress</span>
                    <span className="text-white text-sm">{selectedAthleteData.progress}%</span>
                  </div>
                  <ProgressBar progress={selectedAthleteData.progress} max={100} showText={false} />
                </div>

                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="bg-yellow-600/20 rounded-lg p-3">
                    <div className="text-yellow-400 font-bold">{selectedAthleteData.xp}</div>
                    <div className="text-xs text-gray-400">Total XP</div>
                  </div>
                  <div className="bg-orange-600/20 rounded-lg p-3">
                    <div className="text-orange-400 font-bold">{selectedAthleteData.streak}</div>
                    <div className="text-xs text-gray-400">Day Streak</div>
                  </div>
                  <div className="bg-purple-600/20 rounded-lg p-3">
                    <div className="text-purple-400 font-bold">{selectedAthleteData.badges}</div>
                    <div className="text-xs text-gray-400">Badges</div>
                  </div>
                  <div className="bg-green-600/20 rounded-lg p-3">
                    <div className="text-green-400 font-bold">{selectedAthleteData.challenges}</div>
                    <div className="text-xs text-gray-400">Challenges</div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Button variant="primary" className="w-full" icon={MessageSquare}>
                  Send Message
                </Button>
                <Button variant="secondary" className="w-full" icon={BarChart3}>
                  View Analytics
                </Button>
                <Button variant="secondary" className="w-full" icon={Award}>
                  Manage Badges
                </Button>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-700 text-xs text-gray-400">
                <p>Joined: {new Date(selectedAthleteData.joinDate).toLocaleDateString()}</p>
              </div>
            </Card>
          ) : (
            <Card>
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Select an Athlete</h3>
                <p className="text-gray-400">Click on an athlete to view their detailed progress and manage their training.</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoachAthletes;