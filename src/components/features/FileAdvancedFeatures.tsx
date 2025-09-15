import React from 'react';
import { FavoriteButton } from './FavoriteButton';
import { CommentsSection } from './CommentsSection';
import { ApprovalButtons } from './ApprovalButtons';
import { AnalyticsDisplay } from './AnalyticsDisplay';

interface ProjectSettings {
  enableFavorites?: boolean;
  enableComments?: boolean;
  enableApprovals?: boolean;
  enableAnalytics?: boolean;
  enableNotifications?: boolean;
}

interface FileAdvancedFeaturesProps {
  projectId: string;
  fileId: string;
  settings: ProjectSettings;
  layout?: 'horizontal' | 'vertical';
  className?: string;
}

export function FileAdvancedFeatures({ 
  projectId, 
  fileId, 
  settings, 
  layout = 'horizontal',
  className = '' 
}: FileAdvancedFeaturesProps) {
  // Don't render anything if no features are enabled (analytics only in dashboard)
  const hasEnabledFeatures = settings.enableFavorites || 
                           settings.enableComments || 
                           settings.enableApprovals;

  if (!hasEnabledFeatures) {
    return null;
  }

  const containerClass = layout === 'horizontal' 
    ? 'flex items-center gap-4 flex-wrap' 
    : 'space-y-4';

  return (
    <div className={`border-t pt-4 mt-4 ${containerClass} ${className}`}>
      {/* Favorites */}
      {settings.enableFavorites && (
        <FavoriteButton 
          projectId={projectId} 
          fileId={fileId} 
        />
      )}

      {/* Approvals */}
      {settings.enableApprovals && (
        <ApprovalButtons 
          projectId={projectId} 
          fileId={fileId} 
        />
      )}

      {/* Analytics: Only shown in dashboard, not on public site */}
      
      {/* Comments - Full width in horizontal layout */}
      {settings.enableComments && (
        <div className={layout === 'horizontal' ? 'w-full' : ''}>
          <CommentsSection 
            projectId={projectId} 
            fileId={fileId} 
          />
        </div>
      )}
    </div>
  );
}