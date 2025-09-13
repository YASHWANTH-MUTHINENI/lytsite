import React, { useState, useEffect, useRef } from 'react';
import { useEnhancedTheme } from '../../contexts/EnhancedThemeContext';
import type { HeroLayoutVariant } from '../../contexts/EnhancedThemeContext';
import { Button } from './button';
import { 
  Sun, 
  Moon, 
  Check,
  Briefcase,
  Palette,
  Leaf,
  Minus,
  Crown,
  Layout,
  AlignCenter,
  Columns,
  Image
} from 'lucide-react';

const visualStyleIcons = {
  professional: <Briefcase className="w-4 h-4" />,
  creative: <Palette className="w-4 h-4" />,
  nature: <Leaf className="w-4 h-4" />,
  minimal: <Minus className="w-4 h-4" />,
  elegant: <Crown className="w-4 h-4" />,
};

const visualStyleColors = {
  professional: 'bg-blue-500',
  creative: 'bg-orange-500', 
  nature: 'bg-green-500',
  minimal: 'bg-gray-500',
  elegant: 'bg-purple-500',
};

const heroLayoutIcons = {
  minimal: <Layout className="w-4 h-4" />,
  centered: <AlignCenter className="w-4 h-4" />,
  split: <Columns className="w-4 h-4" />,
  featured: <Image className="w-4 h-4" />,
};

const heroLayoutNames = {
  minimal: 'Minimal',
  centered: 'Centered',
  split: 'Split Layout',
  featured: 'Featured',
};

// Helper function to determine if we need light or dark icons
const getIconColor = (bgColorClass: string, mode: 'light' | 'dark') => {
  // In light mode, always use dark icons for better visibility
  if (mode === 'light') {
    return '#374151'; // Always dark gray in light mode
  }
  
  // For dark mode, use white icons
  return 'white';
};

interface EnhancedThemeSwitcherProps {
  variant?: 'button' | 'minimal';
  showLabel?: boolean;
}

