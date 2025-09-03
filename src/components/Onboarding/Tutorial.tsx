import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../UI/Button';
import { ChevronRight, ChevronLeft, Trophy, Target, BookOpen, Award, User } from 'lucide-react';

interface TutorialProps {
  onComplete: () => void;
}

const Tutorial: React.FC<TutorialProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const tutorialSteps = [
    {
      title: 'Welcome to Talent Track! 🎉',
      description: 'Your journey to athletic excellence starts here. Let me show you around!',
      icon: Trophy,
      color: 'purple',
      action: null
    },
    {
      title: 'Profile Section 👤',
      description: 'Manage your personal information, track your level progress, and view your achievement collection.',
      icon: User,
      color: 'blue',
      action: () => navigate('/athlete/profile')
    },
    {
      title: 'Challenges Hub 🎯',
      description: 'Complete daily, weekly, and seasonal challenges to earn XP, coins, and unlock badges.',
      icon: Target,
      color: 'green',
      action: () => navigate('/athlete/challenges')
    },
    {
      title: 'Training Center 📚',
      description: 'Access expert training videos, tips from coaches, and improve your technique.',
      icon: BookOpen,
      color: 'yellow',
      action: () => navigate('/athlete/training')
    },
    {
      title: 'Badge Roadmap 🏅',
      description: 'Explore all 30 available badges and track your progress toward becoming the ultimate athlete.',
      icon: Award,
      color: 'orange',
      action: () => navigate('/athlete/roadmap')
    }
  ];

  const currentStepData = tutorialSteps[currentStep];
  const Icon = currentStepData.icon;

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleVisitSection = () => {
    if (currentStepData.action) {
      currentStepData.action();
      onComplete();
    }
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'purple': return 'bg-purple-600/20 border-purple-500 text-purple-400';
      case 'blue': return 'bg-blue-600/20 border-blue-500 text-blue-400';
      case 'green': return 'bg-green-600/20 border-green-500 text-green-400';
      case 'yellow': return 'bg-yellow-600/20 border-yellow-500 text-yellow-400';
      case 'orange': return 'bg-orange-600/20 border-orange-500 text-orange-400';
      default: return 'bg-gray-600/20 border-gray-500 text-gray-400';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-gray-800 rounded-lg sm:rounded-xl border border-gray-700 p-4 sm:p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-6">
          <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 ${getColorClasses(currentStepData.color)} flex items-center justify-center mx-auto mb-3 sm:mb-4`}>
            <Icon className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 px-2">{currentStepData.title}</h2>
          <p className="text-gray-300 text-sm sm:text-base px-2">{currentStepData.description}</p>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center space-x-1 sm:space-x-2 mb-4 sm:mb-6">
          {tutorialSteps.map((_, index) => (
            <div
              key={index}
              className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-colors ${
                index === currentStep ? 'bg-purple-500' : 
                index < currentStep ? 'bg-green-500' : 'bg-gray-600'
              }`}
            />
          ))}
        </div>

        <div className="flex justify-between items-center">
          <Button
            variant="secondary"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            icon={ChevronLeft}
            size="sm"
            className="px-2 sm:px-4"
          >
            <span className="hidden sm:inline">Previous</span>
            <span className="sm:hidden">Prev</span>
          </Button>

          <span className="text-gray-400 text-xs sm:text-sm">
            {currentStep + 1} of {tutorialSteps.length}
          </span>

          <div className="flex gap-1 sm:gap-2">
            {currentStepData.action && (
              <Button
                variant="success"
                onClick={handleVisitSection}
                size="sm"
                className="px-2 sm:px-3"
              >
                <span className="hidden sm:inline">Visit Now</span>
                <span className="sm:hidden">Visit</span>
              </Button>
            )}
            <Button
              onClick={handleNext}
              icon={currentStep === tutorialSteps.length - 1 ? Trophy : ChevronRight}
              size="sm"
              className="px-2 sm:px-4"
            >
              <span className="hidden sm:inline">{currentStep === tutorialSteps.length - 1 ? 'Get Started' : 'Next'}</span>
              <span className="sm:hidden">{currentStep === tutorialSteps.length - 1 ? 'Start' : 'Next'}</span>
            </Button>
          </div>
        </div>

        <div className="mt-3 sm:mt-4 text-center">
          <button
            onClick={onComplete}
            className="text-gray-400 hover:text-white text-xs sm:text-sm underline touch-manipulation"
          >
            Skip Tutorial
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tutorial;