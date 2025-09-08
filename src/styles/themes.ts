export type ColorPalette = 'ocean' | 'forest' | 'sunset' | 'lavender' | 'mono';
export type ThemeMode = 'light' | 'dark';

export interface ThemeVariant {
  name: string;
  palette: ColorPalette;
  mode: ThemeMode;
  colors: {
    // Background colors
    background: string;
    backgroundSecondary: string;
    backgroundTertiary: string;
    
    // Text colors
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    
    // Brand colors
    primary: string;
    primaryHover: string;
    primaryLight: string;
    
    // Accent colors
    accent: string;
    accentHover: string;
    accentLight: string;
    
    // Semantic colors
    success: string;
    warning: string;
    error: string;
    info: string;
    
    // Border & surface colors
    border: string;
    borderLight: string;
    surface: string;
    surfaceHover: string;
    
    // Overlay colors
    overlay: string;
    overlayLight: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  gradients: {
    primary: string;
    hero: string;
    surface: string;
  };
}

// Ocean Theme (Default)
const oceanLight: ThemeVariant = {
  name: 'Ocean Light',
  palette: 'ocean',
  mode: 'light',
  colors: {
    background: '#ffffff',
    backgroundSecondary: '#f8fafc',
    backgroundTertiary: '#f1f5f9',
    
    textPrimary: '#0f172a',
    textSecondary: '#334155',
    textMuted: '#64748b',
    
    primary: '#0ea5e9',
    primaryHover: '#0284c7',
    primaryLight: '#e0f2fe',
    
    accent: '#06b6d4',
    accentHover: '#0891b2',
    accentLight: '#cffafe',
    
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
    
    border: '#e2e8f0',
    borderLight: '#f1f5f9',
    surface: '#ffffff',
    surfaceHover: '#f8fafc',
    
    overlay: 'rgba(15, 23, 42, 0.8)',
    overlayLight: 'rgba(15, 23, 42, 0.1)',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  },
  gradients: {
    primary: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
    hero: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #bae6fd 100%)',
    surface: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
  }
};

const oceanDark: ThemeVariant = {
  ...oceanLight,
  name: 'Ocean Dark',
  mode: 'dark',
  colors: {
    background: '#0f172a',
    backgroundSecondary: '#1e293b',
    backgroundTertiary: '#334155',
    
    textPrimary: '#ffffff',        // Increased contrast: pure white
    textSecondary: '#e2e8f0',      // Increased contrast: lighter gray
    textMuted: '#cbd5e1',          // Increased contrast: moved up from #94a3b8
    
    primary: '#38bdf8',
    primaryHover: '#0ea5e9',
    primaryLight: '#1e293b',
    
    accent: '#22d3ee',
    accentHover: '#06b6d4',
    accentLight: '#164e63',
    
    success: '#34d399',
    warning: '#fbbf24',
    error: '#f87171',
    info: '#60a5fa',
    
    border: '#475569',
    borderLight: '#334155',
    surface: '#1e293b',
    surfaceHover: '#334155',
    
    overlay: 'rgba(0, 0, 0, 0.8)',
    overlayLight: 'rgba(0, 0, 0, 0.1)',
  },
  gradients: {
    primary: 'linear-gradient(135deg, #38bdf8 0%, #22d3ee 100%)',
    hero: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
    surface: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
  }
};

// Forest Theme
const forestLight: ThemeVariant = {
  name: 'Forest Light',
  palette: 'forest',
  mode: 'light',
  colors: {
    background: '#ffffff',
    backgroundSecondary: '#f0fdf4',
    backgroundTertiary: '#dcfce7',
    
    textPrimary: '#14532d',
    textSecondary: '#166534',
    textMuted: '#4ade80',
    
    primary: '#22c55e',
    primaryHover: '#16a34a',
    primaryLight: '#dcfce7',
    
    accent: '#10b981',
    accentHover: '#059669',
    accentLight: '#d1fae5',
    
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
    
    border: '#d1fae5',
    borderLight: '#f0fdf4',
    surface: '#ffffff',
    surfaceHover: '#f0fdf4',
    
    overlay: 'rgba(20, 83, 45, 0.8)',
    overlayLight: 'rgba(20, 83, 45, 0.1)',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(34, 197, 94, 0.05)',
    md: '0 4px 6px -1px rgba(34, 197, 94, 0.1)',
    lg: '0 10px 15px -3px rgba(34, 197, 94, 0.1)',
    xl: '0 25px 50px -12px rgba(34, 197, 94, 0.25)',
  },
  gradients: {
    primary: 'linear-gradient(135deg, #22c55e 0%, #10b981 100%)',
    hero: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%)',
    surface: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)',
  }
};

