import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { indianStates } from '../../data/indianStates';
import Button from '../UI/Button';
import { Trophy, Gift, X } from 'lucide-react';

interface OnboardingSurveyProps {
  onComplete: () => void;
  onSkip?: () => void;
  mandatory?: boolean;
}

const OnboardingSurvey: React.FC<OnboardingSurveyProps> = ({ onComplete, onSkip, mandatory = false }) => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    gender: '',
    mobile: '',
    state: '',
    district: '',
    achievements: ''
  });

  const selectedState = indianStates.find(state => state.name === formData.state);
  const districts = selectedState ? selectedState.districts : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (user) {
      updateUser({
        ...formData,
        onboardingComplete: true,
        profileComplete: true,
        coins: (user.coins || 0) + 100, // Welcome bonus
        xp: (user.xp || 0) + 50
      });
    }
    
    onComplete();
  };

  const handleSkip = () => {
    if (user && !mandatory) {
      updateUser({
        onboardingComplete: true,
        profileComplete: false
      });
    }
    onSkip?.();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-gray-800 rounded-lg sm:rounded-xl border border-gray-700 p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-1 sm:space-x-2">
            <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500" />
            <h2 className="text-lg sm:text-xl font-bold text-white">Complete Your Profile</h2>
          </div>
          {!mandatory && (
            <button onClick={handleSkip} className="text-gray-400 hover:text-white touch-manipulation">
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}
        </div>

        {mandatory && (
          <div className="bg-yellow-600/20 border border-yellow-500 rounded-lg p-2 sm:p-3 mb-3 sm:mb-4">
            <p className="text-yellow-300 text-xs sm:text-sm">
              Please complete your profile to access all features.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none text-sm sm:text-base"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
              Gender *
            </label>
            <select
              value={formData.gender}
              onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none text-sm sm:text-base"
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
              Mobile Number *
            </label>
            <input
              type="tel"
              value={formData.mobile}
              onChange={(e) => setFormData(prev => ({ ...prev, mobile: e.target.value }))}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none text-sm sm:text-base"
              placeholder="Enter your mobile number"
              pattern="[0-9]{10}"
              required
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
              State *
            </label>
            <select
              value={formData.state}
              onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value, district: '' }))}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none text-sm sm:text-base"
              required
            >
              <option value="">Select State</option>
              {indianStates.map(state => (
                <option key={state.name} value={state.name}>{state.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
              District *
            </label>
            <select
              value={formData.district}
              onChange={(e) => setFormData(prev => ({ ...prev, district: e.target.value }))}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none text-sm sm:text-base"
              required
              disabled={!formData.state}
            >
              <option value="">Select District</option>
              {districts.map(district => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
              What have you achieved so far? (Optional)
            </label>
            <textarea
              value={formData.achievements}
              onChange={(e) => setFormData(prev => ({ ...prev, achievements: e.target.value }))}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none resize-none text-sm sm:text-base"
              placeholder="Share your athletic achievements, goals, or experience..."
              rows={2}
            />
          </div>

          <div className="bg-green-600/20 border border-green-500 rounded-lg p-2 sm:p-3">
            <div className="flex items-center space-x-2 mb-2">
              <Gift className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
              <span className="text-green-400 font-medium text-sm sm:text-base">Welcome Bonus</span>
            </div>
            <p className="text-green-300 text-xs sm:text-sm">
              Complete your profile to receive 100 coins and 50 XP!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
            <Button type="submit" className="flex-1">
              Complete Profile
            </Button>
            {!mandatory && (
              <Button type="button" variant="secondary" onClick={handleSkip} className="flex-1 sm:flex-none">
                <span className="hidden sm:inline">Skip for Now</span>
                <span className="sm:hidden">Skip</span>
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default OnboardingSurvey;