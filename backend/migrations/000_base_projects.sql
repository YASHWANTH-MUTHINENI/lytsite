-- Migration 000: Base Projects Table
-- This creates the fundamental projects table that our system needs

CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster slug lookups
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);