export default function EnhancedThemeSwitcher({ 
  variant = 'minimal', 
  showLabel = false 
}: EnhancedThemeSwitcherProps) {
  const { theme, toggleDarkMode, changeVisualStyle, getVisualStyles, heroLayout, setHeroLayout } = useEnhancedTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const currentVisualStyle = theme.visualStyle;
  const currentMode = theme.mode;
  const visualStyles = getVisualStyles();

  // Auto-cycle through visual styles
  const cycleVisualStyle = () => {
    const styleKeys = Object.keys(visualStyles);
    const currentIndex = styleKeys.indexOf(currentVisualStyle);
    const nextIndex = (currentIndex + 1) % styleKeys.length;
    const nextStyle = styleKeys[nextIndex] as keyof typeof visualStyles;
    
    console.log("Cycling from", currentVisualStyle, "to", nextStyle);
    changeVisualStyle(nextStyle);
  };

  // Auto-cycle through hero layouts
  const cycleHeroLayout = () => {
    const layoutKeys: HeroLayoutVariant[] = ['minimal', 'centered', 'split', 'featured'];
    const currentIndex = layoutKeys.indexOf(heroLayout);
    const nextIndex = (currentIndex + 1) % layoutKeys.length;
    const nextLayout = layoutKeys[nextIndex];
    
    console.log("Cycling hero layout from", heroLayout, "to", nextLayout);
    setHeroLayout(nextLayout);
  };

  return (
    <div 
      className="flex items-center space-x-2 backdrop-blur-sm rounded-lg p-1 shadow-lg border"
      style={{
        backgroundColor: theme.mode === 'light' 
          ? '#ffffff' // Solid white for light mode
          : `${theme.colors.surface}E6`, // 90% opacity for dark mode
        borderColor: theme.mode === 'light'
          ? '#e5e5e5' // Light gray border for light mode
          : `${theme.colors.border}80`, // 50% opacity for dark mode
        boxShadow: theme.mode === 'light' 
          ? '0 4px 6px -1px rgba(0, 0, 0, 0.15), 0 2px 4px -1px rgba(0, 0, 0, 0.1)' // stronger shadow for light mode
          : undefined,
      }}
    >
      {/* Dark Mode Toggle */}
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleDarkMode}
        className="w-8 h-8 p-0 transition-all border"
        style={{
          color: theme.mode === 'light' ? '#374151' : theme.colors.textPrimary, // Darker gray for light mode
          backgroundColor: theme.mode === 'light' ? '#f9fafb' : 'transparent', // Light gray background in light mode
          borderColor: theme.mode === 'light' ? '#d1d5db' : 'transparent', // Gray border in light mode
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = theme.mode === 'light' ? '#f3f4f6' : theme.colors.backgroundSecondary;
          e.currentTarget.style.borderColor = theme.mode === 'light' ? '#9ca3af' : 'transparent';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = theme.mode === 'light' ? '#f9fafb' : 'transparent';
          e.currentTarget.style.borderColor = theme.mode === 'light' ? '#d1d5db' : 'transparent';
        }}
        title={`Switch to ${currentMode === 'light' ? 'dark' : 'light'} mode`}
      >
        {currentMode === 'light' ? (
          <Moon className="w-4 h-4" style={{ color: theme.mode === 'light' ? '#374151' : theme.colors.textPrimary }} />
        ) : (
          <Sun className="w-4 h-4" style={{ color: theme.mode === 'light' ? '#374151' : theme.colors.textPrimary }} />
        )}
      </Button>

      {/* Visual Style Selector - Two Options */}
      {variant === 'minimal' ? (
        // Option 1: Simple Cycle Button
        <Button
          variant="ghost"
          size="sm"
          className="w-8 h-8 p-0 transition-all border"
          style={{
            backgroundColor: theme.mode === 'light' ? '#f9fafb' : 'transparent',
            borderColor: theme.mode === 'light' ? '#d1d5db' : 'transparent',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = theme.mode === 'light' ? '#f3f4f6' : theme.colors.backgroundSecondary;
            e.currentTarget.style.borderColor = theme.mode === 'light' ? '#9ca3af' : theme.colors.border;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = theme.mode === 'light' ? '#f9fafb' : 'transparent';
            e.currentTarget.style.borderColor = theme.mode === 'light' ? '#d1d5db' : 'transparent';
          }}
          title={`Current: ${theme.name} - Click to change style`}
          onClick={cycleVisualStyle}
        >
          <div 
            className={`w-5 h-5 rounded-full ${visualStyleColors[currentVisualStyle]} border-2 shadow-sm ring-1 flex items-center justify-center text-xs`}
            style={{
              borderColor: theme.colors.surface,
              '--tw-ring-color': theme.colors.border,
              color: getIconColor(visualStyleColors[currentVisualStyle], theme.mode),
            } as React.CSSProperties}
          >
            {visualStyleIcons[currentVisualStyle]}
          </div>
        </Button>
      ) : (
        // Option 2: Dropdown Selector
        <div className="relative" ref={dropdownRef}>
          <Button
            variant="ghost"
            size="sm"
            className="w-8 h-8 p-0 transition-all border"
            style={{
              backgroundColor: theme.mode === 'light' ? '#f9fafb' : 'transparent',
              borderColor: theme.mode === 'light' ? '#d1d5db' : 'transparent',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme.mode === 'light' ? '#f3f4f6' : theme.colors.backgroundSecondary;
              e.currentTarget.style.borderColor = theme.mode === 'light' ? '#9ca3af' : theme.colors.border;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = theme.mode === 'light' ? '#f9fafb' : 'transparent';
              e.currentTarget.style.borderColor = theme.mode === 'light' ? '#d1d5db' : 'transparent';
            }}
            title="Choose visual style"
            onClick={() => {
              console.log("Visual style button clicked, toggling dropdown");
              setIsOpen(!isOpen);
            }}
          >
            <div 
              className={`w-5 h-5 rounded-full ${visualStyleColors[currentVisualStyle]} border-2 shadow-sm ring-1 flex items-center justify-center text-xs`}
              style={{
                borderColor: theme.colors.surface,
                '--tw-ring-color': theme.colors.border,
                color: getIconColor(visualStyleColors[currentVisualStyle], theme.mode),
              } as React.CSSProperties}
            >
              {visualStyleIcons[currentVisualStyle]}
            </div>
          </Button>
          
          {/* Dropdown menu */}
          {isOpen && (
            <div 
              className="absolute top-full right-0 mt-1 w-64 p-2 border rounded-md shadow-lg z-[9999]"
              style={{ 
                position: 'absolute', 
                zIndex: 9999,
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
              }}
            >
              <div className="space-y-1">
                <div 
                  className="text-xs font-medium px-2 py-1"
                  style={{ color: theme.mode === 'light' ? '#6B7280' : theme.colors.textMuted }}
                >
                  Visual Style
                </div>
                {Object.entries(visualStyles).map(([styleKey, styleData]) => (
                  <button
                    key={styleKey}
                    className="w-full flex items-center justify-start px-2 py-2 text-sm rounded transition-colors"
                    style={{
                      color: theme.mode === 'light' ? '#374151' : theme.colors.textPrimary, // Darker gray for light mode
                      backgroundColor: 'transparent',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = theme.colors.backgroundSecondary;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                    onClick={() => {
                      console.log("Changing visual style to:", styleKey);
                      changeVisualStyle(styleKey as any);
                      setIsOpen(false);
                    }}
                  >
                    <div className="flex items-center space-x-3 flex-1">
                      <div 
                        className={`w-6 h-6 rounded-full ${visualStyleColors[styleKey as keyof typeof visualStyleColors]} flex items-center justify-center text-xs`}
                        style={{
                          color: getIconColor(visualStyleColors[styleKey as keyof typeof visualStyleColors], theme.mode),
                        }}
                      >
                        {styleData.icon}
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="capitalize font-medium" style={{ color: theme.mode === 'light' ? '#374151' : theme.colors.textPrimary }}>{styleKey}</span>
                        <span className="text-xs" style={{ color: theme.colors.textMuted }}>{styleData.description}</span>
                      </div>
                    </div>
                    {styleKey === currentVisualStyle && (
                      <Check className="w-3 h-3 ml-auto" style={{ color: theme.colors.primary }} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Hero Layout Toggle */}
      <Button
        variant="ghost"
        size="sm"
        className="w-8 h-8 p-0 transition-all border"
        style={{
          backgroundColor: theme.mode === 'light' ? '#f9fafb' : 'transparent',
          borderColor: theme.mode === 'light' ? '#d1d5db' : 'transparent',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = theme.mode === 'light' ? '#f3f4f6' : theme.colors.backgroundSecondary;
          e.currentTarget.style.borderColor = theme.mode === 'light' ? '#9ca3af' : theme.colors.border;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = theme.mode === 'light' ? '#f9fafb' : 'transparent';
          e.currentTarget.style.borderColor = theme.mode === 'light' ? '#d1d5db' : 'transparent';
        }}
        title={`Current: ${heroLayoutNames[heroLayout]} - Click to change layout`}
        onClick={cycleHeroLayout}
      >
        <div 
          className="w-4 h-4 flex items-center justify-center"
          style={{
            color: theme.mode === 'light' ? '#374151' : theme.colors.textPrimary,
          }}
        >
          {heroLayoutIcons[heroLayout]}
        </div>
      </Button>
    </div>
  );
}