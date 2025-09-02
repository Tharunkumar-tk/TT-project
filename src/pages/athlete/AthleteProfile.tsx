import React from 'react';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useGame } from '../../contexts/GameContext';
import Card from '../../components/UI/Card';
import ProgressBar from '../../components/UI/ProgressBar';
import Button from '../../components/UI/Button';
import { Trophy, Zap, Calendar, Star, Target, Edit, Save, X, Upload } from 'lucide-react';

const AthleteProfile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { badges } = useGame();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    age: '',
    bio: '',
    height: '',
    weight: '',
    sport: ''
  });
  const [proofImages, setProofImages] = useState<{
    height?: File;
    weight?: File;
  }>({});

  if (!user) return null;

  const level = user.level || 1;
  const xpForNextLevel = level * 300;
  const currentXP = (user.xp || 0) % 300;

  const unlockedBadges = badges.filter(badge => badge.unlocked);
  const progressBadges = badges.filter(badge => !badge.unlocked && badge.progress > 0);

  const handleSaveProfile = () => {
    updateUser({ name: editForm.name });
    setIsEditing(false);
  };

  const handleProofUpload = (type: 'height' | 'weight', file: File) => {
    setProofImages(prev => ({ ...prev, [type]: file }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Profile</h1>
        <Button 
          variant={isEditing ? "success" : "secondary"}
          icon={isEditing ? Save : Edit}
          onClick={isEditing ? handleSaveProfile : () => setIsEditing(true)}
        >
          {isEditing ? 'Save Changes' : 'Edit Profile'}
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <div className="text-center">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-purple-500"
            />
            {isEditing ? (
              <div className="space-y-3 mb-4">
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-center"
                  placeholder="Full Name"
                />
                <input
                  type="number"
                  value={editForm.age}
                  onChange={(e) => setEditForm(prev => ({ ...prev, age: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-center"
                  placeholder="Age"
                />
                <textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-center resize-none"
                  placeholder="Bio"
                  rows={2}
                />
                <input
                  type="text"
                  value={editForm.sport}
                  onChange={(e) => setEditForm(prev => ({ ...prev, sport: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-center"
                  placeholder="Favorite Sport"
                />
              </div>
            ) : (
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-white mb-1">{user.name}</h2>
                <p className="text-gray-400 mb-2">{user.email}</p>
                {editForm.age && <p className="text-gray-400 text-sm">Age: {editForm.age}</p>}
                {editForm.bio && <p className="text-gray-300 text-sm italic mt-2">"{editForm.bio}"</p>}
                {editForm.sport && <p className="text-purple-400 text-sm mt-1">🏆 {editForm.sport}</p>}
              </div>
            )}
            
            <div className="bg-purple-600/20 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Trophy className="w-5 h-5 text-purple-400" />
                <span className="text-purple-400 font-medium">Level {level}</span>
              </div>
              <ProgressBar 
                progress={currentXP} 
                max={xpForNextLevel} 
                color="purple"
                className="mb-2"
              />
              <p className="text-xs text-gray-400">
                {xpForNextLevel - currentXP} XP to next level
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-yellow-600/20 rounded-lg p-3">
                <Zap className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                <div className="text-yellow-400 font-bold">{user.xp}</div>
                <div className="text-xs text-gray-400">Total XP</div>
              </div>
              <div className="bg-green-600/20 rounded-lg p-3">
                <span className="text-2xl mb-1 block">🪙</span>
                <div className="text-green-400 font-bold">{user.coins}</div>
                <div className="text-xs text-gray-400">Coins</div>
              </div>
              <div className="bg-orange-600/20 rounded-lg p-3">
                <span className="text-2xl mb-1 block">🔥</span>
                <div className="text-orange-400 font-bold">{user.streak}</div>
                <div className="text-xs text-gray-400">Day Streak</div>
              </div>
            </div>
          </div>

          {/* Physical Stats Section */}
          {isEditing && (
            <div className="mt-6 pt-6 border-t border-gray-700">
              <h3 className="text-lg font-bold text-white mb-4">Physical Stats</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Height (cm)</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={editForm.height}
                      onChange={(e) => setEditForm(prev => ({ ...prev, height: e.target.value }))}
                      className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                      placeholder="175"
                    />
                    <label className="bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg cursor-pointer flex items-center">
                      <Upload className="w-4 h-4 text-gray-400" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleProofUpload('height', e.target.files[0])}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {proofImages.height && (
                    <p className="text-green-400 text-xs mt-1">✓ Proof image uploaded</p>
                  )}
                  <p className="text-gray-500 text-xs mt-1">Upload measuring tape photo for verification</p>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Weight (kg)</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={editForm.weight}
                      onChange={(e) => setEditForm(prev => ({ ...prev, weight: e.target.value }))}
                      className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                      placeholder="70"
                    />
                    <label className="bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg cursor-pointer flex items-center">
                      <Upload className="w-4 h-4 text-gray-400" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleProofUpload('weight', e.target.files[0])}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {proofImages.weight && (
                    <p className="text-green-400 text-xs mt-1">✓ Proof image uploaded</p>
                  )}
                  <p className="text-gray-500 text-xs mt-1">Upload scale photo for verification</p>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Stats and Achievements */}
        <div className="lg:col-span-2 space-y-6">
          {/* Achievement Summary */}
          <Card>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <Trophy className="w-6 h-6 text-purple-500 mr-2" />
              Achievement Summary
            </h3>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">{unlockedBadges.length}</div>
                <div className="text-sm text-gray-400">Badges Earned</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">7</div>
                <div className="text-sm text-gray-400">Challenges Done</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">#{Math.floor(Math.random() * 50) + 1}</div>
                <div className="text-sm text-gray-400">National Rank</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-400">12</div>
                <div className="text-sm text-gray-400">Best Streak</div>
              </div>
            </div>
          </Card>

          {/* Badge Collection */}
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white flex items-center">
                <Star className="w-6 h-6 text-yellow-500 mr-2" />
                Badge Collection
              </h3>
              <Button variant="secondary" size="sm">
                View Roadmap
              </Button>
            </div>
            
            {unlockedBadges.length > 0 ? (
              <div className="grid grid-cols-3 gap-4 mb-6">
                {unlockedBadges.slice(0, 6).map((badge) => (
                  <div key={badge.id} className="bg-gray-700 rounded-lg p-4 text-center">
                    <div className="text-2xl mb-2">{badge.icon}</div>
                    <div className="text-white font-medium text-sm">{badge.name}</div>
                    <div className="text-xs text-gray-400 mt-1">{badge.description}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-400 py-8">
                <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Complete challenges to earn your first badges!</p>
              </div>
            )}

            {progressBadges.length > 0 && (
              <div>
                <h4 className="text-white font-medium mb-3">In Progress</h4>
                <div className="space-y-3">
                  {progressBadges.map((badge) => (
                    <div key={badge.id} className="flex items-center space-x-3 bg-gray-700 rounded-lg p-3">
                      <div className="text-xl opacity-50">{badge.icon}</div>
                      <div className="flex-1">
                        <div className="text-white font-medium">{badge.name}</div>
                        <ProgressBar 
                          progress={badge.progress} 
                          max={badge.maxProgress} 
                          className="mt-1" 
                          showText={false}
                        />
                      </div>
                      <div className="text-sm text-gray-400">
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
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <Calendar className="w-6 h-6 text-blue-500 mr-2" />
              Recent Activity
            </h3>
            <div className="space-y-3">
              {[
                { action: 'Completed Jump Test', reward: '+50 XP', time: '2 hours ago', icon: '🦘' },
                { action: 'Unlocked First Leap Badge', reward: '+10 🪙', time: '1 day ago', icon: '🏆' },
                { action: 'Daily Challenge Complete', reward: '+25 XP', time: '2 days ago', icon: '✅' },
                { action: 'Uploaded Push-up Video', reward: '+30 XP', time: '3 days ago', icon: '💪' },
              ].map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
                  <span className="text-2xl">{activity.icon}</span>
                  <div className="flex-1">
                    <div className="text-white font-medium">{activity.action}</div>
                    <div className="text-sm text-gray-400">{activity.time}</div>
                  </div>
                  <div className="text-green-400 font-medium">{activity.reward}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AthleteProfile;