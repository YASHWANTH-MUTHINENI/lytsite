// Google Analytics 4 Integration for Lytsite
// Enhanced tracking for file collaboration and engagement analytics

export interface GAEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
}

export interface GAPageView {
  page_title: string;
  page_location: string;
  project_id?: string;
  file_type?: string;
  user_type?: 'authenticated' | 'anonymous';
}

export interface GAUser {
  user_id?: string;
  user_properties?: {
    account_type?: 'free' | 'pro' | 'enterprise';
    signup_date?: string;
    total_projects?: number;
  };
}

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

class LytsiteAnalytics {
  private isInitialized = false;
  private measurementId = 'G-4T2QS44067';

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window === 'undefined') return;

    // Initialize dataLayer if it doesn't exist
    window.dataLayer = window.dataLayer || [];
    
    // Check if gtag is loaded
    if (typeof window.gtag === 'function') {
      this.isInitialized = true;
      console.log('✅ Google Analytics initialized for Lytsite');
    } else {
      // Wait for gtag to load
      const checkGtag = setInterval(() => {
        if (typeof window.gtag === 'function') {
          this.isInitialized = true;
          console.log('✅ Google Analytics initialized for Lytsite');
          clearInterval(checkGtag);
        }
      }, 100);

      // Stop checking after 10 seconds
      setTimeout(() => clearInterval(checkGtag), 10000);
    }
  }

  // Enhanced page tracking for file collaboration
  trackPageView(data: GAPageView) {
    if (!this.isInitialized || typeof window.gtag !== 'function') return;

    window.gtag('config', this.measurementId, {
      page_title: data.page_title,
      page_location: data.page_location,
      custom_map: {
        'dimension1': 'project_id',
        'dimension2': 'file_type', 
        'dimension3': 'user_type'
      }
    });

    // Send custom dimensions
    if (data.project_id || data.file_type || data.user_type) {
      window.gtag('event', 'page_view', {
        project_id: data.project_id,
        file_type: data.file_type,
        user_type: data.user_type
      });
    }

    console.log('📊 Page view tracked:', data);
  }

  // File engagement events
  trackFileEngagement(action: 'view' | 'download' | 'share' | 'favorite' | 'comment' | 'approve', data: {
    project_id: string;
    file_id: string;
    file_type: string;
    file_size?: string;
    user_type?: string;
  }) {
    if (!this.isInitialized) return;

    window.gtag('event', action, {
      event_category: 'file_engagement',
      event_label: `${data.file_type}_${action}`,
      project_id: data.project_id,
      file_id: data.file_id,
      file_type: data.file_type,
      file_size: data.file_size,
      user_type: data.user_type,
      value: this.getActionValue(action)
    });

    console.log(`📊 File ${action} tracked:`, data);
  }

  // Project creation and management
  trackProjectEvent(action: 'create' | 'edit' | 'delete' | 'publish' | 'unpublish', data: {
    project_id: string;
    file_count?: number;
    project_type?: string;
    features_enabled?: string[];
  }) {
    if (!this.isInitialized) return;

    window.gtag('event', `project_${action}`, {
      event_category: 'project_management',
      project_id: data.project_id,
      file_count: data.file_count,
      project_type: data.project_type,
      features_enabled: data.features_enabled?.join(','),
      value: action === 'create' ? 10 : 1
    });

    console.log(`📊 Project ${action} tracked:`, data);
  }

  // User authentication and engagement
  trackUserEvent(action: 'signup' | 'login' | 'logout' | 'upgrade' | 'downgrade', data: {
    method?: string;
    user_type?: string;
    plan_type?: string;
  } = {}) {
    if (!this.isInitialized) return;

    window.gtag('event', action, {
      event_category: 'user_engagement',
      method: data.method,
      user_type: data.user_type,
      plan_type: data.plan_type,
      value: action === 'signup' ? 20 : action === 'upgrade' ? 50 : 1
    });

    console.log(`📊 User ${action} tracked:`, data);
  }

  // Collaboration features
  trackCollaboration(action: 'invite_sent' | 'invite_accepted' | 'comment_added' | 'approval_given', data: {
    project_id: string;
    collaboration_type?: 'real_time' | 'async';
    participant_count?: number;
  }) {
    if (!this.isInitialized) return;

    window.gtag('event', action, {
      event_category: 'collaboration',
      project_id: data.project_id,
      collaboration_type: data.collaboration_type,
      participant_count: data.participant_count,
      value: 5
    });

    console.log(`📊 Collaboration ${action} tracked:`, data);
  }

  // Feature usage tracking
  trackFeatureUsage(feature: string, data: {
    project_id?: string;
    usage_context?: string;
    feature_value?: string;
  } = {}) {
    if (!this.isInitialized) return;

    window.gtag('event', 'feature_usage', {
      event_category: 'features',
      event_label: feature,
      project_id: data.project_id,
      usage_context: data.usage_context,
      feature_value: data.feature_value,
      value: 1
    });

    console.log(`📊 Feature usage tracked: ${feature}`, data);
  }

  // Performance and errors
  trackPerformance(metric: 'page_load' | 'file_upload' | 'file_processing', data: {
    duration?: number;
    file_size?: string;
    error?: string;
  }) {
    if (!this.isInitialized) return;

    if (data.error) {
      window.gtag('event', 'exception', {
        description: `${metric}_error: ${data.error}`,
        fatal: false
      });
    } else {
      window.gtag('event', metric, {
        event_category: 'performance',
        duration: data.duration,
        file_size: data.file_size,
        value: data.duration
      });
    }

    console.log(`📊 Performance tracked: ${metric}`, data);
  }

  // Business metrics
  trackConversion(action: 'trial_started' | 'subscription_purchased' | 'feature_upgraded', data: {
    plan_type?: string;
    price?: number;
    currency?: string;
    trial_length?: number;
  }) {
    if (!this.isInitialized) return;

    window.gtag('event', 'purchase', {
      transaction_id: `lytsite_${Date.now()}`,
      value: data.price || 0,
      currency: data.currency || 'USD',
      items: [{
        item_id: data.plan_type,
        item_name: `Lytsite ${data.plan_type} Plan`,
        category: 'subscription',
        quantity: 1,
        price: data.price || 0
      }]
    });

    // Also track as custom conversion
    window.gtag('event', action, {
      event_category: 'conversion',
      plan_type: data.plan_type,
      value: data.price || 0,
      trial_length: data.trial_length
    });

    console.log(`📊 Conversion tracked: ${action}`, data);
  }

  // Set user properties
  setUser(data: GAUser) {
    if (!this.isInitialized) return;

    if (data.user_id) {
      window.gtag('config', this.measurementId, {
        user_id: data.user_id
      });
    }

    if (data.user_properties) {
      window.gtag('event', 'user_properties', data.user_properties);
    }

    console.log('📊 User properties set:', data);
  }

  // Custom event tracking
  trackCustomEvent(event: GAEvent) {
    if (!this.isInitialized) return;

    window.gtag('event', event.action, {
      event_category: event.category,
      event_label: event.label,
      value: event.value,
      ...event.custom_parameters
    });

    console.log('📊 Custom event tracked:', event);
  }

  // Helper method to assign values to actions
  private getActionValue(action: string): number {
    const values = {
      'view': 1,
      'download': 5,
      'share': 3,
      'favorite': 2,
      'comment': 4,
      'approve': 6
    };
    return values[action as keyof typeof values] || 1;
  }

  // Enhanced ecommerce tracking
  trackEcommerce(action: 'begin_checkout' | 'add_payment_info' | 'purchase', data: {
    transaction_id?: string;
    value: number;
    currency: string;
    items: Array<{
      item_id: string;
      item_name: string;
      category: string;
      quantity: number;
      price: number;
    }>;
  }) {
    if (!this.isInitialized) return;

    window.gtag('event', action, {
      transaction_id: data.transaction_id,
      value: data.value,
      currency: data.currency,
      items: data.items
    });

    console.log(`📊 Ecommerce ${action} tracked:`, data);
  }
}

// Create singleton instance
export const analytics = new LytsiteAnalytics();

// Convenience functions for common tracking scenarios
export const trackFileView = (projectId: string, fileId: string, fileType: string) => {
  analytics.trackFileEngagement('view', {
    project_id: projectId,
    file_id: fileId,
    file_type: fileType
  });
};

export const trackFileDownload = (projectId: string, fileId: string, fileType: string, fileSize?: string) => {
  analytics.trackFileEngagement('download', {
    project_id: projectId,
    file_id: fileId,
    file_type: fileType,
    file_size: fileSize
  });
};

export const trackUserSignup = (method: string = 'email') => {
  analytics.trackUserEvent('signup', { method });
};

export const trackFeature = (feature: string, projectId?: string) => {
  analytics.trackFeatureUsage(feature, { project_id: projectId });
};

export default analytics;