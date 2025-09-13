export type VisualStyle = 'professional' | 'creative' | 'nature' | 'minimal' | 'elegant';

export interface TypographyStyle {
  headingFont: string;
  bodyFont: string;
  headingWeight: string;
  bodyWeight: string;
  letterSpacing: string;
  lineHeight: string;
}

export interface SpacingStyle {
  componentPadding: string;
  sectionGap: string;
  elementGap: string;
  borderRadius: string;
}

export interface VisualEffects {
  shadowStyle: string;
  borderStyle: string;
  animationSpeed: string;
  hoverEffect: string;
}

export interface LayoutStyle {
  cardStyle: string;
  buttonStyle: string;
  layoutFlow: string;
}

export interface EnhancedThemeVariant {
  name: string;
  palette: string;
  mode: 'light' | 'dark';
  visualStyle: VisualStyle;
  colors: {
    background: string;
    backgroundSecondary: string;
    backgroundTertiary: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    primary: string;
    primaryHover: string;
    primaryLight: string;
    accent: string;
    accentHover: string;
    accentLight: string;
    success: string;
    warning: string;
    error: string;
    info: string;
    border: string;
    borderLight: string;
    surface: string;
    surfaceHover: string;
    overlay: string;
    overlayLight: string;
  };
  typography: TypographyStyle;
  spacing: SpacingStyle;
  effects: VisualEffects;
  layout: LayoutStyle;
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

// Professional Theme Package
const professionalLight: EnhancedThemeVariant = {
  name: 'Professional Light',
  palette: 'ocean',
  mode: 'light',
  visualStyle: 'professional',
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
  typography: {
    headingFont: 'Inter, system-ui, sans-serif',
    bodyFont: 'Inter, system-ui, sans-serif',
    headingWeight: '600',
    bodyWeight: '400',
    letterSpacing: '-0.025em',
    lineHeight: '1.5',
  },
  spacing: {
    componentPadding: '1rem',
    sectionGap: '2rem',
    elementGap: '0.75rem',
    borderRadius: '0.375rem',
  },
  effects: {
    shadowStyle: 'subtle',
    borderStyle: 'clean',
    animationSpeed: '150ms',
    hoverEffect: 'subtle',
  },
  layout: {
    cardStyle: 'clean',
    buttonStyle: 'solid',
    layoutFlow: 'structured',
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

const professionalDark: EnhancedThemeVariant = {
  ...professionalLight,
  name: 'Professional Dark',
  mode: 'dark',
  colors: {
    background: '#0f172a',
    backgroundSecondary: '#1e293b',
    backgroundTertiary: '#334155',
    textPrimary: '#ffffff',
    textSecondary: '#e2e8f0',
    textMuted: '#cbd5e1',
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

// Creative Theme Package
const creativeLight: EnhancedThemeVariant = {
  name: 'Creative Light',
  palette: 'sunset',
  mode: 'light',
  visualStyle: 'creative',
  colors: {
    background: '#ffffff',
    backgroundSecondary: '#fefefe',
    backgroundTertiary: '#fafafa',
    textPrimary: '#1a1a1a',
    textSecondary: '#4a4a4a',
    textMuted: '#6a6a6a',
    primary: '#f97316',
    primaryHover: '#ea580c',
    primaryLight: '#fff7ed',
    accent: '#ef4444',
    accentHover: '#dc2626',
    accentLight: '#fee2e2',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
    border: '#e5e5e5',
    borderLight: '#f5f5f5',
    surface: '#ffffff',
    surfaceHover: '#fafafa',
    overlay: 'rgba(26, 26, 26, 0.8)',
    overlayLight: 'rgba(26, 26, 26, 0.1)',
  },
  typography: {
    headingFont: 'Inter, system-ui, sans-serif',
    bodyFont: 'Inter, system-ui, sans-serif',
    headingWeight: '700',
    bodyWeight: '400',
    letterSpacing: '-0.01em',
    lineHeight: '1.6',
  },
  spacing: {
    componentPadding: '1.5rem',
    sectionGap: '3rem',
    elementGap: '1rem',
    borderRadius: '0.75rem',
  },
  effects: {
    shadowStyle: 'dramatic',
    borderStyle: 'rounded',
    animationSpeed: '200ms',
    hoverEffect: 'lift',
  },
  layout: {
    cardStyle: 'elevated',
    buttonStyle: 'gradient',
    layoutFlow: 'dynamic',
  },
  shadows: {
    sm: '0 2px 4px 0 rgba(249, 115, 22, 0.1)',
    md: '0 8px 12px -2px rgba(249, 115, 22, 0.15)',
    lg: '0 16px 24px -4px rgba(249, 115, 22, 0.15)',
    xl: '0 32px 64px -12px rgba(249, 115, 22, 0.25)',
  },
  gradients: {
    primary: 'linear-gradient(135deg, #f97316 0%, #ef4444 100%)',
    hero: 'linear-gradient(135deg, #ffffff 0%, #fefefe 50%, #fafafa 100%)',
    surface: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)',
  }
};

const creativeDark: EnhancedThemeVariant = {
  ...creativeLight,
  name: 'Creative Dark',
  mode: 'dark',
  colors: {
    background: '#1a1a1a',
    backgroundSecondary: '#2a2a2a',
    backgroundTertiary: '#3a3a3a',
    textPrimary: '#ffffff',
    textSecondary: '#e5e5e5',
    textMuted: '#a3a3a3',
    primary: '#f97316',
    primaryHover: '#fb923c',
    primaryLight: '#431407',
    accent: '#ef4444',
    accentHover: '#f87171',
    accentLight: '#450a0a',
    success: '#34d399',
    warning: '#fbbf24',
    error: '#f87171',
    info: '#60a5fa',
    border: '#404040',
    borderLight: '#333333',
    surface: '#2a2a2a',
    surfaceHover: '#3a3a3a',
    overlay: 'rgba(0, 0, 0, 0.8)',
    overlayLight: 'rgba(0, 0, 0, 0.1)',
  },
  gradients: {
    primary: 'linear-gradient(135deg, #f97316 0%, #ef4444 100%)',
    hero: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 50%, #3a3a3a 100%)',
    surface: 'linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 100%)',
  }
};

// Nature Theme Package
const natureLight: EnhancedThemeVariant = {
  name: 'Nature Light',
  palette: 'forest',
  mode: 'light',
  visualStyle: 'nature',
  colors: {
    background: '#ffffff',
    backgroundSecondary: '#fefefe',
    backgroundTertiary: '#fafafa',
    textPrimary: '#1a1a1a',
    textSecondary: '#4a4a4a',
    textMuted: '#6a6a6a',
    primary: '#22c55e',
    primaryHover: '#16a34a',
    primaryLight: '#f0fdf4',
    accent: '#10b981',
    accentHover: '#059669',
    accentLight: '#d1fae5',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
    border: '#e5e5e5',
    borderLight: '#f5f5f5',
    surface: '#ffffff',
    surfaceHover: '#fafafa',
    overlay: 'rgba(26, 26, 26, 0.8)',
    overlayLight: 'rgba(26, 26, 26, 0.1)',
  },
  typography: {
    headingFont: 'Inter, system-ui, sans-serif',
    bodyFont: 'Inter, system-ui, sans-serif',
    headingWeight: '500',
    bodyWeight: '400',
    letterSpacing: '0em',
    lineHeight: '1.7',
  },
  spacing: {
    componentPadding: '1.25rem',
    sectionGap: '2.5rem',
    elementGap: '1rem',
    borderRadius: '1rem',
  },
  effects: {
    shadowStyle: 'soft',
    borderStyle: 'organic',
    animationSpeed: '300ms',
    hoverEffect: 'glow',
  },
  layout: {
    cardStyle: 'organic',
    buttonStyle: 'soft',
    layoutFlow: 'flowing',
  },
  shadows: {
    sm: '0 2px 8px 0 rgba(34, 197, 94, 0.08)',
    md: '0 6px 16px -2px rgba(34, 197, 94, 0.12)',
    lg: '0 12px 24px -4px rgba(34, 197, 94, 0.12)',
    xl: '0 24px 48px -12px rgba(34, 197, 94, 0.2)',
  },
  gradients: {
    primary: 'linear-gradient(135deg, #22c55e 0%, #10b981 100%)',
    hero: 'linear-gradient(135deg, #ffffff 0%, #fefefe 50%, #fafafa 100%)',
    surface: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)',
  }
};

const natureDark: EnhancedThemeVariant = {
  ...natureLight,
  name: 'Nature Dark',
  mode: 'dark',
  colors: {
    background: '#1a1a1a',
    backgroundSecondary: '#2a2a2a',
    backgroundTertiary: '#3a3a3a',
    textPrimary: '#ffffff',
    textSecondary: '#e5e5e5',
    textMuted: '#a3a3a3',
    primary: '#22c55e',
    primaryHover: '#4ade80',
    primaryLight: '#14532d',
    accent: '#10b981',
    accentHover: '#34d399',
    accentLight: '#064e3b',
    success: '#34d399',
    warning: '#fbbf24',
    error: '#f87171',
    info: '#60a5fa',
    border: '#404040',
    borderLight: '#333333',
    surface: '#2a2a2a',
    surfaceHover: '#3a3a3a',
    overlay: 'rgba(0, 0, 0, 0.8)',
    overlayLight: 'rgba(0, 0, 0, 0.1)',
  },
  gradients: {
    primary: 'linear-gradient(135deg, #22c55e 0%, #10b981 100%)',
    hero: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 50%, #3a3a3a 100%)',
    surface: 'linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 100%)',
  }
};

// Minimal Theme Package
const minimalLight: EnhancedThemeVariant = {
  name: 'Minimal Light',
  palette: 'mono',
  mode: 'light',
  visualStyle: 'minimal',
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
  typography: {
    headingFont: 'Inter, system-ui, sans-serif',
    bodyFont: 'Inter, system-ui, sans-serif',
    headingWeight: '400',
    bodyWeight: '300',
    letterSpacing: '0em',
    lineHeight: '1.8',
  },
  spacing: {
    componentPadding: '2rem',
    sectionGap: '4rem',
    elementGap: '1.5rem',
    borderRadius: '0rem',
  },
  effects: {
    shadowStyle: 'none',
    borderStyle: 'minimal',
    animationSpeed: '100ms',
    hoverEffect: 'fade',
  },
  layout: {
    cardStyle: 'flat',
    buttonStyle: 'minimal',
    layoutFlow: 'spacious',
  },
  shadows: {
    sm: '0 0 0 0 transparent',
    md: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    lg: '0 2px 4px 0 rgba(0, 0, 0, 0.05)',
    xl: '0 4px 8px 0 rgba(0, 0, 0, 0.1)',
  },
  gradients: {
    primary: 'linear-gradient(135deg, #475569 0%, #64748b 100%)',
    hero: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)',
    surface: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
  }
};

const minimalDark: EnhancedThemeVariant = {
  ...minimalLight,
  name: 'Minimal Dark',
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

// Elegant Theme Package
const elegantLight: EnhancedThemeVariant = {
  name: 'Elegant Light',
  palette: 'lavender',
  mode: 'light',
  visualStyle: 'elegant',
  colors: {
    background: '#ffffff',
    backgroundSecondary: '#fefefe',
    backgroundTertiary: '#fafafa',
    textPrimary: '#1a1a1a',
    textSecondary: '#4a4a4a',
    textMuted: '#6a6a6a',
    primary: '#a855f7',
    primaryHover: '#9333ea',
    primaryLight: '#faf5ff',
    accent: '#ec4899',
    accentHover: '#db2777',
    accentLight: '#fce7f3',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
    border: '#e5e5e5',
    borderLight: '#f5f5f5',
    surface: '#ffffff',
    surfaceHover: '#fafafa',
    overlay: 'rgba(26, 26, 26, 0.8)',
    overlayLight: 'rgba(26, 26, 26, 0.1)',
  },
  typography: {
    headingFont: 'Inter, system-ui, sans-serif',
    bodyFont: 'Inter, system-ui, sans-serif',
    headingWeight: '600',
    bodyWeight: '400',
    letterSpacing: '0.01em',
    lineHeight: '1.6',
  },
  spacing: {
    componentPadding: '1.5rem',
    sectionGap: '3rem',
    elementGap: '1rem',
    borderRadius: '0.5rem',
  },
  effects: {
    shadowStyle: 'elegant',
    borderStyle: 'refined',
    animationSpeed: '250ms',
    hoverEffect: 'elegant',
  },
  layout: {
    cardStyle: 'elegant',
    buttonStyle: 'refined',
    layoutFlow: 'balanced',
  },
  shadows: {
    sm: '0 2px 4px 0 rgba(168, 85, 247, 0.08)',
    md: '0 6px 12px -2px rgba(168, 85, 247, 0.12)',
    lg: '0 12px 24px -4px rgba(168, 85, 247, 0.15)',
    xl: '0 24px 48px -12px rgba(168, 85, 247, 0.25)',
  },
  gradients: {
    primary: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
    hero: 'linear-gradient(135deg, #ffffff 0%, #fefefe 50%, #fafafa 100%)',
    surface: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)',
  }
};

const elegantDark: EnhancedThemeVariant = {
  ...elegantLight,
  name: 'Elegant Dark',
  mode: 'dark',
  colors: {
    background: '#1a1a1a',
    backgroundSecondary: '#2a2a2a',
    backgroundTertiary: '#3a3a3a',
    textPrimary: '#ffffff',
    textSecondary: '#e5e5e5',
    textMuted: '#a3a3a3',
    primary: '#a855f7',
    primaryHover: '#c084fc',
    primaryLight: '#581c87',
    accent: '#ec4899',
    accentHover: '#f472b6',
    accentLight: '#831843',
    success: '#34d399',
    warning: '#fbbf24',
    error: '#f87171',
    info: '#60a5fa',
    border: '#404040',
    borderLight: '#333333',
    surface: '#2a2a2a',
    surfaceHover: '#3a3a3a',
    overlay: 'rgba(0, 0, 0, 0.8)',
    overlayLight: 'rgba(0, 0, 0, 0.1)',
  },
  gradients: {
    primary: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
    hero: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 50%, #3a3a3a 100%)',
    surface: 'linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 100%)',
  }
};

// Export all enhanced themes
export const enhancedThemeVariants: Record<string, EnhancedThemeVariant> = {
  'professional-light': professionalLight,
  'professional-dark': professionalDark,
  'creative-light': creativeLight,
  'creative-dark': creativeDark,
  'nature-light': natureLight,
  'nature-dark': natureDark,
  'minimal-light': minimalLight,
  'minimal-dark': minimalDark,
  'elegant-light': elegantLight,
  'elegant-dark': elegantDark,
};

export const defaultEnhancedTheme = professionalLight;

// Helper function to get visual style themes
export const getVisualStyleThemes = () => {
  return {
    professional: {
      light: professionalLight,
      dark: professionalDark,
      icon: '📊',
      description: 'Clean, structured, business-focused'
    },
    creative: {
      light: creativeLight,
      dark: creativeDark,
      icon: '🎨',
      description: 'Dynamic, expressive, artistic'
    },
    nature: {
      light: natureLight,
      dark: natureDark,
      icon: '🌲',
      description: 'Organic, natural, calming'
    },
    minimal: {
      light: minimalLight,
      dark: minimalDark,
      icon: '⚫',
      description: 'Ultra-clean, spacious, focused'
    },
    elegant: {
      light: elegantLight,
      dark: elegantDark,
      icon: '💜',
      description: 'Sophisticated, refined, luxurious'
    }
  };
};