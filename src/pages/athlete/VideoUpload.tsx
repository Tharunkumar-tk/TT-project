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
      demoGif: 'https://images.pexels.com/photos/4662438/pexels-photo-4662438.jpeg?auto=compress&cs=tinysrgb&w=400',
      instructions: [
        'Stand straight with feet shoulder-width apart',
        'Keep your arms relaxed at your sides',
        'Bend knees slightly before lift-off',
        'Jump as high as possible with arms up',
        'Land softly on both feet'
      ]
    },
    { 
      id: 'shuttle' as TestType, 
      name: 'Shuttle Run', 
      icon: '🏃', 
      description: 'Test your agility and speed',
      demoGif: 'https://images.pexels.com/photos/2803158/pexels-photo-2803158.jpeg?auto=compress&cs=tinysrgb&w=400',
      instructions: [
        'Set up two markers 10 meters apart',
        'Start at one marker in ready position',
        'Sprint to opposite marker and touch line',
        'Turn quickly and sprint back',
        'Complete 4 rounds as fast as possible'
      ]
    },
    { 
      id: 'pushup' as TestType, 
      name: 'Push-ups', 
      icon: '💪', 
      description: 'Count your push-up reps',
      demoGif: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=400',
      instructions: [
        'Start in plank position with hands shoulder-width apart',
        'Keep body straight from head to heels',
        'Lower chest until it nearly touches ground',
        'Push back up to full arm extension',
        'Maintain steady breathing throughout'
      ]
    },
    { 
      id: 'situp' as TestType, 
      name: 'Sit-ups', 
      icon: '🤸', 
      description: 'Count your sit-up reps',
      demoGif: 'https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg?auto=compress&cs=tinysrgb&w=400',
      instructions: [
        'Lie on back with knees bent at 90 degrees',
        'Place hands lightly behind head (don\'t pull neck)',
        'Lift shoulder blades completely off ground',
        'Touch elbows to knees at the top',
        'Lower back down with control'
      ]
    },
    { 
      id: 'endurance' as TestType, 
      name: 'Endurance Run', 
      icon: '🏃‍♀️', 
      description: 'Track your running performance',
      demoGif: 'https://images.pexels.com/photos/2294361/pexels-photo-2294361.jpeg?auto=compress&cs=tinysrgb&w=400',
      instructions: [
        'Start with a gentle warm-up jog',
        'Maintain upright posture with relaxed shoulders',
        'Keep consistent breathing rhythm',
        'Land on midfoot, not heel',
        'Finish with a cool-down walk'
      ]
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
            <h2 className="text-lg font-bold text-white mb-4">How to Perform {selectedTestData.name}</h2>
            
            {/* Demo Image */}
            <div className="mb-4">
              <img 
                src={selectedTestData.demoGif}
                alt={`${selectedTest} demo`}
                className="w-full h-auto rounded-lg"
              />
            </div>

            {/* 5-Point Instructions */}
            <div className="bg-blue-600/20 rounded-lg p-4">
              <h4 className="text-blue-400 font-medium mb-3">Step-by-Step Instructions</h4>
              <ol className="space-y-2">
                {selectedTestData.instructions.map((instruction, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <span className="text-gray-300 text-sm">{instruction}</span>
                  </li>
                ))}
              </ol>
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
            <div className="space-y-2">
              <span className="text-purple-400 font-medium text-sm">Key Points:</span>
              <ul className="space-y-1">
                {selectedTestData.instructions.slice(0, 3).map((instruction, index) => (
                  <li key={index} className="text-gray-300 text-sm flex items-start space-x-2">
                    <span className="text-purple-400">•</span>
                    <span>{instruction}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      )}

      {/* Demo & Instructions - Moved to separate section */}
      {selectedTestData && !showDemo && (
        <div className="lg:hidden">
          <Card>
            <h3 className="text-lg font-bold text-white mb-3">How to Perform {selectedTestData.name}</h3>
            <div className="mb-4">
              <img 
                src={selectedTestData.demoGif}
                alt={`${selectedTest} demo`}
                className="w-full h-auto rounded-lg"
              />
            </div>
            <div className="bg-blue-600/20 rounded-lg p-4">
              <h4 className="text-blue-400 font-medium mb-3">Instructions</h4>
              <ol className="space-y-2">
                {selectedTestData.instructions.map((instruction, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <span className="text-gray-300 text-sm">{instruction}</span>
                  </li>
                ))}
              </ol>
            </div>
          </Card>
        </div>
      )}

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
                    className="w-full h-auto rounded-lg"
                  />
                </div>
                <div>
                  <h4 className="text-white font-medium mb-4">Step-by-Step Instructions</h4>
                  <ol className="space-y-3">
                    {selectedTestData.instructions.map((instruction, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                          {index + 1}
                        </span>
                        <span className="text-gray-300">{instruction}</span>
                      </li>
                    ))}
                  </ol>
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