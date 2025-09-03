import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Upload, Video, CheckCircle, AlertCircle, ArrowLeft, Target, Play, Camera, Sparkles, Zap } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useGame } from '../../contexts/GameContext';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';

interface ActivityDemo {
  id: string;
  name: string;
  gif: string;
  instructions: string[];
}

const activityDemos: Record<string, ActivityDemo> = {
  jump: {
    id: 'jump',
    name: 'Vertical Jump',
    gif: '/challenge-demos/ssvid.net--Vertical-Jump_v720P (online-video-cutter.com) copy.gif',
    instructions: [
      'Stand straight with feet shoulder-width apart',
      'Keep your arms relaxed at your sides',
      'Bend knees slightly and prepare for lift-off',
      'Jump as high as possible using your arms for momentum',
      'Land softly on both feet with bent knees'
    ]
  },
  shuttle: {
    id: 'shuttle',
    name: 'Shuttle Run',
    gif: '/challenge-demos/ssvid.net--Shuttle-Run_1080p (online-video-cutter.com) (1) copy.gif',
    instructions: [
      'Start in a ready position at the starting line',
      'Sprint to the first cone as fast as possible',
      'Touch the cone and immediately change direction',
      'Sprint back to the starting line',
      'Maintain speed throughout all direction changes'
    ]
  },
  pushup: {
    id: 'pushup',
    name: 'Push-Ups',
    gif: '/challenge-demos/ssvid.net--How-to-do-a-Push-Up-Proper-Form-Technique_1080p (online-video-cutter.com) (1) copy.gif',
    instructions: [
      'Start in plank position with hands shoulder-width apart',
      'Keep your body in a straight line from head to heels',
      'Lower your chest until it nearly touches the ground',
      'Push back up to starting position',
      'Maintain controlled movement throughout'
    ]
  },
  situp: {
    id: 'situp',
    name: 'Sit-Ups',
    gif: '/challenge-demos/4921658-hd_1066_1920_25fps (online-video-cutter.com) copy.gif',
    instructions: [
      'Lie on your back with knees bent',
      'Place hands behind your head or crossed on chest',
      'Engage your core muscles',
      'Lift your upper body toward your knees',
      'Lower back down with control'
    ]
  },
  endurance: {
    id: 'endurance',
    name: 'Endurance Run',
    gif: '/challenge-demos/Become obsessed (online-video-cutter.com) (1) copy.gif',
    instructions: [
      'Start with a comfortable running pace',
      'Maintain steady breathing rhythm',
      'Keep your posture upright and relaxed',
      'Land on the middle of your foot',
      'Focus on consistent pace rather than speed'
    ]
  }
};

// Challenge name mapping
const challengeNames: Record<string, string> = {
  'daily-jump': 'Daily Leap Challenge',
  'daily-pushups': 'Power Push-ups Challenge',
  'weekly-run': 'Distance Destroyer Challenge',
  'shuttle-sprint': 'Shuttle Sprint Challenge',
  'core-crusher': 'Core Crusher Challenge'
};

interface VideoUploadProps {}

