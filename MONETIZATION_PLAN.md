# Lytsite Monetization & Payment Integration Plan

## 📊 Current State Analysis

### What We Have Built:
- ✅ File upload and sharing system
- ✅ Comments and feedback system
- ✅ Approval workflows
- ✅ Comprehensive analytics dashboard
- ✅ User authentication system
- ✅ Project management features
- ✅ File engagement tracking

### What's Missing for Monetization:
- ❌ Payment gateway integration
- ❌ Subscription management
- ❌ Usage limit enforcement
- ❌ Feature flagging system
- ❌ Billing dashboard
- ❌ Free trial management

---

## 🎯 Pricing Strategy Analysis

### Current Market Positioning:
**File Collaboration Platform** (not basic file sharing)

### Competitor Analysis:
- **Dropbox Business**: $15-25/user/month
- **Box Business**: $15-25/user/month  
- **Notion**: $8-16/user/month
- **Monday.com**: $8-24/user/month
- **DocuSign**: $10-40/user/month
- **Figma**: $12-45/user/month

### Our Value Proposition:
- **Instant file → collaborative workspace**
- **No learning curve** (vs Notion/Monday complexity)
- **Beautiful client-facing** (vs ugly Dropbox links)
- **Built-in approval workflows** (vs DocuSign limited scope)

---

## 💰 Recommended Pricing Tiers

### 🆓 **Free Plan - "Starter"**
**Target**: Individual creators, small tests
```
Limits:
├── 5 projects per month
├── 100MB file size limit
├── 2 comments per project
├── Basic analytics (views only)
├── 7-day file retention
├── Lytsite branding
└── Email support only

Features Included:
├── File upload & sharing ✅
├── Basic project creation ✅
├── Public sharing links ✅
├── Basic file previews ✅
└── Mobile responsive ✅
```

### 💼 **Pro Plan - "Professional"** 
**Price**: 
- **India**: ₹999/month or ₹9,999/year (Save 17%)
- **Global**: $12/month or $120/year
**Target**: Freelancers, small agencies, consultants
```
Limits:
├── 50 projects per month
├── 2GB file size limit
├── Unlimited comments
├── Full analytics dashboard
├── 90-day file retention
├── Remove Lytsite branding
└── Priority email support

Additional Features:
├── Comments & feedback system ✅
├── Approval workflows ✅
├── Advanced analytics dashboard ✅
├── Password protection ✅
├── Custom project URLs ✅
├── Email notifications ✅
├── Download tracking ✅
└── Basic API access ✅
```

### 🏢 **Business Plan - "Enterprise"**
**Price**: 
- **India**: ₹3,299/month or ₹32,999/year (Save 17%)
- **Global**: $39/month or $390/year
**Target**: Teams, agencies, consultancies
```
Limits:
├── Unlimited projects
├── 10GB file size limit
├── Unlimited everything
├── 1-year file retention
├── Custom branding
├── Team management (up to 10 users)
└── Live chat + phone support

Additional Features:
├── Team collaboration ✅
├── Client portal access ✅
├── Advanced integrations ✅
├── White-label options ✅
├── SSO integration ✅
├── Advanced API ✅
├── Custom domains ✅
├── Priority processing ✅
└── Dedicated account manager ✅
```

### 🌟 **Agency Plan - "Scale"**
**Price**: Custom pricing 
- **India**: Starts at ₹8,299/month
- **Global**: Starts at $99/month
**Target**: Large agencies, enterprises
```
Features:
├── Everything in Business
├── Unlimited users
├── Unlimited storage
├── Custom integrations
├── Dedicated infrastructure
├── SLA guarantees
├── Custom feature development
└── White-glove onboarding
```

---

## 🇮🇳 Razorpay-Specific Considerations

### Pricing Strategy for Indian Market:
- **INR pricing** is more accessible for Indian users
- **UPI payments** have zero transaction fees
- **Net Banking** widely used for subscriptions
- **Cards + Wallets** for premium users

### Payment Methods by Region:

**Indian Customers:**
1. **UPI** (0% fees, instant) - Promote heavily
2. **Debit Cards** (1.9% + GST) - Most common
3. **Credit Cards** (1.9% + GST) - Premium users
4. **Net Banking** (₹10-15 flat fee) - Enterprise users
5. **Wallets** (1.9% + GST) - Mobile users

