import React from 'react';
import ReactDOM from 'react-dom/client';
import UniversalFileTemplate from './components/universal-file-template';
import './index.css';

// Wait for DOM and data to be ready
function initializeLytsite() {
  const rootElement = document.getElementById('root');
  const data = (window as any).LYTSITE_DATA;
  
  if (!rootElement || !data) {
    console.error('Lytsite: Missing root element or data');
    return;
  }

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
