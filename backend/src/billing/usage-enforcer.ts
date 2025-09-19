import { Env } from '../types';
import { SubscriptionData } from '../razorpay/handler';

export interface FeatureLimits {
  monthlyProjects: number;
  maxFileSize: number; // in MB
  commentsPerProject: number; // -1 means unlimited
  analyticsLevel: 'basic' | 'advanced' | 'enterprise';
  fileRetentionDays: number;
  customBranding: boolean;
  apiAccess: boolean;
  teamMembers: number;
  storageLimit: number; // in MB
  prioritySupport: boolean;
  whiteLabel: boolean;
  ssoIntegration: boolean;
}

export const PLAN_LIMITS: Record<string, FeatureLimits> = {
  free: {
    monthlyProjects: 3, // Up to 3 active delivery links
    maxFileSize: 1000, // 1GB max file size
    commentsPerProject: 0, // No feedback system on free
    analyticsLevel: 'basic',
    fileRetentionDays: 30,
    customBranding: false,
    apiAccess: false,
    teamMembers: 1,
    storageLimit: 5000, // 5GB
    prioritySupport: false,
    whiteLabel: false,
    ssoIntegration: false
  },
  pro_monthly: {
    monthlyProjects: -1, // unlimited delivery links
    maxFileSize: 5000, // 5GB max file size
    commentsPerProject: -1, // comments & feedback included
    analyticsLevel: 'advanced',
    fileRetentionDays: 90,
    customBranding: true,
    apiAccess: false, // No API access in Pro
    teamMembers: 1,
    storageLimit: 100000, // 100GB
    prioritySupport: false,
    whiteLabel: false,
    ssoIntegration: false
  },
  pro_yearly: {
    monthlyProjects: 50,
    maxFileSize: 2000,
    commentsPerProject: -1,
    analyticsLevel: 'advanced',
    fileRetentionDays: 90,
    customBranding: true,
    apiAccess: true,
    teamMembers: 1,
    storageLimit: 50000,
    prioritySupport: true,
    whiteLabel: false,
    ssoIntegration: false
  },
  business_monthly: {
    monthlyProjects: -1, // unlimited delivery links
    maxFileSize: -1, // unlimited file size
    commentsPerProject: -1, // unlimited collaboration
    analyticsLevel: 'enterprise',
    fileRetentionDays: 365,
    customBranding: true,
    apiAccess: true, // API access included
    teamMembers: -1, // multi-user access (unlimited)
    storageLimit: -1, // unlimited storage
    prioritySupport: true,
    whiteLabel: true,
    ssoIntegration: false
  },
  business_yearly: {
    monthlyProjects: -1,
    maxFileSize: 10000,
    commentsPerProject: -1,
    analyticsLevel: 'enterprise',
    fileRetentionDays: 365,
    customBranding: true,
    apiAccess: true,
    teamMembers: 10,
    storageLimit: 500000,
    prioritySupport: true,
    whiteLabel: true,
    ssoIntegration: true
  }
};

export interface UsageData {
  user_email: string;
  month_year: string;
  projects_created: number;
  storage_used_mb: number;
  comments_made: number;
  api_calls: number;
}

export interface UsageCheckResult {
  allowed: boolean;
  reason?: string;
  upgradeRequired?: boolean;
  currentUsage?: number;
  limit?: number;
}

export class UsageLimitsEnforcer {
  private env: Env;

  constructor(env: Env) {
    this.env = env;
  }

  // Get current month-year string
  private getCurrentMonthYear(): string {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }

  // Get user's subscription
  async getUserSubscription(userEmail: string): Promise<SubscriptionData | null> {
    try {
      const result = await this.env.LYTSITE_DB.prepare(
        'SELECT * FROM subscriptions WHERE user_email = ? AND status = ? ORDER BY created_at DESC LIMIT 1'
      ).bind(userEmail, 'active').first();

      return result as SubscriptionData | null;
    } catch (error) {
      console.error('Error getting user subscription:', error);
      return null;
    }
  }

