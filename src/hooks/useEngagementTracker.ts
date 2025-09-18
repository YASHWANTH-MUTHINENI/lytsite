/**
 * Engagement Tracker Hook
 * Monitors for engagement events and triggers conversion notifications
 */

import { useEffect, useCallback } from 'react';
import { 
  addConversionNotification,
  startEngagementPolling,
  NotificationTrigger
} from '../utils/conversionNotifications';
import { useAnonymousSession } from '../utils/sessionManager';

export function useEngagementTracker() {
  const { hasSession, sessionId } = useAnonymousSession();

  // Simulate engagement detection (in production, this would come from websockets/SSE)
  const simulateEngagementDetection = useCallback(() => {
    if (!hasSession) return;

    // Simulate random engagement events for demo purposes
    const engagementTypes: Array<'comment' | 'favorite' | 'approval'> = ['comment', 'favorite', 'approval'];
    
    const randomInterval = () => {
      setTimeout(() => {
        if (Math.random() > 0.7) { // 30% chance of engagement
          const randomType = engagementTypes[Math.floor(Math.random() * engagementTypes.length)];
          
          const trigger: NotificationTrigger = {
            type: randomType,
            projectId: 'demo_project',
            anonymousSessionId: sessionId,
            message: '',
            ctaText: '',
            urgencyLevel: 'medium'
          };
          
          addConversionNotification(trigger);
          console.log(`🎉 Simulated ${randomType} engagement for anonymous user`);
        }
        
        // Schedule next check (every 2-5 minutes)
        randomInterval();
      }, Math.random() * 180000 + 120000); // 2-5 minutes
    };

    randomInterval();
  }, [hasSession, sessionId]);

  // Set up engagement polling for anonymous users
  useEffect(() => {
    if (!hasSession) return;

    // Start polling for real engagement updates
    const stopPolling = startEngagementPolling(60000); // Every minute

    // Start simulation for demo (remove in production)
    if (process.env.NODE_ENV === 'development') {
      simulateEngagementDetection();
    }

    // Set up expiration warning (6 days after session start)
    const checkExpirationWarning = () => {
      const sessionStart = localStorage.getItem('lytsite_anonymous_session_start');
      if (!sessionStart) {
        localStorage.setItem('lytsite_anonymous_session_start', Date.now().toString());
        return;
      }

      const startTime = parseInt(sessionStart);
      const sixDaysMs = 6 * 24 * 60 * 60 * 1000;
      const timeUntilExpiration = (startTime + 7 * 24 * 60 * 60 * 1000) - Date.now();
      
      // If less than 24 hours until expiration, show warning
      if (timeUntilExpiration > 0 && timeUntilExpiration < 24 * 60 * 60 * 1000) {
        const trigger: NotificationTrigger = {
          type: 'expiration_warning',
          projectId: 'session_expiring',
          anonymousSessionId: sessionId,
          message: '',
          ctaText: '',
          urgencyLevel: 'high'
        };
        
        addConversionNotification(trigger);
      }
    };

    // Check expiration warning on load and every hour
    checkExpirationWarning();
    const expirationInterval = setInterval(checkExpirationWarning, 60 * 60 * 1000);

    return () => {
      stopPolling();
      clearInterval(expirationInterval);
    };
  }, [hasSession, sessionId, simulateEngagementDetection]);

  // Manual trigger for testing
  const triggerTestEngagement = useCallback((type: 'comment' | 'favorite' | 'approval' = 'comment') => {
    if (!hasSession) return;

    const trigger: NotificationTrigger = {
      type,
      projectId: 'test_project',
      anonymousSessionId: sessionId,
      message: '',
      ctaText: '',
      urgencyLevel: type === 'comment' ? 'high' : 'medium'
    };
    
    addConversionNotification(trigger);
  }, [hasSession, sessionId]);

  return {
    isTracking: hasSession,
    triggerTestEngagement
  };
}

/**
 * Hook to track specific engagement events
 * Use this to trigger notifications when real engagement happens
 */
export function useEngagementEvent() {
  const { hasSession, sessionId } = useAnonymousSession();

  const trackEngagement = useCallback((
    type: 'comment' | 'favorite' | 'approval',
    projectId: string,
    metadata?: { 
      userEmail?: string;
      userName?: string;
      content?: string;
    }
  ) => {
    if (!hasSession) return;

    // Generate personalized message based on engagement type and metadata
    let message = '';
    let ctaText = '';
    let urgencyLevel: 'low' | 'medium' | 'high' = 'medium';

    switch (type) {
      case 'comment':
        message = metadata?.userName 
          ? `💬 ${metadata.userName} commented on your project!`
          : `💬 Someone just commented on your project!`;
        ctaText = 'Read & Respond';
        urgencyLevel = 'high';
        break;
      case 'favorite':
        message = metadata?.userName
          ? `❤️ ${metadata.userName} favorited your project!`
          : `❤️ Someone just favorited your project!`;
        ctaText = 'See Who Favorited';
        urgencyLevel = 'medium';
        break;
      case 'approval':
        message = metadata?.userName
          ? `✅ ${metadata.userName} approved your project!`
          : `✅ Someone just approved your project!`;
        ctaText = 'View Approvals';
        urgencyLevel = 'medium';
        break;
    }

    const trigger: NotificationTrigger = {
      type,
      projectId,
      anonymousSessionId: sessionId,
      message,
      ctaText,
      urgencyLevel
    };
    
    addConversionNotification(trigger);
    
    // Analytics tracking (replace with your analytics service)
    console.log('Engagement tracked:', {
      type,
      projectId,
      sessionId,
      metadata
    });
  }, [hasSession, sessionId]);

  return {
    trackEngagement,
    canTrack: hasSession
  };
}