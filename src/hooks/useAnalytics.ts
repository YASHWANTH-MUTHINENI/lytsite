import { useEffect, useCallback, useRef } from 'react';
import { analytics, trackFileView, trackFileDownload } from '../utils/analytics';
import { isAnalyticsEnabled, FILE_TYPE_EVENTS, FEATURE_EVENTS } from '../utils/analyticsConfig';

interface UseAnalyticsOptions {
  projectId?: string;
  fileId?: string;
  fileType?: string;
  trackPageView?: boolean;
  autoTrackFileView?: boolean;
}

interface UseAnalyticsReturn {
  trackEvent: (action: string, data?: Record<string, any>) => void;
  trackFileEngagement: (action: 'view' | 'download' | 'share' | 'favorite' | 'comment' | 'approve', data?: Record<string, any>) => void;
  trackFeatureUsage: (feature: string, context?: string) => void;
  trackUserAction: (action: string, data?: Record<string, any>) => void;
  trackPerformance: (metric: string, duration: number) => void;
  isEnabled: boolean;
}

/**
 * Custom hook for Google Analytics integration in Lytsite
 * Provides easy-to-use methods for tracking user interactions
 */
export const useAnalytics = (options: UseAnalyticsOptions = {}): UseAnalyticsReturn => {
  const {
    projectId,
    fileId,
    fileType,
    trackPageView = true,
    autoTrackFileView = false
  } = options;

  const isEnabled = isAnalyticsEnabled();
  const viewTracked = useRef(false);

  // Auto-track page view on mount
  useEffect(() => {
    if (!isEnabled || !trackPageView) return;

    const pageData = {
      page_title: document.title,
      page_location: window.location.href,
      project_id: projectId,
      file_type: fileType,
      user_type: localStorage.getItem('user_type') as 'authenticated' | 'anonymous' || 'anonymous'
    };

    analytics.trackPageView(pageData);
  }, [isEnabled, trackPageView, projectId, fileType]);

  // Auto-track file view
  useEffect(() => {
    if (!isEnabled || !autoTrackFileView || !projectId || !fileId || !fileType || viewTracked.current) return;

    trackFileView(projectId, fileId, fileType);
    viewTracked.current = true;
  }, [isEnabled, autoTrackFileView, projectId, fileId, fileType]);

  // Generic event tracking
  const trackEvent = useCallback((action: string, data: Record<string, any> = {}) => {
    if (!isEnabled) return;

    analytics.trackCustomEvent({
      action,
      category: data.category || 'user_interaction',
      label: data.label,
      value: data.value,
      custom_parameters: {
        project_id: projectId,
        file_id: fileId,
        file_type: fileType,
        ...data
      }
    });
  }, [isEnabled, projectId, fileId, fileType]);

  // File engagement tracking with enhanced event names
  const trackFileEngagement = useCallback((
    action: 'view' | 'download' | 'share' | 'favorite' | 'comment' | 'approve',
    data: Record<string, any> = {}
  ) => {
    if (!isEnabled || !projectId || !fileId || !fileType) return;

    // Get enhanced event name based on file type
    const fileTypeEvents = FILE_TYPE_EVENTS[fileType as keyof typeof FILE_TYPE_EVENTS];
    const eventName = fileTypeEvents?.[action as keyof typeof fileTypeEvents] || `${fileType}_${action}`;

    analytics.trackFileEngagement(action, {
      project_id: projectId,
      file_id: fileId,
      file_type: fileType,
      ...data
    });

    // Track with enhanced event name for better reporting
    analytics.trackCustomEvent({
      action: eventName,
      category: 'file_engagement',
      label: `${fileType}_${action}`,
      custom_parameters: {
        project_id: projectId,
        file_id: fileId,
        file_type: fileType,
        ...data
      }
    });
  }, [isEnabled, projectId, fileId, fileType]);

  // Feature usage tracking
  const trackFeatureUsage = useCallback((feature: string, context?: string) => {
    if (!isEnabled) return;

    // Check for predefined feature events
    const featureCategory = Object.keys(FEATURE_EVENTS).find(category =>
      Object.values(FEATURE_EVENTS[category as keyof typeof FEATURE_EVENTS]).includes(feature)
    );

    analytics.trackFeatureUsage(feature, {
      project_id: projectId,
      usage_context: context,
      feature_value: featureCategory
    });
  }, [isEnabled, projectId]);

  // User action tracking (clicks, form submissions, etc.)
  const trackUserAction = useCallback((action: string, data: Record<string, any> = {}) => {
    if (!isEnabled) return;

    analytics.trackCustomEvent({
      action,
      category: 'user_action',
      label: data.label || action,
      value: data.value,
      custom_parameters: {
        project_id: projectId,
        file_type: fileType,
        element_type: data.element_type,
        element_text: data.element_text,
        ...data
      }
    });
  }, [isEnabled, projectId, fileType]);

  // Performance tracking
  const trackPerformance = useCallback((metric: string, duration: number, data: Record<string, any> = {}) => {
    if (!isEnabled) return;

    analytics.trackPerformance(metric as any, {
      duration,
      ...data
    });
  }, [isEnabled]);

  return {
    trackEvent,
    trackFileEngagement,
    trackFeatureUsage,
    trackUserAction,
    trackPerformance,
    isEnabled
  };
};

