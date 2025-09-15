import React, { useState, useEffect } from 'react';
import { BarChart3, Eye, Download } from 'lucide-react';

interface AnalyticsDisplayProps {
  projectId: string;
  fileId: string;
  className?: string;
}

interface Analytics {
  views: number;
  downloads: number;
  favorites: number;
  comments: number;
}

export function AnalyticsDisplay({ projectId, fileId, className = '' }: AnalyticsDisplayProps) {
  const [analytics, setAnalytics] = useState<Analytics>({
    views: 0,
    downloads: 0,
    favorites: 0,
    comments: 0
  });
  const [isExpanded, setIsExpanded] = useState(false);

  // Load analytics on component mount
  useEffect(() => {
    loadAnalytics();
    
    // Track view event
    trackEvent('view');
  }, [projectId, fileId]);

  const loadAnalytics = async () => {
    try {
      const response = await fetch(`/api/analytics?projectId=${projectId}&fileId=${fileId}`);
      
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data.analytics || {
          views: 0,
          downloads: 0,
          favorites: 0,
          comments: 0
        });
      }
    } catch (error) {
      console.error('Failed to load analytics:', error);
    }
  };

  const trackEvent = async (eventType: 'view' | 'download' | 'favorite' | 'comment') => {
    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId,
          fileId,
          eventType,
          userSessionId: getUserSessionId(),
          timestamp: new Date().toISOString()
        })
      });
      
      // Reload analytics after tracking
      if (eventType === 'download') {
        setTimeout(loadAnalytics, 100);
      }
    } catch (error) {
      console.error('Failed to track event:', error);
    }
  };

  const getUserSessionId = () => {
    let sessionId = localStorage.getItem('lytsite_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('lytsite_session_id', sessionId);
    }
    return sessionId;
  };

  // Make trackEvent available globally for download buttons
  useEffect(() => {
    (window as any).trackDownload = () => trackEvent('download');
  }, [projectId, fileId]);

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className={`flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors ${className}`}
      >
        <BarChart3 className="w-4 h-4" />
        <span className="text-sm">Analytics</span>
      </button>
    );
  }

  return (
    <div className={`bg-gray-50 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-gray-900 flex items-center gap-2">
          <BarChart3 className="w-4 h-4" />
          File Analytics
        </h3>
        <button
          onClick={() => setIsExpanded(false)}
          className="text-gray-500 hover:text-gray-700 text-sm"
        >
          Collapse
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-blue-600" />
          <div>
            <div className="text-lg font-semibold text-gray-900">{analytics.views}</div>
            <div className="text-xs text-gray-500">Views</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Download className="w-4 h-4 text-green-600" />
          <div>
            <div className="text-lg font-semibold text-gray-900">{analytics.downloads}</div>
            <div className="text-xs text-gray-500">Downloads</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-4 h-4 text-red-600">♥</div>
          <div>
            <div className="text-lg font-semibold text-gray-900">{analytics.favorites}</div>
            <div className="text-xs text-gray-500">Favorites</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-4 h-4 text-purple-600">💬</div>
          <div>
            <div className="text-lg font-semibold text-gray-900">{analytics.comments}</div>
            <div className="text-xs text-gray-500">Comments</div>
          </div>
        </div>
      </div>
    </div>
  );
}