**International Customers:**
1. **Credit Cards** (2.9% + GST) - Primary method
2. **Debit Cards** (2.9% + GST) - Common
3. **PayPal** (Not directly supported - need integration)

### Currency Handling Strategy:
- **Auto-detect location** and show appropriate pricing
- **Indian users**: ₹ prices, local payment methods
- **Global users**: $ prices, international cards only
- **All settlements**: Convert to INR automatically

### Compliance & Legal:
- **GST** handling (18% on services)
- **TDS** considerations for high-value transactions
- **KYC** requirements for subscriptions
- **Automatic tax invoicing**
- **FEMA** compliance for international transactions

### Alternative Consideration:
If significant international growth expected, consider **dual gateway approach**:
- **Razorpay**: For Indian customers (better rates, local methods)
- **Stripe**: For international customers (better global support)
- **Implementation**: Geo-detect and route to appropriate gateway

**Decision Matrix:**
- **>70% Indian customers**: Razorpay only ✅
- **50-70% Indian customers**: Dual gateway
- **<50% Indian customers**: Consider Stripe primary

---

## 🛠 Technical Implementation Plan

### Phase 1: Payment Infrastructure (Week 1-2)

#### 1.1 Payment Gateway Selection
**Using: Razorpay** ✅

**Global Payment Capabilities:**
- **✅ Accepts international cards** (Visa, Mastercard, Amex)
- **✅ Multi-currency support** (USD, EUR, GBP, SGD, AED, etc.)
- **✅ International customers** can pay
- **⚠️ Settlement only in INR** (requires Indian business entity)
- **⚠️ Limited local payment methods** outside India

