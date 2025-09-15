-- Advanced Features Database Schema
-- Migration: 001_advanced_features.sql
-- Created: 2024-09-14

-- Users table (guest vs registered users)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE,
  name TEXT,
  avatar_url TEXT,
  user_type TEXT DEFAULT 'guest', -- 'guest' | 'registered'
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch())
);

-- Extended project settings
CREATE TABLE IF NOT EXISTS project_settings (
  project_id TEXT PRIMARY KEY,
  enable_favorites BOOLEAN DEFAULT 0,
  enable_comments BOOLEAN DEFAULT 0,
  enable_approvals BOOLEAN DEFAULT 0,
  enable_analytics BOOLEAN DEFAULT 1,
  enable_notifications BOOLEAN DEFAULT 0,
  notification_email TEXT,
  slack_webhook TEXT,
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch())
);

-- Favorites system
CREATE TABLE IF NOT EXISTS favorites (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  file_id TEXT NOT NULL,
  user_email TEXT NOT NULL,
  user_name TEXT,
  created_at INTEGER DEFAULT (unixepoch()),
  UNIQUE(project_id, file_id, user_email)
);

-- Comments system  
CREATE TABLE IF NOT EXISTS comments (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  file_id TEXT NOT NULL,
  thread_id TEXT, -- NULL for root comments
  user_email TEXT NOT NULL,
  user_name TEXT,
  comment_text TEXT NOT NULL,
  resolved BOOLEAN DEFAULT 0,
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch())
);

-- Approvals system
CREATE TABLE IF NOT EXISTS approvals (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  file_id TEXT, -- NULL for gallery-level approval
  user_email TEXT NOT NULL,
  user_name TEXT,
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  notes TEXT,
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch()),
  UNIQUE(project_id, file_id, user_email)
);

-- Analytics tracking
CREATE TABLE IF NOT EXISTS analytics (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  file_id TEXT, -- NULL for page-level events
  user_email TEXT,
  event_type TEXT NOT NULL, -- 'view', 'download', 'favorite', 'comment', 'approve'
  metadata TEXT, -- JSON for additional data
  ip_address TEXT,
  user_agent TEXT,
  created_at INTEGER DEFAULT (unixepoch())
);

-- Notification queue
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  recipient_email TEXT NOT NULL,
  notification_type TEXT NOT NULL, -- 'new_favorite', 'new_comment', 'approval_change'
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  metadata TEXT, -- JSON for additional data
  status TEXT CHECK (status IN ('pending', 'sent', 'failed')) DEFAULT 'pending',
  created_at INTEGER DEFAULT (unixepoch()),
  sent_at INTEGER
);

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_favorites_project_file ON favorites(project_id, file_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_email);

CREATE INDEX IF NOT EXISTS idx_comments_project_file ON comments(project_id, file_id);
CREATE INDEX IF NOT EXISTS idx_comments_thread ON comments(thread_id);
CREATE INDEX IF NOT EXISTS idx_comments_user ON comments(user_email);

CREATE INDEX IF NOT EXISTS idx_approvals_project ON approvals(project_id);
CREATE INDEX IF NOT EXISTS idx_approvals_user ON approvals(user_email);
CREATE INDEX IF NOT EXISTS idx_approvals_status ON approvals(status);

CREATE INDEX IF NOT EXISTS idx_analytics_project ON analytics(project_id);
CREATE INDEX IF NOT EXISTS idx_analytics_created ON analytics(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics(event_type);

CREATE INDEX IF NOT EXISTS idx_notifications_status ON notifications(status);
CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON notifications(recipient_email);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at);

-- Sample data for testing (optional - can be removed in production)
-- INSERT INTO users (id, email, name, user_type) VALUES 
--   ('test-user-1', 'test@example.com', 'Test User', 'guest');