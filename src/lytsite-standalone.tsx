import React from 'react';
import ReactDOM from 'react-dom/client';
import UniversalFileTemplate from './components/universal-file-template';
import { themeVariants } from './styles/themes';
import './index.css';

// Initialize theme CSS variables on document.body
function initializeTheme() {
  const defaultTheme = themeVariants['ocean-light'];
  
  // Set CSS variables on document body for all theme colors
  Object.entries(defaultTheme.colors).forEach(([key, value]) => {
    document.body.style.setProperty(`--color-${key}`, value);
  });
  
  Object.entries(defaultTheme.shadows).forEach(([key, value]) => {
    document.body.style.setProperty(`--shadow-${key}`, value);
  });
  
  Object.entries(defaultTheme.gradients).forEach(([key, value]) => {
    document.body.style.setProperty(`--gradient-${key}`, value);
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
  
  // Apply theme class to body
  document.body.className = document.body.className.replace(/theme-\w+-\w+/g, '').concat(' theme-ocean-light').trim();
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

  // Transform data to match UniversalFileTemplate interface
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
    }
  };

  // Create React root and render
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <UniversalFileTemplate 
        data={templateData}
        onNavigate={() => {}} // No navigation needed in standalone mode
      />
    </React.StrictMode>
  );
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeLytsite);
} else {
  initializeLytsite();
}
