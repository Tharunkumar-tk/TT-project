import React, { useState, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useGame } from '../../contexts/GameContext';
import OnboardingSurvey from '../../components/Onboarding/OnboardingSurvey';
import Card from '../../components/UI/Card';
import ProgressBar from '../../components/UI/ProgressBar';
import Button from '../../components/UI/Button';
import { Trophy, Zap, Calendar, Star, Target, Edit, Save, Upload, Camera, Eye, EyeOff } from 'lucide-react';

const AthleteProfile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { badges } = useGame();
  const [isEditing, setIsEditing] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showAllProgress, setShowAllProgress] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const heightProofRef = useRef<HTMLInputElement>(null);
  
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    height: user?.height || '',
    weight: user?.weight || ''
  });

  if (!user) return null;

  // Check if profile is incomplete and show survey
  if (!user.profileComplete) {
    return (
      <OnboardingSurvey 
        onComplete={() => setShowOnboarding(false)}
        mandatory={true}
      />
    );
  }

  const level = user.level || 1;
  const xpForNextLevel = level * 300;
  const currentXP = (user.xp || 0) % 300;

  const unlockedBadges = badges.filter(badge => badge.unlocked);
  const progressBadges = badges.filter(badge => !badge.unlocked && badge.progress > 0);
  const displayedProgressBadges = showAllProgress ? progressBadges : progressBadges.slice(0, 5);

  const handleSaveProfile = () => {
    updateUser({ 
      name: editForm.name,
      height: editForm.height,
      weight: editForm.weight
    });
    setIsEditing(false);
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        updateUser({ avatar: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleHeightProofUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        updateUser({ heightProof: result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Profile</h1>
        <Button 
          variant={isEditing ? "success" : "secondary"}
          icon={isEditing ? Save : Edit}
          onClick={isEditing ? handleSaveProfile : () => setIsEditing(true)}
          size="sm"
          className="w-full sm:w-auto"
        >
          {isEditing ? 'Save Changes' : 'Edit Profile'}
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <div className="text-center">
            <div className="relative inline-block mb-4">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-purple-500"
              />
              {isEditing && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-purple-600 hover:bg-purple-700 rounded-full p-1.5 sm:p-2 transition-colors touch-manipulation"
                >
                  <Camera className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </div>

            {isEditing ? (
              <div className="space-y-2 sm:space-y-3 mb-4">
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-center text-sm sm:text-base"
                  placeholder="Full Name"
                />
              </div>
            ) : (
              <div className="mb-4">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">{user.name}</h2>
                <p className="text-gray-400 mb-2 text-sm sm:text-base truncate">{user.email}</p>
                {user.gender && <p className="text-gray-400 text-sm">Gender: {user.gender}</p>}
                {user.mobile && <p className="text-gray-400 text-sm">Mobile: {user.mobile}</p>}
                {user.state && user.district && (
                  <p className="text-purple-400 text-sm mt-1 truncate">📍 {user.district}, {user.state}</p>
                )}
                {user.achievements && (
                  <p className="text-gray-300 text-xs sm:text-sm italic mt-2 bg-gray-700 p-2 rounded line-clamp-3">
                    "{user.achievements}"
                  </p>
                )}
              </div>
            )}
            
            <div className="bg-purple-600/20 rounded-lg p-3 sm:p-4 mb-4">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                <span className="text-purple-400 font-medium">Level {level}</span>
              </div>
              <ProgressBar 
                progress={currentXP} 
                max={xpForNextLevel} 
                color="purple"
                className="mb-2"
              />
              <p className="text-xs sm:text-sm text-gray-400">
                {xpForNextLevel - currentXP} XP to next level
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center mb-4 sm:mb-6">
              <div className="bg-yellow-600/20 rounded-lg p-2 sm:p-3">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 mx-auto mb-1" />
                <div className="text-yellow-400 font-bold">{user.xp}</div>
                <div className="text-xs text-gray-400">XP</div>
              </div>
              <div className="bg-green-600/20 rounded-lg p-2 sm:p-3">
                <span className="text-2xl mb-1 block">🪙</span>
                <div className="text-green-400 font-bold">{user.coins}</div>
                <div className="text-xs text-gray-400">Coins</div>
              </div>
              <div className="bg-orange-600/20 rounded-lg p-2 sm:p-3">
                <span className="text-2xl mb-1 block">🔥</span>
                <div className="text-orange-400 font-bold">{user.streak}</div>
                <div className="text-xs text-gray-400">Streak</div>
              </div>
            </div>

            {/* Physical Stats */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-bold text-white">Physical Stats</h3>
              
              {/* Height */}
              <div className="bg-gray-700 rounded-lg p-2 sm:p-3">
                <label className="block text-sm text-gray-400 mb-2">Height (cm)</label>
                {isEditing ? (
                  <div className="space-y-1 sm:space-y-2">
                    <input
                      type="number"
                      value={editForm.height}
                      onChange={(e) => setEditForm(prev => ({ ...prev, height: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm sm:text-base"
                      placeholder="175"
                    />
                    <div className="flex gap-1 sm:gap-2">
                      <button
                        onClick={() => heightProofRef.current?.click()}
                        className="flex-1 bg-purple-600 hover:bg-purple-700 px-2 sm:px-3 py-1.5 sm:py-2 rounded text-white text-xs sm:text-sm flex items-center justify-center touch-manipulation"
                      >
                        <Upload className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        <span className="hidden sm:inline">Upload Proof</span>
                        <span className="sm:hidden">Proof</span>
                      </button>
                    </div>
                    <input
                      ref={heightProofRef}
                      type="file"
                      accept="image/*"
                      onChange={handleHeightProofUpload}
                      className="hidden"
                    />
                    {user.heightProof && (
                      <p className="text-green-400 text-xs">✓ Proof image uploaded</p>
                    )}
                    <p className="text-gray-500 text-xs line-clamp-2">
                      Upload full-body photo for verification
                    </p>
                  </div>
                ) : (
                  <div className="text-white font-medium text-sm sm:text-base">
                    {user.height ? `${user.height} cm` : 'Not set'}
                    {user.heightProof && <span className="text-green-400 ml-2">✓</span>}
                  </div>
                )}
              </div>

              {/* Weight */}
              <div className="bg-gray-700 rounded-lg p-2 sm:p-3">
                <label className="block text-sm text-gray-400 mb-2">Weight (kg)</label>
                {isEditing ? (
                  <input
                    type="number"
                    value={editForm.weight}
                    onChange={(e) => setEditForm(prev => ({ ...prev, weight: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm sm:text-base"
                    placeholder="70"
                  />
                ) : (
                  <div className="text-white font-medium text-sm sm:text-base">
                    {user.weight ? `${user.weight} kg` : 'Not set'}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Stats and Achievements */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Achievement Summary */}
          <Card>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 flex items-center">
              <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500 mr-2" />
              Achievement Summary
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-purple-400">{unlockedBadges.length}</div>
                <div className="text-sm text-gray-400">Badges Earned</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-green-400">7</div>
                <div className="text-sm text-gray-400">Challenges</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-yellow-400">#{Math.floor(Math.random() * 50) + 1}</div>
                <div className="text-sm text-gray-400">Rank</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-orange-400">{user.streak}</div>
                <div className="text-sm text-gray-400">Streak</div>
              </div>
            </div>
          </Card>

          {/* Badge Collection */}
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg sm:text-xl font-bold text-white flex items-center">
                <Star className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500 mr-2" />
                Badge Collection
              </h3>
              <Button variant="secondary" size="sm">
                <span className="hidden sm:inline">View Roadmap</span>
                <span className="sm:hidden">Roadmap</span>
              </Button>
            </div>
            
            {unlockedBadges.length > 0 ? (
              <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
                {unlockedBadges.slice(0, 6).map((badge) => (
                  <div key={badge.id} className="bg-gray-700 rounded-lg p-2 sm:p-4 text-center">
                    <div className="text-xl sm:text-2xl mb-1 sm:mb-2">{badge.icon}</div>
                    <div className="text-white font-medium text-xs sm:text-sm line-clamp-2">{badge.name}</div>
                    <div className="text-xs text-gray-400 mt-1 line-clamp-2 hidden sm:block">{badge.description}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-400 py-6 sm:py-8">
                <Target className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm sm:text-base">Complete challenges to earn your first badges!</p>
              </div>
            )}

            {progressBadges.length > 0 && (
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-white font-medium text-sm sm:text-base">In Progress</h4>
                  {progressBadges.length > 5 && (
                    <button
                      onClick={() => setShowAllProgress(!showAllProgress)}
                      className="text-purple-400 hover:text-purple-300 text-xs sm:text-sm flex items-center touch-manipulation"
                    >
                      {showAllProgress ? (
                        <>
                          <EyeOff className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                          <span className="hidden sm:inline">Show Less</span>
                          <span className="sm:hidden">Less</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                          <span className="hidden sm:inline">View More ({progressBadges.length - 5})</span>
                          <span className="sm:hidden">+{progressBadges.length - 5}</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
                <div className="space-y-2 sm:space-y-3">
                  {displayedProgressBadges.map((badge) => (
                    <div key={badge.id} className="flex items-center space-x-2 sm:space-x-3 bg-gray-700 rounded-lg p-2 sm:p-3">
                      <div className="text-lg sm:text-xl opacity-50">{badge.icon}</div>
                      <div className="flex-1">
                        <div className="text-white font-medium text-sm sm:text-base truncate">{badge.name}</div>
                        <ProgressBar 
                          progress={badge.progress} 
                          max={badge.maxProgress} 
                          className="mt-1" 
                          showText={false}
                        />
                      </div>
                      <div className="text-xs sm:text-sm text-gray-400">
                        {badge.progress}/{badge.maxProgress}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* Recent Activity */}
          <Card>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 flex items-center">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 mr-2" />
              Recent Activity
            </h3>
            <div className="space-y-2 sm:space-y-3">
              {[
                { action: 'Completed Jump Test', reward: '+50 XP', time: '2 hours ago', icon: '🦘' },
                { action: 'Profile Setup Bonus', reward: '+100 🪙', time: '1 day ago', icon: '🎁' },
                { action: 'Daily Challenge Complete', reward: '+25 XP', time: '2 days ago', icon: '✅' },
                { action: 'Uploaded Push-up Video', reward: '+30 XP', time: '3 days ago', icon: '💪' },
              ].map((activity, index) => (
                <div key={index} className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 bg-gray-700 rounded-lg">
                  <span className="text-lg sm:text-2xl">{activity.icon}</span>
                  <div className="flex-1">
                    <div className="text-white font-medium text-sm sm:text-base line-clamp-1">{activity.action}</div>
                    <div className="text-xs sm:text-sm text-gray-400">{activity.time}</div>
                  </div>
                  <div className="text-green-400 font-medium text-xs sm:text-sm">{activity.reward}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {showOnboarding && (
        <OnboardingSurvey 
          onComplete={() => setShowOnboarding(false)}
          mandatory={true}
        />
      )}
    </div>
  );
};

export default AthleteProfile;