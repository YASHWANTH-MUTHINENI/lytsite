import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  MessageCircle, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye, 
  Download, 
  Users, 
  Calendar,
  FileText,
  TrendingUp,
  ArrowLeft
} from 'lucide-react';

interface ProjectDetails {
  id: string;
  title: string;
  slug: string;
  description?: string;
  created_at: string;
  settings: {
    enable_favorites: boolean;
    enable_comments: boolean;
    enable_approvals: boolean;
    enable_analytics: boolean;
    enable_notifications: boolean;
  };
  files: FileDetails[];
  totals: ProjectTotals;
}

interface FileDetails {
  id: string;
  name: string;
  type: string;
  url?: string;
  thumbnailUrl?: string;
  uploadedAt: string;
  favorites: FavoriteDetails[];
  comments: CommentDetails[];
  approvals: ApprovalDetails[];
  analytics: FileAnalytics;
}

interface FavoriteDetails {
  id: string;
  userEmail: string;
  userName?: string;
  createdAt: string;
}

interface CommentDetails {
  id: string;
  userEmail: string;
  userName?: string;
  commentText: string;
  createdAt: string;
  replies?: CommentDetails[];
}

interface ApprovalDetails {
  id: string;
  userEmail: string;
  userName?: string;
  status: 'approved' | 'rejected' | 'pending';
  notes?: string;
  createdAt: string;
}

interface FileAnalytics {
  views: number;
  downloads: number;
  uniqueVisitors: number;
}

interface ProjectTotals {
  totalFiles: number;
  totalFavorites: number;
  totalComments: number;
  totalApprovals: {
    approved: number;
    rejected: number;
    pending: number;
  };
  totalViews: number;
  totalDownloads: number;
  uniqueUsers: number;
}

interface ComprehensiveProjectDashboardProps {
  projectId: string;
  onBack?: () => void;
  className?: string;
}

