import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className = '', hover = false, onClick }) => {
  return (
    <div 
      className={`bg-gray-800 rounded-xl border border-gray-700 p-6 ${
        hover ? 'hover:bg-gray-750 transition-colors cursor-pointer' : ''
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;