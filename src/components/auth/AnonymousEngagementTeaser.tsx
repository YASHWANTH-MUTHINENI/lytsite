import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  Heart, 
  MessageCircle, 
  CheckCircle, 
  TrendingUp, 
  Clock, 
  Eye,
  UserPlus,
  Sparkles,
  ArrowRight,
  Timer
} from 'lucide-react';
import { useAnonymousSession } from '../../utils/sessionManager';

interface EngagementSummary {
  total_interactions: number;
  has_comments: boolean;
  has_favorites: boolean;
  has_approvals: boolean;
  days_remaining: number;
  expires_at: string;
  project_count: number;
}

interface AnonymousEngagementTeaserProps {
  onSignUpClick: () => void;
  className?: string;
}

export function AnonymousEngagementTeaser({ onSignUpClick, className = '' }: AnonymousEngagementTeaserProps) {
  const { hasSession, getEngagementSummary } = useAnonymousSession();
  const [engagement, setEngagement] = useState<EngagementSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);

  // Check if already dismissed on mount
  useEffect(() => {
    const dismissed = localStorage.getItem('lytsite_engagement_teaser_dismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
    }
  }, []);

  const loadEngagementSummary = async () => {
    setIsLoading(true);
    try {
      const summary = await getEngagementSummary();
      
      if (summary && !summary.expired) {
        setEngagement(summary);
      } else if (summary?.expired) {
        // Handle expired case - could show different UI
        console.log('Analytics access expired');
      }
    } catch (error) {
      console.error('Failed to load engagement summary:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load engagement summary when conditions are met
  useEffect(() => {
    if (hasSession && !isDismissed) {
      loadEngagementSummary();
    } else {
      setIsLoading(false);
    }
  }, [hasSession, isDismissed]);

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('lytsite_engagement_teaser_dismissed', 'true');
  };

  // Don't show if no session, dismissed, or no engagement
  if (!hasSession || isDismissed || (engagement && engagement.total_interactions === 0)) {
    return null;
  }

  if (isLoading) {
    return (
      <Card className={`border-gradient-to-r from-blue-200 to-purple-200 bg-gradient-to-r from-blue-50 to-purple-50 mb-6 ${className}`}>
        <CardContent className="p-6">
          <div className="animate-pulse flex items-center space-x-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!engagement) {
    return null;
  }

  const getEngagementMessage = () => {
    if (engagement.total_interactions === 0) return null;
    
    const messages = [
      `🎉 Your project has ${engagement.total_interactions} interaction${engagement.total_interactions > 1 ? 's' : ''}!`,
      `📈 People are engaging with your content!`,
      `✨ Your project is getting attention!`,
      `🔥 ${engagement.total_interactions} people have interacted with your project!`
    ];
    
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const getUrgencyLevel = () => {
    if (engagement.days_remaining <= 1) return 'high';
    if (engagement.days_remaining <= 3) return 'medium';
    return 'low';
  };

  const getUrgencyColor = () => {
    const level = getUrgencyLevel();
    switch (level) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-orange-600 bg-orange-50 border-orange-200';
      default: return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const engagementTypes = [];
  if (engagement.has_comments) engagementTypes.push({ icon: MessageCircle, label: 'Comments', color: 'text-green-600' });
  if (engagement.has_favorites) engagementTypes.push({ icon: Heart, label: 'Favorites', color: 'text-red-600' });
  if (engagement.has_approvals) engagementTypes.push({ icon: CheckCircle, label: 'Approvals', color: 'text-blue-600' });

  return (
    <Card className={`border-2 ${getUrgencyColor()} mb-6 relative overflow-hidden ${className}`}>
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-purple-50/50 to-pink-50/50 animate-pulse"></div>
      
      <CardHeader className="relative pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center relative">
              <Sparkles className="w-6 h-6 text-white" />
              {engagement.total_interactions > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[20px] h-5 flex items-center justify-center">
                  {engagement.total_interactions}
                </Badge>
              )}
            </div>
            <div>
              <CardTitle className="text-lg bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">
                {getEngagementMessage()}
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                People are discovering and interacting with your content
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600"
          >
            ×
          </Button>
        </div>
      </CardHeader>

      <CardContent className="relative pt-0">
        {/* Engagement Type Hints */}
        <div className="flex flex-wrap gap-2 mb-4">
          {engagementTypes.map((type, index) => (
            <div key={index} className="flex items-center gap-1 px-3 py-1 bg-white/80 rounded-full border">
              <type.icon className={`w-4 h-4 ${type.color}`} />
              <span className="text-sm font-medium text-gray-700">{type.label}</span>
              <div className="w-8 h-2 bg-gray-200 rounded-full ml-1">
                <div className="w-full h-full bg-gradient-to-r from-gray-300 to-gray-400 rounded-full opacity-50"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Blurred Engagement Chart Teaser */}
        <div className="relative mb-4 p-4 bg-white/60 rounded-lg border-2 border-dashed border-gray-300">
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Eye className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-600">Detailed Analytics</p>
              <p className="text-xs text-gray-500">Sign up to unlock insights</p>
            </div>
          </div>
          
          {/* Mock chart background */}
          <div className="h-20 flex items-end gap-2">
            {[...Array(7)].map((_, i) => (
              <div 
                key={i} 
                className="bg-gradient-to-t from-blue-200 to-blue-300 rounded-sm flex-1"
                style={{ height: `${Math.random() * 60 + 20}%` }}
              ></div>
            ))}
          </div>
        </div>

        {/* Time Pressure & CTA */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
          <div className="flex items-center gap-2">
            <Timer className="w-5 h-5 text-amber-600" />
            <div>
              <p className="text-sm font-medium text-amber-800">
                Analytics expire in {engagement.days_remaining} day{engagement.days_remaining > 1 ? 's' : ''}
              </p>
              <p className="text-xs text-amber-600">
                Create an account to save your engagement data forever
              </p>
            </div>
          </div>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDismiss}
              className="flex-1 sm:flex-none"
            >
              Maybe Later
            </Button>
            <Button
              onClick={onSignUpClick}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white flex-1 sm:flex-none"
              size="sm"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Sign Up Free
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Feature Teasers */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
          <div className="flex items-center gap-2 text-gray-600">
            <MessageCircle className="w-3 h-3" />
            <span>Read & respond to comments</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <TrendingUp className="w-3 h-3" />
            <span>Detailed analytics & trends</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="w-3 h-3" />
            <span>Permanent data storage</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}