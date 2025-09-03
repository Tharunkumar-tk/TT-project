import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Upload, Video, CheckCircle, AlertCircle, ArrowLeft, Target, Play } from 'lucide-react';
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
  const currentDemo = activityDemos[activityType];

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
        <div className="flex items-center space-x-4">
          <Button variant="secondary" icon={ArrowLeft} onClick={goBack}>
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">
              {currentDemo ? `${currentDemo.name} Upload` : 'Video Upload'}
            </h1>
            <p className="text-gray-400 mt-1">
              {currentDemo ? `Upload your ${currentDemo.name.toLowerCase()} video for AI analysis` : 'Upload your training videos for analysis and feedback'}
            </p>
          </div>
        </div>
        {challengeId && (
          <div className="flex items-center space-x-2 bg-purple-600/20 px-4 py-2 rounded-lg">
            <Target className="w-5 h-5 text-purple-400" />
            <span className="text-purple-400 font-medium">Challenge Mode</span>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upload Section */}
        <div className="lg:col-span-2">
          <Card>
            {uploadStatus === 'idle' && (
              <div>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Upload className="w-6 h-6 text-blue-500 mr-2" />
                  Upload Your Video
                </h2>
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 hover:border-purple-500 transition-colors text-center">
                  <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {currentDemo ? `Upload ${currentDemo.name} Video` : 'Upload Training Video'}
                  </h3>
                  <p className="text-gray-400 mb-6">
                    {currentDemo ? `Record yourself performing ${currentDemo.name.toLowerCase()} and upload for AI analysis` : 'Select a video file to upload for analysis'}
                  </p>
                  
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="video-upload"
                  />
                  <label
                    htmlFor="video-upload"
                    className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer transition-colors"
                  >
                    <Upload className="w-5 h-5 mr-2" />
                    Choose Video File
                  </label>
                  
                  <div className="mt-4 text-sm text-gray-500">
                    Supported formats: MP4, MOV, AVI • Max size: 100MB
                  </div>
                </div>

                {selectedFile && (
                  <div className="mt-6 p-4 bg-gray-700 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Video className="w-5 h-5 text-purple-400 mr-2" />
                        <span className="text-sm font-medium text-white">{selectedFile.name}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-gray-400">
                          {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                        </span>
                        <Button onClick={handleUpload}>
                          Analyze Video
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {uploadStatus === 'uploading' && (
              <div className="text-center py-12">
                <div className="animate-spin w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                <h3 className="text-lg font-semibold text-white mb-2">Uploading Video...</h3>
                <p className="text-gray-400">Please wait while we upload your video</p>
                <div className="w-full bg-gray-700 rounded-full h-2 mt-4">
                  <div className="bg-purple-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                </div>
              </div>
            )}

            {uploadStatus === 'analyzing' && (
              <div className="text-center py-12">
                <div className="relative">
                  <div className="animate-pulse w-16 h-16 bg-gradient-to-r from-purple-600 to-green-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Video className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute inset-0 animate-ping w-16 h-16 bg-purple-600/30 rounded-full mx-auto"></div>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">AI Analysis in Progress...</h3>
                <p className="text-gray-400">Our AI is analyzing your {currentDemo?.name.toLowerCase() || 'performance'}</p>
                <div className="flex justify-center space-x-1 mt-4">
                  <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            )}

            {uploadStatus === 'success' && analysisResults && (
              <div className="space-y-6">
                <div className="text-center">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Analysis Complete!</h3>
                  <p className="text-gray-400">Your {currentDemo?.name.toLowerCase() || 'video'} has been analyzed</p>
                </div>

                {/* Analysis Results */}
                <div className="bg-gray-700 rounded-lg p-6">
                  <h4 className="text-white font-bold mb-4">Performance Results</h4>
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">{analysisResults.measurement}</div>
                      <div className="text-sm text-gray-400">
                        {activityType === 'jump' ? 'Jump Height' :
                         activityType === 'shuttle' ? 'Best Time' :
                         activityType === 'pushup' || activityType === 'situp' ? 'Reps Counted' :
                         activityType === 'endurance' ? 'Distance' : 'Result'}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${
                        analysisResults.rating === 'Excellent' ? 'text-green-400' :
                        analysisResults.rating === 'Good' ? 'text-yellow-400' : 'text-orange-400'
                      }`}>
                        {analysisResults.rating}
                      </div>
                      <div className="text-sm text-gray-400">Form Rating</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">
                        {Math.floor((analysisResults.count / analysisResults.target) * 100)}%
                      </div>
                      <div className="text-sm text-gray-400">Challenge Progress</div>
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-4 mb-4">
                    <h5 className="text-white font-medium mb-2">AI Feedback</h5>
                    <p className="text-gray-300 text-sm">{analysisResults.feedback}</p>
                  </div>

                  <div className="flex justify-center space-x-6 text-sm">
                    <div className="flex items-center space-x-1">
                      <span className="text-yellow-400">+{analysisResults.xpEarned} XP</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="text-green-400">+{analysisResults.coinsEarned} 🪙</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button onClick={resetUpload} variant="secondary" className="flex-1">
                    Upload Another
                  </Button>
                  <Button onClick={() => navigate('/athlete/challenges')} className="flex-1">
                    Back to Challenges
                  </Button>
                </div>
              </div>
            )}

            {uploadStatus === 'error' && (
              <div className="text-center py-12">
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Upload Failed</h3>
                <p className="text-gray-400 mb-6">There was an error processing your video. Please try again.</p>
                <Button onClick={resetUpload} variant="secondary">
                  Try Again
                </Button>
              </div>
            )}
          </Card>
        </div>

        {/* Demo Section */}
        {currentDemo && (
          <div className="space-y-6">
            {/* Activity Demo */}
            <Card>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                <Play className="w-5 h-5 text-green-500 mr-2" />
                {currentDemo.name} Demo
              </h3>
              
              {/* GIF Display - Full View */}
              <div className="mb-4 bg-gray-900 rounded-lg overflow-hidden">
                <img 
                  src={currentDemo.gif} 
                  alt={`${currentDemo.name} demonstration`}
                  className="w-full h-auto object-contain"
                  style={{ maxHeight: 'none' }}
                />
              </div>

              {/* Instructions */}
              <div>
                <h4 className="text-white font-medium mb-3">Proper Technique:</h4>
                <ol className="space-y-2">
                  {currentDemo.instructions.map((instruction, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <span className="text-gray-300 text-sm">{instruction}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </Card>

            {/* Tips */}
            <Card>
              <h4 className="text-white font-medium mb-3">📱 Recording Tips</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start space-x-2">
                  <span className="text-green-400">•</span>
                  <span>Record in good lighting</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-400">•</span>
                  <span>Show your full body in frame</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-400">•</span>
                  <span>Keep camera steady</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-400">•</span>
                  <span>Record from the side view</span>
                </li>
              </ul>
            </Card>
          </div>
        )}

        {/* General Upload Info */}
        {!currentDemo && (
          <div className="space-y-6">
            <Card>
              <h3 className="text-lg font-bold text-white mb-4">Upload Guidelines</h3>
              <div className="space-y-3 text-sm text-gray-300">
                <div className="flex items-start space-x-2">
                  <span className="text-green-400">✓</span>
                  <span>Record in landscape mode for better analysis</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-400">✓</span>
                  <span>Ensure good lighting and clear visibility</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-400">✓</span>
                  <span>Show your full body in the frame</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-400">✓</span>
                  <span>Keep the camera steady during recording</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-400">✓</span>
                  <span>Record from a side angle for best results</span>
                </div>
              </div>
            </Card>

            <Card>
              <h4 className="text-white font-medium mb-3">Available Activities</h4>
              <div className="grid grid-cols-2 gap-2">
                {Object.values(activityDemos).map(demo => (
                  <button
                    key={demo.id}
                    onClick={() => navigate(`/athlete/upload?activity=${demo.id}`)}
                    className="p-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-left transition-colors"
                  >
                    <div className="text-white font-medium text-sm">{demo.name}</div>
                  </button>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoUpload;