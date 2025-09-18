import React from 'react';
import { useEngagementTracker } from '../hooks/useEngagementTracker';

interface EngagementProviderProps {
  children: React.ReactNode;
}

export function EngagementProvider({ children }: EngagementProviderProps) {
  // Initialize engagement tracking
  useEngagementTracker();
  
  return <>{children}</>;
}