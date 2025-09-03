import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Trophy, User, Users, AlertCircle, X } from 'lucide-react';
import Button from '../components/UI/Button';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'athlete' | 'coach'>('athlete');
  const [loading, setLoading] = useState(false);
  
  const { login, signup, authError, clearAuthError } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  React.useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam === 'coach') {
      setRole('coach');
    }
  }, [searchParams]);

  React.useEffect(() => {
    // Clear auth error when switching between login/signup
    clearAuthError();
  }, [isLogin, clearAuthError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    clearAuthError();

    try {
      if (isLogin) {
        await login(email, password, role);
      } else {
        await signup(email, password, name, role);
      }
      
      // Navigate to appropriate dashboard
      if (role === 'athlete') {
        navigate('/athlete/dashboard');
      } else {
        navigate('/coach/dashboard');
      }
    } catch (error) {
      // Error is already set in context, just log it
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950 flex items-center justify-center px-3 sm:px-4 md:px-6 py-4">
      <div className="max-w-md w-full">
        <div className="bg-gray-800 p-4 sm:p-6 md:p-8 rounded-lg sm:rounded-xl border border-gray-700">
          <div className="text-center mb-6 sm:mb-8">
            <Trophy className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-purple-500 mx-auto mb-3 sm:mb-4" />
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
              {isLogin ? 'Welcome Back' : 'Join Talent Track'}
            </h2>
            <p className="text-gray-400 mt-2 text-xs sm:text-sm md:text-base px-2">
              {isLogin ? 'Sign in to your account' : 'Create your account and start your journey'}
            </p>
          </div>

          {/* Error Message */}
          {authError && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-600/20 border border-red-500 rounded-lg">
              <div className="flex items-start space-x-2 sm:space-x-3">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-red-300 text-xs sm:text-sm">{authError.message}</p>
                </div>
                <button
                  onClick={clearAuthError}
                  className="text-red-400 hover:text-red-300 touch-manipulation"
                >
                  <X className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Role Selection */}
          <div className="mb-4 sm:mb-6">
            <div className="flex bg-gray-700 rounded-lg p-1">
              <button
                type="button"
                onClick={() => setRole('athlete')}
                className={`flex-1 flex items-center justify-center py-2 px-2 sm:px-4 rounded-md transition-colors touch-manipulation ${
                  role === 'athlete' 
                    ? 'bg-purple-600 text-white' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <User className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="text-sm sm:text-base">Athlete</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('coach')}
                className={`flex-1 flex items-center justify-center py-2 px-2 sm:px-4 rounded-md transition-colors touch-manipulation ${
                  role === 'coach' 
                    ? 'bg-green-600 text-white' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="text-sm sm:text-base">Coach</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none text-sm sm:text-base"
                  placeholder="Enter your full name"
                  required={!isLogin}
                />
              </div>
            )}

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none text-sm sm:text-base"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none text-sm sm:text-base"
                placeholder="Enter your password"
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full py-2.5 sm:py-3 mt-4 sm:mt-6" 
              disabled={loading}
            >
              {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
            </Button>
          </form>

          <div className="mt-4 sm:mt-6 text-center">
            <p className="text-gray-400 text-sm sm:text-base">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-purple-500 hover:text-purple-400 font-medium touch-manipulation"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>

          {/* Demo Accounts */}
          <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gray-700 rounded-lg">
            <p className="text-xs sm:text-sm text-gray-300 mb-2">Demo Accounts:</p>
            <div className="text-xs text-gray-400 space-y-1">
              <p>Athlete: athlete@demo.com / demo123</p>
              <p>Coach: coach@demo.com / demo123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;