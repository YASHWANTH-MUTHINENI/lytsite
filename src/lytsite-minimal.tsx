import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// Minimal mock data for testing
const mockData = {
  title: "Sample Files",
  subLine: "File sharing made simple",
  tagLine: "Shared via Lytsite",
  heroImage: null,
  files: [
    {
      name: "sample.pdf",
      size: "2.5 MB",
      type: "application/pdf",
      url: "#",
      description: "Sample PDF file"
    }
  ],
  contactInfo: {
    email: "",
    website: "https://lytsite.com",
    linkedin: ""
  }
};

// Ultra-minimal template component without any external dependencies
function MinimalTemplate({ data }: { data: any }) {
  const templateData = data || mockData;
  
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-2xl font-bold text-gray-900">{templateData.title}</h1>
          <p className="text-gray-600">{templateData.subLine}</p>
        </div>
      </header>
      
      {/* Files */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-4">
          {templateData.files.map((file: any, index: number) => (
            <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">{file.name}</h3>
                <p className="text-sm text-gray-500">{file.size}</p>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Download
              </button>
            </div>
          ))}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-gray-200 py-4 mt-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-500">
            Powered by <span className="font-semibold text-blue-600">Lytsite</span>
          </p>
        </div>
      </footer>
    </div>
  );
}

// Initialize when DOM is ready
function initializeLytsite() {
  const rootElement = document.getElementById('root');
  const data = (window as any).LYTSITE_DATA;
  
  if (!rootElement) {
    console.error('Lytsite: Missing root element');
    return;
  }
  
  const root = ReactDOM.createRoot(rootElement);
  
  root.render(
    <React.StrictMode>
      <MinimalTemplate data={data} />
    </React.StrictMode>
  );
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeLytsite);
} else {
  initializeLytsite();
}