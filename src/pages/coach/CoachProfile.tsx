import React, { useState, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { indianStates } from '../../data/indianStates';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import { User, Edit, Save, Camera, Trophy, Users, Calendar, Star } from 'lucide-react';

const CoachProfile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    expertise: user?.expertise || '',
    state: user?.state || '',
    district: user?.district || '',
    mobile: user?.mobile || ''
  });

  if (!user) return null;

  const selectedState = indianStates.find(state => state.name === editForm.state);
  const districts = selectedState ? selectedState.districts : [];

  const handleSaveProfile = () => {
    updateUser(editForm);
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

  const coachStats = {
    totalAthletes: 40,
    badgesAwarded: 156,
    avgImprovement: 22,
    rating: 4.8,
    experience: '3 years',
    specializations: ['Strength Training', 'Speed Development', 'Injury Prevention']
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold text-white">Coach Profile</h1>
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
            <div className="relative inline-block mb-4">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-24 h-24 rounded-full border-4 border-green-500"
              />
              {isEditing && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-green-600 hover:bg-green-700 rounded-full p-2 transition-colors"
                >
                  <Camera className="w-4 h-4 text-white" />
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
              <div className="space-y-3 mb-4">
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-center"
                  placeholder="Full Name"
                />
                <input
                  type="tel"
                  value={editForm.mobile}
                  onChange={(e) => setEditForm(prev => ({ ...prev, mobile: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-center"
                  placeholder="Mobile Number"
                />
                <select
                  value={editForm.state}
                  onChange={(e) => setEditForm(prev => ({ ...prev, state: e.target.value, district: '' }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                >
                  <option value="">Select State</option>
                  {indianStates.map(state => (
                    <option key={state.name} value={state.name}>{state.name}</option>
                  ))}
                </select>
                <select
                  value={editForm.district}
                  onChange={(e) => setEditForm(prev => ({ ...prev, district: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  disabled={!editForm.state}
                >
                  <option value="">Select District</option>
                  {districts.map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={editForm.expertise}
                  onChange={(e) => setEditForm(prev => ({ ...prev, expertise: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-center"
                  placeholder="Sport Expertise"
                />
                <textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-center resize-none"
                  placeholder="Bio"
                  rows={3}
                />
              </div>
            ) : (
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-white mb-1">{user.name}</h2>
                <p className="text-gray-400 mb-2">{user.email}</p>
                {user.mobile && <p className="text-gray-400 text-sm">📱 {user.mobile}</p>}
                {user.state && user.district && (
                  <p className="text-green-400 text-sm mt-1">📍 {user.district}, {user.state}</p>
                )}
                {user.expertise && <p className="text-blue-400 text-sm mt-1">🏆 {user.expertise}</p>}
                {user.bio && (
                  <p className="text-gray-300 text-sm italic mt-2 bg-gray-700 p-2 rounded">
                    "{user.bio}"
                  </p>
                )}
              </div>
            )}

            <div className="bg-green-600/20 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Trophy className="w-5 h-5 text-green-400" />
                <span className="text-green-400 font-medium">Coach Level</span>
              </div>
              <div className="text-2xl font-bold text-white text-center">Expert</div>
              <div className="flex items-center justify-center space-x-1 mt-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star key={star} className={`w-4 h-4 ${star <= coachStats.rating ? 'text-yellow-400' : 'text-gray-600'}`} />
                ))}
                <span className="text-yellow-400 ml-1">{coachStats.rating}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-blue-600/20 rounded-lg p-3">
                <Users className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                <div className="text-blue-400 font-bold">{coachStats.totalAthletes}</div>
                <div className="text-xs text-gray-400">Athletes</div>
              </div>
              <div className="bg-yellow-600/20 rounded-lg p-3">
                <Award className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                <div className="text-yellow-400 font-bold">{coachStats.badgesAwarded}</div>
                <div className="text-xs text-gray-400">Badges Given</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Coach Stats */}
        <div className="lg:col-span-2 space-y-6">
          {/* Performance Overview */}
          <Card>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <Trophy className="w-6 h-6 text-green-500 mr-2" />
              Coaching Performance
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{coachStats.avgImprovement}%</div>
                <div className="text-sm text-gray-400">Avg Athlete Improvement</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{coachStats.experience}</div>
                <div className="text-sm text-gray-400">Coaching Experience</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{coachStats.rating}/5</div>
                <div className="text-sm text-gray-400">Coach Rating</div>
              </div>
            </div>
          </Card>

          {/* Specializations */}
          <Card>
            <h3 className="text-xl font-bold text-white mb-4">Specializations</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {coachStats.specializations.map((spec, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-purple-600/20 text-purple-400 rounded-full text-sm"
                >
                  {spec}
                </span>
              ))}
            </div>
            {isEditing && (
              <Button variant="secondary" size="sm">
                Add Specialization
              </Button>
            )}
          </Card>

          {/* Recent Activity */}
          <Card>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <Calendar className="w-6 h-6 text-blue-500 mr-2" />
              Recent Coaching Activity
            </h3>
            <div className="space-y-3">
              {[
                { action: 'Awarded "Push-up Pro" to Arjun', time: '2 hours ago', icon: '🏆' },
                { action: 'Created new training plan', time: '1 day ago', icon: '📋' },
                { action: 'Reviewed Priya\'s jump video', time: '2 days ago', icon: '📹' },
                { action: 'Sent feedback to Sanjay', time: '3 days ago', icon: '💬' },
              ].map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
                  <span className="text-2xl">{activity.icon}</span>
                  <div className="flex-1">
                    <div className="text-white font-medium">{activity.action}</div>
                    <div className="text-sm text-gray-400">{activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Achievements */}
          <Card>
            <h3 className="text-xl font-bold text-white mb-4">Coach Achievements</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { title: 'Top Mentor', description: 'Helped 10+ athletes improve by 20%', icon: '🌟' },
                { title: 'Badge Master', description: 'Awarded 100+ badges to athletes', icon: '🎖️' },
                { title: 'Consistency Coach', description: 'Active coaching for 6+ months', icon: '📅' },
                { title: 'Excellence Award', description: 'Maintained 4.5+ rating', icon: '⭐' }
              ].map((achievement, index) => (
                <div key={index} className="bg-gray-700 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">{achievement.icon}</div>
                  <div className="text-white font-medium text-sm">{achievement.title}</div>
                  <div className="text-xs text-gray-400 mt-1">{achievement.description}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CoachProfile;