import { Env } from '../types';

// Simple HMAC implementation for Cloudflare Workers
async function createHmac(data: string, secret: string): Promise<string> {
  const key = await globalThis.crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await globalThis.crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(data)
  );
  const hashArray = Array.from(new Uint8Array(signature));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export interface PlanConfig {
  id: string;
  name: string;
  amount: number; // in paise
  currency: string;
  period: 'monthly' | 'yearly';
  interval: number;
}

export const PLAN_CONFIGS: Record<string, PlanConfig> = {
  pro_monthly: {
    id: 'pro_monthly',
    name: 'Pro Plan Monthly',
    amount: 157700, // $19 USD ≈ ₹1577 in paise
    currency: 'INR',
    period: 'monthly',
    interval: 1
  },
  pro_yearly: {
    id: 'pro_yearly',
    name: 'Pro Plan Yearly',
    amount: 1516800, // $15.20 × 12 USD ≈ ₹15168 in paise (20% discount)
    currency: 'INR',
    period: 'yearly',
    interval: 1
  },
  business_monthly: {
    id: 'business_monthly',
    name: 'Business Plan Monthly',
    amount: 406700, // $49 USD ≈ ₹4067 in paise
    currency: 'INR',
    period: 'monthly',
    interval: 1
  },
  business_yearly: {
    id: 'business_yearly',
    name: 'Business Plan Yearly',
    amount: 3914400, // $39.20 × 12 USD ≈ ₹39144 in paise (20% discount)
    currency: 'INR',
    period: 'yearly',
    interval: 1
  }
};

export interface SubscriptionData {
  id: string;
  user_email: string;
  razorpay_subscription_id?: string;
  razorpay_customer_id?: string;
  plan_type: string;
  status: string;
  current_period_start?: number;
  current_period_end?: number;
  cancel_at_period_end: boolean;
  created_at: number;
  updated_at: number;
}

export interface PaymentData {
  id: string;
  user_email: string;
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  amount: number;
  currency: string;
  status: string;
  method: string;
  created_at: number;
}

export class RazorpayHandler {
  private env: Env;
  private baseUrl = 'https://api.razorpay.com/v1';

  constructor(env: Env) {
    this.env = env;
  }

  private getAuthHeaders(): Record<string, string> {
    const credentials = btoa(`${this.env.RAZORPAY_KEY_ID}:${this.env.RAZORPAY_KEY_SECRET}`);
    return {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/json'
    };
  }

