import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent } from './ui/card';
import { Mail, Bell, BarChart3, Heart, MessageCircle, X, Check } from 'lucide-react';

interface EmailCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEmailSubmit: (email: string) => void;
  trigger: 'first_engagement' | 'high_views' | 'return_visit' | 'success_page';
  projectTitle?: string;
  isSubmitting?: boolean;
}

const triggerConfig = {
  first_engagement: {
    title: "🎉 Your project is getting attention!",
    subtitle: "Get notified when people interact with your work",
    benefits: [
      { icon: MessageCircle, text: "New comments & feedback" },
      { icon: Heart, text: "When people favorite your work" },
      { icon: Bell, text: "Real-time notifications" }
    ],
    cta: "Get Notifications",
    skipText: "Maybe later"
  },
  high_views: {
    title: "📈 Your project is trending!",
    subtitle: "Track your performance and never miss engagement",
    benefits: [
      { icon: BarChart3, text: "View analytics & insights" },
      { icon: MessageCircle, text: "Comment notifications" },
      { icon: Bell, text: "Performance updates" }
    ],
    cta: "Track Performance",
    skipText: "Skip for now"
  },
  return_visit: {
    title: "👋 Welcome back!",
    subtitle: "Stay connected with your projects",
    benefits: [
      { icon: Bell, text: "Never miss feedback" },
      { icon: BarChart3, text: "Project performance updates" },
      { icon: Heart, text: "Engagement notifications" }
    ],
    cta: "Stay Connected",
    skipText: "Continue without notifications"
  },
  success_page: {
    title: "🚀 Project published successfully!",
    subtitle: "Want to know when people interact with it?",
    benefits: [
      { icon: MessageCircle, text: "Comment notifications" },
      { icon: Heart, text: "New favorites alerts" },
      { icon: BarChart3, text: "View tracking" }
    ],
    cta: "Enable Notifications",
    skipText: "Skip notifications"
  }
};

export function EmailCollectionModal({ 
  isOpen, 
  onClose, 
  onEmailSubmit, 
  trigger, 
  projectTitle,
  isSubmitting = false 
}: EmailCollectionModalProps) {
  const [email, setEmail] = useState('');
  const [isValid, setIsValid] = useState(false);

  const config = triggerConfig[trigger];

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const valid = emailRegex.test(email);
    setIsValid(valid);
    return valid;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    validateEmail(newEmail);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid && !isSubmitting) {
      onEmailSubmit(email);
    }
  };

  const handleSkip = () => {
    // Track skip event for analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'email_collection_skipped', {
        trigger: trigger,
        project_title: projectTitle
      });
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold text-gray-900">
              {config.title}
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={handleSkip}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          <p className="text-gray-600 text-sm">
            {config.subtitle}
            {projectTitle && (
              <span className="block mt-1 font-medium text-gray-900">
                "{projectTitle}"
              </span>
            )}
          </p>

          {/* Benefits List */}
          <div className="space-y-3">
            {config.benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center">
                  <benefit.icon className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-sm text-gray-700">{benefit.text}</span>
              </div>
            ))}
          </div>

          {/* Email Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email address
              </Label>
              <div className="mt-1 relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="your@email.com"
                  className="pl-10"
                  required
                />
                {isValid && (
                  <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-500" />
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={!isValid || isSubmitting}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? 'Setting up...' : config.cta}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleSkip}
                className="px-4"
              >
                {config.skipText}
              </Button>
            </div>
          </form>

          <p className="text-xs text-gray-500 text-center">
            We'll only send you notifications about your projects. No spam, unsubscribe anytime.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}