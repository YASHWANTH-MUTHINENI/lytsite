import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  CreditCard, 
  Package, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  TrendingUp,
  Users,
  FileText
} from 'lucide-react';

interface Subscription {
  id: string;
  plan_id: string;
  status: 'active' | 'cancelled' | 'past_due' | 'trialing';
  current_period_start: string;
  current_period_end: string;
  razorpay_subscription_id?: string;
}

interface UsageSummary {
  storage_used: number;
  storage_limit: number;
  projects_count: number;
  projects_limit: number;
  collaborators_count: number;
  collaborators_limit: number;
  api_requests_count: number;
  api_requests_limit: number;
}

interface PlanConfig {
  id: string;
  name: string;
  price: number;
  currency: string;
  features: string[];
  limits: {
    storage: number;
    projects: number;
    collaborators: number;
    api_requests: number;
  };
}

const PLAN_CONFIGS: Record<string, PlanConfig> = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    currency: 'USD',
    features: [
      'Basic file delivery',
      '5 GB storage',
      'Lytsite branding',
      'Basic analytics',
      'Up to 3 active delivery links'
    ],
    limits: {
      storage: 5368709120, // 5GB
      projects: 3,
      collaborators: 1,
      api_requests: 0
    }
  },
  pro_monthly: {
    id: 'pro_monthly',
    name: 'Pro',
    price: 19,
    currency: 'USD',
    features: [
      'Everything in Free',
      'Custom branding',
      '100 GB storage',
      'Advanced analytics',
      'Unlimited delivery links',
      'Comments & feedback',
      'Client favorites',
      'Email notifications'
    ],
    limits: {
      storage: 107374182400, // 100GB
      projects: -1, // unlimited
      collaborators: 1,
      api_requests: 1000
    }
  },
  business_monthly: {
    id: 'business_monthly',
    name: 'Business',
    price: 49,
    currency: 'USD',
    features: [
      'Everything in Pro',
      'Unlimited storage',
      'CRM integrations',
      'API access',
      'Priority support',
      'Multi-user access',
      'Custom domain'
    ],
    limits: {
      storage: -1, // unlimited
      projects: -1, // unlimited
      collaborators: -1, // unlimited
      api_requests: -1 // unlimited
    }
  }
};

