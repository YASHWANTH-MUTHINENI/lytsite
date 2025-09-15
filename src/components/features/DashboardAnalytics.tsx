import React, { useState, useEffect } from 'react';
import { BarChart3, Eye, Download, Heart, MessageCircle, CheckCircle, XCircle } from 'lucide-react';

interface DashboardAnalyticsProps {
  projectId: string;
  fileId?: string; // Optional - for file-specific analytics
  className?: string;
}

interface DetailedAnalytics {
  views: number;
  downloads: number;
  favorites: number;
  comments: number;
  approvals: {
    approved: number;
    rejected: number;
    pending: number;
  };
  recentActivity: Array<{
    type: 'view' | 'download' | 'favorite' | 'comment' | 'approval';
    timestamp: string;
    userSession: string;
    details?: string;
  }>;
}

export function DashboardAnalytics({ projectId, fileId, className = '' }: DashboardAnalyticsProps) {
  const [analytics, setAnalytics] = useState<DetailedAnalytics>({
    views: 0,
    downloads: 0,
    favorites: 0,
    comments: 0,
    approvals: {
      approved: 0,
      rejected: 0,
      pending: 0
    },
    recentActivity: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDetailedAnalytics();
  }, [projectId, fileId]);

  const loadDetailedAnalytics = async () => {
    try {
      const url = fileId 
        ? `/api/advanced/analytics?projectId=${projectId}&fileId=${fileId}&detailed=true`
        : `/api/advanced/analytics?projectId=${projectId}&detailed=true`;
        
      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data.analytics || {
          views: 0,
          downloads: 0,
          favorites: 0,
          comments: 0,
          approvals: { approved: 0, rejected: 0, pending: 0 },
          recentActivity: []
        });
      }
    } catch (error) {
      console.error('Failed to load detailed analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className={`animate-pulse bg-gray-100 rounded-lg p-6 ${className}`}>
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border shadow-sm p-6 ${className}`}>
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          {fileId ? 'File Analytics' : 'Project Analytics'}
        </h3>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Eye className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Views</span>
          </div>
          <div className="text-2xl font-bold text-blue-900">{analytics.views}</div>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Download className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-900">Downloads</span>
          </div>
          <div className="text-2xl font-bold text-green-900">{analytics.downloads}</div>
        </div>

        <div className="bg-red-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="w-4 h-4 text-red-600" />
            <span className="text-sm font-medium text-red-900">Favorites</span>
          </div>
          <div className="text-2xl font-bold text-red-900">{analytics.favorites}</div>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <MessageCircle className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-900">Comments</span>
          </div>
          <div className="text-2xl font-bold text-purple-900">{analytics.comments}</div>
        </div>
      </div>

      {/* Approval Status */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Approval Status</h4>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <div>
              <div className="text-lg font-semibold text-gray-900">{analytics.approvals.approved}</div>
              <div className="text-xs text-gray-500">Approved</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <XCircle className="w-4 h-4 text-red-600" />
            <div>
              <div className="text-lg font-semibold text-gray-900">{analytics.approvals.rejected}</div>
              <div className="text-xs text-gray-500">Changes Requested</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-yellow-400"></div>
            <div>
              <div className="text-lg font-semibold text-gray-900">{analytics.approvals.pending}</div>
              <div className="text-xs text-gray-500">Pending</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      {analytics.recentActivity.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Recent Activity</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {analytics.recentActivity.slice(0, 10).map((activity, index) => (
              <div key={index} className="flex items-center gap-3 text-sm">
                <div className="flex-shrink-0">
                  {activity.type === 'view' && <Eye className="w-4 h-4 text-blue-500" />}
                  {activity.type === 'download' && <Download className="w-4 h-4 text-green-500" />}
                  {activity.type === 'favorite' && <Heart className="w-4 h-4 text-red-500" />}
                  {activity.type === 'comment' && <MessageCircle className="w-4 h-4 text-purple-500" />}
                  {activity.type === 'approval' && <CheckCircle className="w-4 h-4 text-orange-500" />}
                </div>
                <div className="flex-1">
                  <span className="capitalize">{activity.type}</span>
                  {activity.details && <span className="text-gray-500"> - {activity.details}</span>}
                </div>
                <div className="text-gray-400 text-xs">
                  {new Date(activity.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}