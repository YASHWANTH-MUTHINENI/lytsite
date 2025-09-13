import React from "react";

import UniversalFileTemplate from './universal-file-template';

// Test data that matches what our backend returns
const backendTestData = {
  title: "My Project Files",
  subLine: "Shared via Lytsite",
  tagLine: "By John Doe",
  files: [
    {
      name: "presentation.pdf",
      size: "2.4 MB",
      type: "application/pdf",
      url: "https://example.com/presentation.pdf",
      thumbnailUrl: undefined,
      uploadedAt: "2025-09-08T12:00:00.000Z",
      uploadedBy: "John Doe",
      description: "presentation.pdf - 2.4 MB"
    },
    {
      name: "chart.png",
      size: "1.2 MB",
      type: "image/png",
      url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
      thumbnailUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
      uploadedAt: "2025-09-08T12:00:00.000Z",
      uploadedBy: "John Doe",
      description: "chart.png - 1.2 MB"
    },
    {
      name: "data.xlsx",
      size: "0.8 MB",
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      url: "https://example.com/data.xlsx",
      thumbnailUrl: undefined,
      uploadedAt: "2025-09-08T12:00:00.000Z",
      uploadedBy: "John Doe",
      description: "data.xlsx - 0.8 MB"
    }
  ],
  views: 42,
  createdAt: "2025-09-08T12:00:00.000Z",
  slug: "abc123de",
};

// Test component that simulates consuming backend data


export default function BackendDataTest() {
  
  // Transform backend data to match the universal template's expected format
  const templateData = {
    title: backendTestData.title,
    subLine: backendTestData.subLine,
    tagLine: backendTestData.tagLine,
    heroImage: null, // Backend doesn't provide hero image yet
    files: backendTestData.files,
    contactInfo: {
      email: "",
      website: "https://lytsite.com",
      linkedin: ""
    }
  };

  console.log('Backend data structure:', backendTestData);
  console.log('Template data structure:', templateData);

  return (
    <div>
      <div style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        background: '#1f2937', 
        color: 'white', 
        padding: '0.5rem 1rem', 
        fontSize: '0.875rem',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div>
          Backend Data Test: {backendTestData.files.length} files • {backendTestData.views} views • {backendTestData.slug}
        </div>
        <button 
          onClick={() => window.location.href = '/'}
          style={{ 
            background: '#3b82f6', 
            color: 'white', 
            padding: '0.25rem 0.75rem', 
            borderRadius: '0.375rem', 
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.875rem'
          }}
        >
          ← Back to Home
        </button>
      </div>
      
      <div style={{ marginTop: '3rem' }}>
        <UniversalFileTemplate 
          data={templateData} 
        />
      </div>
    </div>
  );
}
