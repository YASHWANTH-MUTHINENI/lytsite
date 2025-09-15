import React, { useState } from 'react';
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

// Mock comments data - replace with actual API calls
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
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [newComment, setNewComment] = useState('');

  const handleSubmitComment = (e: React.FormEvent) => {
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
              disabled={!newComment.trim()}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}