import React, { useState } from 'react';
import { InlineActionBar } from './InlineActionBar';
import { ExpandableComments } from './ExpandableComments';

interface ProjectSettings {
  enableFavorites?: boolean;
  enableComments?: boolean;
  enableApprovals?: boolean;
  enableAnalytics?: boolean;
  enableNotifications?: boolean;
}

interface CompactFeaturesProps {
  fileId: string;
  projectId: string;
  settings: ProjectSettings;
  onDownload?: () => void;
  className?: string;
}

export function CompactFeatures({ 
  fileId, 
  projectId, 
  settings, 
  onDownload,
  className = '' 
}: CompactFeaturesProps) {
  const [showComments, setShowComments] = useState(false);

  // Don't render anything if no features are enabled
  const hasAnyFeatures = settings.enableFavorites || 
                        settings.enableComments || 
                        settings.enableApprovals;

  if (!hasAnyFeatures && !onDownload) {
    return null;
  }

  const handleCommentToggle = () => {
    setShowComments(!showComments);
  };

  return (
    <div className={className}>
      {/* Action Bar - Always visible if features enabled */}
      <InlineActionBar
        fileId={fileId}
        projectId={projectId}
        settings={settings}
        onCommentToggle={settings.enableComments ? handleCommentToggle : undefined}
        onDownload={onDownload}
      />

      {/* Expandable Comments - Only if comments enabled and expanded */}
      {settings.enableComments && (
        <ExpandableComments
          fileId={fileId}
          projectId={projectId}
          isExpanded={showComments}
          onToggle={handleCommentToggle}
        />
      )}
    </div>
  );
}