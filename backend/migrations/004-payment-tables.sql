-- Migration: Add payment and subscription tables
-- Date: 2025-09-19

-- Subscriptions table
CREATE TABLE subscriptions (
    id TEXT PRIMARY KEY,
    user_email TEXT NOT NULL,
    razorpay_subscription_id TEXT UNIQUE,
    razorpay_customer_id TEXT,
    plan_type TEXT NOT NULL DEFAULT 'free', -- 'free', 'pro', 'business', 'agency'
    status TEXT NOT NULL DEFAULT 'active', -- 'active', 'canceled', 'past_due', 'halted'
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
    created_at INTEGER DEFAULT (unixepoch()),
    updated_at INTEGER DEFAULT (unixepoch()),
    UNIQUE(user_email, month_year)
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

-- Create indexes for performance
CREATE INDEX idx_subscriptions_user_email ON subscriptions(user_email);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_usage_tracking_user_month ON usage_tracking(user_email, month_year);
CREATE INDEX idx_payment_history_user_email ON payment_history(user_email);
CREATE INDEX idx_payment_history_razorpay_payment_id ON payment_history(razorpay_payment_id);

-- Insert default free subscriptions for existing users
INSERT INTO subscriptions (id, user_email, plan_type, status, created_at, updated_at)
SELECT 
    'sub_' || substr(hex(randomblob(16)), 1, 16) as id,
    email as user_email,
    'free' as plan_type,
    'active' as status,
    unixepoch() as created_at,
    unixepoch() as updated_at
FROM users 
WHERE email IS NOT NULL 
AND email NOT IN (SELECT user_email FROM subscriptions WHERE user_email IS NOT NULL);