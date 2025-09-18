/**
 * Conversion-Driven Notification System
 * Strategically sends notifications to anonymous users when their projects receive engagement
 * to drive sign-up conversions at optimal moments
 */

import { getAnonymousSessionId } from './sessionManager';

const API_BASE = process.env.NODE_ENV === 'production' 
  ? 'https://lytsite-backend.yashwanthvarmamuthineni.workers.dev'
  : 'https://lytsite-backend.yashwanthvarmamuthineni.workers.dev';

export interface NotificationTrigger {
  type: 'comment' | 'favorite' | 'approval' | 'expiration_warning';
  projectId: string;
  anonymousSessionId: string;
  message: string;
  ctaText: string;
  urgencyLevel: 'low' | 'medium' | 'high';
}

export interface ConversionNotification {
  id: string;
  type: NotificationTrigger['type'];
  message: string;
  ctaText: string;
  timestamp: string;
  isRead: boolean;
  urgencyLevel: 'low' | 'medium' | 'high';
  expiresAt?: string;
}

// Local storage key for notifications
const NOTIFICATION_STORAGE_KEY = 'lytsite_conversion_notifications';
const NOTIFICATION_SETTINGS_KEY = 'lytsite_notification_settings';

/**
 * Generate conversion-focused notification messages based on engagement type
 */
export function generateConversionMessage(type: NotificationTrigger['type'], count?: number): { message: string; ctaText: string; urgencyLevel: NotificationTrigger['urgencyLevel'] } {
  const messages = {
    comment: {
      message: count && count > 1 
        ? `🗨️ ${count} people commented on your project! Join the conversation.`
        : `🗨️ Someone just commented on your project! See what they said.`,
      ctaText: 'Read & Respond',
      urgencyLevel: 'high' as const
    },
    favorite: {
      message: count && count > 1 
        ? `❤️ ${count} people favorited your project! See who loves your work.`
        : `❤️ Someone just favorited your project! See who loves your work.`,
      ctaText: 'See Who Favorited',
      urgencyLevel: 'medium' as const
    },
    approval: {
      message: count && count > 1 
        ? `✅ ${count} people approved your project! Your work is making an impact.`
        : `✅ Someone just approved your project! Your work is making an impact.`,
      ctaText: 'View Approvals',
      urgencyLevel: 'medium' as const
    },
    expiration_warning: {
      message: `⏰ Your project analytics expire soon! Sign up now to save your engagement data forever.`,
      ctaText: 'Save My Data',
      urgencyLevel: 'high' as const
    }
  };

  return messages[type];
}

/**
 * Add a new conversion notification to local storage
 */
