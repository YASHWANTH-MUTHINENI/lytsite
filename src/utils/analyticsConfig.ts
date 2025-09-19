// Analytics Configuration for Lytsite
// Environment-specific Google Analytics settings

interface AnalyticsConfig {
  ga4MeasurementId: string;
  gtmContainerId: string;
  enableDebug: boolean;
  enableInDevelopment: boolean;
  trackingDomains: string[];
}

// Environment configurations
const configs: Record<string, AnalyticsConfig> = {
  production: {
    ga4MeasurementId: 'G-4T2QS44067',
    gtmContainerId: 'GTM-LYTSITE1',
    enableDebug: false,
    enableInDevelopment: false,
    trackingDomains: ['lytsite.com', 'www.lytsite.com']
  },
  
  staging: {
    ga4MeasurementId: 'G-4T2QS44067', // Using same ID for now
    gtmContainerId: 'GTM-LYTSITE2',
    enableDebug: true,
    enableInDevelopment: true,
    trackingDomains: ['staging.lytsite.com']
  },
  
  development: {
    ga4MeasurementId: 'G-4T2QS44067', // Using same ID for now
    gtmContainerId: 'GTM-LYTSITE3',
    enableDebug: true,
    enableInDevelopment: true,
    trackingDomains: ['localhost', '127.0.0.1']
  }
};

// Get current environment
const getCurrentEnvironment = (): string => {
  if (typeof window === 'undefined') return 'development';
  
  const hostname = window.location.hostname;
  
  if (hostname.includes('lytsite.com') && !hostname.includes('staging')) {
    return 'production';
  } else if (hostname.includes('staging')) {
    return 'staging';
  } else {
    return 'development';
  }
};

// Get configuration for current environment
export const getAnalyticsConfig = (): AnalyticsConfig => {
  const env = getCurrentEnvironment();
  return configs[env] || configs.development;
};

// Check if analytics should be enabled
export const isAnalyticsEnabled = (): boolean => {
  const config = getAnalyticsConfig();
  const isDevelopment = getCurrentEnvironment() === 'development';
  
  return !isDevelopment || config.enableInDevelopment;
};

// Enhanced event configurations for different file types
export const FILE_TYPE_EVENTS = {
  gallery: {
    view: 'image_gallery_viewed',
    download: 'image_downloaded',
    favorite: 'image_favorited',
    share: 'gallery_shared',
    selection: 'images_selected'
  },
  pdf: {
    view: 'pdf_viewed',
    download: 'pdf_downloaded',
    page_turn: 'pdf_page_changed',
    annotation: 'pdf_annotated',
    search: 'pdf_searched'
  },
  video: {
    view: 'video_viewed',
    play: 'video_played',
    pause: 'video_paused',
    complete: 'video_completed',
    download: 'video_downloaded',
    seek: 'video_seeked'
  },
  document: {
    view: 'document_viewed',
    download: 'document_downloaded',
    edit: 'document_edited',
    export: 'document_exported'
  },
  archive: {
    view: 'archive_viewed',
    extract: 'archive_extracted',
    download: 'archive_downloaded',
    file_selected: 'archive_file_selected'
  }
};

// Feature tracking configurations
export const FEATURE_EVENTS = {
  collaboration: {
    comment_added: 'collaboration_comment_added',
    approval_given: 'collaboration_approval_given',
    user_invited: 'collaboration_user_invited',
    real_time_edit: 'collaboration_real_time_edit'
  },
  analytics: {
    dashboard_viewed: 'analytics_dashboard_viewed',
    export_report: 'analytics_report_exported',
    filter_applied: 'analytics_filter_applied'
  },
  project: {
    created: 'project_created',
    published: 'project_published',
    shared: 'project_shared',
    template_used: 'project_template_used'
  }
};

// User journey tracking
export const USER_JOURNEY_EVENTS = {
  onboarding: {
    started: 'onboarding_started',
    step_completed: 'onboarding_step_completed',
    completed: 'onboarding_completed',
    abandoned: 'onboarding_abandoned'
  },
  engagement: {
    first_project: 'engagement_first_project_created',
    first_collaboration: 'engagement_first_collaboration',
    feature_discovery: 'engagement_feature_discovered',
    power_user: 'engagement_power_user_behavior'
  },
  conversion: {
    trial_started: 'conversion_trial_started',
    upgrade_prompted: 'conversion_upgrade_prompted',
    plan_selected: 'conversion_plan_selected',
    payment_completed: 'conversion_payment_completed'
  }
};

// Custom dimensions mapping
export const CUSTOM_DIMENSIONS = {
  1: 'project_id',
  2: 'file_type', 
  3: 'user_type',
  4: 'plan_type',
  5: 'collaboration_mode',
  6: 'feature_set',
  7: 'file_size_category',
  8: 'user_tenure',
  9: 'project_complexity',
  10: 'engagement_level'
};

export default {
  getAnalyticsConfig,
  isAnalyticsEnabled,
  FILE_TYPE_EVENTS,
  FEATURE_EVENTS,
  USER_JOURNEY_EVENTS,
  CUSTOM_DIMENSIONS
};