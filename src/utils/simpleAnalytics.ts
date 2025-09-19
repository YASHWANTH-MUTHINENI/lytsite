// Simple Google Analytics utility for immediate use
// Basic tracking functions for Lytsite

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

// Simple tracking functions
export const trackPageView = (pagePath?: string, pageTitle?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'G-4T2QS44067', {
      page_path: pagePath || window.location.pathname,
      page_title: pageTitle || document.title
    });
  }
};

export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters);
  }
};

// File interaction events
export const trackFileView = (fileType: string, projectId?: string) => {
  trackEvent('file_view', {
    file_type: fileType,
    project_id: projectId
  });
};

export const trackFileDownload = (fileType: string, fileName?: string, projectId?: string) => {
  trackEvent('file_download', {
    file_type: fileType,
    file_name: fileName,
    project_id: projectId
  });
};

export const trackProjectCreate = (projectType?: string) => {
  trackEvent('project_create', {
    project_type: projectType
  });
};

export const trackUserSignup = (method?: string) => {
  trackEvent('sign_up', {
    method: method || 'email'
  });
};

export const trackFeatureUse = (featureName: string, context?: string) => {
  trackEvent('feature_use', {
    feature_name: featureName,
    context: context
  });
};

// Simple page tracking for React Router
export const usePageTracking = () => {
  if (typeof window !== 'undefined') {
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    window.history.pushState = function(...args) {
      originalPushState.apply(window.history, args);
      setTimeout(() => trackPageView(), 0);
    };

    window.history.replaceState = function(...args) {
      originalReplaceState.apply(window.history, args);
      setTimeout(() => trackPageView(), 0);
    };

    window.addEventListener('popstate', () => {
      setTimeout(() => trackPageView(), 0);
    });
  }
};

// Initialize tracking
if (typeof window !== 'undefined') {
  // Track initial page load
  window.addEventListener('load', () => {
    trackPageView();
  });

  // Set up automatic page tracking for SPAs
  usePageTracking();
}

export default {
  trackPageView,
  trackEvent,
  trackFileView,
  trackFileDownload,
  trackProjectCreate,
  trackUserSignup,
  trackFeatureUse
};