  // Get user's current usage for this month
  async getCurrentUsage(userEmail: string): Promise<UsageData> {
    const monthYear = this.getCurrentMonthYear();
    
    try {
      const result = await this.env.LYTSITE_DB.prepare(
        'SELECT * FROM usage_tracking WHERE user_email = ? AND month_year = ?'
      ).bind(userEmail, monthYear).first();

      if (result) {
        return result as UsageData;
      }

      // Create new usage record if doesn't exist
      const newUsage: UsageData = {
        user_email: userEmail,
        month_year: monthYear,
        projects_created: 0,
        storage_used_mb: 0,
        comments_made: 0,
        api_calls: 0
      };

      await this.env.LYTSITE_DB.prepare(`
        INSERT INTO usage_tracking (id, user_email, month_year, projects_created, storage_used_mb, comments_made, api_calls, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        `usage_${Date.now()}`,
        userEmail,
        monthYear,
        0, 0, 0, 0,
        Math.floor(Date.now() / 1000),
        Math.floor(Date.now() / 1000)
      ).run();

      return newUsage;
    } catch (error) {
      console.error('Error getting current usage:', error);
      return {
        user_email: userEmail,
        month_year: monthYear,
        projects_created: 0,
        storage_used_mb: 0,
        comments_made: 0,
        api_calls: 0
      };
    }
  }

  // Check if user can perform specific action
  async checkUsageLimit(
    userEmail: string, 
    operation: 'create_project' | 'upload_file' | 'add_comment' | 'api_call',
    operationSize?: number // for file uploads (in MB)
  ): Promise<UsageCheckResult> {
    try {
      const subscription = await this.getUserSubscription(userEmail);
      const planType = subscription?.plan_type || 'free';
      const limits = PLAN_LIMITS[planType];
      const usage = await this.getCurrentUsage(userEmail);

      switch (operation) {
        case 'create_project':
          if (limits.monthlyProjects === -1) {
            return { allowed: true };
          }
          if (usage.projects_created >= limits.monthlyProjects) {
            return {
              allowed: false,
              reason: `Monthly project limit reached (${limits.monthlyProjects})`,
              upgradeRequired: true,
              currentUsage: usage.projects_created,
              limit: limits.monthlyProjects
            };
          }
          break;

        case 'upload_file':
          const fileSizeMB = operationSize || 0;
          if (fileSizeMB > limits.maxFileSize) {
            return {
              allowed: false,
              reason: `File size exceeds limit (${limits.maxFileSize}MB)`,
              upgradeRequired: true,
              currentUsage: fileSizeMB,
              limit: limits.maxFileSize
            };
          }
          
          if (usage.storage_used_mb + fileSizeMB > limits.storageLimit) {
            return {
              allowed: false,
              reason: `Storage limit would be exceeded (${limits.storageLimit}MB)`,
              upgradeRequired: true,
              currentUsage: usage.storage_used_mb,
              limit: limits.storageLimit
            };
          }
          break;

        case 'add_comment':
          if (limits.commentsPerProject === -1) {
            return { allowed: true };
          }
          // This would need project-specific comment count check
          // For now, just allow if under general comment limits
          break;

        case 'api_call':
          // Could implement API rate limiting here
          break;
      }

      return { allowed: true };
    } catch (error) {
      console.error('Error checking usage limit:', error);
      // Allow the operation if we can't check limits (fail open)
      return { allowed: true };
    }
  }

  // Update usage after successful operation
  async updateUsage(
    userEmail: string,
    operation: 'create_project' | 'upload_file' | 'add_comment' | 'api_call',
    operationSize?: number
  ): Promise<void> {
    const monthYear = this.getCurrentMonthYear();

    try {
      let updateQuery = '';
      let increment = 0;

      switch (operation) {
        case 'create_project':
          updateQuery = 'UPDATE usage_tracking SET projects_created = projects_created + 1, updated_at = ? WHERE user_email = ? AND month_year = ?';
          break;

        case 'upload_file':
          const fileSizeMB = operationSize || 0;
          updateQuery = 'UPDATE usage_tracking SET storage_used_mb = storage_used_mb + ?, updated_at = ? WHERE user_email = ? AND month_year = ?';
          await this.env.LYTSITE_DB.prepare(updateQuery).bind(
            fileSizeMB,
            Math.floor(Date.now() / 1000),
            userEmail,
            monthYear
          ).run();
          return;

        case 'add_comment':
          updateQuery = 'UPDATE usage_tracking SET comments_made = comments_made + 1, updated_at = ? WHERE user_email = ? AND month_year = ?';
          break;

        case 'api_call':
          updateQuery = 'UPDATE usage_tracking SET api_calls = api_calls + 1, updated_at = ? WHERE user_email = ? AND month_year = ?';
          break;
      }

      await this.env.LYTSITE_DB.prepare(updateQuery).bind(
        Math.floor(Date.now() / 1000),
        userEmail,
        monthYear
      ).run();
    } catch (error) {
      console.error('Error updating usage:', error);
    }
  }

  // Check if user has access to feature
  hasFeatureAccess(planType: string, feature: keyof FeatureLimits): boolean {
    const limits = PLAN_LIMITS[planType] || PLAN_LIMITS.free;
    return !!limits[feature];
  }

  // Get feature limits for a plan
  getFeatureLimits(planType: string): FeatureLimits {
    // Handle simple plan type mappings
    const planMapping: Record<string, string> = {
      'pro': 'pro_monthly',
      'business': 'business_monthly'
    };
    
    const actualPlanType = planMapping[planType] || planType;
    return PLAN_LIMITS[actualPlanType] || PLAN_LIMITS.free;
  }

  // Cleanup old usage data (call this periodically)
  async cleanupOldUsageData(monthsToKeep: number = 12): Promise<void> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setMonth(cutoffDate.getMonth() - monthsToKeep);
      const cutoffMonthYear = `${cutoffDate.getFullYear()}-${String(cutoffDate.getMonth() + 1).padStart(2, '0')}`;

      await this.env.LYTSITE_DB.prepare(
        'DELETE FROM usage_tracking WHERE month_year < ?'
      ).bind(cutoffMonthYear).run();
    } catch (error) {
      console.error('Error cleaning up old usage data:', error);
    }
  }

  // Get usage summary for billing dashboard
  async getUsageSummary(userEmail: string): Promise<{
    subscription: SubscriptionData | null;
    currentUsage: UsageData;
    limits: FeatureLimits;
    utilizationPercentages: Record<string, number>;
  }> {
    const subscription = await this.getUserSubscription(userEmail);
    const currentUsage = await this.getCurrentUsage(userEmail);
    const limits = this.getFeatureLimits(subscription?.plan_type || 'free');

    const utilizationPercentages = {
      projects: limits.monthlyProjects === -1 ? 0 : (currentUsage.projects_created / limits.monthlyProjects) * 100,
      storage: (currentUsage.storage_used_mb / limits.storageLimit) * 100,
      comments: limits.commentsPerProject === -1 ? 0 : 0, // Would need project-specific calculation
      apiCalls: 0 // Would need API limit definition
    };

    return {
      subscription,
      currentUsage,
      limits,
      utilizationPercentages
    };
  }
}