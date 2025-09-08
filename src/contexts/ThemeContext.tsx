import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeVariant, themeVariants, defaultTheme } from '../styles/themes';

interface ThemeContextType {
  theme: ThemeVariant;
  setTheme: (themeKey: string) => void;
  availableThemes: { key: string; name: string; palette: string; mode: string }[];
  toggleDarkMode: () => void;
  changePalette: (palette: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  defaultThemeKey?: string;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  defaultThemeKey = 'ocean-light' 
}) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeVariant>(
    themeVariants[defaultThemeKey] || defaultTheme
  );
  const [currentThemeKey, setCurrentThemeKey] = useState(defaultThemeKey);

  // Get available themes for selection
  const availableThemes = Object.entries(themeVariants).map(([key, theme]) => ({
    key,
    name: theme.name,
    palette: theme.palette,
    mode: theme.mode,
  }));

  // Toggle between light and dark mode for current palette
  const toggleDarkMode = () => {
    const newMode = currentTheme.mode === 'light' ? 'dark' : 'light';
    const newThemeKey = `${currentTheme.palette}-${newMode}`;
    
    if (themeVariants[newThemeKey]) {
      setTheme(newThemeKey);
    }
  };

  // Change color palette while keeping current mode
  const changePalette = (palette: string) => {
    const newThemeKey = `${palette}-${currentTheme.mode}`;
    
    if (themeVariants[newThemeKey]) {
      setTheme(newThemeKey);
    }
  };

  // Set theme by key
  const setTheme = (themeKey: string) => {
    if (themeVariants[themeKey]) {
      setCurrentTheme(themeVariants[themeKey]);
      setCurrentThemeKey(themeKey);
      
      // Store in localStorage for persistence
      localStorage.setItem('lytsite-theme', themeKey);
    }
  };

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('lytsite-theme');
    if (savedTheme && themeVariants[savedTheme]) {
      setTheme(savedTheme);
    }
  }, []);

  // Apply CSS custom properties when theme changes
  useEffect(() => {
    const root = document.documentElement;
    const theme = currentTheme;

    // Apply color variables
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value as string);
    });

    // Apply shadow variables
    Object.entries(theme.shadows).forEach(([key, value]) => {
      root.style.setProperty(`--shadow-${key}`, value as string);
    });

    // Apply gradient variables
    Object.entries(theme.gradients).forEach(([key, value]) => {
      root.style.setProperty(`--gradient-${key}`, value as string);
    });

    // Add theme class to body for conditional styling
    document.body.className = document.body.className
      .replace(/theme-\w+-\w+/g, '') // Remove existing theme classes
      .concat(` theme-${currentThemeKey}`)
      .trim();

  }, [currentTheme, currentThemeKey]);

  const value: ThemeContextType = {
    theme: currentTheme,
    setTheme,
    availableThemes,
    toggleDarkMode,
    changePalette,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Theme utilities for CSS-in-JS or inline styles
export const getThemeColors = (theme: ThemeVariant) => theme.colors;
export const getThemeShadows = (theme: ThemeVariant) => theme.shadows;
export const getThemeGradients = (theme: ThemeVariant) => theme.gradients;
