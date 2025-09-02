import React, { useState } from 'react';
import { useGame } from '../../contexts/GameContext';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import { Award, Search, Plus, Users, Star, Trophy } from 'lucide-react';

const CoachBadges: React.FC = () => {
  const { badges } = useGame();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBadge, setSelectedBadge] = useState<string | null>(null);

  const categories = [
    { id: 'all', name: 'All Categories', count: badges.length },
    { id: 'consistency', name: 'Consistency', count: badges.filter(b => b.category === 'consistency').length },
    { id: 'strength', name: 'Strength', count: badges.filter(b => b.category === 'strength').length },
    { id: 'endurance', name: 'Endurance', count: badges.filter(b => b.category === 'endurance').length },
    { id: 'speed', name: 'Speed', count: badges.filter(b => b.category === 'speed').length },
    { id: 'special', name: 'Special', count: badges.filter(b => b.category === 'special').length },
  ];

  const filteredBadges = badges.filter(badge => {
    const matchesSearch = badge.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         badge.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || badge.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const selectedBadgeData = badges.find(b => b.id === selectedBadge);

  const mockAthleteProgress = [
    { name: 'Arjun Sharma', progress: 8, total: 10, avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100' },
    { name: 'Priya Patel', progress: 5, total: 10, avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100' },
    { name: 'Sanjay Kumar', progress: 10, total: 10, avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Badge Management</h1>
          <p className="text-gray-400 mt-1">Manage and assign badges to your athletes</p>
        </div>
        <Button icon={Plus} variant="primary">
          Create Custom Badge
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search badges..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Badge Grid */}
        <div className="lg:col-span-2">
          <Card>
            <h2 className="text-xl font-bold text-white mb-6 flex items-center">
              <Award className="w-6 h-6 text-yellow-500 mr-2" />
              Badge Collection ({filteredBadges.length})
            </h2>
            
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredBadges.map((badge) => (
                <div
                  key={badge.id}
                  className={`bg-gray-700 rounded-lg p-4 cursor-pointer transition-all hover:bg-gray-650 ${
                    selectedBadge === badge.id ? 'ring-2 ring-purple-500' : ''
                  }`}
                  onClick={() => setSelectedBadge(badge.id)}
                >
                  <div className="text-center">
                    <div className="text-3xl mb-2">{badge.icon}</div>
                    <h3 className="text-white font-medium mb-1">{badge.name}</h3>
                    <p className="text-gray-400 text-xs mb-3">{badge.description}</p>
                    
                    <div className="flex justify-center space-x-2 text-xs mb-3">
                      <span className="text-yellow-400">+{badge.xpReward} XP</span>
                      <span className="text-green-400">+{badge.coinReward} 🪙</span>
                    </div>

                    <span className={`text-xs px-2 py-1 rounded-full ${
                      badge.category === 'consistency' ? 'bg-orange-600/20 text-orange-400' :
                      badge.category === 'strength' ? 'bg-red-600/20 text-red-400' :
                      badge.category === 'endurance' ? 'bg-blue-600/20 text-blue-400' :
                      badge.category === 'speed' ? 'bg-yellow-600/20 text-yellow-400' :
                      'bg-purple-600/20 text-purple-400'
                    }`}>
                      {badge.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Badge Details */}
        <div>
          {selectedBadgeData ? (
            <Card>
              <div className="text-center mb-6">
                <div className="text-4xl mb-3">{selectedBadgeData.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{selectedBadgeData.name}</h3>
                <p className="text-gray-400 text-sm">{selectedBadgeData.description}</p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="bg-gray-700 rounded-lg p-3">
                  <h4 className="text-white font-medium mb-2">Requirements</h4>
                  <p className="text-gray-300 text-sm">{selectedBadgeData.requirements}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-yellow-600/20 rounded-lg p-3 text-center">
                    <div className="text-yellow-400 font-bold">{selectedBadgeData.xpReward}</div>
                    <div className="text-xs text-gray-400">XP Reward</div>
                  </div>
                  <div className="bg-green-600/20 rounded-lg p-3 text-center">
                    <div className="text-green-400 font-bold">{selectedBadgeData.coinReward}</div>
                    <div className="text-xs text-gray-400">Coin Reward</div>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <h4 className="text-white font-medium">Athlete Progress</h4>
                {mockAthleteProgress.map((athlete, index) => (
                  <div key={index} className="flex items-center space-x-3 bg-gray-700 rounded-lg p-3">
                    <img src={athlete.avatar} alt={athlete.name} className="w-8 h-8 rounded-full" />
                    <div className="flex-1">
                      <div className="text-white text-sm">{athlete.name}</div>
                      <div className="text-xs text-gray-400">
                        {athlete.progress}/{athlete.total} completed
                      </div>
                    </div>
                    {athlete.progress === athlete.total && (
                      <Star className="w-4 h-4 text-yellow-400" />
                    )}
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Button variant="primary" className="w-full">
                  Assign to Athlete
                </Button>
                <Button variant="secondary" className="w-full">
                  View All Progress
                </Button>
                <Button variant="secondary" className="w-full">
                  Edit Badge
                </Button>
              </div>
            </Card>
          ) : (
            <Card>
              <div className="text-center py-12">
                <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Select a Badge</h3>
                <p className="text-gray-400">Click on a badge to view details and manage athlete progress.</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoachBadges;