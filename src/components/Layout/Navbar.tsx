import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, User, Trophy, Zap } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to={user.role === 'athlete' ? '/athlete/dashboard' : '/coach/dashboard'} className="flex items-center space-x-2">
          <Trophy className="w-8 h-8 text-purple-500" />
          <span className="text-xl font-bold text-white">Talent Track</span>
        </Link>

        <div className="flex items-center space-x-6">
          {user.role === 'athlete' && (
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1 bg-purple-600/20 px-3 py-1 rounded-full">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-400 font-medium">{user.xp} XP</span>
              </div>
              <div className="flex items-center space-x-1 bg-green-600/20 px-3 py-1 rounded-full">
                <span className="text-green-400 font-medium">{user.coins} 🪙</span>
              </div>
              <div className="flex items-center space-x-1 bg-orange-600/20 px-3 py-1 rounded-full">
                <span className="text-orange-400 font-medium">{user.streak} 🔥</span>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-3">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-full border-2 border-purple-500"
            />
            <span className="text-white font-medium">{user.name}</span>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-red-400 transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;