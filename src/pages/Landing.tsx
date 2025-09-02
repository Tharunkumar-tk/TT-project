import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Zap, Target, Award, Users, BarChart3 } from 'lucide-react';
import Button from '../components/UI/Button';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <Trophy className="w-20 h-20 text-purple-500" />
            </div>
            <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-green-400">Talent Track</span>
            </h1>
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Transform your athletic potential with AI-driven performance analysis, gamified challenges, and personalized coaching. Upload videos, earn badges, and compete with athletes worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button size="lg" className="text-lg px-8 py-4">
                  Get Started as Athlete
                </Button>
              </Link>
              <Link to="/auth?role=coach">
                <Button variant="secondary" size="lg" className="text-lg px-8 py-4">
                  Join as Coach
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
      <div className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-16">
            Why Choose Talent Track?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 hover:border-purple-500 transition-colors">
              <div className="flex items-center mb-4">
                <Zap className="w-8 h-8 text-yellow-400 mr-3" />
                <h3 className="text-xl font-bold text-white">AI Analysis</h3>
              </div>
              <p className="text-gray-300">
                Get instant feedback on your performance with advanced AI that detects movement patterns, counts reps, and measures athletic metrics.
              </p>
            </div>

            <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 hover:border-green-500 transition-colors">
              <div className="flex items-center mb-4">
                <Target className="w-8 h-8 text-green-400 mr-3" />
                <h3 className="text-xl font-bold text-white">Gamified Challenges</h3>
              </div>
              <p className="text-gray-300">
                Complete daily, weekly, and seasonal challenges. Earn XP, unlock badges, and maintain streaks while improving your skills.
              </p>
            </div>

            <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 hover:border-blue-500 transition-colors">
              <div className="flex items-center mb-4">
                <Award className="w-8 h-8 text-blue-400 mr-3" />
                <h3 className="text-xl font-bold text-white">Badge System</h3>
              </div>
              <p className="text-gray-300">
                Unlock achievements across consistency, strength, speed, and seasonal categories. Track your progress on an interactive roadmap.
              </p>
            </div>

            <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 hover:border-orange-500 transition-colors">
              <div className="flex items-center mb-4">
                <Users className="w-8 h-8 text-orange-400 mr-3" />
                <h3 className="text-xl font-bold text-white">Leaderboards</h3>
              </div>
              <p className="text-gray-300">
                Compete with athletes nationally and regionally. Climb the ranks and showcase your improvements to the community.
              </p>
            </div>

            <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 hover:border-pink-500 transition-colors">
              <div className="flex items-center mb-4">
                <BarChart3 className="w-8 h-8 text-pink-400 mr-3" />
                <h3 className="text-xl font-bold text-white">Progress Tracking</h3>
              </div>
              <p className="text-gray-300">
                Monitor your athletic development with detailed analytics, performance trends, and personalized insights.
              </p>
            </div>

            <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 hover:border-purple-500 transition-colors">
              <div className="flex items-center mb-4">
                <Trophy className="w-8 h-8 text-purple-400 mr-3" />
                <h3 className="text-xl font-bold text-white">Coach Integration</h3>
              </div>
              <p className="text-gray-300">
                Connect with certified coaches who can provide personalized feedback, create custom challenges, and guide your training.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-6 bg-gradient-to-r from-purple-900/20 to-green-900/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Unlock Your Athletic Potential?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of athletes already improving their performance with AI-powered insights.
          </p>
          <Link to="/auth">
            <Button size="lg" className="text-lg px-12 py-4">
              Start Your Journey
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;