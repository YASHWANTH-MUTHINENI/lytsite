import React, { useState, useEffect } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { DashboardAnalytics } from './features/DashboardAnalytics';
import { ComprehensiveProjectDashboard } from './features/ComprehensiveProjectDashboard';
import { ProjectClaimBanner } from './auth/ProjectClaimBanner';
import { Heart, MessageCircle, CheckCircle, Plus, Upload, Calendar, Users, BarChart3, TrendingUp, FileText } from 'lucide-react';

// Use the same API base as other working components
const API_BASE = process.env.NODE_ENV === 'production' 
  ? 'https://lytsite-backend.yashwanthvarmamuthineni.workers.dev' 
  : 'https://lytsite-backend.yashwanthvarmamuthineni.workers.dev';

interface DashboardProps {
  className?: string;
}

interface Creator {
  id: string;
  clerk_user_id: string;
  email: string;
  name?: string;
  avatar_url?: string;
}

interface ProjectSummary {
  id: string;
  title: string;
  slug: string;
  description?: string;
  created_at: string;
  updated_at: string;
  settings: {
    enable_favorites: boolean;
    enable_comments: boolean;
    enable_approvals: boolean;
    enable_analytics: boolean;
    enable_notifications: boolean;
  };
  // Analytics counts (will be fetched separately)
  favorites_count?: number;
  comments_count?: number;
  approvals_count?: number;
  views_count?: number;
}

