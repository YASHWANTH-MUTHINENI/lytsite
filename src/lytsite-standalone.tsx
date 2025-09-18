import React from 'react';
import ReactDOM from 'react-dom/client';
import UniversalFileTemplate from './components/universal-file-template';
// Removed ClientDelivery import to prevent inclusion in bundle
import { EnhancedThemeProvider } from './contexts/EnhancedThemeContext';
import { enhancedThemeVariants } from './styles/enhanced-themes';
import './index.css';

// Initialize theme CSS variables on document.body
function initializeTheme() {
  const defaultTheme = enhancedThemeVariants['professional-light'];
  
  // Set CSS variables on document body for all theme colors
  Object.entries(defaultTheme.colors).forEach(([key, value]) => {
    document.body.style.setProperty(`--color-${key}`, value as string);
  });
  
  Object.entries(defaultTheme.shadows).forEach(([key, value]) => {
    document.body.style.setProperty(`--shadow-${key}`, value as string);
  });
  
  Object.entries(defaultTheme.gradients).forEach(([key, value]) => {
    document.body.style.setProperty(`--gradient-${key}`, value as string);
  });
  
  // Also set the CSS custom properties that components might be using directly
  document.body.style.setProperty('--background', defaultTheme.colors.background);
  document.body.style.setProperty('--foreground', defaultTheme.colors.textPrimary);
  document.body.style.setProperty('--primary', defaultTheme.colors.primary);
  document.body.style.setProperty('--primary-foreground', defaultTheme.colors.surface);
  document.body.style.setProperty('--secondary', defaultTheme.colors.backgroundSecondary);
  document.body.style.setProperty('--border', defaultTheme.colors.border);
  document.body.style.setProperty('--input', 'transparent');
  document.body.style.setProperty('--ring', defaultTheme.colors.primary);
  
  // Apply enhanced theme class to body
  document.body.className = document.body.className.replace(/enhanced-theme-\w+-\w+/g, '').concat(' enhanced-theme-professional-light').trim();
}

// Wait for DOM and data to be ready
function initializeLytsite() {
  const rootElement = document.getElementById('root');
  const data = (window as any).LYTSITE_DATA;
  
  if (!rootElement || !data) {
    console.error('Lytsite: Missing root element or data');
    return;
  }
  
  // Initialize theme before rendering
  initializeTheme();

  // Transform data to match template interface
  const templateData = {
    title: data.title,
    subLine: data.subLine,
    tagLine: data.tagLine,
    heroImage: data.heroImage || null,
    files: data.files,
    contactInfo: {
      email: "",
      website: "https://lytsite.com",
      linkedin: ""
    },
    // ✅ ADD THE MISSING PROPERTIES FOR INSTAGRAM FEATURES
    slug: data.slug,
    settings: data.settings
  };

  // Always render UniversalFileTemplate for standalone builds
  const renderTemplate = () => <UniversalFileTemplate data={templateData} />;

  // Create React root and render
  const root = ReactDOM.createRoot(rootElement);
  
  root.render(
    <React.StrictMode>
      <EnhancedThemeProvider defaultThemeKey="professional-light">
        {renderTemplate()}
      </EnhancedThemeProvider>
    </React.StrictMode>
  );
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeLytsite);
} else {
  initializeLytsite();
}
