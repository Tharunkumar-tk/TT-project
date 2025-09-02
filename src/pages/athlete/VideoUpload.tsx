import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useGame } from '../../contexts/GameContext';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import { Upload, Video, Zap, Trophy, AlertCircle, CheckCircle } from 'lucide-react';

type TestType = 'jump' | 'shuttle' | 'pushup' | 'situp' | 'endurance';

interface AnalysisResult {
  testType: TestType;
  measurement: string;
  feedback: string;
  xpEarned: number;
  coinsEarned: number;
  comparison: string;
  cheatDetection: boolean;
}

const VideoUpload: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { earnXP, earnCoins } = useGame();
  const [searchParams] = useSearchParams();
  const [selectedTest, setSelectedTest] = useState<TestType>(
    (searchParams.get('activity') as TestType) || 'jump'
  );
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const testTypes = [
    { 
      id: 'jump' as TestType, 
      name: 'Vertical Jump', 
      icon: '🦘', 
      description: 'Measure your jump height',
      demoVideo: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=600',
      instructions: 'Stand with feet shoulder-width apart, jump as high as possible with arms extended upward'
    },
    { 
      id: 'shuttle' as TestType, 
      name: 'Shuttle Run', 
      icon: '🏃', 
      description: 'Test your agility and speed',
      demoVideo: 'https://images.pexels.com/photos/2294361/pexels-photo-2294361.jpeg?auto=compress&cs=tinysrgb&w=600',
      instructions: 'Run between two points 10 meters apart, touch each line, complete 4 rounds'
    },
    { 
      id: 'pushup' as TestType, 
      name: 'Push-ups', 
      icon: '💪', 
      description: 'Count your push-up reps',
      demoVideo: 'https://images.pexels.com/photos/416809/pexels-photo-416809.jpeg?auto=compress&cs=tinysrgb&w=600',
      instructions: 'Keep body straight, lower chest to ground, push back up. Count each complete rep'
    },
    { 
      id: 'situp' as TestType, 
      name: 'Sit-ups', 
      icon: '🤸', 
      description: 'Count your sit-up reps',
      demoVideo: 'https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg?auto=compress&cs=tinysrgb&w=600',
      instructions: 'Lie on back, knees bent, hands behind head. Lift torso to knees, lower back down'
    },
    { 
      id: 'endurance' as TestType, 
      name: 'Endurance Run', 
      icon: '🏃‍♀️', 
      description: 'Track your running performance',
      demoVideo: 'https://images.pexels.com/photos/2803158/pexels-photo-2803158.jpeg?auto=compress&cs=tinysrgb&w=600',
      instructions: 'Run at steady pace for specified distance. Maintain consistent breathing rhythm'
    },
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setAnalysisResult(null);
    }
  };

  const getMockAnalysis = (testType: TestType): AnalysisResult => {
    const analyses: Record<TestType, AnalysisResult> = {
      jump: {
        testType: 'jump',
        measurement: '52cm',
        feedback: 'Excellent vertical jump! Your technique shows good knee bend and explosive power.',
        xpEarned: 75,
        coinsEarned: 15,
        comparison: 'Above average for your age group (avg: 45cm)',
        cheatDetection: false
      },
      shuttle: {
        testType: 'shuttle',
        measurement: '11.8 seconds',
        feedback: 'Great agility performance! Your direction changes are quick and controlled.',
        xpEarned: 80,
        coinsEarned: 16,
        comparison: 'Top 20% for your age group (avg: 13.2s)',
        cheatDetection: false
      },
      pushup: {
        testType: 'pushup',
        measurement: '28 reps',
        feedback: 'Solid push-up performance! Good form maintained throughout most reps.',
        xpEarned: 70,
        coinsEarned: 14,
        comparison: 'Above average for your age group (avg: 22 reps)',
        cheatDetection: false
      },
      situp: {
        testType: 'situp',
        measurement: '35 reps',
        feedback: 'Strong core performance! Consistent pace and good form.',
        xpEarned: 65,
        coinsEarned: 13,
        comparison: 'Excellent - top 15% for your age group (avg: 25 reps)',
        cheatDetection: false
      },
      endurance: {
        testType: 'endurance',
        measurement: '8:45 (1km)',
        feedback: 'Good endurance pace! Your breathing rhythm improved throughout the run.',
        xpEarned: 85,
        coinsEarned: 17,
        comparison: 'Above average pace for your age group (avg: 9:30)',
        cheatDetection: false
      }
    };
    return analyses[testType];
  };

  const handleAnalyze = async () => {
    if (!uploadedFile) return;

    setAnalyzing(true);
    
    // Simulate AI analysis delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const result = getMockAnalysis(selectedTest);
    setAnalysisResult(result);
    
    // Update user stats
    if (user) {
      updateUser({
        xp: (user.xp || 0) + result.xpEarned,
        coins: (user.coins || 0) + result.coinsEarned
      });
    }

    earnXP(result.xpEarned);
    earnCoins(result.coinsEarned);
    setAnalyzing(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Upload Performance Video</h1>
        <p className="text-gray-400">Upload a video of your athletic performance for AI-powered analysis and feedback.</p>
        {searchParams.get('challenge') && (
          <div className="mt-3 p-3 bg-purple-600/20 rounded-lg border border-purple-500">
            <p className="text-purple-300 text-sm">
              📋 Challenge Mode: Upload a video to complete your active challenge
            </p>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Test Selection */}
        <Card>
          <h2 className="text-xl font-bold text-white mb-4">Select Test Type</h2>
          <div className="grid gap-3">
            {testTypes.map((test) => (
              <div
                key={test.id}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  selectedTest === test.id
                    ? 'border-purple-500 bg-purple-600/20'
                    : 'border-gray-600 hover:border-gray-500'
                }`}
                onClick={() => setSelectedTest(test.id)}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{test.icon}</span>
                  <div>
                    <div className="text-white font-medium">{test.name}</div>
                    <div className="text-sm text-gray-400">{test.description}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Demo Video Section */}
          <div className="mt-6 pt-6 border-t border-gray-700">
            <h3 className="text-lg font-bold text-white mb-3">Demo Video & Instructions</h3>
            <div className="bg-gray-700 rounded-lg p-4">
              <img 
                src={testTypes.find(t => t.id === selectedTest)?.demoVideo}
                alt={`${selectedTest} demo`}
                className="w-full h-32 object-cover rounded-lg mb-3"
              />
              <div className="text-white font-medium mb-2">
                How to perform {testTypes.find(t => t.id === selectedTest)?.name}
              </div>
              <p className="text-gray-300 text-sm">
                {testTypes.find(t => t.id === selectedTest)?.instructions}
              </p>
            </div>
          </div>
        </Card>

        {/* Video Upload */}
        <Card>
          <h2 className="text-xl font-bold text-white mb-4">Upload Video</h2>
          
          {!uploadedFile ? (
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
              <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">Choose a video file to upload</p>
              <input
                type="file"
                accept="video/*"
                onChange={handleFileUpload}
                className="hidden"
                id="video-upload"
              />
              <label htmlFor="video-upload">
                <Button variant="primary" icon={Upload} className="cursor-pointer">
                  Select Video File
                </Button>
              </label>
              <p className="text-xs text-gray-500 mt-2">
                Supported formats: MP4, MOV, AVI (Max: 100MB)
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <Video className="w-8 h-8 text-purple-400" />
                  <div>
                    <div className="text-white font-medium">{uploadedFile.name}</div>
                    <div className="text-sm text-gray-400">
                      {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={handleAnalyze}
                  disabled={analyzing}
                  className="flex-1"
                  icon={analyzing ? undefined : Zap}
                >
                  {analyzing ? 'Analyzing...' : 'Analyze Performance'}
                </Button>
                <Button 
                  variant="secondary"
                  onClick={() => setUploadedFile(null)}
                >
                  Change File
                </Button>
              </div>
            </div>
          )}

          {/* Analysis Progress */}
          {analyzing && (
            <div className="mt-6 p-4 bg-blue-600/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400"></div>
                <div className="text-blue-400 font-medium">AI is analyzing your performance...</div>
              </div>
              <div className="text-sm text-blue-300 mt-2">
                This may take a few moments. Our AI is detecting movement patterns and measuring performance metrics.
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Analysis Results */}
      {analysisResult && (
        <Card>
          <div className="flex items-center space-x-3 mb-6">
            <CheckCircle className="w-8 h-8 text-green-400" />
            <div>
              <h2 className="text-2xl font-bold text-white">Analysis Complete!</h2>
              <p className="text-gray-400">Here are your performance results</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-green-600/20 rounded-lg p-4">
                <h3 className="text-lg font-bold text-green-400 mb-2">Performance Measurement</h3>
                <div className="text-3xl font-bold text-white mb-2">{analysisResult.measurement}</div>
                <p className="text-green-300">{analysisResult.comparison}</p>
              </div>

              <div className="bg-purple-600/20 rounded-lg p-4">
                <h3 className="text-lg font-bold text-purple-400 mb-2">AI Feedback</h3>
                <p className="text-gray-300">{analysisResult.feedback}</p>
              </div>

              {!analysisResult.cheatDetection && (
                <div className="bg-blue-600/20 rounded-lg p-4 flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-blue-400" />
                  <div>
                    <div className="text-blue-400 font-medium">Video Verified</div>
                    <div className="text-sm text-blue-300">No tampering detected</div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="bg-yellow-600/20 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-yellow-400">XP Earned</h3>
                  <Zap className="w-6 h-6 text-yellow-400" />
                </div>
                <div className="text-3xl font-bold text-white">+{analysisResult.xpEarned}</div>
              </div>

              <div className="bg-green-600/20 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-green-400">Coins Earned</h3>
                  <span className="text-2xl">🪙</span>
                </div>
                <div className="text-3xl font-bold text-white">+{analysisResult.coinsEarned}</div>
              </div>

              <div className="bg-gray-600/20 rounded-lg p-4">
                <h3 className="text-lg font-bold text-gray-300 mb-3">Quick Actions</h3>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm">Share Results</Button>
                  <Button variant="secondary" size="sm">View History</Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default VideoUpload;