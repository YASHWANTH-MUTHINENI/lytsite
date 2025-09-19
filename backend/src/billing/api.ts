import { Env } from '../types';
import { RazorpayHandler, PLAN_CONFIGS } from '../razorpay/handler';
import { UsageLimitsEnforcer } from '../billing/usage-enforcer';

export class BillingAPI {
  private env: Env;
  private razorpay: RazorpayHandler;
  private usageEnforcer: UsageLimitsEnforcer;

  constructor(env: Env) {
    this.env = env;
    this.razorpay = new RazorpayHandler(env);
    this.usageEnforcer = new UsageLimitsEnforcer(env);
  }

  // Handle billing API routes
  async handleRequest(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (method === 'OPTIONS') {
      return new Response(null, { status: 200, headers: corsHeaders });
    }

    try {
      // Extract user email from Authorization header or request body
      const userEmail = await this.extractUserEmail(request);
      if (!userEmail) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
          status: 401, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        });
      }

      // Route handling
      if (path === '/api/billing/subscription' && method === 'GET') {
        return await this.getSubscriptionStatus(userEmail, corsHeaders);
      }

      if (path === '/api/billing/usage' && method === 'GET') {
        return await this.getUsageSummary(userEmail, corsHeaders);
      }

      if (path === '/api/billing/plans' && method === 'GET') {
        return await this.getAvailablePlans(corsHeaders);
      }

      if (path === '/api/billing/checkout' && method === 'POST') {
        return await this.createCheckoutSession(request, userEmail, corsHeaders);
      }

      if (path === '/api/billing/cancel' && method === 'POST') {
        return await this.cancelSubscription(userEmail, corsHeaders);
      }

      if (path === '/api/billing/webhook' && method === 'POST') {
        return await this.handleWebhook(request);
      }

      return new Response(JSON.stringify({ error: 'Not found' }), { 
        status: 404, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      });
    } catch (error) {
      console.error('Billing API error:', error);
      return new Response(JSON.stringify({ error: 'Internal server error' }), { 
        status: 500, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      });
    }
  }

  // Extract user email from request
  private async extractUserEmail(request: Request): Promise<string | null> {
    try {
      // Try to get from Authorization header first
      const authHeader = request.headers.get('Authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        // You can implement JWT token verification here
        // For now, we'll extract from request body or query params
      }

      // Try to get from query parameters first (for GET requests)
      const url = new URL(request.url);
      const userEmail = url.searchParams.get('userEmail') || url.searchParams.get('user_email');
      if (userEmail) {
        return userEmail;
      }

      // Try to get from request body
      const contentType = request.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const body = await request.json() as any;
        return body.user_email || body.userEmail || null;
      }

      return null;
    } catch (error) {
      console.error('Error extracting user email:', error);
      return null;
    }
  }

  // Get subscription status
  private async getSubscriptionStatus(userEmail: string, corsHeaders: Record<string, string>): Promise<Response> {
    const subscription = await this.razorpay.getSubscriptionStatus(userEmail);
    
    return new Response(JSON.stringify({ 
      subscription: subscription || { plan_type: 'free', status: 'active' }
    }), { 
      status: 200, 
      headers: { 'Content-Type': 'application/json', ...corsHeaders } 
    });
  }

  // Get usage summary
  private async getUsageSummary(userEmail: string, corsHeaders: Record<string, string>): Promise<Response> {
    const summary = await this.usageEnforcer.getUsageSummary(userEmail);
    
    return new Response(JSON.stringify(summary), { 
      status: 200, 
      headers: { 'Content-Type': 'application/json', ...corsHeaders } 
    });
  }

  // Get available plans
  private async getAvailablePlans(corsHeaders: Record<string, string>): Promise<Response> {
    const plans = Object.entries(PLAN_CONFIGS).map(([key, config]) => ({
      id: key,
      name: config.name,
      amount: config.amount,
      currency: config.currency,
      period: config.period,
      interval: config.interval,
      features: this.usageEnforcer.getFeatureLimits(key)
    }));

    return new Response(JSON.stringify({ plans }), { 
      status: 200, 
      headers: { 'Content-Type': 'application/json', ...corsHeaders } 
    });
  }

  // Create checkout session
  private async createCheckoutSession(request: Request, userEmail: string, corsHeaders: Record<string, string>): Promise<Response> {
    console.log('=== CHECKOUT DEBUG ===');
    console.log('User Email:', userEmail);
    
    // Get planId from query parameters first, then try request body
    const url = new URL(request.url);
    let planId = url.searchParams.get('planId');
    console.log('Plan ID from query:', planId);
    
    if (!planId) {
      try {
        const body = await request.json();
        planId = (body as any).planId;
        console.log('Plan ID from body:', planId);
      } catch {
        // If no body, continue with null planId
        console.log('No body or failed to parse body');
      }
    }

    console.log('Available plans:', Object.keys(PLAN_CONFIGS));
    console.log('Requested plan ID:', planId);

    if (!planId || !PLAN_CONFIGS[planId]) {
      console.log('ERROR: Invalid plan ID');
      return new Response(JSON.stringify({ 
        error: 'Invalid plan ID', 
        planId: planId, 
        availablePlans: Object.keys(PLAN_CONFIGS) 
      }), { 
        status: 400, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      });
    }

    try {
      const planConfig = PLAN_CONFIGS[planId];
      console.log('Plan config:', planConfig);
      console.log('Razorpay key ID:', this.env.RAZORPAY_KEY_ID ? 'SET' : 'MISSING');
      
      // Create order for subscription
      console.log('Creating Razorpay order...');
      
      // Generate short receipt (max 40 chars)
      const timestamp = Date.now().toString().slice(-8); // Last 8 digits
      const shortReceipt = `sub_${timestamp}_${planId.slice(0, 10)}`;
      console.log('Receipt:', shortReceipt, 'Length:', shortReceipt.length);
      
      const order = await this.razorpay.createOrder(
        planConfig.amount,
        planConfig.currency,
        shortReceipt
      );
      console.log('Order created:', order);

      // Return order details for frontend checkout
      const checkoutData = {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: this.env.RAZORPAY_KEY_ID,
        planId: planId,
        planName: planConfig.name
      };

      console.log('Returning checkout data:', checkoutData);
      return new Response(JSON.stringify(checkoutData), { 
        status: 200, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      });
    } catch (error) {
      console.error('Error creating checkout session:', error);
      console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
      return new Response(JSON.stringify({ 
        error: 'Failed to create checkout session',
        details: error instanceof Error ? error.message : 'Unknown error'
      }), { 
        status: 500, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      });
    }
  }

  // Cancel subscription
  private async cancelSubscription(userEmail: string, corsHeaders: Record<string, string>): Promise<Response> {
    const success = await this.razorpay.cancelSubscription(userEmail);
    
    if (success) {
      return new Response(JSON.stringify({ success: true, message: 'Subscription cancelled' }), { 
        status: 200, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      });
    } else {
      return new Response(JSON.stringify({ error: 'Failed to cancel subscription' }), { 
        status: 400, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      });
    }
  }

  // Handle Razorpay webhooks
  private async handleWebhook(request: Request): Promise<Response> {
    return await this.razorpay.handleWebhook(request);
  }

  // Check if user can perform operation (used by other APIs)
  async checkOperationAllowed(userEmail: string, operation: string, size?: number): Promise<{allowed: boolean, reason?: string}> {
    const result = await this.usageEnforcer.checkUsageLimit(
      userEmail, 
      operation as any, 
      size
    );
    return { allowed: result.allowed, reason: result.reason };
  }

  // Update usage after operation (used by other APIs)
  async recordUsage(userEmail: string, operation: string, size?: number): Promise<void> {
    await this.usageEnforcer.updateUsage(userEmail, operation as any, size);
  }
}