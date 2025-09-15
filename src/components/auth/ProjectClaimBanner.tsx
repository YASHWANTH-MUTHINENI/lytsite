import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Upload, Calendar, Heart, MessageCircle, CheckCircle, AlertCircle, X } from 'lucide-react';
import { useAnonymousSession } from '../../utils/sessionManager';

interface AnonymousProject {
  id: string;
  slug: string;
  title: string;
  description?: string;
  created_at: string;
  settings?: {
    enable_favorites: boolean;
    enable_comments: boolean;
    enable_approvals: boolean;
    enable_analytics: boolean;
    enable_notifications: boolean;
  };
}

interface ProjectClaimBannerProps {
  creatorId: string;
  onClaimComplete: () => void;
}

export function ProjectClaimBanner({ creatorId, onClaimComplete }: ProjectClaimBannerProps) {
  const { hasSession, claimProjects, getProjects } = useAnonymousSession();
  const [anonymousProjects, setAnonymousProjects] = useState<AnonymousProject[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (hasSession) {
      loadAnonymousProjects();
    }
  }, [hasSession]);

  const loadAnonymousProjects = async () => {
    setIsLoading(true);
    try {
      const projects = await getProjects();
      setAnonymousProjects(projects);
    } catch (error) {
      console.error('Failed to load anonymous projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClaimProjects = async () => {
    setIsClaiming(true);
    try {
      const success = await claimProjects(creatorId);
      if (success) {
        setIsVisible(false);
        onClaimComplete();
      } else {
        alert('Failed to claim projects. Please try again.');
      }
    } catch (error) {
      console.error('Failed to claim projects:', error);
      alert('Failed to claim projects. Please try again.');
    } finally {
      setIsClaiming(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  // Don't show if no session, no projects, already claimed, or dismissed
  if (!hasSession || !anonymousProjects.length || !isVisible) {
    return null;
  }

  return (
    <Card className="border-blue-200 bg-blue-50 mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Upload className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg text-blue-900">
                Welcome! You have {anonymousProjects.length} project{anonymousProjects.length !== 1 ? 's' : ''} to claim
              </CardTitle>
              <p className="text-blue-700 text-sm mt-1">
                It looks like you created some projects before signing up. Would you like to add them to your account?
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="text-blue-600 hover:text-blue-800"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center gap-3 mb-4">
          <Button
            onClick={handleClaimProjects}
            disabled={isClaiming}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isClaiming ? 'Claiming Projects...' : 'Claim All Projects'}
          </Button>
          
          <Button
            variant="outline"
            onClick={() => setShowDetails(!showDetails)}
            className="border-blue-200 text-blue-800 hover:bg-blue-100"
          >
            {showDetails ? 'Hide Details' : 'Show Details'}
          </Button>
        </div>

        {showDetails && (
          <div className="space-y-3 pt-3 border-t border-blue-200">
            <h4 className="font-medium text-blue-900">Projects to be claimed:</h4>
            {anonymousProjects.map((project) => (
              <div key={project.id} className="bg-white rounded-lg p-4 border border-blue-100">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h5 className="font-medium text-gray-900">{project.title}</h5>
                    {project.description && (
                      <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    {new Date(project.created_at).toLocaleDateString()}
                  </div>
                </div>
                
                {/* Feature indicators */}
                <div className="flex items-center gap-2 mt-3">
                  {project.settings?.enable_favorites && (
                    <Badge variant="secondary" className="text-xs">
                      <Heart className="w-3 h-3 mr-1" />
                      Favorites
                    </Badge>
                  )}
                  {project.settings?.enable_comments && (
                    <Badge variant="secondary" className="text-xs">
                      <MessageCircle className="w-3 h-3 mr-1" />
                      Comments
                    </Badge>
                  )}
                  {project.settings?.enable_approvals && (
                    <Badge variant="secondary" className="text-xs">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Approvals
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}