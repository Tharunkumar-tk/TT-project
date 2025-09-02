import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useGame } from '../../contexts/GameContext';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import { Upload, Video, Zap, Trophy, CheckCircle, AlertTriangle, Eye, Camera } from 'lucide-react';

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

interface VideoValidation {
  isValid: boolean;
  warnings: string[];
  errors: string[];
}

const VideoUpload: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { earnXP, earnCoins, updateProgress, updateBadgeProgress } = useGame();
  const [searchParams] = useSearchParams();
  const [selectedTest, setSelectedTest] = useState<TestType>(
    (searchParams.get('activity') as TestType) || 'jump'
  );
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [videoValidation, setVideoValidation] = useState<VideoValidation | null>(null);
  const [showDemo, setShowDemo] = useState(false);

  const challengeId = searchParams.get('challenge');

  useEffect(() => {
    const activity = searchParams.get('activity') as TestType;
    if (activity) {
      setSelectedTest(activity);
    }
  }, [searchParams]);

  const testTypes = [
    { 
      id: 'jump' as TestType, 
      name: 'Vertical Jump', 
      icon: '🦘', 
      description: 'Measure your jump height',
      demoGif: '/challenge-demos/ssvid.net--Vertical-Jump_v720P (online-video-cutter.com).gif',
      instructions: 'Stand with feet shoulder-width apart, jump as high as possible with arms extended upward. Make sure the camera captures your full body and the ground reference.',
      postureGuide: 'Camera should be positioned 3-4 meters away at waist height. Ensure full body is visible from head to toe. Jump straight up with arms reaching overhead.',
      angleGuide: 'Side view (90° angle) works best for measuring jump height. Avoid front or back angles.'
    },
    { 
      id: 'shuttle' as TestType, 
      name: 'Shuttle Run', 
      icon: '🏃', 
      description: 'Test your agility and speed',
      demoGif: '/challenge-demos/ssvid.net--Shuttle-Run_1080p (online-video-cutter.com) (1).gif',
      instructions: 'Set up two markers 10 meters apart. Run between them, touching each line. Complete 4 rounds as fast as possible. Camera should capture the full running path.',
      postureGuide: 'Maintain low center of gravity when changing direction. Touch the line with your hand at each turn.',
      angleGuide: 'Position camera to capture the full 10-meter distance. Side angle preferred to see full running motion.'
    },
    { 
      id: 'pushup' as TestType, 
      name: 'Push-ups', 
      icon: '💪', 
      description: 'Count your push-up reps',
      demoGif: '/challenge-demos/ssvid.net--How-to-do-a-Push-Up-Proper-Form-Technique_1080p (online-video-cutter.com) (1).gif',
      instructions: 'Keep body straight, lower chest to ground, push back up. Count each complete rep. Camera should show your side profile for proper form verification.',
      postureGuide: 'Maintain straight line from head to heels. Lower chest until it nearly touches ground. Push up to full arm extension.',
      angleGuide: 'Side view is essential for form verification. Camera should be at ground level to see proper depth.'
    },
    { 
      id: 'situp' as TestType, 
      name: 'Sit-ups', 
      icon: '🤸', 
      description: 'Count your sit-up reps',
      demoGif: '/challenge-demos/4921658-hd_1066_1920_25fps (online-video-cutter.com).gif',
      instructions: 'Lie on back, knees bent, hands behind head. Lift torso to knees, lower back down. Camera should capture your full body movement.',
      postureGuide: 'Keep knees bent at 90°, hands behind head (not pulling neck). Lift shoulder blades off ground completely.',
      angleGuide: 'Side view captures the full range of motion best. Ensure camera shows complete up and down movement.'
    },
    { 
      id: 'endurance' as TestType, 
      name: 'Endurance Run', 
      icon: '🏃‍♀️', 
      description: 'Track your running performance',
      demoGif: '/challenge-demos/Become obsessed (online-video-cutter.com) (1).gif',
      instructions: 'Run at steady pace for specified distance. Maintain consistent breathing rhythm. Use a fitness tracker or phone app to record distance and time.',
      postureGuide: 'Maintain upright posture, relaxed shoulders, and consistent stride. Land on midfoot, not heel.',
      angleGuide: 'Side view or slight diagonal angle works best. Capture full stride and running form.'
    },
  ];

  const selectedTestData = testTypes.find(t => t.id === selectedTest);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setAnalysisResult(null);
      
      // Perform basic video validation
      validateVideo(file);
    }
  };

  const validateVideo = (file: File) => {
    const warnings: string[] = [];
    const errors: string[] = [];
    
    // File size validation
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      errors.push('Video file is too large. Please keep it under 100MB.');
    }
    
    // File type validation
    const allowedTypes = ['video/mp4', 'video/mov', 'video/avi', 'video/quicktime'];
    if (!allowedTypes.includes(file.type)) {
      errors.push('Unsupported video format. Please use MP4, MOV, or AVI.');
    }
    
    // Duration estimation (rough)
    if (file.size < 5 * 1024 * 1024) { // Less than 5MB
      warnings.push('Video appears to be very short. Ensure you capture the complete exercise.');
    }
    
    // Quality estimation based on file size and type
    if (file.size < 2 * 1024 * 1024) { // Less than 2MB
      warnings.push('Video quality may be too low. Ensure good lighting and stable camera.');
    }
    
    setVideoValidation({
      isValid: errors.length === 0,
      warnings,
      errors
    });
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
    
    if (videoValidation && !videoValidation.isValid) {
      return; // Don't analyze if validation failed
    }

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

    // Update challenge progress if linked
    if (challengeId) {
      updateProgress(challengeId, result.testType === 'pushup' ? 28 : 1);
    }

    // Update badge progress
    updateBadgeProgress('video-verified', 1);
    if (result.testType === 'pushup') {
      updateBadgeProgress('pushup-pro', 28);
      updateBadgeProgress('iron-arms', 28);
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
        {challengeId && (
          <div className="mt-3 p-3 bg-purple-600/20 rounded-lg border border-purple-500">
            <p className="text-purple-300 text-sm">
              📋 Challenge Mode: Upload a video to complete your active challenge
            </p>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
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
          
          {selectedTestData && (
            <div className="mt-4 pt-4 border-t border-gray-700">
              <Button 
                variant="secondary" 
                className="w-full" 
                icon={Eye}
                onClick={() => setShowDemo(true)}
              >
                View Demo & Instructions
              </Button>
            </div>
          )}
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

              {/* Video Validation Results */}
              {videoValidation && (
                <div className="space-y-2">
                  {videoValidation.errors.length > 0 && (
                    <div className="bg-red-600/20 border border-red-500 rounded-lg p-3">
                      <div className="flex items-center space-x-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                        <span className="text-red-400 font-medium">Upload Errors</span>
                      </div>
                      {videoValidation.errors.map((error, index) => (
                        <p key={index} className="text-red-300 text-sm">• {error}</p>
                      ))}
                    </div>
                  )}
                  
                  {videoValidation.warnings.length > 0 && (
                    <div className="bg-yellow-600/20 border border-yellow-500 rounded-lg p-3">
                      <div className="flex items-center space-x-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-400" />
                        <span className="text-yellow-400 font-medium">Quality Warnings</span>
                      </div>
                      {videoValidation.warnings.map((warning, index) => (
                        <p key={index} className="text-yellow-300 text-sm">• {warning}</p>
                      ))}
                    </div>
                  )}
                  
                  {videoValidation.isValid && videoValidation.warnings.length === 0 && (
                    <div className="bg-green-600/20 border border-green-500 rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-green-400 font-medium">Video looks good!</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-3">
                <Button 
                  onClick={handleAnalyze}
                  disabled={analyzing || (videoValidation && !videoValidation.isValid)}
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

        {/* Demo & Instructions Panel */}
        {selectedTestData && (
          <Card>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <Camera className="w-6 h-6 text-blue-500 mr-2" />
              Demo & Instructions
            </h2>
            
            {/* Demo GIF */}
            <div className="bg-gray-700 rounded-lg overflow-hidden mb-4">
              <img 
                src={selectedTestData.demoGif}
                alt={`${selectedTest} demo`}
                className="w-full h-48 object-cover"
              />
              <div className="p-3 bg-gray-800">
                <div className="text-white font-medium text-sm mb-1">
                  Perfect {selectedTestData.name} Form
                </div>
                <div className="text-gray-400 text-xs">
                  Follow this exact posture and movement
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="space-y-4">
              <div className="bg-blue-600/20 rounded-lg p-3">
                <h4 className="text-blue-400 font-medium mb-2">📋 Exercise Instructions</h4>
                <p className="text-gray-300 text-sm">{selectedTestData.instructions}</p>
              </div>

              <div className="bg-green-600/20 rounded-lg p-3">
                <h4 className="text-green-400 font-medium mb-2">🎯 Posture Guide</h4>
                <p className="text-gray-300 text-sm">{selectedTestData.postureGuide}</p>
              </div>

              <div className="bg-purple-600/20 rounded-lg p-3">
                <h4 className="text-purple-400 font-medium mb-2">📹 Camera Angle</h4>
                <p className="text-gray-300 text-sm">{selectedTestData.angleGuide}</p>
              </div>

              <div className="bg-yellow-600/20 rounded-lg p-3">
                <h4 className="text-yellow-400 font-medium mb-2">💡 Quality Tips</h4>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Ensure good lighting (natural light preferred)</li>
                  <li>• Keep camera stable (use tripod or stable surface)</li>
                  <li>• Wear contrasting colors against background</li>
                  <li>• Record in landscape mode for better analysis</li>
                </ul>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Demo Modal */}
      {showDemo && selectedTestData && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
              <h3 className="text-xl font-bold text-white">{selectedTestData.name} Demo</h3>
              <button
                onClick={() => setShowDemo(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <img 
                    src={selectedTestData.demoGif}
                    alt={`${selectedTest} demo`}
                    className="w-full rounded-lg"
                  />
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-white font-medium mb-2">Exercise Instructions</h4>
                    <p className="text-gray-300 text-sm">{selectedTestData.instructions}</p>
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-2">Posture Guide</h4>
                    <p className="text-gray-300 text-sm">{selectedTestData.postureGuide}</p>
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-2">Camera Positioning</h4>
                    <p className="text-gray-300 text-sm">{selectedTestData.angleGuide}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Quality Guidelines */}
      <Card>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center">
          <CheckCircle className="w-6 h-6 text-green-500 mr-2" />
          Video Quality Guidelines
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-green-600/20 rounded-lg p-4">
            <h4 className="text-green-400 font-medium mb-2">✅ Good Quality</h4>
            <ul className="text-gray-300 text-sm space-y-1">
              <li>• Clear, well-lit video</li>
              <li>• Stable camera position</li>
              <li>• Full body visible</li>
              <li>• Proper camera angle</li>
            </ul>
          </div>
          <div className="bg-yellow-600/20 rounded-lg p-4">
            <h4 className="text-yellow-400 font-medium mb-2">⚠️ Needs Improvement</h4>
            <ul className="text-gray-300 text-sm space-y-1">
              <li>• Slightly dark lighting</li>
              <li>• Minor camera shake</li>
              <li>• Partial body visibility</li>
              <li>• Suboptimal angle</li>
            </ul>
          </div>
          <div className="bg-red-600/20 rounded-lg p-4">
            <h4 className="text-red-400 font-medium mb-2">❌ Poor Quality</h4>
            <ul className="text-gray-300 text-sm space-y-1">
              <li>• Too dark to analyze</li>
              <li>• Excessive camera movement</li>
              <li>• Body not fully visible</li>
              <li>• Wrong camera angle</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Current Challenge Info */}
      {challengeId && selectedTestData && (
        <Card>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <Target className="w-6 h-6 text-purple-500 mr-2" />
            Challenge Requirements
          </h2>
          <div className="bg-purple-600/20 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-3">
              <span className="text-2xl">{selectedTestData.icon}</span>
              <div>
                <h3 className="text-white font-medium">{selectedTestData.name} Challenge</h3>
                <p className="text-gray-400 text-sm">Follow the demo exactly for best results</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-purple-400 font-medium">Required Posture:</span>
                <p className="text-gray-300">{selectedTestData.postureGuide}</p>
              </div>
              <div>
                <span className="text-purple-400 font-medium">Camera Setup:</span>
                <p className="text-gray-300">{selectedTestData.angleGuide}</p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Demo & Instructions - Moved to separate section */}
      {selectedTestData && !showDemo && (
        <div className="lg:hidden">
          {selectedTestData && (
            <Card>
              <h3 className="text-lg font-bold text-white mb-3 flex items-center">
                <Camera className="w-5 h-5 text-blue-500 mr-2" />
                Demo & Instructions
              </h3>
              <div className="bg-gray-700 rounded-lg overflow-hidden">
                <img 
                  src={selectedTestData.demoGif}
                  alt={`${selectedTest} demo`}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <div className="text-white font-medium mb-2">
                    How to perform {selectedTestData.name}
                  </div>
                  <p className="text-gray-300 text-sm">
                    {selectedTestData.instructions}
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}

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