export function ComprehensiveProjectDashboard({ 
  projectId, 
  onBack, 
  className = '' 
}: ComprehensiveProjectDashboardProps) {
  const [projectDetails, setProjectDetails] = useState<ProjectDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'files' | 'engagement'>('overview');

  useEffect(() => {
    loadProjectDetails();
  }, [projectId]);

  const loadProjectDetails = async () => {
    try {
      console.log('📊 Loading comprehensive project details for:', projectId);
      
      const response = await fetch(`https://lytsite-backend.yashwanthvarmamuthineni.workers.dev/api/projects/${projectId}/details`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Project details loaded:', data);
        setProjectDetails(data.project);
      } else {
        console.error('❌ Failed to load project details:', response.status);
      }
    } catch (error) {
      console.error('💥 Error loading project details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-gray-100 rounded-lg h-32"></div>
          ))}
        </div>
        <div className="bg-gray-100 rounded-lg h-96"></div>
      </div>
    );
  }

  if (!projectDetails) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">Failed to load project details</p>
        {onBack && (
          <button
            onClick={onBack}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        {onBack && (
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">{projectDetails.title}</h1>
          {projectDetails.description && (
            <p className="text-gray-600 mt-1">{projectDetails.description}</p>
          )}
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              Created {formatDate(projectDetails.created_at)}
            </span>
            <span className="flex items-center gap-1">
              <FileText className="w-4 h-4" />
              {projectDetails.totals.totalFiles} files
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {projectDetails.totals.uniqueUsers} unique users
            </span>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="w-5 h-5 text-red-600" />
            <span className="font-medium text-red-900">Favorites</span>
          </div>
          <div className="text-2xl font-bold text-red-900">{projectDetails.totals.totalFavorites}</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <MessageCircle className="w-5 h-5 text-purple-600" />
            <span className="font-medium text-purple-900">Comments</span>
          </div>
          <div className="text-2xl font-bold text-purple-900">{projectDetails.totals.totalComments}</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="font-medium text-green-900">Approved</span>
          </div>
          <div className="text-2xl font-bold text-green-900">{projectDetails.totals.totalApprovals.approved}</div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Eye className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-blue-900">Views</span>
          </div>
          <div className="text-2xl font-bold text-blue-900">{projectDetails.totals.totalViews}</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'overview', label: 'Overview', icon: TrendingUp },
            { key: 'files', label: 'Files', icon: FileText },
            { key: 'engagement', label: 'Engagement', icon: Users }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="py-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Approval Status */}
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Approval Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-green-900 font-medium">Approved</span>
                  </div>
                  <span className="text-2xl font-bold text-green-900">
                    {projectDetails.totals.totalApprovals.approved}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-red-600" />
                    <span className="text-red-900 font-medium">Changes Requested</span>
                  </div>
                  <span className="text-2xl font-bold text-red-900">
                    {projectDetails.totals.totalApprovals.rejected}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-yellow-600" />
                    <span className="text-yellow-900 font-medium">Pending</span>
                  </div>
                  <span className="text-2xl font-bold text-yellow-900">
                    {projectDetails.totals.totalApprovals.pending}
                  </span>
                </div>
              </div>
            </div>

            {/* Analytics Summary */}
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Analytics Summary</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-700">Total Views</span>
                  </div>
                  <span className="text-xl font-bold text-gray-900">{projectDetails.totals.totalViews}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Download className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">Total Downloads</span>
                  </div>
                  <span className="text-xl font-bold text-gray-900">{projectDetails.totals.totalDownloads}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-600" />
                    <span className="text-gray-700">Unique Users</span>
                  </div>
                  <span className="text-xl font-bold text-gray-900">{projectDetails.totals.uniqueUsers}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'files' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">File Details</h3>
            <div className="grid gap-4">
              {projectDetails.files.map((file) => (
                <div key={file.id} className="bg-white border rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{file.name}</h4>
                      <p className="text-sm text-gray-500">
                        Uploaded {formatDate(file.uploadedAt)} • {file.type}
                      </p>
                    </div>
                    {file.thumbnailUrl && (
                      <img 
                        src={file.thumbnailUrl} 
                        alt={file.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">{file.favorites.length}</div>
                      <div className="text-xs text-gray-500">Favorites</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{file.comments.length}</div>
                      <div className="text-xs text-gray-500">Comments</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{file.approvals.filter(a => a.status === 'approved').length}</div>
                      <div className="text-xs text-gray-500">Approved</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{file.analytics.views}</div>
                      <div className="text-xs text-gray-500">Views</div>
                    </div>
                  </div>

                  {/* File-specific engagement details */}
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex gap-4 text-sm">
                      {file.favorites.length > 0 && (
                        <button
                          onClick={() => setSelectedFile(selectedFile === file.id ? null : file.id)}
                          className="flex items-center gap-1 text-red-600 hover:text-red-700"
                        >
                          <Heart className="w-4 h-4" />
                          View Favorites
                        </button>
                      )}
                      
                      {file.comments.length > 0 && (
                        <button
                          onClick={() => setSelectedFile(selectedFile === file.id ? null : file.id)}
                          className="flex items-center gap-1 text-purple-600 hover:text-purple-700"
                        >
                          <MessageCircle className="w-4 h-4" />
                          View Comments
                        </button>
                      )}
                    </div>

                    {/* Expanded details for selected file */}
                    {selectedFile === file.id && (
                      <div className="mt-4 space-y-4">
                        {/* Favorites */}
                        {file.favorites.length > 0 && (
                          <div>
                            <h5 className="font-medium text-gray-900 mb-2">Favorites</h5>
                            <div className="space-y-2 max-h-32 overflow-y-auto">
                              {file.favorites.map((favorite) => (
                                <div key={favorite.id} className="flex items-center justify-between text-sm bg-gray-50 rounded p-2">
                                  <span className="text-gray-700">
                                    {favorite.userName || `User ${favorite.userEmail.slice(-4)}`}
                                  </span>
                                  <span className="text-gray-500">
                                    {formatDateTime(favorite.createdAt)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Comments */}
                        {file.comments.length > 0 && (
                          <div>
                            <h5 className="font-medium text-gray-900 mb-2">Comments</h5>
                            <div className="space-y-3 max-h-48 overflow-y-auto">
                              {file.comments.map((comment) => (
                                <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="font-medium text-sm text-gray-900">
                                      {comment.userName || `User ${comment.userEmail.slice(-4)}`}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      {formatDateTime(comment.createdAt)}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-700">{comment.commentText}</p>
                                  {comment.replies && comment.replies.length > 0 && (
                                    <div className="ml-4 mt-2 space-y-2">
                                      {comment.replies.map((reply) => (
                                        <div key={reply.id} className="bg-white rounded p-2">
                                          <div className="flex items-center justify-between mb-1">
                                            <span className="font-medium text-xs text-gray-800">
                                              {reply.userName || `User ${reply.userEmail.slice(-4)}`}
                                            </span>
                                            <span className="text-xs text-gray-400">
                                              {formatDateTime(reply.createdAt)}
                                            </span>
                                          </div>
                                          <p className="text-xs text-gray-600">{reply.commentText}</p>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'engagement' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Files by Engagement */}
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Engaged Files</h3>
              <div className="space-y-3">
                {projectDetails.files
                  .sort((a, b) => {
                    const aEngagement = a.favorites.length + a.comments.length + a.analytics.views;
                    const bEngagement = b.favorites.length + b.comments.length + b.analytics.views;
                    return bEngagement - aEngagement;
                  })
                  .slice(0, 5)
                  .map((file, index) => {
                    const engagement = file.favorites.length + file.comments.length + file.analytics.views;
                    return (
                      <div key={file.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                          <p className="text-xs text-gray-500">
                            {engagement} total interactions
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="flex items-center gap-1 text-red-600">
                            <Heart className="w-3 h-3" />
                            {file.favorites.length}
                          </span>
                          <span className="flex items-center gap-1 text-purple-600">
                            <MessageCircle className="w-3 h-3" />
                            {file.comments.length}
                          </span>
                          <span className="flex items-center gap-1 text-blue-600">
                            <Eye className="w-3 h-3" />
                            {file.analytics.views}
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">User Engagement</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Active Users (with interactions)</span>
                  <span className="font-semibold text-gray-900">{projectDetails.totals.uniqueUsers}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Avg. Interactions per File</span>
                  <span className="font-semibold text-gray-900">
                    {(projectDetails.totals.totalFavorites + projectDetails.totals.totalComments) / projectDetails.totals.totalFiles || 0}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Conversion Rate (Views → Favorites)</span>
                  <span className="font-semibold text-gray-900">
                    {projectDetails.totals.totalViews > 0 
                      ? Math.round((projectDetails.totals.totalFavorites / projectDetails.totals.totalViews) * 100)
                      : 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}