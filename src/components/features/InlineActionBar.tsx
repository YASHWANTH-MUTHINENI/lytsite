import React, { useState } from 'react';
import { Heart, MessageCircle, CheckCircle, XCircle, Download } from 'lucide-react';

interface ProjectSettings {
  enableFavorites?: boolean;
  enableComments?: boolean;
  enableApprovals?: boolean;
  enableAnalytics?: boolean;
  enableNotifications?: boolean;
}

interface InlineActionBarProps {
  fileId: string;
  projectId: string;
  settings: ProjectSettings;
  onCommentToggle?: () => void;
  onDownload?: () => void;
  className?: string;
}

export function InlineActionBar({ 
  fileId, 
  projectId, 
  settings, 
  onCommentToggle,
  onDownload,
  className = '' 
}: InlineActionBarProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [commentCount] = useState(3); // Mock count for now

  // Don't render if no interactive features are enabled
  const hasInteractiveFeatures = settings.enableFavorites || settings.enableComments || settings.enableApprovals;
  
  if (!hasInteractiveFeatures) {
    // Still show download if available, but no interactive features
    return onDownload ? (
      <div className={`flex items-center justify-end ${className}`}>
        <button
          onClick={onDownload}
          className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Download</span>
        </button>
      </div>
    ) : null;
  }

  const handleFavoriteClick = () => {
    setIsFavorited(!isFavorited);
    // TODO: Implement actual API call
    console.log(`Toggle favorite for file ${fileId} in project ${projectId}`);
  };

  const handleApprovalClick = (status: 'approved' | 'rejected') => {
    setApprovalStatus(status);
    // TODO: Implement actual API call
    console.log(`Set approval status ${status} for file ${fileId} in project ${projectId}`);
  };

  return (
    <div className={`flex items-center gap-4 py-3 border-t border-gray-100 ${className}`}>
      {/* Left side - Interactive features */}
      <div className="flex items-center gap-4 flex-1">
        {/* Favorite Button */}
        {settings.enableFavorites && (
          <button
            onClick={handleFavoriteClick}
            className="flex items-center gap-1 text-sm hover:scale-110 transition-transform"
          >
            <Heart 
              className={`w-5 h-5 ${
                isFavorited 
                  ? 'fill-red-500 text-red-500' 
                  : 'text-gray-500 hover:text-red-500'
              }`} 
            />
          </button>
        )}

        {/* Comments Toggle */}
        {settings.enableComments && (
          <button
            onClick={onCommentToggle}
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Comments ({commentCount})</span>
          </button>
        )}

        {/* Approval Buttons */}
        {settings.enableApprovals && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-medium">
              {approvalStatus === 'pending' && 'Pending'}
              {approvalStatus === 'approved' && 'Approved'}
              {approvalStatus === 'rejected' && 'Rejected'}
            </span>
            <button
              onClick={() => handleApprovalClick('approved')}
              className={`p-1 rounded transition-colors ${
                approvalStatus === 'approved'
                  ? 'bg-green-100 text-green-600'
                  : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleApprovalClick('rejected')}
              className={`p-1 rounded transition-colors ${
                approvalStatus === 'rejected'
                  ? 'bg-red-100 text-red-600'
                  : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
              }`}
            >
              <XCircle className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Right side - Download */}
      {onDownload && (
        <button
          onClick={onDownload}
          className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Download</span>
        </button>
      )}
    </div>
  );
}