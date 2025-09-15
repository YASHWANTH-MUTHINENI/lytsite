import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '../ui/button';

interface FavoriteButtonProps {
  projectId: string;
  fileId: string;
  className?: string;
}

export function FavoriteButton({ projectId, fileId, className = '' }: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Get user session ID from localStorage or generate one
  const getUserSessionId = () => {
    let sessionId = localStorage.getItem('lytsite_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('lytsite_session_id', sessionId);
    }
    return sessionId;
  };

  // Load favorite status and count on component mount
  useEffect(() => {
    loadFavoriteStatus();
  }, [projectId, fileId]);

  const loadFavoriteStatus = async () => {
    try {
      const userSessionId = getUserSessionId();
      const response = await fetch(`/api/favorites?projectId=${projectId}&fileId=${fileId}&userSessionId=${userSessionId}`);
      
      if (response.ok) {
        const data = await response.json();
        setIsFavorited(data.isFavorited || false);
        setFavoriteCount(data.count || 0);
      }
    } catch (error) {
      console.error('Failed to load favorite status:', error);
    }
  };

  const toggleFavorite = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    const userSessionId = getUserSessionId();

    try {
      const method = isFavorited ? 'DELETE' : 'POST';
      const response = await fetch('/api/favorites', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId,
          fileId,
          userSessionId
        })
      });

      if (response.ok) {
        const data = await response.json();
        setIsFavorited(!isFavorited);
        setFavoriteCount(data.count || 0);
      } else {
        console.error('Failed to toggle favorite');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleFavorite}
      disabled={isLoading}
      className={`flex items-center gap-2 transition-colors ${className}`}
    >
      <Heart 
        className={`w-4 h-4 transition-colors ${
          isFavorited 
            ? 'fill-red-500 text-red-500' 
            : 'text-gray-500 hover:text-red-500'
        }`}
      />
      <span className="text-sm font-medium">
        {favoriteCount > 0 ? favoriteCount : '♥'}
      </span>
    </Button>
  );
}