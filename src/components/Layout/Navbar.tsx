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
    <nav className="bg-gray-900 border-b border-gray-800 px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to={user.role === 'athlete' ? '/athlete/dashboard' : '/coach/dashboard'} className="flex items-center space-x-1 sm:space-x-2">
          <Trophy className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-purple-500" />
          <span className="text-base sm:text-lg md:text-xl font-bold text-white hidden xs:block sm:hidden">TT</span>
          <span className="text-base sm:text-lg md:text-xl font-bold text-white hidden sm:block">Talent Track</span>
        </Link>

        <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-6">
          {user.role === 'athlete' && (
            <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4 text-xs sm:text-sm">
              <div className="flex items-center space-x-1 bg-purple-600/20 px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 rounded-full">
                <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
                <span className="text-yellow-400 font-medium text-xs sm:text-sm">{user.xp}</span>
              </div>
              <div className="flex items-center space-x-1 bg-green-600/20 px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 rounded-full">
                <span className="text-green-400 font-medium text-xs sm:text-sm">🪙{user.coins}</span>
              </div>
              <div className="flex items-center space-x-1 bg-orange-600/20 px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 rounded-full">
                <span className="text-orange-400 font-medium text-xs sm:text-sm">🔥{user.streak}</span>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full border-2 border-purple-500"
            />
            <span className="text-white font-medium text-sm hidden lg:block">{user.name}</span>
            <button
              onClick={handleLogout}
              className="p-1 sm:p-1.5 md:p-2 text-gray-400 hover:text-red-400 transition-colors touch-manipulation"
              title="Logout"
            >
              <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;