import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  Bell, 
  X, 
  MessageCircle, 
  Heart, 
  CheckCircle, 
  Clock,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Settings
} from 'lucide-react';
import {
  getConversionNotifications,
  markNotificationAsRead,
  clearAllNotifications,
  getUnreadNotificationCount,
  requestNotificationPermission,
  simulateEngagementNotification,
  ConversionNotification
} from '../../utils/conversionNotifications';

interface ConversionNotificationCenterProps {
  onSignUpClick: () => void;
  className?: string;
}

export function ConversionNotificationCenter({ onSignUpClick, className = '' }: ConversionNotificationCenterProps) {
  const [notifications, setNotifications] = useState<ConversionNotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    loadNotifications();
    checkNotificationPermission();
    
    // Set up periodic refresh
    const interval = setInterval(loadNotifications, 30000); // Every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const loadNotifications = () => {
    const allNotifications = getConversionNotifications();
    setNotifications(allNotifications);
    setUnreadCount(getUnreadNotificationCount());
  };

  const checkNotificationPermission = () => {
    setHasPermission(Notification.permission === 'granted');
  };

  const handleNotificationClick = (notification: ConversionNotification) => {
    markNotificationAsRead(notification.id);
    loadNotifications();
    onSignUpClick();
  };

  const handleMarkAsRead = (notificationId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    markNotificationAsRead(notificationId);
    loadNotifications();
  };

  const handleClearAll = () => {
    clearAllNotifications();
    loadNotifications();
  };

  const handleRequestPermission = async () => {
    const granted = await requestNotificationPermission();
    setHasPermission(granted);
  };

  const handleTestNotification = () => {
    const types: Array<'comment' | 'favorite' | 'approval'> = ['comment', 'favorite', 'approval'];
    const randomType = types[Math.floor(Math.random() * types.length)];
    simulateEngagementNotification(randomType);
    setTimeout(() => loadNotifications(), 100);
  };

  const getNotificationIcon = (type: ConversionNotification['type']) => {
    switch (type) {
      case 'comment':
        return <MessageCircle className="w-4 h-4 text-blue-600" />;
      case 'favorite':
        return <Heart className="w-4 h-4 text-red-600" />;
      case 'approval':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'expiration_warning':
        return <Clock className="w-4 h-4 text-orange-600" />;
      default:
        return <Bell className="w-4 h-4 text-gray-600" />;
    }
  };

  const getUrgencyColor = (urgencyLevel: ConversionNotification['urgencyLevel']) => {
    switch (urgencyLevel) {
      case 'high':
        return 'border-red-200 bg-red-50';
      case 'medium':
        return 'border-orange-200 bg-orange-50';
      default:
        return 'border-blue-200 bg-blue-50';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  // Don't show if no notifications
  if (notifications.length === 0 && !isOpen) {
    return null;
  }

  return (
    <div className={`relative ${className}`}>
      {/* Notification Bell Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[20px] h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-96 max-w-[90vw] z-50">
          <Card className="border-2 shadow-xl">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  Engagement Alerts
                </CardTitle>
                <div className="flex items-center gap-2">
                  {process.env.NODE_ENV === 'development' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleTestNotification}
                      className="text-xs"
                    >
                      Test
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              {/* Permission Request */}
              {!hasPermission && (
                <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2 text-sm">
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    <span className="text-yellow-800">
                      Enable notifications to never miss engagement
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRequestPermission}
                    className="mt-2 text-xs"
                  >
                    <Settings className="w-3 h-3 mr-1" />
                    Enable Notifications
                  </Button>
                </div>
              )}
            </CardHeader>

            <CardContent className="pt-0">
              {notifications.length === 0 ? (
                <div className="text-center py-8">
                  <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">No notifications yet</p>
                  <p className="text-gray-400 text-xs">
                    We'll notify you when people engage with your projects
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                        getUrgencyColor(notification.urgencyLevel)
                      } ${!notification.isRead ? 'ring-2 ring-blue-200' : ''}`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 leading-snug">
                            {notification.message}
                          </p>
                          
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-500">
                              {formatTimeAgo(notification.timestamp)}
                            </span>
                            
                            <div className="flex items-center gap-2">
                              {!notification.isRead && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              )}
                              
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs px-2 py-1 h-6"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleNotificationClick(notification);
                                }}
                              >
                                {notification.ctaText}
                                <ArrowRight className="w-3 h-3 ml-1" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Actions */}
              {notifications.length > 0 && (
                <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearAll}
                    className="text-xs text-gray-500"
                  >
                    Clear All
                  </Button>
                  
                  <Button
                    onClick={onSignUpClick}
                    size="sm"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xs"
                  >
                    Sign Up Free
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}