export default function BillingDashboard() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [usage, setUsage] = useState<UsageSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get user session ID from localStorage or generate one
  const getUserSessionId = () => {
    let sessionId = localStorage.getItem('lytsite_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('lytsite_session_id', sessionId);
    }
    return sessionId;
  };

  useEffect(() => {
    fetchBillingData();
  }, []);

  const fetchBillingData = async () => {
    try {
      setLoading(true);
      
      // Fetch subscription data
      const userSessionId = getUserSessionId();
      console.log('🔍 Fetching billing data for session:', userSessionId);
      
      const subResponse = await fetch(`https://lytsite-backend.yashwanthvarmamuthineni.workers.dev/api/billing/subscription?userEmail=${userSessionId}`);
      
      console.log('📡 Subscription response status:', subResponse.status);
      
      if (subResponse.ok) {
        const contentType = subResponse.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const subData = await subResponse.json();
          console.log('✅ Subscription data:', subData);
          setSubscription(subData.subscription);
        } else {
          console.error('❌ Subscription response is not JSON:', await subResponse.text());
        }
      } else {
        console.error('❌ Subscription request failed:', subResponse.status, await subResponse.text());
      }

      // Fetch usage data
      const usageResponse = await fetch(`https://lytsite-backend.yashwanthvarmamuthineni.workers.dev/api/billing/usage?userEmail=${userSessionId}`);
      
      console.log('📡 Usage response status:', usageResponse.status);
      
      if (usageResponse.ok) {
        const contentType = usageResponse.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const usageData = await usageResponse.json();
          console.log('✅ Usage data:', usageData);
          setUsage(usageData.currentUsage);
        } else {
          console.error('❌ Usage response is not JSON:', await usageResponse.text());
        }
      } else {
        console.error('❌ Usage request failed:', usageResponse.status, await usageResponse.text());
      }

    } catch (err) {
      console.error('💥 Billing data fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load billing data');
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (planId: string) => {
    try {
      const userSessionId = getUserSessionId();
      const params = new URLSearchParams({
        userEmail: userSessionId,
        planId: planId
      });
      
      console.log('🚀 Starting checkout for plan:', planId);
      const response = await fetch(`https://lytsite-backend.yashwanthvarmamuthineni.workers.dev/api/billing/checkout?${params}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('📡 Checkout response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Checkout data received:', data);
        
        // Initialize Razorpay checkout
        if (data.orderId && data.keyId) {
          const options = {
            key: data.keyId,
            amount: data.amount,
            currency: data.currency,
            name: 'Lytsite',
            description: `${data.planName} Subscription`,
            order_id: data.orderId,
            handler: function (response: any) {
              console.log('✅ Payment successful:', response);
              // Handle successful payment
              alert('Payment successful! Your subscription has been activated.');
              // Refresh billing data
              fetchBillingData();
            },
            prefill: {
              email: userSessionId
            },
            theme: {
              color: '#3B82F6'
            }
          };
          
          // Load Razorpay script and open checkout
          if (typeof (window as any).Razorpay === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => {
              const rzp = new (window as any).Razorpay(options);
              rzp.open();
            };
            document.body.appendChild(script);
          } else {
            const rzp = new (window as any).Razorpay(options);
            rzp.open();
          }
        } else {
          throw new Error('Invalid checkout data received');
        }
      } else {
        const errorData = await response.json();
        console.error('❌ Checkout failed:', errorData);
        throw new Error(errorData.error || 'Failed to create checkout session');
      }
    } catch (err) {
      console.error('💥 Checkout error:', err);
      setError(err instanceof Error ? err.message : 'Upgrade failed');
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'destructive' | 'secondary'> = {
      active: 'default',
      cancelled: 'destructive',
      past_due: 'destructive',
      trialing: 'secondary'
    };
    
    return (
      <Badge variant={variants[status] || 'secondary'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getCurrentPlan = () => {
    if (!subscription) return PLAN_CONFIGS.free;
    return PLAN_CONFIGS[subscription.plan_id] || PLAN_CONFIGS.free;
  };

  const getUsagePercentage = (used: number, limit: number) => {
    if (limit === -1) return 0; // unlimited
    return Math.min((used / limit) * 100, 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map(i => (
                <Card key={i}>
                  <CardHeader>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2 text-red-600">
                <AlertCircle className="h-5 w-5" />
                <span>{error}</span>
              </div>
              <Button onClick={fetchBillingData} className="mt-4">
                Retry
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const currentPlan = getCurrentPlan();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Billing Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your subscription and monitor usage</p>
          </div>
          {currentPlan.id === 'free' && (
            <Button onClick={() => handleUpgrade('pro_monthly')} className="bg-blue-600 hover:bg-blue-700">
              <TrendingUp className="h-4 w-4 mr-2" />
              Upgrade to Pro
            </Button>
          )}
        </div>

        {/* Current Plan */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Package className="h-5 w-5" />
              <span>Current Plan</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold">{currentPlan.name}</h3>
                <p className="text-gray-600">
                  {currentPlan.price > 0 ? `₹${currentPlan.price}/month` : 'Free forever'}
                </p>
                {subscription && (
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="text-sm text-gray-600">Status:</span>
                    {getStatusBadge(subscription.status)}
                  </div>
                )}
              </div>
              <div className="text-right">
                {subscription && subscription.current_period_end && (
                  <div className="text-sm text-gray-600">
                    <Clock className="h-4 w-4 inline mr-1" />
                    Renews: {new Date(subscription.current_period_end).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Usage Overview */}
        {usage && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Storage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{formatBytes(usage.storage_used)}</span>
                    <span className="text-gray-600">
                      {currentPlan.limits.storage === -1 ? 'Unlimited' : formatBytes(currentPlan.limits.storage)}
                    </span>
                  </div>
                  {currentPlan.limits.storage !== -1 && (
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${getUsagePercentage(usage.storage_used, currentPlan.limits.storage)}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                  <FileText className="h-4 w-4 mr-1" />
                  Projects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{usage.projects_count}</span>
                    <span className="text-gray-600">
                      {currentPlan.limits.projects === -1 ? 'Unlimited' : currentPlan.limits.projects}
                    </span>
                  </div>
                  {currentPlan.limits.projects !== -1 && (
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all"
                        style={{ width: `${getUsagePercentage(usage.projects_count, currentPlan.limits.projects)}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  Collaborators
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{usage.collaborators_count}</span>
                    <span className="text-gray-600">
                      {currentPlan.limits.collaborators === -1 ? 'Unlimited' : currentPlan.limits.collaborators}
                    </span>
                  </div>
                  {currentPlan.limits.collaborators !== -1 && (
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full transition-all"
                        style={{ width: `${getUsagePercentage(usage.collaborators_count, currentPlan.limits.collaborators)}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">API Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{usage.api_requests_count?.toLocaleString()}</span>
                    <span className="text-gray-600">
                      {currentPlan.limits.api_requests === -1 ? 'Unlimited' : currentPlan.limits.api_requests.toLocaleString()}
                    </span>
                  </div>
                  {currentPlan.limits.api_requests !== -1 && (
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-orange-600 h-2 rounded-full transition-all"
                        style={{ width: `${getUsagePercentage(usage.api_requests_count, currentPlan.limits.api_requests)}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Available Plans */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Available Plans</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {Object.values(PLAN_CONFIGS).map((plan) => (
              <Card key={plan.id} className={`relative ${currentPlan.id === plan.id ? 'ring-2 ring-blue-500' : ''}`}>
                {currentPlan.id === plan.id && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-600">Current Plan</Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>{plan.name}</span>
                    {plan.price > 0 && <span className="text-lg">₹{plan.price}/mo</span>}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-4">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  {currentPlan.id !== plan.id && plan.id !== 'free' && (
                    <Button 
                      onClick={() => handleUpgrade(plan.id)} 
                      className="w-full"
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Upgrade to {plan.name}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}