export function CreatorDashboard({ className = '' }: DashboardProps) {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const [creator, setCreator] = useState<Creator | null>(null);
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [showDetailedDashboard, setShowDetailedDashboard] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize creator when user loads
  useEffect(() => {
    if (isLoaded && user) {
      initializeCreator();
    }
  }, [isLoaded, user]);

  // Load projects when creator is set
  useEffect(() => {
    if (creator) {
      loadProjects();
    }
  }, [creator]);

  // Initialize creator account - sync with backend
  const initializeCreator = async () => {
    if (!user) return;

    try {
      console.log('🔍 Initializing creator for user:', user.id);
      const creatorData = {
        clerk_user_id: user.id,
        email: user.primaryEmailAddress?.emailAddress || '',
        name: user.fullName || user.firstName || '',
        avatar_url: user.imageUrl || undefined,
      };

      console.log('📤 Creating creator with data:', creatorData);
      const response = await fetch(`${API_BASE}/api/creators/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(creatorData),
      });

      console.log('📥 Creator sync response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Creator initialized:', data.creator);
        setCreator(data.creator);
      } else {
        console.error('❌ Creator sync failed:', response.status, await response.text());
      }
    } catch (error) {
      console.error('💥 Failed to initialize creator:', error);
    }
  };

  const loadProjects = async () => {
    if (!creator) return;

    try {
      console.log('📋 Loading projects for creator:', creator.id);
      
      // Get authentication token
      const token = await getToken();
      console.log('🔑 Token retrieved:', token ? 'Yes (length: ' + token.length + ')' : 'No');
      
      if (!token) {
        console.error('❌ No authentication token available');
        return;
      }
      
      console.log('🔑 Token preview:', token.substring(0, 20) + '...');
      
      const response = await fetch(`${API_BASE}/api/creators/projects/${creator.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      console.log('📤 Request headers sent with Authorization header');
      
      console.log('📥 Projects response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Projects loaded:', data.projects);
        
        // Fetch real analytics for each project
        const projectsWithAnalytics = await Promise.all(
          (data.projects || []).map(async (project: any) => {
            try {
              const analyticsResponse = await fetch(
                `${API_BASE}/api/analytics?projectId=${project.id}&detailed=true`,
                {
                  headers: {
                    'Content-Type': 'application/json',
                  }
                }
              );
              
              if (analyticsResponse.ok) {
                const analyticsData = await analyticsResponse.json();
                console.log(`📊 Analytics for project ${project.id}:`, analyticsData);
                
                return {
                  ...project,
                  favorites_count: analyticsData.analytics?.favorites || 0,
                  comments_count: analyticsData.analytics?.comments || 0,
                  approvals_count: (analyticsData.analytics?.approvals?.approved || 0) + 
                                 (analyticsData.analytics?.approvals?.rejected || 0) + 
                                 (analyticsData.analytics?.approvals?.pending || 0),
                  views_count: analyticsData.analytics?.views || 0,
                };
              } else {
                console.warn(`⚠️ Failed to load analytics for project ${project.id}`);
                return {
                  ...project,
                  favorites_count: 0,
                  comments_count: 0,
                  approvals_count: 0,
                  views_count: 0,
                };
              }
            } catch (error) {
              console.error(`💥 Error loading analytics for project ${project.id}:`, error);
              return {
                ...project,
                favorites_count: 0,
                comments_count: 0,
                approvals_count: 0,
                views_count: 0,
              };
            }
          })
        );
        
        setProjects(projectsWithAnalytics);
      } else {
        console.error('❌ Projects load failed:', response.status, await response.text());
      }
    } catch (error) {
      console.error('💥 Failed to load projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading while auth state is loading
  if (!isLoaded) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="grid gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  // User should be redirected by ProtectedRoute, but just in case
  if (!user) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="text-lg mb-2">Please sign in to access your dashboard</div>
        <div className="text-sm text-gray-500">Redirecting...</div>
      </div>
    );
  }

  if (isLoading || !creator) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="grid gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  // If showing detailed dashboard for a project, render that instead
  if (showDetailedDashboard) {
    return (
      <div className={`max-w-7xl mx-auto px-4 py-8 ${className}`}>
        <ComprehensiveProjectDashboard 
          projectId={showDetailedDashboard}
          onBack={() => setShowDetailedDashboard(null)}
        />
      </div>
    );
  }

  return (
    <div className={`space-y-6 max-w-7xl mx-auto px-4 py-8 ${className}`}>
      {/* Project Claim Banner for new authenticated users */}
      {creator && (
        <ProjectClaimBanner 
          creatorId={creator.id} 
          onClaimComplete={() => {
            // Reload projects after claiming
            loadProjects();
          }} 
        />
      )}

      {/* Header with creator welcome */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {creator.name || user.firstName || 'Creator'}!
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your projects and track engagement from your shared files
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500">
              {projects.length} project{projects.length !== 1 ? 's' : ''}
            </div>
            <a
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create New Project
            </a>
          </div>
        </div>
      </div>

      {/* Project Overview */}
      <div className="grid gap-6">
        {projects.map((project) => (
          <div key={project.id} className="bg-white rounded-lg border shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
                <div className="text-sm text-gray-500">
                  Created {new Date(project.created_at).toLocaleDateString()}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowDetailedDashboard(project.id)}
                  className="px-3 py-2 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors flex items-center gap-1"
                >
                  <FileText className="w-4 h-4" />
                  View Details
                </button>
                <button
                  onClick={() => setSelectedProject(selectedProject === project.id ? null : project.id)}
                  className="px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                >
                  {selectedProject === project.id ? 'Hide' : 'View'} Analytics
                </button>
                <a
                  href={`https://lytsite-backend.yashwanthvarmamuthineni.workers.dev/${project.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                >
                  View Site
                </a>
              </div>
            </div>

            {/* Project Description */}
            {project.description && (
              <p className="text-gray-600 mb-4">{project.description}</p>
            )}

            {/* Engagement Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-red-50 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center w-8 h-8 bg-red-100 rounded-full mx-auto mb-2">
                  <Heart className="w-4 h-4 text-red-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{project.favorites_count || 0}</div>
                <div className="text-sm text-gray-600">Favorites</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full mx-auto mb-2">
                  <MessageCircle className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{project.comments_count || 0}</div>
                <div className="text-sm text-gray-600">Comments</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full mx-auto mb-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{project.approvals_count || 0}</div>
                <div className="text-sm text-gray-600">Approvals</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-full mx-auto mb-2">
                  <BarChart3 className="w-4 h-4 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{project.views_count || 0}</div>
                <div className="text-sm text-gray-600">Views</div>
              </div>
            </div>

            {/* Detailed Analytics */}
            {selectedProject === project.id && (
              <DashboardAnalytics 
                projectId={project.id}
                className="mt-4"
              />
            )}
          </div>
        ))}
      </div>

      {projects.length === 0 && !isLoading && (
        <div className="text-center py-16 bg-white rounded-lg border">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects yet</h3>
            <p className="text-gray-600 mb-6">
              Create your first project by uploading files to share with others
            </p>
            <a
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              <Plus className="w-5 h-5" />
              Create Your First Project
            </a>
          </div>
        </div>
      )}
    </div>
  );
}