import React from 'react';
import ReactDOM from 'react-dom/client';

// Ultra-minimal standalone template without ANY imports from our component library
function MinimalLytsiteTemplate() {
  // Get data from window
  const data = (window as any).LYTSITE_DATA || {};
  
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8fafc', 
      padding: '2rem',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ maxWidth: '64rem', margin: '0 auto' }}>
        {/* Header */}
        <header style={{ marginBottom: '2rem' }}>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: 'bold', 
            color: '#1e293b',
            marginBottom: '0.5rem'
          }}>
            {data.title || 'Shared Files'}
          </h1>
          <p style={{ color: '#64748b' }}>
            {data.subLine || 'Files shared via Lytsite'}
          </p>
        </header>

        {/* Files */}
        <main>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {data.files?.map((file: any, index: number) => (
              <div 
                key={index}
                style={{
                  backgroundColor: 'white',
                  padding: '1.5rem',
                  borderRadius: '0.5rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  border: '1px solid #e2e8f0'
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center' 
                }}>
                  <div>
                    <h3 style={{ 
                      fontWeight: '600', 
                      color: '#1e293b',
                      marginBottom: '0.25rem'
                    }}>
                      {file.name}
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
                      {file.size}
                    </p>
                  </div>
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      padding: '0.5rem 1rem',
                      borderRadius: '0.375rem',
                      textDecoration: 'none',
                      fontSize: '0.875rem',
                      fontWeight: '500'
                    }}
                    onMouseOver={(e) => {
                      (e.target as HTMLElement).style.backgroundColor = '#2563eb';
                    }}
                    onMouseOut={(e) => {
                      (e.target as HTMLElement).style.backgroundColor = '#3b82f6';
                    }}
                  >
                    Download
                  </a>
                </div>
              </div>
            )) || (
              <div style={{
                backgroundColor: 'white',
                padding: '3rem',
                borderRadius: '0.5rem',
                textAlign: 'center',
                color: '#64748b'
              }}>
                No files available
              </div>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer style={{ 
          marginTop: '3rem', 
          paddingTop: '1.5rem',
          borderTop: '1px solid #e2e8f0',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
            Powered by <span style={{ color: '#3b82f6', fontWeight: '600' }}>Lytsite</span>
          </p>
        </footer>
      </div>
    </div>
  );
}

// Initialize when DOM is ready
function initializeLytsite() {
  const rootElement = document.getElementById('root');
  
  if (!rootElement) {
    console.error('Lytsite: Missing root element');
    return;
  }
  
  const root = ReactDOM.createRoot(rootElement);
  
  root.render(
    <React.StrictMode>
      <MinimalLytsiteTemplate />
    </React.StrictMode>
  );
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeLytsite);
} else {
  initializeLytsite();
}