import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { DashboardAnalytics } from './features/DashboardAnalytics';
import { ProjectClaimBanner } from './auth/ProjectClaimBanner';
import { Heart, MessageCircle, CheckCircle, Plus, Upload, Calendar, Users, BarChart3, TrendingUp } from 'lucide-react';

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
  const [creator, setCreator] = useState<Creator | null>(null);
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
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
      const creatorData = {
        clerk_user_id: user.id,
        email: user.primaryEmailAddress?.emailAddress || '',
        name: user.fullName || user.firstName || '',
        avatar_url: user.imageUrl || undefined,
      };

      const response = await fetch('/api/creators/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(creatorData),
      });

      if (response.ok) {
        const data = await response.json();
        setCreator(data.creator);
      }
    } catch (error) {
      console.error('Failed to initialize creator:', error);
    }
  };

  const loadProjects = async () => {
    if (!creator) return;

    try {
      const response = await fetch(`/api/creators/projects/${creator.id}`);
      
      if (response.ok) {
        const data = await response.json();
        const projectsWithPlaceholders = (data.projects || []).map((project: any) => ({
          ...project,
          favorites_count: 0, // TODO: Fetch real analytics
          comments_count: 0,
          approvals_count: 0,
          views_count: 0,
        }));
        setProjects(projectsWithPlaceholders);
      }
    } catch (error) {
      console.error('Failed to load projects:', error);
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
                  onClick={() => setSelectedProject(selectedProject === project.id ? null : project.id)}
                  className="px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                >
                  {selectedProject === project.id ? 'Hide' : 'View'} Analytics
                </button>
                <a
                  href={`/${project.slug}`}
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