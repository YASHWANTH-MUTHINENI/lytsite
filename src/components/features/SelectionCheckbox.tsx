import React from 'react';
import { Check } from 'lucide-react';

interface SelectionCheckboxProps {
  isSelected: boolean;
  onToggle: () => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function SelectionCheckbox({
  isSelected,
  onToggle,
  size = 'md',
  className = ''
}: SelectionCheckboxProps) {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const checkSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4', 
    lg: 'w-5 h-5'
  };

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      className={`
        ${sizeClasses[size]} 
        rounded-md border-2 transition-all duration-200 
        flex items-center justify-center
        ${isSelected 
          ? 'bg-blue-600 border-blue-600 shadow-md hover:bg-blue-700' 
          : 'bg-white border-gray-300 hover:border-gray-400 hover:bg-gray-50'
        }
        ${className}
      `}
    >
      {isSelected && (
        <Check className={`${checkSizes[size]} text-white`} />
      )}
    </button>
  );
}