**Razorpay Advantages:**
- Lower fees for Indian transactions (1.9% vs Stripe's 2.9%)
- Local payment methods (UPI, Net Banking, Wallets)
- INR + multi-currency pricing support
- Faster settlement times in India
- Good dashboard and analytics
- Strong fraud protection

**Global Payment Limitations:**
- **Business Registration**: Need Indian company for settlement
- **Currency Conversion**: Auto-converts to INR
- **Local Methods**: No UPI/Net Banking for international users
- **Compliance**: Primarily India-focused regulations

#### 1.2 Database Schema Updates
```sql
-- Subscriptions table
CREATE TABLE subscriptions (
    id TEXT PRIMARY KEY,
    user_email TEXT NOT NULL,
    razorpay_subscription_id TEXT UNIQUE,
    razorpay_customer_id TEXT,
    plan_type TEXT NOT NULL, -- 'free', 'pro', 'business', 'agency'
    status TEXT NOT NULL, -- 'active', 'canceled', 'past_due', 'halted'
    current_period_start INTEGER,
    current_period_end INTEGER,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    created_at INTEGER DEFAULT (unixepoch()),
    updated_at INTEGER DEFAULT (unixepoch())
);

-- Usage tracking table
CREATE TABLE usage_tracking (
    id TEXT PRIMARY KEY,
    user_email TEXT NOT NULL,
    month_year TEXT NOT NULL, -- '2025-09'
    projects_created INTEGER DEFAULT 0,
    storage_used_mb INTEGER DEFAULT 0,
    comments_made INTEGER DEFAULT 0,
    api_calls INTEGER DEFAULT 0,
    created_at INTEGER DEFAULT (unixepoch())
);

-- Payment history table
CREATE TABLE payment_history (
    id TEXT PRIMARY KEY,
    user_email TEXT NOT NULL,
    razorpay_payment_id TEXT,
    razorpay_order_id TEXT,
    amount INTEGER, -- in paise (smallest currency unit)
    currency TEXT DEFAULT 'INR',
    status TEXT, -- 'captured', 'failed', 'pending', 'authorized'
    method TEXT, -- 'card', 'upi', 'netbanking', 'wallet'
    created_at INTEGER DEFAULT (unixepoch())
);
```

#### 1.3 Feature Flag System
```typescript
// Feature flags configuration
interface FeatureLimits {
  monthlyProjects: number;
  maxFileSize: number; // in MB
  commentsPerProject: number;
  analyticsLevel: 'basic' | 'advanced' | 'enterprise';
  fileRetentionDays: number;
  customBranding: boolean;
  apiAccess: boolean;
  teamMembers: number;
}

const PLAN_LIMITS: Record<PlanType, FeatureLimits> = {
  free: {
    monthlyProjects: 5,
    maxFileSize: 100,
    commentsPerProject: 2,
    analyticsLevel: 'basic',
    fileRetentionDays: 7,
    customBranding: false,
    apiAccess: false,
    teamMembers: 1
  },
  pro: {
    monthlyProjects: 50,
    maxFileSize: 2000,
    commentsPerProject: -1, // unlimited
    analyticsLevel: 'advanced',
    fileRetentionDays: 90,
    customBranding: true,
    apiAccess: true,
    teamMembers: 1
  },
  // ... other plans
};
```

### Phase 2: Subscription Management (Week 3)

#### 2.1 Razorpay Integration Components
```typescript
// backend/src/razorpay-handler.ts
export class RazorpayHandler {
  async createSubscription(userEmail: string, planType: string);
  async createOrder(amount: number, currency: string, receipt: string);
  async handleWebhook(request: Request);
  async cancelSubscription(subscriptionId: string);
  async updateSubscription(subscriptionId: string, newPlan: string);
  async getSubscriptionStatus(userEmail: string);
  async verifyPaymentSignature(payload: any);
}
```

#### 2.2 Usage Enforcement Middleware
```typescript
// Middleware to check limits before operations
export async function enforceUsageLimits(
  userEmail: string, 
  operation: 'create_project' | 'upload_file' | 'add_comment'
): Promise<{ allowed: boolean; reason?: string }> {
  const subscription = await getSubscription(userEmail);
  const limits = PLAN_LIMITS[subscription.plan_type];
  const usage = await getCurrentUsage(userEmail);
  
  // Check specific operation limits
  switch (operation) {
    case 'create_project':
      if (usage.projects_created >= limits.monthlyProjects) {
        return { allowed: false, reason: 'Monthly project limit reached' };
      }
      break;
    // ... other checks
  }
  
  return { allowed: true };
}
```

### Phase 3: Frontend Integration (Week 4)

#### 3.1 Billing Dashboard Component
```typescript
// src/components/billing/BillingDashboard.tsx
export function BillingDashboard() {
  return (
    <div className="billing-dashboard">
      <CurrentPlan />
      <UsageMetrics />
      <PaymentHistory />
      <PlanUpgrade />
    </div>
  );
}
```

#### 3.2 Paywall Components
```typescript
// src/components/paywalls/ProjectLimitPaywall.tsx
export function ProjectLimitPaywall({ onUpgrade }: { onUpgrade: () => void }) {
  return (
    <div className="paywall">
      <h3>Project Limit Reached</h3>
      <p>You've created 5 projects this month (Free plan limit)</p>
      <Button onClick={onUpgrade}>Upgrade to Pro - $12/month</Button>
    </div>
  );
}
```

---

## 🔄 User Journey & Conversion Funnel

### Free User Journey:
```
1. Sign up (no credit card)
2. Create 1-2 projects → Experience value
3. Try advanced features → See limitations
4. Hit project limit → Conversion opportunity
5. Upgrade prompt → Stripe checkout
```

### Conversion Optimization:
- **Usage notifications**: "2 of 5 projects used this month"
- **Feature previews**: Show locked features with upgrade CTA
- **Success moments**: After positive feedback, show upgrade
- **Urgency**: "Files expire in 2 days (Pro keeps them 90 days)"

---

## 📈 Revenue Projections

### Year 1 Conservative Estimates:
```
Month 3: 100 users → 10 Pro ($120) = $1,200 MRR
Month 6: 500 users → 50 Pro, 5 Business ($650) = $5,850 MRR  
Month 9: 1,000 users → 100 Pro, 15 Business ($1,785) = $10,785 MRR
Month 12: 2,000 users → 200 Pro, 30 Business ($3,570) = $21,570 MRR

Annual Revenue Run Rate: ~$260,000
```

### Key Metrics to Track:
- **Free to Pro conversion**: Target 5-10%
- **Pro to Business conversion**: Target 15-20%
- **Monthly churn**: Target <5%
- **Average revenue per user (ARPU)**: Target $12-15
- **Customer lifetime value (LTV)**: Target $200-400

---

## 🚀 Implementation Timeline

### Week 1: Foundation
- [ ] Set up Razorpay account & get API keys
- [ ] Create subscription database schema
- [ ] Build basic feature flag system
- [ ] Implement usage tracking
- [ ] Set up webhook endpoint URLs

### Razorpay Setup Steps:
```bash
# Install Razorpay SDK
npm install razorpay

# Environment variables needed:
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxx
RAZORPAY_WEBHOOK_SECRET=xxxxx
```

### Week 2: Backend Integration  
- [ ] Razorpay webhook handling
- [ ] Subscription CRUD operations
- [ ] Payment verification (signature validation)
- [ ] Usage limit enforcement
- [ ] Order and payment processing endpoints

### Week 3: Frontend Integration
- [ ] Billing dashboard
- [ ] Razorpay checkout integration (Standard/Custom)
- [ ] UPI QR code generation
- [ ] Paywall components
- [ ] Usage limit notifications
- [ ] Payment method selection UI

### Week 4: Testing & Polish
- [ ] End-to-end testing
- [ ] Error handling
- [ ] Email notifications
- [ ] Analytics tracking

### Week 5: Launch
- [ ] Soft launch to existing users
- [ ] Monitor conversion metrics
- [ ] Iterate based on feedback
- [ ] Full marketing push

---

## 🔧 Technical Architecture

### Payment Flow:
```
Frontend → Razorpay Checkout → Payment Success → Webhook → Backend → Database Update → Feature Unlock
```

### Usage Checking Flow:
```
User Action → Check Limits → Allow/Deny → Update Usage Counter → Show Upgrade if Needed
```

### File Structure:
```
backend/
├── src/
│   ├── razorpay/
│   │   ├── checkout.ts
│   │   ├── webhooks.ts
│   │   ├── subscriptions.ts
│   │   └── orders.ts
│   ├── billing/
│   │   ├── usage-tracker.ts
│   │   ├── limits-enforcer.ts
│   │   └── notifications.ts
│   └── migrations/
│       └── 003-billing-tables.sql

frontend/
├── src/
│   ├── components/
│   │   ├── billing/
│   │   │   ├── BillingDashboard.tsx
│   │   │   ├── PlanSelector.tsx
│   │   │   └── UsageMetrics.tsx
│   │   └── paywalls/
│   │       ├── ProjectLimitPaywall.tsx
│   │       ├── FileSizePaywall.tsx
│   │       └── FeatureLockedPaywall.tsx
│   └── hooks/
│       ├── useSubscription.ts
│       ├── useUsageTracking.ts
│       └── useBilling.ts
```

---

## 🎯 Success Metrics & KPIs

### Primary Metrics:
1. **Monthly Recurring Revenue (MRR)**
2. **Customer Acquisition Cost (CAC)**
3. **Customer Lifetime Value (LTV)**
4. **Free-to-Paid Conversion Rate**

### Secondary Metrics:
1. **Feature adoption rates**
2. **Time to first value**
3. **Support ticket volume**
4. **User engagement depth**

### Success Targets (Month 6):
- 500+ total users
- 10%+ conversion rate (free → paid)
- $5,000+ MRR
- <$50 CAC
- >$200 LTV

---

## 🚨 Risk Mitigation

### Technical Risks:
- **Payment failures**: Robust error handling + retry logic
- **Webhook reliability**: Idempotent processing + monitoring
- **Usage accuracy**: Real-time counters + periodic reconciliation

### Business Risks:
- **Low conversion**: A/B test pricing + messaging
- **High churn**: Improve onboarding + customer success
- **Feature creep**: Focus on core value first

### Compliance:
- **EU VAT**: Use Paddle or implement tax calculation
- **Data privacy**: GDPR compliance for EU users
- **Payment security**: PCI compliance through Stripe

---

## 💡 Next Steps

1. **Validate pricing** with 10-20 current users
2. **Set up Stripe account** and test environment
3. **Implement basic subscription tracking**
4. **Create simple paywall for project limits**
5. **Launch with existing user base**

---

*This plan assumes current technical foundation and focuses on monetizing existing features rather than building new ones first. Priority is validating willingness to pay for current value proposition.*