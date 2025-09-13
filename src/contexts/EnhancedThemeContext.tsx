import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { EnhancedThemeVariant, enhancedThemeVariants, defaultEnhancedTheme, getVisualStyleThemes, VisualStyle } from '../styles/enhanced-themes';

export type HeroLayoutVariant = 'minimal' | 'centered' | 'split' | 'featured';

interface EnhancedThemeContextType {
  theme: EnhancedThemeVariant;
  setTheme: (themeKey: string) => void;
  availableThemes: { key: string; name: string; visualStyle: string; mode: string }[];
  toggleDarkMode: () => void;
  changeVisualStyle: (style: VisualStyle) => void;
  getVisualStyles: () => ReturnType<typeof getVisualStyleThemes>;
  heroLayout: HeroLayoutVariant;
  setHeroLayout: (layout: HeroLayoutVariant) => void;
}

const EnhancedThemeContext = createContext<EnhancedThemeContextType | undefined>(undefined);

interface EnhancedThemeProviderProps {
  children: ReactNode;
  defaultThemeKey?: string;
}

export const EnhancedThemeProvider: React.FC<EnhancedThemeProviderProps> = ({ 
  children, 
  defaultThemeKey = 'professional-light' 
}) => {
  const [currentTheme, setCurrentTheme] = useState<EnhancedThemeVariant>(
    enhancedThemeVariants[defaultThemeKey] || defaultEnhancedTheme
  );
  const [currentThemeKey, setCurrentThemeKey] = useState(defaultThemeKey);
  const [heroLayout, setHeroLayoutState] = useState<HeroLayoutVariant>('minimal');

  // Get available themes for selection
  const availableThemes = Object.entries(enhancedThemeVariants).map(([key, theme]) => ({
    key,
    name: theme.name,
    visualStyle: theme.visualStyle,
    mode: theme.mode,
  }));

  // Toggle between light and dark mode for current visual style
  const toggleDarkMode = () => {
    const newMode = currentTheme.mode === 'light' ? 'dark' : 'light';
    const newThemeKey = `${currentTheme.visualStyle}-${newMode}`;
    
    console.log("toggleDarkMode called");
    console.log("Current theme:", currentTheme.visualStyle, currentTheme.mode);
    console.log("New theme key:", newThemeKey);
    
    if (enhancedThemeVariants[newThemeKey]) {
      console.log("Theme found, setting theme to:", newThemeKey);
      setTheme(newThemeKey);
    } else {
      console.error("Theme not found:", newThemeKey);
    }
  };

  // Change visual style while keeping current mode
  const changeVisualStyle = (style: VisualStyle) => {
    const newThemeKey = `${style}-${currentTheme.mode}`;
    
    console.log("changeVisualStyle called with:", style);
    console.log("Current mode:", currentTheme.mode);
    console.log("New theme key:", newThemeKey);
    console.log("Available themes:", Object.keys(enhancedThemeVariants));
    
    if (enhancedThemeVariants[newThemeKey]) {
      console.log("Theme found, setting theme to:", newThemeKey);
      setTheme(newThemeKey);
    } else {
      console.error("Theme not found:", newThemeKey);
    }
  };

  // Hero layout management
  const setHeroLayout = (layout: HeroLayoutVariant) => {
    setHeroLayoutState(layout);
    localStorage.setItem('lytsite-hero-layout', layout);
  };

  // Set theme by key
  const setTheme = (themeKey: string) => {
    if (enhancedThemeVariants[themeKey]) {
      setCurrentTheme(enhancedThemeVariants[themeKey]);
      setCurrentThemeKey(themeKey);
      
      // Store in localStorage for persistence
      localStorage.setItem('lytsite-enhanced-theme', themeKey);
    }
  };

  // Load theme and hero layout from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('lytsite-enhanced-theme');
    if (savedTheme && enhancedThemeVariants[savedTheme]) {
      setTheme(savedTheme);
    }
    
    const savedHeroLayout = localStorage.getItem('lytsite-hero-layout') as HeroLayoutVariant;
    if (savedHeroLayout && ['minimal', 'centered', 'split', 'featured'].includes(savedHeroLayout)) {
      setHeroLayoutState(savedHeroLayout);
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

    // Apply typography variables
    Object.entries(theme.typography).forEach(([key, value]) => {
      root.style.setProperty(`--typography-${key}`, value as string);
    });

    // Apply spacing variables
    Object.entries(theme.spacing).forEach(([key, value]) => {
      root.style.setProperty(`--spacing-${key}`, value as string);
    });

    // Apply effect variables
    Object.entries(theme.effects).forEach(([key, value]) => {
      root.style.setProperty(`--effects-${key}`, value as string);
    });

    // Apply layout variables
    Object.entries(theme.layout).forEach(([key, value]) => {
      root.style.setProperty(`--layout-${key}`, value as string);
    });

    // Apply specific CSS variables expected by global styles
    root.style.setProperty('--background', theme.colors.background);
    root.style.setProperty('--foreground', theme.colors.textPrimary);

    // Add theme class to body for conditional styling
    document.body.className = document.body.className
      .replace(/enhanced-theme-\w+-\w+/g, '') // Remove existing theme classes
      .concat(` enhanced-theme-${currentThemeKey}`)
      .trim();

    // Add visual style class
    document.body.className = document.body.className
      .replace(/visual-style-\w+/g, '') // Remove existing visual style classes
      .concat(` visual-style-${theme.visualStyle}`)
      .trim();

  }, [currentTheme, currentThemeKey]);

  const value: EnhancedThemeContextType = {
    theme: currentTheme,
    setTheme,
    availableThemes,
    toggleDarkMode,
    changeVisualStyle,
    getVisualStyles: getVisualStyleThemes,
    heroLayout,
    setHeroLayout,
  };

  return (
    <EnhancedThemeContext.Provider value={value}>
      {children}
    </EnhancedThemeContext.Provider>
  );
};

// Custom hook to use enhanced theme with fallback
export const useEnhancedTheme = (): EnhancedThemeContextType => {
  const context = useContext(EnhancedThemeContext);
  if (!context) {
    // Provide a fallback theme when no provider is available
    return {
      theme: defaultEnhancedTheme,
      setTheme: () => {},
      availableThemes: [],
      toggleDarkMode: () => {},
      changeVisualStyle: () => {},
      getVisualStyles: getVisualStyleThemes,
      heroLayout: 'minimal',
      setHeroLayout: () => {},
    };
  }
  return context;
};

// Theme utilities for CSS-in-JS or inline styles
export const getEnhancedThemeColors = (theme: EnhancedThemeVariant) => theme.colors;
export const getEnhancedThemeShadows = (theme: EnhancedThemeVariant) => theme.shadows;
export const getEnhancedThemeGradients = (theme: EnhancedThemeVariant) => theme.gradients;
export const getEnhancedThemeTypography = (theme: EnhancedThemeVariant) => theme.typography;
export const getEnhancedThemeSpacing = (theme: EnhancedThemeVariant) => theme.spacing;
export const getEnhancedThemeEffects = (theme: EnhancedThemeVariant) => theme.effects;
export const getEnhancedThemeLayout = (theme: EnhancedThemeVariant) => theme.layout;