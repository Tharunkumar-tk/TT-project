import React from 'react';

interface ProgressBarProps {
  progress: number;
  max: number;
  className?: string;
  color?: 'purple' | 'green' | 'yellow' | 'blue';
  showText?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  max, 
  className = '', 
  color = 'purple',
  showText = true 
}) => {
  const percentage = Math.min((progress / max) * 100, 100);
  
  const colorClasses = {
    purple: 'bg-purple-600',
    green: 'bg-green-600',
    yellow: 'bg-yellow-600',
    blue: 'bg-blue-600'
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="bg-gray-700 rounded-full h-2 overflow-hidden">
        <div 
          className={`h-full ${colorClasses[color]} transition-all duration-300 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showText && (
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>{progress}</span>
          <span>{max}</span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;