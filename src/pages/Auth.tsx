import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Trophy, User, Users } from 'lucide-react';
import Button from '../components/UI/Button';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'athlete' | 'coach'>('athlete');
  const [loading, setLoading] = useState(false);
  
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  React.useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam === 'coach') {
      setRole('coach');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

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
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950 flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        <div className="bg-gray-800 p-8 rounded-xl border border-gray-700">
          <div className="text-center mb-8">
            <Trophy className="w-12 h-12 text-purple-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white">
              {isLogin ? 'Welcome Back' : 'Join Talent Track'}
            </h2>
            <p className="text-gray-400 mt-2">
              {isLogin ? 'Sign in to your account' : 'Create your account and start your journey'}
            </p>
          </div>

          {/* Role Selection */}
          <div className="mb-6">
            <div className="flex bg-gray-700 rounded-lg p-1">
              <button
                type="button"
                onClick={() => setRole('athlete')}
                className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md transition-colors ${
                  role === 'athlete' 
                    ? 'bg-purple-600 text-white' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <User className="w-4 h-4 mr-2" />
                Athlete
              </button>
              <button
                type="button"
                onClick={() => setRole('coach')}
                className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md transition-colors ${
                  role === 'coach' 
                    ? 'bg-green-600 text-white' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <Users className="w-4 h-4 mr-2" />
                Coach
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                  placeholder="Enter your full name"
                  required={!isLogin}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                placeholder="Enter your password"
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full py-3 mt-6" 
              disabled={loading}
            >
              {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-purple-500 hover:text-purple-400 font-medium"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>

          {/* Demo Accounts */}
          <div className="mt-6 p-4 bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-300 mb-2">Demo Accounts:</p>
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