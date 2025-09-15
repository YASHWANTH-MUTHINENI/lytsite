import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { Button } from '../ui/button';

interface ApprovalButtonsProps {
  projectId: string;
  fileId: string;
  className?: string;
}

export function ApprovalButtons({ projectId, fileId, className = '' }: ApprovalButtonsProps) {
  const [approvalStatus, setApprovalStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [approvalCounts, setApprovalCounts] = useState({ approved: 0, rejected: 0 });
  const [userApproval, setUserApproval] = useState<'approved' | 'rejected' | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Get user session ID
  const getUserSessionId = () => {
    let sessionId = localStorage.getItem('lytsite_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('lytsite_session_id', sessionId);
    }
    return sessionId;
  };

  // Load approval status on component mount
  useEffect(() => {
    loadApprovalStatus();
  }, [projectId, fileId]);

  const loadApprovalStatus = async () => {
    try {
      const userSessionId = getUserSessionId();
      const response = await fetch(`/api/approvals?projectId=${projectId}&fileId=${fileId}&userSessionId=${userSessionId}`);
      
      if (response.ok) {
        const data = await response.json();
        setApprovalCounts(data.counts || { approved: 0, rejected: 0 });
        setUserApproval(data.userApproval || null);
        
        // Determine overall status based on counts
        if (data.counts.approved > data.counts.rejected) {
          setApprovalStatus('approved');
        } else if (data.counts.rejected > data.counts.approved) {
          setApprovalStatus('rejected');
        } else {
          setApprovalStatus('pending');
        }
      }
    } catch (error) {
      console.error('Failed to load approval status:', error);
    }
  };

  const submitApproval = async (status: 'approved' | 'rejected') => {
    if (isLoading) return;
    
    setIsLoading(true);
    const userSessionId = getUserSessionId();

    try {
      const response = await fetch('/api/approvals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId,
          fileId,
          status,
          userSessionId
        })
      });

      if (response.ok) {
        const data = await response.json();
        setUserApproval(status);
        setApprovalCounts(data.counts || { approved: 0, rejected: 0 });
        
        // Update overall status
        if (data.counts.approved > data.counts.rejected) {
          setApprovalStatus('approved');
        } else if (data.counts.rejected > data.counts.approved) {
          setApprovalStatus('rejected');
        } else {
          setApprovalStatus('pending');
        }
        
        // Note: Backend should send notification/email to project creator
        // when approval status changes (handled by backend API)
      } else {
        console.error('Failed to submit approval');
      }
    } catch (error) {
      console.error('Error submitting approval:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = () => {
    switch (approvalStatus) {
      case 'approved': return 'text-green-600';
      case 'rejected': return 'text-red-600';
      default: return 'text-orange-600';
    }
  };

  const getStatusIcon = () => {
    switch (approvalStatus) {
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Overall Status */}
      <div className={`flex items-center gap-1 ${getStatusColor()}`}>
        {getStatusIcon()}
        <span className="text-sm font-medium capitalize">
          {approvalStatus}
        </span>
      </div>

      {/* Approval Buttons */}
      <div className="flex items-center gap-2">
        <Button
          variant={userApproval === 'approved' ? 'default' : 'outline'}
          size="sm"
          onClick={() => submitApproval('approved')}
          disabled={isLoading}
          className={`flex items-center gap-1 ${
            userApproval === 'approved' 
              ? 'bg-green-600 hover:bg-green-700' 
              : 'hover:bg-green-50 hover:border-green-200'
          }`}
        >
          <CheckCircle className="w-3 h-3" />
          <span className="text-xs">
            Approve {approvalCounts.approved > 0 && `(${approvalCounts.approved})`}
          </span>
        </Button>

        <Button
          variant={userApproval === 'rejected' ? 'default' : 'outline'}
          size="sm"
          onClick={() => submitApproval('rejected')}
          disabled={isLoading}
          className={`flex items-center gap-1 ${
            userApproval === 'rejected' 
              ? 'bg-red-600 hover:bg-red-700' 
              : 'hover:bg-red-50 hover:border-red-200'
          }`}
        >
          <XCircle className="w-3 h-3" />
          <span className="text-xs">
            Reject {approvalCounts.rejected > 0 && `(${approvalCounts.rejected})`}
          </span>
        </Button>
      </div>
    </div>
  );
}