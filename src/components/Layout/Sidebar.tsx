import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Home, 
  Upload, 
  Target, 
  Trophy, 
  User, 
  Award,
  Users,
  BarChart3,
  BookOpen
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const athleteLinks = [
    { to: '/athlete/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/athlete/upload', icon: Upload, label: 'Upload Video' },
    { to: '/athlete/challenges', icon: Target, label: 'Challenges' },
    { to: '/athlete/training', icon: BookOpen, label: 'Training' },
    { to: '/athlete/profile', icon: User, label: 'Profile' },
    { to: '/athlete/roadmap', icon: Award, label: 'Roadmap' },
  ];

  const coachLinks = [
    { to: '/coach/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/coach/athletes', icon: Users, label: 'Athletes' },
    { to: '/coach/analytics', icon: BarChart3, label: 'Analytics' },
    { to: '/coach/badges', icon: Award, label: 'Badges' },
    { to: '/coach/profile', icon: User, label: 'Profile' },
  ];

  const links = user.role === 'athlete' ? athleteLinks : coachLinks;

  return (
    <aside className="w-14 sm:w-16 md:w-64 bg-gray-900 border-r border-gray-800 min-h-screen">
      <div className="p-2 sm:p-3 md:p-6">
        <nav className="space-y-2">
          {links.map(({ to, icon: Icon, label }) => (
            <Link
              key={to}
              to={to}
              className={`w-full flex items-center justify-center md:justify-start space-x-0 md:space-x-3 px-1 sm:px-2 md:px-4 py-2 sm:py-3 rounded-lg transition-colors touch-manipulation ${
                location.pathname === to
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
              title={label}
            >
              <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="font-medium hidden md:block">{label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;