const forestDark: ThemeVariant = {
  ...forestLight,
  name: 'Forest Dark',
  mode: 'dark',
  colors: {
    background: '#14532d',
    backgroundSecondary: '#166534',
    backgroundTertiary: '#15803d',
    
    textPrimary: '#f0fdf4',
    textSecondary: '#dcfce7',
    textMuted: '#bbf7d0',
    
    primary: '#4ade80',
    primaryHover: '#22c55e',
    primaryLight: '#166534',
    
    accent: '#34d399',
    accentHover: '#10b981',
    accentLight: '#064e3b',
    
    success: '#34d399',
    warning: '#fbbf24',
    error: '#f87171',
    info: '#60a5fa',
    
    border: '#15803d',
    borderLight: '#166534',
    surface: '#166534',
    surfaceHover: '#15803d',
    
    overlay: 'rgba(0, 0, 0, 0.8)',
    overlayLight: 'rgba(0, 0, 0, 0.1)',
  },
  gradients: {
    primary: 'linear-gradient(135deg, #4ade80 0%, #34d399 100%)',
    hero: 'linear-gradient(135deg, #14532d 0%, #166534 50%, #15803d 100%)',
    surface: 'linear-gradient(135deg, #166534 0%, #15803d 100%)',
  }
};

// Sunset Theme
const sunsetLight: ThemeVariant = {
  name: 'Sunset Light',
  palette: 'sunset',
  mode: 'light',
  colors: {
    background: '#ffffff',
    backgroundSecondary: '#fff7ed',
    backgroundTertiary: '#ffedd5',
    
    textPrimary: '#9a3412',
    textSecondary: '#c2410c',
    textMuted: '#ea580c',
    
    primary: '#f97316',
    primaryHover: '#ea580c',
    primaryLight: '#ffedd5',
    
    accent: '#ef4444',
    accentHover: '#dc2626',
    accentLight: '#fee2e2',
    
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
    
    border: '#fed7aa',
    borderLight: '#fff7ed',
    surface: '#ffffff',
    surfaceHover: '#fff7ed',
    
    overlay: 'rgba(154, 52, 18, 0.8)',
    overlayLight: 'rgba(154, 52, 18, 0.1)',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(249, 115, 22, 0.05)',
    md: '0 4px 6px -1px rgba(249, 115, 22, 0.1)',
    lg: '0 10px 15px -3px rgba(249, 115, 22, 0.1)',
    xl: '0 25px 50px -12px rgba(249, 115, 22, 0.25)',
  },
  gradients: {
    primary: 'linear-gradient(135deg, #f97316 0%, #ef4444 100%)',
    hero: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 50%, #fed7aa 100%)',
    surface: 'linear-gradient(135deg, #ffffff 0%, #fff7ed 100%)',
  }
};

const sunsetDark: ThemeVariant = {
  ...sunsetLight,
  name: 'Sunset Dark',
  mode: 'dark',
  colors: {
    background: '#9a3412',
    backgroundSecondary: '#c2410c',
    backgroundTertiary: '#ea580c',
    
    textPrimary: '#fff7ed',
    textSecondary: '#ffedd5',
    textMuted: '#fed7aa',
    
    primary: '#fb923c',
    primaryHover: '#f97316',
    primaryLight: '#c2410c',
    
    accent: '#f87171',
    accentHover: '#ef4444',
    accentLight: '#7f1d1d',
    
    success: '#34d399',
    warning: '#fbbf24',
    error: '#f87171',
    info: '#60a5fa',
    
    border: '#ea580c',
    borderLight: '#c2410c',
    surface: '#c2410c',
    surfaceHover: '#ea580c',
    
    overlay: 'rgba(0, 0, 0, 0.8)',
    overlayLight: 'rgba(0, 0, 0, 0.1)',
  },
  gradients: {
    primary: 'linear-gradient(135deg, #fb923c 0%, #f87171 100%)',
    hero: 'linear-gradient(135deg, #9a3412 0%, #c2410c 50%, #ea580c 100%)',
    surface: 'linear-gradient(135deg, #c2410c 0%, #ea580c 100%)',
  }
};

