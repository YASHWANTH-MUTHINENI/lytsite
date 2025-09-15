import React, { useState, useEffect } from 'react';
import { MessageCircle, Send, Reply } from 'lucide-react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';

interface Comment {
  id: string;
  content: string;
  userSessionId: string;
  userName?: string;
  createdAt: string;
  parentId?: string;
  replies?: Comment[];
}

interface CommentsSectionProps {
  projectId: string;
  fileId: string;
  className?: string;
}

export function CommentsSection({ projectId, fileId, className = '' }: CommentsSectionProps) {
  // Comments are visible to both creator and client - threaded discussion
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Get user session ID
  const getUserSessionId = () => {
    let sessionId = localStorage.getItem('lytsite_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('lytsite_session_id', sessionId);
    }
    return sessionId;
  };

  // Load comments on component mount
  useEffect(() => {
    if (isExpanded) {
      loadComments();
    }
  }, [projectId, fileId, isExpanded]);

  const loadComments = async () => {
    try {
      const response = await fetch(`/api/comments?projectId=${projectId}&fileId=${fileId}`);
      
      if (response.ok) {
        const data = await response.json();
        setComments(organizeComments(data.comments || []));
      }
    } catch (error) {
      console.error('Failed to load comments:', error);
    }
  };

  // Organize comments into threaded structure
  const organizeComments = (flatComments: Comment[]): Comment[] => {
    const commentMap = new Map<string, Comment>();
    const rootComments: Comment[] = [];

    // First pass: create map of all comments
    flatComments.forEach(comment => {
      commentMap.set(comment.id, { ...comment, replies: [] });
    });

    // Second pass: organize into tree structure
    flatComments.forEach(comment => {
      const commentWithReplies = commentMap.get(comment.id)!;
      
      if (comment.parentId) {
        const parent = commentMap.get(comment.parentId);
        if (parent) {
          parent.replies!.push(commentWithReplies);
        }
      } else {
        rootComments.push(commentWithReplies);
      }
    });

    return rootComments;
  };

  const submitComment = async () => {
    if (!newComment.trim() || isLoading) return;

    setIsLoading(true);
    const userSessionId = getUserSessionId();

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId,
          fileId,
          content: newComment.trim(),
          userSessionId
        })
      });

      if (response.ok) {
        setNewComment('');
        await loadComments(); // Reload comments
      } else {
        console.error('Failed to submit comment');
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const submitReply = async (parentId: string) => {
    if (!replyContent.trim() || isLoading) return;

    setIsLoading(true);
    const userSessionId = getUserSessionId();

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId,
          fileId,
          content: replyContent.trim(),
          userSessionId,
          parentId
        })
      });

      if (response.ok) {
        setReplyContent('');
        setReplyingTo(null);
        await loadComments(); // Reload comments
      } else {
        console.error('Failed to submit reply');
      }
    } catch (error) {
      console.error('Error submitting reply:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => (
    <div className={`${isReply ? 'ml-6 border-l-2 border-gray-200 pl-4' : ''} mb-4`}>
      <div className="bg-gray-50 rounded-lg p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Anonymous User
          </span>
          <span className="text-xs text-gray-500">
            {new Date(comment.createdAt).toLocaleDateString()}
          </span>
        </div>
        <p className="text-sm text-gray-800 mb-2">{comment.content}</p>
        
        {!isReply && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
            className="text-xs"
          >
            <Reply className="w-3 h-3 mr-1" />
            Reply
          </Button>
        )}
      </div>

      {/* Reply form */}
      {replyingTo === comment.id && (
        <div className="mt-2 ml-4">
          <Textarea
            placeholder="Write a reply..."
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            className="mb-2"
            rows={2}
          />
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => submitReply(comment.id)}
              disabled={isLoading || !replyContent.trim()}
            >
              <Send className="w-3 h-3 mr-1" />
              Reply
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setReplyingTo(null);
                setReplyContent('');
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Render replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3">
          {comment.replies.map(reply => (
            <CommentItem key={reply.id} comment={reply} isReply={true} />
          ))}
        </div>
      )}
    </div>
  );

  if (!isExpanded) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsExpanded(true)}
        className={`flex items-center gap-2 ${className}`}
      >
        <MessageCircle className="w-4 h-4" />
        <span className="text-sm">Comments</span>
        {comments.length > 0 && (
          <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">
            {comments.length}
          </span>
        )}
      </Button>
    );
  }

  return (
    <div className={`border rounded-lg p-4 bg-white ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-gray-900 flex items-center gap-2">
          <MessageCircle className="w-4 h-4" />
          Comments ({comments.length})
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(false)}
        >
          Collapse
        </Button>
      </div>

      {/* New comment form */}
      <div className="mb-4">
        <Textarea
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="mb-2"
        />
        <Button
          onClick={submitComment}
          disabled={isLoading || !newComment.trim()}
          size="sm"
        >
          <Send className="w-3 h-3 mr-1" />
          Comment
        </Button>
      </div>

      {/* Comments list */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-4">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments.map(comment => (
            <CommentItem key={comment.id} comment={comment} />
          ))
        )}
      </div>
    </div>
  );
}