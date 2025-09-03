import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Zap, Target, Award, Users, BarChart3 } from 'lucide-react';
import Button from '../components/UI/Button';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950 overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-8 sm:py-12 md:py-20">
          <div className="text-center">
            <div className="flex justify-center mb-6 sm:mb-8">
              <Trophy className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-purple-500" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight px-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-green-400">Talent Track</span>
            </h1>
            <p className="text-sm sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 md:mb-12 max-w-3xl mx-auto leading-relaxed px-4 sm:px-6">
              Transform your athletic potential with AI-driven performance analysis, gamified challenges, and personalized coaching. Upload videos, earn badges, and compete with athletes worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <Link to="/auth">
                <Button size="lg" className="text-sm sm:text-base md:text-lg px-4 sm:px-6 md:px-8 py-3 md:py-4 w-full sm:w-auto">
                  <span className="hidden sm:inline">Get Started as Athlete</span>
                  <span className="sm:hidden">Start as Athlete</span>
                </Button>
              </Link>
              <Link to="/auth?role=coach">
                <Button variant="secondary" size="lg" className="text-sm sm:text-base md:text-lg px-4 sm:px-6 md:px-8 py-3 md:py-4 w-full sm:w-auto">
                  <span className="hidden sm:inline">Join as Coach</span>
                  <span className="sm:hidden">Start as Coach</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Background Video */}
        <div className="absolute inset-0 opacity-10 -z-10">
          <img 
            src="https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Athletes training"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Features Section */}
      <div className="py-8 sm:py-12 md:py-20 px-3 sm:px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl sm:text-2xl md:text-4xl font-bold text-white text-center mb-6 sm:mb-8 md:mb-16 px-2">
            Why Choose Talent Track?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            <div className="bg-gray-800 p-4 sm:p-6 md:p-8 rounded-lg sm:rounded-xl border border-gray-700 hover:border-purple-500 transition-colors">
              <div className="flex items-center mb-4">
                <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400 mr-2 sm:mr-3" />
                <h3 className="text-lg sm:text-xl font-bold text-white">AI Analysis</h3>
              </div>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                Get instant feedback on your performance with advanced AI that detects movement patterns, counts reps, and measures athletic metrics.
              </p>
            </div>

            <div className="bg-gray-800 p-4 sm:p-6 md:p-8 rounded-lg sm:rounded-xl border border-gray-700 hover:border-green-500 transition-colors">
              <div className="flex items-center mb-4">
                <Target className="w-6 h-6 sm:w-8 sm:h-8 text-green-400 mr-2 sm:mr-3" />
                <h3 className="text-lg sm:text-xl font-bold text-white">Gamified Challenges</h3>
              </div>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                Complete daily, weekly, and seasonal challenges. Earn XP, unlock badges, and maintain streaks while improving your skills.
              </p>
            </div>

            <div className="bg-gray-800 p-4 sm:p-6 md:p-8 rounded-lg sm:rounded-xl border border-gray-700 hover:border-blue-500 transition-colors">
              <div className="flex items-center mb-4">
                <Award className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 mr-2 sm:mr-3" />
                <h3 className="text-lg sm:text-xl font-bold text-white">Badge System</h3>
              </div>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                Unlock achievements across consistency, strength, speed, and seasonal categories. Track your progress on an interactive roadmap.
              </p>
            </div>

            <div className="bg-gray-800 p-4 sm:p-6 md:p-8 rounded-lg sm:rounded-xl border border-gray-700 hover:border-orange-500 transition-colors">
              <div className="flex items-center mb-4">
                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-orange-400 mr-2 sm:mr-3" />
                <h3 className="text-lg sm:text-xl font-bold text-white">Leaderboards</h3>
              </div>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                Compete with athletes nationally and regionally. Climb the ranks and showcase your improvements to the community.
              </p>
            </div>

            <div className="bg-gray-800 p-4 sm:p-6 md:p-8 rounded-lg sm:rounded-xl border border-gray-700 hover:border-pink-500 transition-colors">
              <div className="flex items-center mb-4">
                <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-pink-400 mr-2 sm:mr-3" />
                <h3 className="text-lg sm:text-xl font-bold text-white">Progress Tracking</h3>
              </div>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                Monitor your athletic development with detailed analytics, performance trends, and personalized insights.
              </p>
            </div>

            <div className="bg-gray-800 p-4 sm:p-6 md:p-8 rounded-lg sm:rounded-xl border border-gray-700 hover:border-purple-500 transition-colors">
              <div className="flex items-center mb-4">
                <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400 mr-2 sm:mr-3" />
                <h3 className="text-lg sm:text-xl font-bold text-white">Coach Integration</h3>
              </div>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                Connect with certified coaches who can provide personalized feedback, create custom challenges, and guide your training.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-gradient-to-r from-purple-900/20 to-green-900/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6 px-2">
            Ready to Unlock Your Athletic Potential?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 px-4">
            Join thousands of athletes already improving their performance with AI-powered insights.
          </p>
          <Link to="/auth">
            <Button size="lg" className="text-sm sm:text-base md:text-lg px-6 sm:px-8 md:px-12 py-3 md:py-4">
              <span className="hidden sm:inline">Start Your Journey</span>
              <span className="sm:hidden">Get Started</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;