/**
 * Hook for tracking specific file interactions
 * Optimized for gallery, PDF, video, and document blocks
 */
export const useFileAnalytics = (projectId: string, fileId: string, fileType: string) => {
  const { trackFileEngagement, trackUserAction, isEnabled } = useAnalytics({
    projectId,
    fileId,
    fileType,
    autoTrackFileView: true
  });

  // Gallery-specific tracking
  const trackGalleryAction = useCallback((action: 'selection_mode_entered' | 'bulk_download' | 'slideshow_started' | 'image_selected', data?: Record<string, any>) => {
    trackUserAction(`gallery_${action}`, {
      category: 'gallery_interaction',
      ...data
    });
  }, [trackUserAction]);

  // PDF-specific tracking
  const trackPDFAction = useCallback((action: 'page_changed' | 'zoom_changed' | 'fullscreen_entered' | 'search_performed', data?: Record<string, any>) => {
    trackUserAction(`pdf_${action}`, {
      category: 'pdf_interaction',
      ...data
    });
  }, [trackUserAction]);

  // Video-specific tracking
  const trackVideoAction = useCallback((action: 'played' | 'paused' | 'seeked' | 'quality_changed' | 'speed_changed', data?: Record<string, any>) => {
    trackUserAction(`video_${action}`, {
      category: 'video_interaction',
      ...data
    });
  }, [trackUserAction]);

  // Download with file size tracking
  const trackDownloadWithSize = useCallback((fileSize?: string, downloadType: 'full' | 'preview' = 'full') => {
    trackFileDownload(projectId, fileId, fileType, fileSize);
    
    trackUserAction('download_initiated', {
      category: 'file_download',
      download_type: downloadType,
      file_size: fileSize
    });
  }, [projectId, fileId, fileType, trackUserAction]);

  return {
    trackFileEngagement,
    trackGalleryAction,
    trackPDFAction,
    trackVideoAction,
    trackDownloadWithSize,
    isEnabled
  };
};

/**
 * Hook for tracking user journey and onboarding
 */
export const useUserJourneyAnalytics = () => {
  const { trackEvent, isEnabled } = useAnalytics();

  const trackOnboardingStep = useCallback((step: number, stepName: string, completed: boolean = true) => {
    trackEvent(completed ? 'onboarding_step_completed' : 'onboarding_step_started', {
      category: 'onboarding',
      step_number: step,
      step_name: stepName,
      value: step
    });
  }, [trackEvent]);

  const trackConversion = useCallback((action: 'trial_started' | 'upgrade_prompted' | 'plan_selected', data?: Record<string, any>) => {
    trackEvent(`conversion_${action}`, {
      category: 'conversion',
      ...data
    });
  }, [trackEvent]);

  const trackEngagement = useCallback((milestone: 'first_project' | 'first_collaboration' | 'feature_discovery' | 'power_user', data?: Record<string, any>) => {
    trackEvent(`engagement_${milestone}`, {
      category: 'engagement',
      ...data
    });
  }, [trackEvent]);

  return {
    trackOnboardingStep,
    trackConversion,
    trackEngagement,
    isEnabled
  };
};

export default useAnalytics;