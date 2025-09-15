-- Migration 002: Add Creator Account Management
-- This migration adds creator support to link projects to authenticated users

-- Create creators table to store Clerk user data
CREATE TABLE IF NOT EXISTS creators (
  id TEXT PRIMARY KEY,
  clerk_user_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  name TEXT,
  avatar_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster clerk_user_id lookups
CREATE INDEX IF NOT EXISTS idx_creators_clerk_user_id ON creators(clerk_user_id);

-- Add creator_id column to existing tables
ALTER TABLE projects ADD COLUMN creator_id TEXT REFERENCES creators(id);
ALTER TABLE project_settings ADD COLUMN creator_id TEXT REFERENCES creators(id);

-- Create index for faster project lookups by creator
CREATE INDEX IF NOT EXISTS idx_projects_creator_id ON projects(creator_id);
CREATE INDEX IF NOT EXISTS idx_project_settings_creator_id ON project_settings(creator_id);

-- Add anonymous session tracking for migration purposes
ALTER TABLE projects ADD COLUMN anonymous_session_id TEXT;
ALTER TABLE project_settings ADD COLUMN anonymous_session_id TEXT;

-- Create indexes for anonymous session lookups (for claiming projects)
CREATE INDEX IF NOT EXISTS idx_projects_anonymous_session ON projects(anonymous_session_id);
CREATE INDEX IF NOT EXISTS idx_project_settings_anonymous_session ON project_settings(anonymous_session_id);

-- Add updated_at to projects table (created_at already exists)
-- Using a separate step to handle if column already exists
-- SQLite doesn't have ADD COLUMN IF NOT EXISTS, so we'll handle this in code

-- Note: created_at already exists from base migration
-- Only add updated_at if it doesn't exist
-- ALTER TABLE projects ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP;

-- Update existing records to have updated_at timestamp
-- UPDATE projects SET updated_at = CURRENT_TIMESTAMP WHERE updated_at IS NULL;