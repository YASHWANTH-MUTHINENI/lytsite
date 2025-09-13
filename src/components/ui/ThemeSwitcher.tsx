import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from './button';
import { Card, CardContent } from './card';
import { Badge } from './badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './popover';
import { 
  Palette, 
  Sun, 
  Moon, 
  Monitor,
  Check,
  Droplets,
  Leaf,
  Sunset,
  Flower,
  Circle
} from 'lucide-react';

const paletteIcons = {
  ocean: <Droplets className="w-4 h-4" />,
  forest: <Leaf className="w-4 h-4" />,
  sunset: <Sunset className="w-4 h-4" />,
  lavender: <Flower className="w-4 h-4" />,
  mono: <Circle className="w-4 h-4" />,
};

const paletteColors = {
  ocean: 'bg-sky-500',
  forest: 'bg-green-500', 
  sunset: 'bg-orange-500',
  lavender: 'bg-purple-500',
  mono: 'bg-gray-500',
};

interface ThemeSwitcherProps {
  variant?: 'button' | 'minimal';
  showLabel?: boolean;
}

export default function ThemeSwitcher({ 
  variant = 'button', 
  showLabel = true 
}: ThemeSwitcherProps) {
  const { theme, setTheme, availableThemes, toggleDarkMode, changePalette } = useTheme();
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

  // Group themes by palette
  const themesByPalette = availableThemes.reduce((acc, themeItem) => {
    if (!acc[themeItem.palette]) {
      acc[themeItem.palette] = [];
    }
    acc[themeItem.palette].push(themeItem);
    return acc;
  }, {} as Record<string, Array<{ key: string; name: string; palette: string; mode: string }>>);

  const handleThemeSelect = (themeKey: string) => {
    setTheme(themeKey);
    setIsOpen(false);
  };

  const currentPalette = theme.palette;
  const currentMode = theme.mode;

  if (variant === 'minimal') {
    return (
      <div className="flex items-center space-x-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-1 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
        {/* Quick Dark Mode Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleDarkMode}
          className="w-8 h-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
          title={`Switch to ${currentMode === 'light' ? 'dark' : 'light'} mode`}
        >
          {currentMode === 'light' ? (
            <Moon className="w-4 h-4" />
          ) : (
            <Sun className="w-4 h-4" />
          )}
        </Button>

        {/* Palette Selector - Simple Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <Button
            variant="ghost"
            size="sm"
            className="w-8 h-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700 border-2 border-transparent hover:border-gray-300 transition-all"
            title="Change color palette"
            onClick={() => {
              console.log("Button clicked, toggling isOpen from", isOpen, "to", !isOpen);
              setIsOpen(!isOpen);
            }}
          >
            <div className={`w-5 h-5 rounded-full ${paletteColors[currentPalette as keyof typeof paletteColors]} border-2 border-white shadow-sm ring-1 ring-gray-200 dark:ring-gray-600`} />
          </Button>
          
          {/* Simple dropdown menu */}
          {isOpen && (
            <div 
              className="absolute top-full right-0 mt-1 w-48 p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-[9999]"
              style={{ position: 'absolute', zIndex: 9999 }}
            >
              <div className="space-y-1">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 px-2 py-1">
                  Color Palette
                </div>
                {Object.entries(paletteColors).map(([palette, colorClass]) => (
                  <button
                    key={palette}
                    className="w-full flex items-center justify-start px-2 py-1.5 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => {
                      console.log("Changing palette to:", palette);
                      changePalette(palette);
                      setIsOpen(false);
                    }}
                  >
                    <div className={`w-3 h-3 rounded-full ${colorClass} mr-2`} />
                    <span className="capitalize">{palette}</span>
                    {palette === currentPalette && (
                      <Check className="w-3 h-3 ml-auto" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <Palette className="w-4 h-4 mr-2" />
          {showLabel && (
            <span className="hidden sm:inline">
              {theme.name}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Theme Settings</h4>
            <Badge variant="secondary" className="text-xs">
              {theme.name}
            </Badge>
          </div>

          {/* Quick Mode Toggle */}
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center space-x-2">
              <Monitor className="w-4 h-4" />
              <span className="text-sm font-medium">Display Mode</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleDarkMode}
              className="h-8"
            >
              {currentMode === 'light' ? (
                <>
                  <Moon className="w-3 h-3 mr-1" />
                  Dark
                </>
              ) : (
                <>
                  <Sun className="w-3 h-3 mr-1" />
                  Light
                </>
              )}
            </Button>
          </div>

          {/* Color Palettes */}
          <div className="space-y-2">
            <h5 className="text-sm font-medium">Color Palettes</h5>
            <div className="grid grid-cols-1 gap-2">
              {Object.entries(themesByPalette).map(([palette, themes]) => (
                <Card 
                  key={palette}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    palette === currentPalette 
                      ? 'ring-2 ring-blue-500 ring-opacity-50' 
                      : ''
                  }`}
                  onClick={() => changePalette(palette)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-6 h-6 rounded-lg ${paletteColors[palette as keyof typeof paletteColors]} flex items-center justify-center text-white`}>
                          {paletteIcons[palette as keyof typeof paletteIcons]}
                        </div>
                        <div>
                          <div className="font-medium text-sm capitalize">{palette}</div>
                          <div className="text-xs text-gray-500">
                            {themes.length} variants
                          </div>
                        </div>
                      </div>
                      {palette === currentPalette && (
                        <Check className="w-4 h-4 text-blue-500" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="p-3 border rounded-lg" style={{ 
            background: theme.gradients.surface,
            borderColor: theme.colors.border 
          }}>
            <div className="text-xs text-gray-500 mb-2">Preview</div>
            <div className="space-y-2">
              <div 
                className="h-8 rounded flex items-center px-3 text-sm font-medium"
                style={{ 
                  background: theme.colors.primary, 
                  color: theme.colors.surface 
                }}
              >
                Primary Button
              </div>
              <div className="flex space-x-2">
                <div 
                  className="h-6 w-6 rounded"
                  style={{ background: theme.colors.success }}
                />
                <div 
                  className="h-6 w-6 rounded"
                  style={{ background: theme.colors.warning }}
                />
                <div 
                  className="h-6 w-6 rounded"
                  style={{ background: theme.colors.error }}
                />
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