export const VideoUpload: React.FC<VideoUploadProps> = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const { updateProgress, completeChallenge } = useGame();
  
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'analyzing' | 'success' | 'error'>('idle');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analysisResults, setAnalysisResults] = useState<any>(null);

  const activityType = searchParams.get('activity') || '';
  const challengeId = searchParams.get('challenge') || '';
  const challengeNameParam = searchParams.get('challengeName') || '';
  const currentDemo = activityDemos[activityType];
  const challengeName = challengeNameParam || (challengeId ? challengeNames[challengeId] : null);

  useEffect(() => {
    // Reset state when activity changes
    setSelectedFile(null);
    setUploadStatus('idle');
    setAnalysisResults(null);
  }, [activityType]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadStatus('idle');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploadStatus('uploading');
    
    try {
      // Simulate upload process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setUploadStatus('analyzing');
      
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // Mock analysis results based on activity type
      const mockResults = generateMockResults(activityType);
      setAnalysisResults(mockResults);
      
      // Update user stats and challenge progress
      if (user) {
        const xpGained = mockResults.xpEarned;
        const coinsGained = mockResults.coinsEarned;
        
        updateUser({
          xp: (user.xp || 0) + xpGained,
          coins: (user.coins || 0) + coinsGained,
          streak: (user.streak || 0) + (Math.random() > 0.5 ? 1 : 0)
        });

        // Update challenge progress if coming from a challenge
        if (challengeId) {
          updateProgress(challengeId, mockResults.count);
          if (mockResults.count >= mockResults.target) {
            completeChallenge(challengeId);
          }
        }
      }
      
      setUploadStatus('success');
    } catch (error) {
      setUploadStatus('error');
    }
  };

  const generateMockResults = (activity: string) => {
    switch (activity) {
      case 'jump':
        const jumpHeight = Math.floor(Math.random() * 20) + 35; // 35-55cm
        return {
          count: 1,
          target: 1,
          measurement: `${jumpHeight}cm`,
          rating: jumpHeight > 45 ? 'Excellent' : jumpHeight > 40 ? 'Good' : 'Fair',
          feedback: jumpHeight > 45 ? 'Outstanding jump height!' : 'Good form, try to jump higher next time.',
          xpEarned: jumpHeight > 45 ? 75 : 50,
          coinsEarned: jumpHeight > 45 ? 15 : 10
        };
      case 'shuttle':
        const time = (Math.random() * 3 + 10).toFixed(1); // 10-13 seconds
        return {
          count: 1,
          target: 5,
          measurement: `${time}s`,
          rating: parseFloat(time) < 11.5 ? 'Excellent' : parseFloat(time) < 12.5 ? 'Good' : 'Fair',
          feedback: parseFloat(time) < 11.5 ? 'Amazing speed!' : 'Good run, work on acceleration.',
          xpEarned: parseFloat(time) < 11.5 ? 60 : 40,
          coinsEarned: parseFloat(time) < 11.5 ? 12 : 8
        };
      case 'pushup':
        const pushups = Math.floor(Math.random() * 15) + 15; // 15-30
        return {
          count: pushups,
          target: 25,
          measurement: `${pushups} reps`,
          rating: pushups >= 25 ? 'Excellent' : pushups >= 20 ? 'Good' : 'Fair',
          feedback: pushups >= 25 ? 'Perfect form and count!' : 'Good effort, keep building strength.',
          xpEarned: pushups >= 25 ? 60 : 40,
          coinsEarned: pushups >= 25 ? 12 : 8
        };
      case 'situp':
        const situps = Math.floor(Math.random() * 20) + 30; // 30-50
        return {
          count: situps,
          target: 50,
          measurement: `${situps} reps`,
          rating: situps >= 45 ? 'Excellent' : situps >= 35 ? 'Good' : 'Fair',
          feedback: situps >= 45 ? 'Excellent core strength!' : 'Good work, keep building endurance.',
          xpEarned: situps >= 45 ? 70 : 50,
          coinsEarned: situps >= 45 ? 14 : 10
        };
      case 'endurance':
        const distance = (Math.random() * 2 + 1).toFixed(1); // 1-3km
        return {
          count: parseFloat(distance),
          target: 10,
          measurement: `${distance}km`,
          rating: parseFloat(distance) > 2 ? 'Excellent' : parseFloat(distance) > 1.5 ? 'Good' : 'Fair',
          feedback: parseFloat(distance) > 2 ? 'Great endurance!' : 'Good pace, keep building stamina.',
          xpEarned: parseFloat(distance) > 2 ? 80 : 60,
          coinsEarned: parseFloat(distance) > 2 ? 16 : 12
        };
      default:
        return {
          count: 1,
          target: 1,
          measurement: 'Completed',
          rating: 'Good',
          feedback: 'Great job completing this activity!',
          xpEarned: 50,
          coinsEarned: 10
        };
    }
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setUploadStatus('idle');
    setAnalysisResults(null);
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
          <Button variant="secondary" icon={ArrowLeft} onClick={goBack}>
            <span className="hidden sm:inline">Back</span>
            <span className="sm:hidden">←</span>
          </Button>
          <div className="min-w-0 flex-1">
            <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-white truncate">
              {challengeName || (currentDemo ? `${currentDemo.name} Upload` : 'Video Upload')}
            </h1>
            <p className="text-gray-400 mt-1 text-xs sm:text-sm line-clamp-2">
              {challengeName 
                ? `Complete the ${challengeName} by uploading your video`
                : currentDemo 
                  ? `Upload your ${currentDemo.name.toLowerCase()} video for AI analysis` 
                  : 'Upload your training videos for analysis and feedback'
              }
            </p>
          </div>
        </div>
        {challengeId && (
          <div className="flex items-center space-x-1 sm:space-x-2 bg-purple-600/20 px-2 sm:px-4 py-1 sm:py-2 rounded-lg flex-shrink-0">
            <Target className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
            <span className="text-purple-400 font-medium text-xs sm:text-sm">
              <span className="hidden sm:inline">Challenge Mode</span>
              <span className="sm:hidden">Challenge</span>
            </span>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Demo Section - Larger and First */}
        {currentDemo && (
          <Card className="lg:col-span-1">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 flex items-center">
              <Play className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2" />
              {currentDemo.name} Demo
            </h3>
            
            {/* GIF Display - Better sizing and error handling */}
            <div className="mb-4 sm:mb-6 bg-gray-900 rounded-lg sm:rounded-xl overflow-hidden border border-gray-700 relative">
              <img 
                src={currentDemo.gif} 
                alt={`${currentDemo.name} demonstration`}
                className="w-full h-auto object-cover rounded-lg"
                style={{ maxHeight: '400px', minHeight: '200px' }}
                onError={(e) => {
                  console.error('Failed to load GIF:', currentDemo.gif);
                  const target = e.currentTarget as HTMLImageElement;
                  target.src = 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=600';
                  target.alt = 'Exercise demonstration placeholder';
                }}
              />
              <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-white text-xs">
                Demo Video
              </div>
            </div>

            {/* Instructions */}
            <div>
              <h4 className="text-white font-bold mb-3 sm:mb-4 text-sm sm:text-base">Proper Technique:</h4>
              <ol className="space-y-1 sm:space-y-2">
                {currentDemo.instructions.map((instruction, index) => (
                  <li key={index} className="flex items-start space-x-2 sm:space-x-3">
                    <span className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-medium">
                      {index + 1}
                    </span>
                    <span className="text-gray-200 text-sm sm:text-base">{instruction}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Recording Tips */}
            <div className="mt-4 sm:mt-6 pt-4 border-t border-gray-700">
              <h4 className="text-white font-bold mb-3 sm:mb-4 flex items-center text-sm sm:text-base">
                <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 mr-2" />
                Recording Tips
              </h4>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-300">
                <li className="flex items-start space-x-1 sm:space-x-2">
                  <span className="text-green-400">•</span>
                  <span>Record in good lighting</span>
                </li>
                <li className="flex items-start space-x-1 sm:space-x-2">
                  <span className="text-green-400">•</span>
                  <span>Show your full body in frame</span>
                </li>
                <li className="flex items-start space-x-1 sm:space-x-2">
                  <span className="text-green-400">•</span>
                  <span>Keep camera steady</span>
                </li>
                <li className="flex items-start space-x-1 sm:space-x-2">
                  <span className="text-green-400">•</span>
                  <span>Record from the side view</span>
                </li>
              </ul>
            </div>
          </Card>
        )}

        {/* Upload Section - Smaller and Compact */}
        <Card className="lg:col-span-1">
          {uploadStatus === 'idle' && (
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white mb-3 flex items-center">
                <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-2 rounded-lg mr-2">
                  <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                {challengeName || `Upload ${currentDemo?.name || 'Video'}`}
              </h2>
              
              <div className="relative overflow-hidden border-2 border-dashed border-gray-600 rounded-lg p-3 sm:p-4 hover:border-purple-500 transition-all duration-300 text-center bg-gradient-to-br from-gray-800/50 to-gray-900/50">
                <div className="relative z-10">
                  <div className="bg-gradient-to-r from-purple-600 to-blue-600 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 shadow-lg">
                    <Video className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  
                  <h3 className="text-sm sm:text-base font-bold text-white mb-2">
                    Record Your Performance
                  </h3>
                  
                  <p className="text-gray-300 mb-3 text-xs max-w-sm mx-auto leading-relaxed">
                    {currentDemo 
                      ? `Follow the demo and get AI feedback` 
                      : 'Get instant AI-powered analysis of your technique and performance'
                    }
                  </p>
                  
                  <div className="flex flex-wrap justify-center gap-1 sm:gap-2 mb-3 text-xs">
                    <div className="flex items-center space-x-1 text-purple-300">
                      <Sparkles className="w-3 h-3" />
                      <span className="hidden sm:inline">AI Analysis</span>
                      <span className="sm:hidden">AI</span>
                    </div>
                    <div className="flex items-center space-x-1 text-green-300">
                      <Zap className="w-3 h-3" />
                      <span className="hidden sm:inline">Feedback</span>
                      <span className="sm:hidden">Fast</span>
                    </div>
                    <div className="flex items-center space-x-1 text-yellow-300">
                      <span>🏆</span>
                      <span className="hidden sm:inline">Rewards</span>
                      <span className="sm:hidden">XP</span>
                    </div>
                  </div>
                  
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="video-upload"
                  />
                  <label
                    htmlFor="video-upload"
                    className="inline-flex items-center px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs sm:text-sm font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 touch-manipulation"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Choose Video File</span>
                    <span className="sm:hidden">Choose File</span>
                  </label>
                  
                  <div className="mt-2 sm:mt-3 flex justify-center gap-2 sm:gap-4 text-xs text-gray-400">
                    <div className="flex items-center space-x-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span className="hidden sm:inline">MP4, MOV</span>
                      <span className="sm:hidden">MP4</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span className="hidden sm:inline">100MB max</span>
                      <span className="sm:hidden">100MB</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                      <span className="hidden sm:inline">HD Quality</span>
                      <span className="sm:hidden">HD</span>
                    </div>
                  </div>
                </div>
              </div>

              {selectedFile && (
                <div className="mt-3 p-2 sm:p-3 bg-gradient-to-r from-gray-700 to-gray-800 rounded-lg border border-gray-600">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                      <Video className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-white truncate">{selectedFile.name}</div>
                        <div className="text-xs text-gray-400">
                          {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                        </div>
                      </div>
                    </div>
                    <Button onClick={handleUpload} className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800" size="sm">
                      <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">Analyze Video</span>
                      <span className="sm:hidden">Analyze</span>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {uploadStatus === 'uploading' && (
            <div className="text-center py-4 sm:py-6">
              <div className="relative">
                <div className="animate-spin w-10 h-10 sm:w-12 sm:h-12 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-3 sm:mb-4"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Upload className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400" />
                </div>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-2">Uploading...</h3>
              <p className="text-gray-400 mb-3 text-xs sm:text-sm px-4">Processing your video</p>
              <div className="max-w-xs mx-auto">
                <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-600 to-blue-600 h-3 rounded-full animate-pulse transition-all duration-1000" style={{ width: '75%' }}></div>
                </div>
              </div>
            </div>
          )}

          {uploadStatus === 'analyzing' && (
            <div className="text-center py-4 sm:py-6">
              <div className="relative">
                <div className="animate-pulse w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-600 to-green-600 rounded-full mx-auto mb-2 sm:mb-3 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 animate-ping w-10 h-10 sm:w-12 sm:h-12 bg-purple-600/30 rounded-full"></div>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-2">AI Analysis...</h3>
              <p className="text-gray-400 mb-3 text-xs sm:text-sm px-4">Analyzing your {currentDemo?.name.toLowerCase() || 'performance'}</p>
              
              <div className="bg-gray-700 rounded-lg p-2 sm:p-3 max-w-sm mx-auto mb-3">
                <div className="flex justify-center space-x-1 mb-3">
                  <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce"></div>
                  <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-3 h-3 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <p className="text-xs text-gray-300">Counting reps...</p>
              </div>
            </div>
          )}

          {uploadStatus === 'success' && analysisResults && (
            <div className="space-y-3 sm:space-y-4">
              <div className="text-center">
                <div className="relative">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-2xl">
                    <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <div className="absolute inset-0 animate-ping w-12 h-12 sm:w-16 sm:h-16 bg-green-500/30 rounded-full mx-auto"></div>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white mb-2">Complete! 🎉</h3>
                <p className="text-gray-300 text-xs sm:text-sm px-2">Analysis finished</p>
              </div>

              {/* Analysis Results */}
              <div className="bg-gradient-to-r from-gray-700 to-gray-800 rounded-lg p-3 sm:p-4 border border-gray-600">
                <h4 className="text-sm sm:text-base font-bold text-white mb-3 sm:mb-4 flex items-center justify-center">
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 mr-2" />
                  Performance Results
                </h4>
                <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div className="text-center bg-gray-800 rounded-lg p-2 sm:p-3">
                    <div className="text-lg sm:text-xl font-bold text-purple-400 mb-1">{analysisResults.measurement}</div>
                    <div className="text-xs sm:text-sm text-gray-300 font-medium">
                      {activityType === 'jump' ? 'Jump Height' :
                       activityType === 'shuttle' ? 'Best Time' :
                       activityType === 'pushup' || activityType === 'situp' ? 'Reps Counted' :
                       activityType === 'endurance' ? 'Distance' : 'Result'}
                    </div>
                  </div>
                  <div className="text-center bg-gray-800 rounded-lg p-2 sm:p-3">
                    <div className={`text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2 ${
                      analysisResults.rating === 'Excellent' ? 'text-green-400' :
                      analysisResults.rating === 'Good' ? 'text-yellow-400' : 'text-orange-400'
                    }`}>
                      {analysisResults.rating}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-400">Form Rating</div>
                  </div>
                  <div className="text-center bg-gray-800 rounded-lg p-2 sm:p-3">
                    <div className="text-lg sm:text-xl font-bold text-blue-400 mb-1">
                      {Math.floor((analysisResults.count / analysisResults.target) * 100)}%
                    </div>
                    <div className="text-xs sm:text-sm text-gray-400">Progress</div>
                  </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-2 sm:p-3 mb-3">
                  <h5 className="text-white font-bold mb-2 sm:mb-3 flex items-center">
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 mr-2" />
                    AI Feedback
                  </h5>
                  <p className="text-gray-200 leading-relaxed text-sm sm:text-base">{analysisResults.feedback}</p>
                </div>

                <div className="flex justify-center gap-2 text-center">
                  <div className="bg-yellow-600/20 rounded-lg px-2 sm:px-3 py-1 sm:py-2 flex items-center justify-center space-x-1">
                    <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                    <span className="text-yellow-400 font-bold text-xs sm:text-sm">+{analysisResults.xpEarned} XP</span>
                  </div>
                  <div className="bg-green-600/20 rounded-lg px-2 sm:px-3 py-1 sm:py-2 flex items-center justify-center space-x-1">
                    <span className="text-lg sm:text-xl">🪙</span>
                    <span className="text-green-400 font-bold text-xs sm:text-sm">+{analysisResults.coinsEarned}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <Button onClick={resetUpload} variant="secondary" className="flex-1">
                  <span className="hidden sm:inline">Upload Another</span>
                  <span className="sm:hidden">Upload Again</span>
                </Button>
                <Button onClick={() => navigate('/athlete/challenges')} className="flex-1">
                  <span className="hidden sm:inline">Back to Challenges</span>
                  <span className="sm:hidden">Challenges</span>
                </Button>
              </div>
            </div>
          )}

          {uploadStatus === 'error' && (
            <div className="text-center py-4 sm:py-6">
              <div className="bg-red-500 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-2">Upload Failed</h3>
              <p className="text-gray-400 mb-3 max-w-md mx-auto text-xs sm:text-sm px-4">
                There was an error processing your video. Please check your internet connection and try again.
              </p>
              <Button onClick={resetUpload} variant="secondary">
                <Upload className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                Try Again
              </Button>
            </div>
          )}

          {/* General Upload Info for non-specific activities */}
          {!currentDemo && uploadStatus === 'idle' && (
            <div className="mt-4 pt-3 border-t border-gray-700">
              <h4 className="text-white font-bold mb-3">Upload Guidelines</h4>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-start space-x-2">
                  <span className="text-green-400">✓</span>
                  <span>Record in landscape mode</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-400">✓</span>
                  <span>Good lighting required</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-400">✓</span>
                  <span>Show your full body in the frame</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-400">✓</span>
                  <span>Keep camera steady</span>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-white font-bold mb-3">Available Activities</h4>
                <div className="grid grid-cols-2 gap-2">
                  {Object.values(activityDemos).map(demo => (
                    <button
                      key={demo.id}
                      onClick={() => navigate(`/athlete/upload?activity=${demo.id}`)}
                      className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-center transition-colors touch-manipulation"
                    >
                      <div className="text-white font-medium text-xs">{demo.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default VideoUpload;