export function addConversionNotification(trigger: NotificationTrigger): void {
  const notifications = getConversionNotifications();
  const { message, ctaText, urgencyLevel } = generateConversionMessage(trigger.type);
  
  const newNotification: ConversionNotification = {
    id: `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: trigger.type,
    message: trigger.message || message,
    ctaText: trigger.ctaText || ctaText,
    timestamp: new Date().toISOString(),
    isRead: false,
    urgencyLevel: trigger.urgencyLevel || urgencyLevel,
    expiresAt: trigger.type === 'expiration_warning' 
      ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
      : undefined
  };

  // Add to beginning of array (newest first)
  notifications.unshift(newNotification);
  
  // Keep only the 10 most recent notifications
  const recentNotifications = notifications.slice(0, 10);
  
  localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(recentNotifications));
  
  // Show browser notification if permission granted
  showBrowserNotification(newNotification);
}

/**
 * Get all conversion notifications from local storage
 */
export function getConversionNotifications(): ConversionNotification[] {
  try {
    const stored = localStorage.getItem(NOTIFICATION_STORAGE_KEY);
    if (!stored) return [];
    
    const notifications: ConversionNotification[] = JSON.parse(stored);
    
    // Filter out expired notifications
    const now = new Date();
    const activeNotifications = notifications.filter(notification => {
      if (!notification.expiresAt) return true;
      return new Date(notification.expiresAt) > now;
    });
    
    // Update storage if we filtered out expired notifications
    if (activeNotifications.length !== notifications.length) {
      localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(activeNotifications));
    }
    
    return activeNotifications;
  } catch (error) {
    console.error('Failed to load conversion notifications:', error);
    return [];
  }
}

/**
 * Mark a notification as read
 */
export function markNotificationAsRead(notificationId: string): void {
  const notifications = getConversionNotifications();
  const updated = notifications.map(notification => 
    notification.id === notificationId 
      ? { ...notification, isRead: true }
      : notification
  );
  
  localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(updated));
}

/**
 * Get count of unread notifications
 */
export function getUnreadNotificationCount(): number {
  const notifications = getConversionNotifications();
  return notifications.filter(n => !n.isRead).length;
}

/**
 * Clear all notifications
 */
export function clearAllNotifications(): void {
  localStorage.removeItem(NOTIFICATION_STORAGE_KEY);
}

/**
 * Request browser notification permission
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission === 'denied') {
    return false;
  }

  const permission = await Notification.requestPermission();
  return permission === 'granted';
}

/**
 * Show browser notification for engagement
 */
function showBrowserNotification(notification: ConversionNotification): void {
  if (Notification.permission !== 'granted') return;

  const browserNotification = new Notification('Lytsite - Your project got engagement! 🎉', {
    body: notification.message,
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    tag: `lytsite-${notification.type}`,
    requireInteraction: notification.urgencyLevel === 'high'
  });

  browserNotification.onclick = () => {
    window.focus();
    // Navigate to sign up or project
    window.location.href = '/dashboard';
    browserNotification.close();
  };

  // Auto close after 10 seconds unless high urgency
  if (notification.urgencyLevel !== 'high') {
    setTimeout(() => {
      browserNotification.close();
    }, 10000);
  }
}

/**
 * Notification settings management
 */
export interface NotificationSettings {
  enableBrowserNotifications: boolean;
  enableEmailNotifications: boolean;
  notificationFrequency: 'immediate' | 'hourly' | 'daily';
  enabledTypes: NotificationTrigger['type'][];
}

export function getNotificationSettings(): NotificationSettings {
  const defaultSettings: NotificationSettings = {
    enableBrowserNotifications: true,
    enableEmailNotifications: false, // Requires email collection
    notificationFrequency: 'immediate',
    enabledTypes: ['comment', 'favorite', 'approval', 'expiration_warning']
  };

  try {
    const stored = localStorage.getItem(NOTIFICATION_SETTINGS_KEY);
    if (!stored) return defaultSettings;
    
    return { ...defaultSettings, ...JSON.parse(stored) };
  } catch (error) {
    console.error('Failed to load notification settings:', error);
    return defaultSettings;
  }
}

export function updateNotificationSettings(settings: Partial<NotificationSettings>): void {
  const current = getNotificationSettings();
  const updated = { ...current, ...settings };
  localStorage.setItem(NOTIFICATION_SETTINGS_KEY, JSON.stringify(updated));
}

/**
 * Simulate engagement notifications for testing
 * In production, these would be triggered by backend events
 */
export function simulateEngagementNotification(type: NotificationTrigger['type'] = 'comment'): void {
  const sessionId = getAnonymousSessionId();
  const trigger: NotificationTrigger = {
    type,
    projectId: 'demo_project',
    anonymousSessionId: sessionId,
    message: generateConversionMessage(type).message,
    ctaText: generateConversionMessage(type).ctaText,
    urgencyLevel: generateConversionMessage(type).urgencyLevel
  };
  
  addConversionNotification(trigger);
}

/**
 * Poll for new engagement notifications
 * In production, this would be replaced with websockets or server-sent events
 */
export async function pollForEngagementUpdates(): Promise<void> {
  const sessionId = getAnonymousSessionId();
  
  try {
    // This would be a real API call to check for new engagement
    const response = await fetch(`${API_BASE}/api/engagement/anonymous/${sessionId}/updates`);
    
    if (response.ok) {
      const updates = await response.json();
      
      // Process each engagement update
      updates.forEach((update: any) => {
        const trigger: NotificationTrigger = {
          type: update.type,
          projectId: update.project_id,
          anonymousSessionId: sessionId,
          message: update.message,
          ctaText: update.cta_text,
          urgencyLevel: update.urgency_level
        };
        
        addConversionNotification(trigger);
      });
    }
  } catch (error) {
    console.error('Failed to poll for engagement updates:', error);
  }
}

/**
 * Start polling for engagement updates
 */
export function startEngagementPolling(intervalMs: number = 60000): () => void {
  const interval = setInterval(() => {
    pollForEngagementUpdates();
  }, intervalMs);

  // Return cleanup function
  return () => clearInterval(interval);
}