// Lavender Theme
const lavenderLight: ThemeVariant = {
  name: 'Lavender Light',
  palette: 'lavender',
  mode: 'light',
  colors: {
    background: '#ffffff',
    backgroundSecondary: '#faf5ff',
    backgroundTertiary: '#f3e8ff',
    
    textPrimary: '#581c87',
    textSecondary: '#7c3aed',
    textMuted: '#8b5cf6',
    
    primary: '#a855f7',
    primaryHover: '#9333ea',
    primaryLight: '#f3e8ff',
    
    accent: '#ec4899',
    accentHover: '#db2777',
    accentLight: '#fce7f3',
    
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
    
    border: '#e9d5ff',
    borderLight: '#faf5ff',
    surface: '#ffffff',
    surfaceHover: '#faf5ff',
    
    overlay: 'rgba(88, 28, 135, 0.8)',
    overlayLight: 'rgba(88, 28, 135, 0.1)',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(168, 85, 247, 0.05)',
    md: '0 4px 6px -1px rgba(168, 85, 247, 0.1)',
    lg: '0 10px 15px -3px rgba(168, 85, 247, 0.1)',
    xl: '0 25px 50px -12px rgba(168, 85, 247, 0.25)',
  },
  gradients: {
    primary: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
    hero: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 50%, #e9d5ff 100%)',
    surface: 'linear-gradient(135deg, #ffffff 0%, #faf5ff 100%)',
  }
};

const lavenderDark: ThemeVariant = {
  ...lavenderLight,
  name: 'Lavender Dark',
  mode: 'dark',
  colors: {
    background: '#581c87',
    backgroundSecondary: '#7c3aed',
    backgroundTertiary: '#8b5cf6',
    
    textPrimary: '#faf5ff',
    textSecondary: '#f3e8ff',
    textMuted: '#e9d5ff',
    
    primary: '#c084fc',
    primaryHover: '#a855f7',
    primaryLight: '#7c3aed',
    
    accent: '#f472b6',
    accentHover: '#ec4899',
    accentLight: '#831843',
    
    success: '#34d399',
    warning: '#fbbf24',
    error: '#f87171',
    info: '#60a5fa',
    
    border: '#8b5cf6',
    borderLight: '#7c3aed',
    surface: '#7c3aed',
    surfaceHover: '#8b5cf6',
    
    overlay: 'rgba(0, 0, 0, 0.8)',
    overlayLight: 'rgba(0, 0, 0, 0.1)',
  },
  gradients: {
    primary: 'linear-gradient(135deg, #c084fc 0%, #f472b6 100%)',
    hero: 'linear-gradient(135deg, #581c87 0%, #7c3aed 50%, #8b5cf6 100%)',
    surface: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)',
  }
};

// Mono Theme
const monoLight: ThemeVariant = {
  name: 'Mono Light',
  palette: 'mono',
  mode: 'light',
  colors: {
    background: '#ffffff',
    backgroundSecondary: '#f8fafc',
    backgroundTertiary: '#f1f5f9',
    
    textPrimary: '#0f172a',
    textSecondary: '#334155',
    textMuted: '#64748b',
    
    primary: '#475569',
    primaryHover: '#334155',
    primaryLight: '#f1f5f9',
    
    accent: '#64748b',
    accentHover: '#475569',
    accentLight: '#f8fafc',
    
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
    
    border: '#e2e8f0',
    borderLight: '#f1f5f9',
    surface: '#ffffff',
    surfaceHover: '#f8fafc',
    
    overlay: 'rgba(15, 23, 42, 0.8)',
    overlayLight: 'rgba(15, 23, 42, 0.1)',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  },
  gradients: {
    primary: 'linear-gradient(135deg, #475569 0%, #64748b 100%)',
    hero: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)',
    surface: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
  }
};

const monoDark: ThemeVariant = {
  ...monoLight,
  name: 'Mono Dark',
  mode: 'dark',
  colors: {
    background: '#0f172a',
    backgroundSecondary: '#1e293b',
    backgroundTertiary: '#334155',
    
    textPrimary: '#f8fafc',
    textSecondary: '#cbd5e1',
    textMuted: '#94a3b8',
    
    primary: '#cbd5e1',
    primaryHover: '#f8fafc',
    primaryLight: '#334155',
    
    accent: '#94a3b8',
    accentHover: '#cbd5e1',
    accentLight: '#1e293b',
    
    success: '#34d399',
    warning: '#fbbf24',
    error: '#f87171',
    info: '#60a5fa',
    
    border: '#475569',
    borderLight: '#334155',
    surface: '#1e293b',
    surfaceHover: '#334155',
    
    overlay: 'rgba(0, 0, 0, 0.8)',
    overlayLight: 'rgba(0, 0, 0, 0.1)',
  },
  gradients: {
    primary: 'linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%)',
    hero: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
    surface: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
  }
};

// Export all themes
export const themeVariants: Record<string, ThemeVariant> = {
  'ocean-light': oceanLight,
  'ocean-dark': oceanDark,
  'forest-light': forestLight,
  'forest-dark': forestDark,
  'sunset-light': sunsetLight,
  'sunset-dark': sunsetDark,
  'lavender-light': lavenderLight,
  'lavender-dark': lavenderDark,
  'mono-light': monoLight,
  'mono-dark': monoDark,
};

export const defaultTheme = oceanLight;