  private async makeRequest(endpoint: string, method: string = 'GET', body?: any): Promise<any> {
    const headers = {
      ...this.getAuthHeaders(),
      ...(body ? { 'Content-Type': 'application/json' } : {})
    };

    console.log(`🔥 Razorpay API: ${method} ${this.baseUrl}${endpoint}`);
    console.log('🔑 Headers:', headers);
    if (body) console.log('📦 Body:', body);

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined
    });

    console.log(`📡 Razorpay response: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Razorpay API error response:', errorText);
      throw new Error(`Razorpay API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const responseData = await response.json();
    console.log('✅ Razorpay response data:', responseData);
    return responseData;
  }

  // Create a Razorpay customer
  async createCustomer(userEmail: string, userName?: string): Promise<any> {
    try {
      const customer = await this.makeRequest('/customers', 'POST', {
        email: userEmail,
        name: userName || 'Lytsite User',
        fail_existing: false // Don't fail if customer already exists
      });
      return customer;
    } catch (error) {
      console.error('Error creating Razorpay customer:', error);
      throw error;
    }
  }

  // Create a subscription plan in Razorpay
  async createPlan(planConfig: PlanConfig): Promise<any> {
    try {
      const plan = await this.makeRequest('/plans', 'POST', {
        period: planConfig.period,
        interval: planConfig.interval,
        item: {
          name: planConfig.name,
          amount: planConfig.amount,
          currency: planConfig.currency,
          description: `${planConfig.name} - Lytsite Subscription`
        }
      });
      return plan;
    } catch (error) {
      console.error('Error creating Razorpay plan:', error);
      throw error;
    }
  }

  // Create a subscription for a customer
  async createSubscription(userEmail: string, planId: string): Promise<any> {
    try {
      const planConfig = PLAN_CONFIGS[planId];
      if (!planConfig) {
        throw new Error(`Invalid plan ID: ${planId}`);
      }

      // Get or create customer
      let customer = await this.createCustomer(userEmail);

      // Create subscription
      const subscription = await this.makeRequest('/subscriptions', 'POST', {
        plan_id: planConfig.id, // This should be the Razorpay plan ID
        customer_notify: 1,
        total_count: 12, // For yearly plans, adjust as needed
        start_at: Math.floor(Date.now() / 1000), // Start immediately
        expire_by: Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60), // 1 year expiry
        notes: {
          user_email: userEmail,
          plan_type: planId
        }
      });

      // Save subscription to database
      await this.saveSubscription({
        id: `sub_${Date.now()}`,
        user_email: userEmail,
        razorpay_subscription_id: subscription.id,
        razorpay_customer_id: customer.id,
        plan_type: planId,
        status: 'active',
        current_period_start: subscription.current_start || undefined,
        current_period_end: subscription.current_end || undefined,
        cancel_at_period_end: false,
        created_at: Math.floor(Date.now() / 1000),
        updated_at: Math.floor(Date.now() / 1000)
      });

      return subscription;
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  }

  // Create an order for one-time payments
  async createOrder(amount: number, currency: string = 'INR', receipt?: string): Promise<any> {
    try {
      const order = await this.makeRequest('/orders', 'POST', {
        amount: amount,
        currency: currency,
        receipt: receipt || `ord_${Date.now().toString().slice(-8)}`,
        payment_capture: true // Auto capture payment
      });
      return order;
    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      throw error;
    }
  }

  // Verify payment signature
  async verifyPaymentSignature(orderId: string, paymentId: string, signature: string): Promise<boolean> {
    try {
      const body = orderId + '|' + paymentId;
      const expectedSignature = await createHmac(body, this.env.RAZORPAY_KEY_SECRET);
      
      return expectedSignature === signature;
    } catch (error) {
      console.error('Error verifying payment signature:', error);
      return false;
    }
  }

  // Handle webhook events
  async handleWebhook(request: Request): Promise<Response> {
    try {
      const body = await request.text();
      const signature = request.headers.get('x-razorpay-signature');

      if (!signature) {
        return new Response('Missing signature', { status: 400 });
      }

      // Verify webhook signature
      const expectedSignature = await createHmac(body, this.env.RAZORPAY_WEBHOOK_SECRET);

      if (expectedSignature !== signature) {
        return new Response('Invalid signature', { status: 400 });
      }

      const event = JSON.parse(body);

      switch (event.event) {
        case 'payment.captured':
          await this.handlePaymentCaptured(event.payload.payment.entity);
          break;
        case 'payment.failed':
          await this.handlePaymentFailed(event.payload.payment.entity);
          break;
        case 'subscription.charged':
          await this.handleSubscriptionCharged(event.payload.subscription.entity, event.payload.payment.entity);
          break;
        case 'subscription.cancelled':
          await this.handleSubscriptionCancelled(event.payload.subscription.entity);
          break;
        case 'subscription.activated':
          await this.handleSubscriptionActivated(event.payload.subscription.entity);
          break;
        default:
          console.log('Unhandled webhook event:', event.event);
      }

      return new Response('OK', { status: 200 });
    } catch (error) {
      console.error('Error handling webhook:', error);
      return new Response('Internal Server Error', { status: 500 });
    }
  }

  // Get subscription status
  async getSubscriptionStatus(userEmail: string): Promise<SubscriptionData | null> {
    try {
      const result = await this.env.LYTSITE_DB.prepare(
        'SELECT * FROM subscriptions WHERE user_email = ? ORDER BY created_at DESC LIMIT 1'
      ).bind(userEmail).first();

      return result as SubscriptionData | null;
    } catch (error) {
      console.error('Error getting subscription status:', error);
      return null;
    }
  }

  // Cancel subscription
  async cancelSubscription(userEmail: string): Promise<boolean> {
    try {
      const subscription = await this.getSubscriptionStatus(userEmail);
      if (!subscription || !subscription.razorpay_subscription_id) {
        return false;
      }

      // Cancel in Razorpay
      await this.makeRequest(`/subscriptions/${subscription.razorpay_subscription_id}/cancel`, 'POST', {
        cancel_at_cycle_end: 0
      });

      // Update in database
      await this.env.LYTSITE_DB.prepare(
        'UPDATE subscriptions SET status = ?, cancel_at_period_end = ?, updated_at = ? WHERE user_email = ?'
      ).bind('cancelled', true, Math.floor(Date.now() / 1000), userEmail).run();

      return true;
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      return false;
    }
  }

  // Private helper methods
  private async saveSubscription(subscription: SubscriptionData): Promise<void> {
    await this.env.LYTSITE_DB.prepare(`
      INSERT OR REPLACE INTO subscriptions 
      (id, user_email, razorpay_subscription_id, razorpay_customer_id, plan_type, status, 
       current_period_start, current_period_end, cancel_at_period_end, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      subscription.id,
      subscription.user_email,
      subscription.razorpay_subscription_id,
      subscription.razorpay_customer_id,
      subscription.plan_type,
      subscription.status,
      subscription.current_period_start,
      subscription.current_period_end,
      subscription.cancel_at_period_end,
      subscription.created_at,
      subscription.updated_at
    ).run();
  }

  private async savePayment(payment: PaymentData): Promise<void> {
    await this.env.LYTSITE_DB.prepare(`
      INSERT INTO payment_history 
      (id, user_email, razorpay_payment_id, razorpay_order_id, amount, currency, status, method, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      payment.id,
      payment.user_email,
      payment.razorpay_payment_id,
      payment.razorpay_order_id,
      payment.amount,
      payment.currency,
      payment.status,
      payment.method,
      payment.created_at
    ).run();
  }

  // Webhook event handlers
  private async handlePaymentCaptured(payment: any): Promise<void> {
    // Save successful payment to database
    const paymentData: PaymentData = {
      id: `pay_${Date.now()}`,
      user_email: payment.notes?.user_email || '',
      razorpay_payment_id: payment.id,
      razorpay_order_id: payment.order_id,
      amount: payment.amount,
      currency: payment.currency,
      status: 'captured',
      method: payment.method,
      created_at: Math.floor(Date.now() / 1000)
    };

    await this.savePayment(paymentData);
  }

  private async handlePaymentFailed(payment: any): Promise<void> {
    // Log failed payment
    console.log('Payment failed:', payment.id);
  }

  private async handleSubscriptionCharged(subscription: any, payment: any): Promise<void> {
    // Update subscription status
    await this.env.LYTSITE_DB.prepare(
      'UPDATE subscriptions SET status = ?, updated_at = ? WHERE razorpay_subscription_id = ?'
    ).bind('active', Math.floor(Date.now() / 1000), subscription.id).run();
  }

  private async handleSubscriptionCancelled(subscription: any): Promise<void> {
    // Update subscription status
    await this.env.LYTSITE_DB.prepare(
      'UPDATE subscriptions SET status = ?, updated_at = ? WHERE razorpay_subscription_id = ?'
    ).bind('cancelled', Math.floor(Date.now() / 1000), subscription.id).run();
  }

  private async handleSubscriptionActivated(subscription: any): Promise<void> {
    // Update subscription status
    await this.env.LYTSITE_DB.prepare(
      'UPDATE subscriptions SET status = ?, updated_at = ? WHERE razorpay_subscription_id = ?'
    ).bind('active', Math.floor(Date.now() / 1000), subscription.id).run();
  }
}