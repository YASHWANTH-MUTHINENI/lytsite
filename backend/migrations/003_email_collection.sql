-- Email Collections Migration
-- Add email collection tracking to support progressive email capture

-- Create email collections table for analytics
CREATE TABLE IF NOT EXISTS email_collections (
  id TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  email TEXT NOT NULL,
  trigger TEXT NOT NULL, -- 'first_comment', 'first_favorite', 'high_views', 'return_visit', 'success_page'
  project_id TEXT,
  anonymous_session_id TEXT NOT NULL,
  collected_at TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Add email collection fields to projects table
ALTER TABLE projects ADD COLUMN notification_email TEXT;
ALTER TABLE projects ADD COLUMN email_collected_at TEXT;
ALTER TABLE projects ADD COLUMN email_collection_trigger TEXT;

-- Create indexes for email collection analytics
CREATE INDEX IF NOT EXISTS idx_email_collections_trigger ON email_collections(trigger);
CREATE INDEX IF NOT EXISTS idx_email_collections_session ON email_collections(anonymous_session_id);
CREATE INDEX IF NOT EXISTS idx_email_collections_email ON email_collections(email);
CREATE INDEX IF NOT EXISTS idx_email_collections_collected_at ON email_collections(collected_at);
CREATE INDEX IF NOT EXISTS idx_projects_notification_email ON projects(notification_email);