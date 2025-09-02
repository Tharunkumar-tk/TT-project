import React, { useState } from 'react';
import { useGame } from '../../contexts/GameContext';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import { Play, Clock, User, BookOpen, Lightbulb, MessageSquare } from 'lucide-react';

type TrainingCategory = 'all' | 'strength' | 'endurance' | 'flexibility' | 'recovery';

const Training: React.FC = () => {
  const { trainingVideos } = useGame();
  const [activeCategory, setActiveCategory] = useState<TrainingCategory>('all');

  const categories = [
    { id: 'all' as TrainingCategory, name: 'All Videos', icon: BookOpen, color: 'gray' },
    { id: 'strength' as TrainingCategory, name: 'Strength', icon: '💪', color: 'red' },
    { id: 'endurance' as TrainingCategory, name: 'Endurance', icon: '🏃', color: 'blue' },
    { id: 'flexibility' as TrainingCategory, name: 'Flexibility', icon: '🤸', color: 'green' },
    { id: 'recovery' as TrainingCategory, name: 'Recovery', icon: '😌', color: 'purple' },
  ];

  const filteredVideos = activeCategory === 'all' 
    ? trainingVideos 
    : trainingVideos.filter(v => v.category === activeCategory);

  const tips = [
    {
      title: 'Proper Warm-up',
      content: 'Always start with 5-10 minutes of light cardio and dynamic stretching to prepare your muscles.',
      icon: '🔥'
    },
    {
      title: 'Form Over Speed',
      content: 'Focus on perfect technique rather than rushing through exercises. Quality beats quantity.',
      icon: '✨'
    },
    {
      title: 'Progressive Overload',
      content: 'Gradually increase intensity, duration, or difficulty to continue improving your performance.',
      icon: '📈'
    },
    {
      title: 'Recovery is Key',
      content: 'Allow adequate rest between intense sessions. Your muscles grow during recovery, not just training.',
      icon: '💤'
    }
  ];

  const coachAdvice = [
    {
      coach: 'Coach Sarah',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100',
      advice: 'Consistency beats perfection. Show up every day, even if it\'s just for 10 minutes.',
      specialty: 'Strength Training'
    },
    {
      coach: 'Coach Mike',
      avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100',
      advice: 'Listen to your body. Push yourself, but know when to rest to prevent injury.',
      specialty: 'Endurance Coaching'
    },
    {
      coach: 'Coach Emma',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
      advice: 'Flexibility is often overlooked but crucial for athletic performance and injury prevention.',
      specialty: 'Flexibility & Recovery'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Training Center</h1>
        <p className="text-gray-400">Master your technique with expert training videos and professional tips</p>
      </div>

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

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Training Videos */}
        <div className="lg:col-span-2">
          <Card>
            <h2 className="text-xl font-bold text-white mb-6 flex items-center">
              <Play className="w-6 h-6 text-green-500 mr-2" />
              Training Videos
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              {filteredVideos.map((video) => (
                <div key={video.id} className="bg-gray-700 rounded-lg overflow-hidden hover:bg-gray-650 transition-colors cursor-pointer">
                  <div className="relative">
                    <img 
                      src={video.thumbnail} 
                      alt={video.title}
                      className="w-full h-32 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <Play className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-white text-xs">
                      {video.duration}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-white font-medium mb-1">{video.title}</h3>
                    <p className="text-gray-400 text-sm mb-2">{video.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <User className="w-3 h-3 text-gray-400" />
                        <span className="text-gray-400 text-xs">{video.instructor}</span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        video.category === 'strength' ? 'bg-red-600/20 text-red-400' :
                        video.category === 'endurance' ? 'bg-blue-600/20 text-blue-400' :
                        video.category === 'flexibility' ? 'bg-green-600/20 text-green-400' :
                        'bg-purple-600/20 text-purple-400'
                      }`}>
                        {video.category}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Tips & Coach's Corner */}
        <div className="space-y-6">
          {/* Tips & Tricks */}
          <Card>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
              <Lightbulb className="w-5 h-5 text-yellow-500 mr-2" />
              Tips & Tricks
            </h3>
            <div className="space-y-4">
              {tips.map((tip, index) => (
                <div key={index} className="bg-gray-700 rounded-lg p-3">
                  <div className="flex items-start space-x-3">
                    <span className="text-xl">{tip.icon}</span>
                    <div>
                      <h4 className="text-white font-medium text-sm mb-1">{tip.title}</h4>
                      <p className="text-gray-300 text-xs">{tip.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Coach's Corner */}
          <Card>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
              <MessageSquare className="w-5 h-5 text-blue-500 mr-2" />
              Coach's Corner
            </h3>
            <div className="space-y-4">
              {coachAdvice.map((advice, index) => (
                <div key={index} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <img 
                      src={advice.avatar} 
                      alt={advice.coach}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-white font-medium text-sm">{advice.coach}</span>
                        <span className="text-xs text-purple-400">{advice.specialty}</span>
                      </div>
                      <p className="text-gray-300 text-sm italic">"{advice.advice}"</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card>
            <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="primary" className="w-full justify-start">
                📚 Browse All Videos
              </Button>
              <Button variant="secondary" className="w-full justify-start">
                💬 Ask a Coach
              </Button>
              <Button variant="secondary" className="w-full justify-start">
                📝 Submit Training Tip
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Training;