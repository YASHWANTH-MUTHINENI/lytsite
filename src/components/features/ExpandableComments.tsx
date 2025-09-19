import React, { useState, useEffect } from 'react';
import { MessageCircle, Send, Heart, MoreHorizontal } from 'lucide-react';

interface Comment {
  id: string;
  author: string;
  avatar?: string;
  content: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
}

interface ExpandableCommentsProps {
  fileId: string;
  projectId: string;
  isExpanded: boolean;
  onToggle: () => void;
  className?: string;
}

// Mock comments data - TO BE REPLACED WITH REAL API
const mockComments: Comment[] = [
  {
    id: '1',
    author: 'Sarah Chen',
    avatar: 'SC',
    content: 'This looks great! The color scheme really works well.',
    timestamp: '2h ago',
    likes: 2,
    isLiked: false
  },
  {
    id: '2', 
    author: 'Mike Johnson',
    avatar: 'MJ',
    content: 'Could we try a slightly different approach for the header section?',
    timestamp: '1h ago',
    likes: 1,
    isLiked: true
  },
  {
    id: '3',
    author: 'Emma Davis',
    avatar: 'ED', 
    content: 'Perfect! This is exactly what we were looking for. ✨',
    timestamp: '30m ago',
    likes: 5,
    isLiked: false
  }
];

export function ExpandableComments({ 
  fileId, 
  projectId, 
  isExpanded, 
  onToggle, 
  className = '' 
}: ExpandableCommentsProps) {
  console.log('🚀 ExpandableComments rendered with:', { fileId, projectId, isExpanded });
  
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
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

  // Load comments when component mounts or when expanded
  useEffect(() => {
    if (isExpanded) {
      console.log('📥 Loading comments for expanded section...');
      loadComments();
    }
  }, [isExpanded, fileId, projectId]);

  const loadComments = async () => {
    try {
      console.log('🔍 Fetching comments from API...');
      const response = await fetch(`https://lytsite-backend.yashwanthvarmamuthineni.workers.dev/api/comments?projectId=${projectId}&fileId=${fileId}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Comments loaded:', data);
        
        // Convert backend format to UI format
        const uiComments = (data.comments || []).map((comment: any) => ({
          id: comment.id,
          author: comment.user_name || comment.userName || (comment.user_email ? `User ${comment.user_email.slice(-4)}` : `User ${comment.userEmail?.slice(-4) || 'Unknown'}`),
          avatar: (comment.user_name || comment.userName)?.substring(0, 2).toUpperCase() || 'U',
          content: comment.comment_text || comment.commentText || comment.content,
          timestamp: comment.created_at ? new Date(comment.created_at * 1000).toLocaleString() : new Date(comment.createdAt).toLocaleString(),
          likes: 0,
          isLiked: false
        }));
        
        setComments(uiComments);
      } else {
        console.error('❌ Failed to load comments:', response.status);
        // Fall back to mock data for now
        setComments(mockComments);
      }
    } catch (error) {
      console.error('❌ Error loading comments:', error);
      // Fall back to mock data for now
      setComments(mockComments);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isLoading) return;

    console.log('📤 Submitting comment:', newComment);
    setIsLoading(true);
    const userSessionId = getUserSessionId();

    try {
      const requestBody = {
        projectId,
        fileId,
        threadId: null,
        userEmail: userSessionId,
        userName: `User ${userSessionId?.slice(-4) || 'Unknown'}`,
        commentText: newComment.trim()
      };

      console.log('🚀 Sending comment to backend:', requestBody);

      const response = await fetch('https://lytsite-backend.yashwanthvarmamuthineni.workers.dev/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      console.log('📥 Comment submission response:', response.status, response.statusText);

      if (response.ok) {
        setNewComment('');
        // Reload comments to get the new one
        await loadComments();
        console.log('✅ Comment submitted successfully');
      } else {
        console.error('❌ Failed to submit comment');
        // Add comment locally as fallback
        const fallbackComment: Comment = {
          id: Date.now().toString(),
          author: 'You',
          avatar: 'Y',
          content: newComment,
          timestamp: 'now',
          likes: 0,
          isLiked: false
        };
        setComments(prev => [...prev, fallbackComment]);
        setNewComment('');
      }
    } catch (error) {
      console.error('❌ Error submitting comment:', error);
      // Add comment locally as fallback
      const fallbackComment: Comment = {
        id: Date.now().toString(),
        author: 'You',
        avatar: 'Y',
        content: newComment,
        timestamp: 'now',
        likes: 0,
        isLiked: false
      };
      setComments(prev => [...prev, fallbackComment]);
      setNewComment('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitCommentOld = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      author: 'You',
      avatar: 'Y',
      content: newComment,
      timestamp: 'now',
      likes: 0,
      isLiked: false
    };

    setComments(prev => [...prev, comment]);
    setNewComment('');
    
    // TODO: Implement actual API call
    console.log(`Add comment to file ${fileId} in project ${projectId}:`, newComment);
  };

  const handleLikeComment = (commentId: string) => {
    setComments(prev => prev.map(comment => 
      comment.id === commentId 
        ? { 
            ...comment, 
            isLiked: !comment.isLiked,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1
          }
        : comment
    ));
    
    // TODO: Implement actual API call
    console.log(`Toggle like for comment ${commentId}`);
  };

  if (!isExpanded) {
    return null;
  }

  return (
    <div className={`border-t border-gray-100 bg-gray-50/50 ${className}`}>
      <div className="p-4 space-y-4">
        {/* Comments Header */}
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-gray-900">Comments ({comments.length})</h4>
          <button
            onClick={onToggle}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ×
          </button>
        </div>

        {/* Comments List */}
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              {/* Avatar */}
              <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                {comment.avatar}
              </div>

              {/* Comment Content */}
              <div className="flex-1 min-w-0">
                <div className="bg-white rounded-lg px-3 py-2 shadow-sm border">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm text-gray-900">{comment.author}</span>
                    <span className="text-xs text-gray-500">{comment.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-700">{comment.content}</p>
                </div>

                {/* Comment Actions */}
                <div className="flex items-center gap-4 mt-1 px-1">
                  <button
                    onClick={() => handleLikeComment(comment.id)}
                    className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-500 transition-colors"
                  >
                    <Heart className={`w-3 h-3 ${comment.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                    {comment.likes > 0 && <span>{comment.likes}</span>}
                  </button>
                  <button className="text-xs text-gray-500 hover:text-gray-700 transition-colors">
                    Reply
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Comment Form */}
        <form onSubmit={handleSubmitComment} className="flex gap-2">
          <div className="flex-shrink-0 w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white text-xs font-medium">
            Y
          </div>
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!newComment.trim() || isLoading}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}