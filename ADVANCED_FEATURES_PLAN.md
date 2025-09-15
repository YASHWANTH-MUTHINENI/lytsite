# 🚀 Advanced Features Implementation Plan
*Favorites, Comments, Approvals, Analytics & Notifications for Lytsite*

## 📋 Current Architecture Analysis

### **Frontend (React/Vite)**
- Universal template system serving all generated sites
- Modal-based upload flow with preview step
- Cloudflare integration via `window.LYTSITE_DATA`
- Current publish flow: Upload → Details → Preview → Publish

### **Backend (Cloudflare Workers)**
- KV storage for project metadata
- R2 storage for files
- Template serving with HTML wrapper
- Current data structure: `ProjectData` in `types.ts`

### **Generated Sites**
- Universal template: Hero → Files → Footer
- Template loads via `/lytsite-template.iife.js`
- Data injection through `window.LYTSITE_DATA`

---

## 🎯 Implementation Strategy

### **Phase 1: Database & Authentication (Week 1)**

#### **1.1 Cloudflare D1 Database Setup**

Create migration file: `backend/migrations/001_advanced_features.sql`

```sql
-- Users table (guest vs registered users)
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE,
  name TEXT,
  avatar_url TEXT,
  user_type TEXT DEFAULT 'guest', -- 'guest' | 'registered'
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch())
);

-- Extended project settings
CREATE TABLE project_settings (
  project_id TEXT PRIMARY KEY,
  enable_favorites BOOLEAN DEFAULT 0,
  enable_comments BOOLEAN DEFAULT 0,
  enable_approvals BOOLEAN DEFAULT 0,
  enable_analytics BOOLEAN DEFAULT 1,
  enable_notifications BOOLEAN DEFAULT 0,
  notification_email TEXT,
  slack_webhook TEXT,
  created_at INTEGER DEFAULT (unixepoch()),
  FOREIGN KEY (project_id) REFERENCES projects(id)
);

-- Favorites system
CREATE TABLE favorites (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  file_id TEXT NOT NULL,
  user_email TEXT NOT NULL,
  user_name TEXT,
  created_at INTEGER DEFAULT (unixepoch()),
  UNIQUE(project_id, file_id, user_email)
);

-- Comments system  
CREATE TABLE comments (
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
CREATE TABLE approvals (
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
CREATE TABLE analytics (
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
CREATE TABLE notifications (
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

-- Indexes for performance
CREATE INDEX idx_favorites_project_file ON favorites(project_id, file_id);
CREATE INDEX idx_comments_project_file ON comments(project_id, file_id);
CREATE INDEX idx_comments_thread ON comments(thread_id);
CREATE INDEX idx_approvals_project ON approvals(project_id);
CREATE INDEX idx_analytics_project ON analytics(project_id);
CREATE INDEX idx_analytics_created ON analytics(created_at);
CREATE INDEX idx_notifications_status ON notifications(status);
```

#### **1.2 Update Backend Types**

Extend `backend/src/types.ts`:

```typescript
// Add to existing ProjectData interface
export interface ProjectData {
  // ... existing fields
  
  // Advanced features settings
  settings?: ProjectSettings;
}

export interface ProjectSettings {
  enableFavorites: boolean;
  enableComments: boolean;
  enableApprovals: boolean;
  enableAnalytics: boolean;
  enableNotifications: boolean;
  notificationEmail?: string;
  slackWebhook?: string;
}

export interface UserSession {
  id: string;
  email?: string;
  name?: string;
  userType: 'guest' | 'registered';
}

export interface Favorite {
  id: string;
  projectId: string;
  fileId: string;
  userEmail: string;
  userName?: string;
  createdAt: number;
}

export interface Comment {
  id: string;
  projectId: string;
  fileId: string;
  threadId?: string;
  userEmail: string;
  userName?: string;
  commentText: string;
  resolved: boolean;
  createdAt: number;
  updatedAt: number;
  replies?: Comment[];
}

export interface Approval {
  id: string;
  projectId: string;
  fileId?: string; // NULL for gallery-level
  userEmail: string;
  userName?: string;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
  createdAt: number;
  updatedAt: number;
}

export interface Analytics {
  id: string;
  projectId: string;
  fileId?: string;
  userEmail?: string;
  eventType: 'view' | 'download' | 'favorite' | 'comment' | 'approve';
  metadata?: any;
  ipAddress?: string;
  userAgent?: string;
  createdAt: number;
}
```

#### **1.3 Add D1 to Worker Environment**

Update `backend/wrangler.toml`:

```toml
# ... existing config

[[d1_databases]]
binding = "LYTSITE_DB"
database_name = "lytsite-advanced"
database_id = "<generated-id>"
```

Update `backend/src/types.ts` Env interface:

```typescript
export interface Env {
  // ... existing bindings
  LYTSITE_DB: D1Database;
}
```

---

### **Phase 2: Frontend Settings & UI (Week 2)**

#### **2.1 Enhanced Upload Modal**

Modify `src/components/minimal-upload-modal.tsx` to add settings step between details and preview:

```tsx
// Add to state
const [projectSettings, setProjectSettings] = useState<ProjectSettings>({
  enableFavorites: false,
  enableComments: false,
  enableApprovals: false,
  enableAnalytics: true,
  enableNotifications: false,
});

// Add settings step between 'details' and 'preview'
const steps = ['upload', 'details', 'settings', 'preview', 'success'];

// Settings step UI
{step === 'settings' && (
  <div className="p-6 space-y-6">
    <div className="text-center mb-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-2">
        Client Engagement Features
      </h2>
      <p className="text-slate-600">
        Enable interactive features for your clients (optional)
      </p>
    </div>

    <div className="space-y-4">
      {/* Favorites Toggle */}
      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Heart className="w-5 h-5 text-red-500" />
            <h3 className="font-semibold text-slate-900">Favorites</h3>
            <Badge variant="secondary">Free</Badge>
          </div>
          <p className="text-sm text-slate-600">
            Let clients ♥ their preferred files for easy shortlisting
          </p>
        </div>
        <Switch
          checked={projectSettings.enableFavorites}
          onCheckedChange={(checked) => 
            setProjectSettings(prev => ({ ...prev, enableFavorites: checked }))
          }
        />
      </div>

      {/* Comments Toggle */}
      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <MessageCircle className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold text-slate-900">Comments & Feedback</h3>
            <Badge variant="outline">Pro</Badge>
          </div>
          <p className="text-sm text-slate-600">
            Enable threaded discussions directly on files
          </p>
        </div>
        <Switch
          checked={projectSettings.enableComments}
          onCheckedChange={(checked) => 
            setProjectSettings(prev => ({ ...prev, enableComments: checked }))
          }
        />
      </div>

      {/* Approvals Toggle */}
      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <h3 className="font-semibold text-slate-900">One-Click Approvals</h3>
            <Badge variant="outline">Pro</Badge>
          </div>
          <p className="text-sm text-slate-600">
            Speed up approval workflows with status tracking
          </p>
        </div>
        <Switch
          checked={projectSettings.enableApprovals}
          onCheckedChange={(checked) => 
            setProjectSettings(prev => ({ ...prev, enableApprovals: checked }))
          }
        />
      </div>

      {/* Analytics Toggle */}
      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="w-5 h-5 text-purple-500" />
            <h3 className="font-semibold text-slate-900">Light Analytics</h3>
            <Badge variant="secondary">Free</Badge>
          </div>
          <p className="text-sm text-slate-600">
            Track views, downloads, and engagement
          </p>
        </div>
        <Switch
          checked={projectSettings.enableAnalytics}
          onCheckedChange={(checked) => 
            setProjectSettings(prev => ({ ...prev, enableAnalytics: checked }))
          }
        />
      </div>

      {/* Notifications Toggle */}
      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Bell className="w-5 h-5 text-yellow-500" />
            <h3 className="font-semibold text-slate-900">Notifications</h3>
            <Badge variant="outline">Pro</Badge>
          </div>
          <p className="text-sm text-slate-600">
            Get notified when clients interact with your files
          </p>
        </div>
        <Switch
          checked={projectSettings.enableNotifications}
          onCheckedChange={(checked) => 
            setProjectSettings(prev => ({ ...prev, enableNotifications: checked }))
          }
        />
      </div>
    </div>

    {/* Navigation */}
    <div className="flex justify-between pt-6">
      <Button
        variant="outline"
        onClick={() => setStep('details')}
      >
        <ChevronLeft className="w-4 h-4 mr-2" />
        Back to Details
      </Button>
      <Button
        onClick={() => setStep('preview')}
        className="bg-gradient-to-r from-emerald-600 to-teal-600"
      >
        Preview Site
        <ChevronRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  </div>
)}
```

#### **2.2 Update Upload Handler**

Modify the upload functions to include settings:

```tsx
const handleRegularUpload = async () => {
  // ... existing upload code

  const projectPayload = {
    title: uploadTitle,
    description: uploadDescription,
    template: selectedTemplate,
    authorName: authorName,
    authorEmail: uploadEmail,
    password: uploadPassword,
    expiryDate: uploadExpiryDate,
    settings: projectSettings, // Add settings to payload
    files: fileMetadata
  };

  // ... rest of upload logic
};
```

---

### **Phase 3: Backend API Endpoints (Week 3)**

#### **3.1 Create API Router**

Create `backend/src/api.ts`:

```typescript
import { Env, ProjectSettings, UserSession } from './types';

export class AdvancedFeaturesAPI {
  constructor(private env: Env) {}

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
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // Route API calls
      if (path.startsWith('/api/favorites')) {
        return this.handleFavorites(request, corsHeaders);
      } else if (path.startsWith('/api/comments')) {
        return this.handleComments(request, corsHeaders);
      } else if (path.startsWith('/api/approvals')) {
        return this.handleApprovals(request, corsHeaders);
      } else if (path.startsWith('/api/analytics')) {
        return this.handleAnalytics(request, corsHeaders);
      } else if (path.startsWith('/api/notifications')) {
        return this.handleNotifications(request, corsHeaders);
      }

      return new Response('Not found', { status: 404, headers: corsHeaders });
    } catch (error) {
      console.error('API Error:', error);
      return new Response('Internal error', { status: 500, headers: corsHeaders });
    }
  }

  // Favorites API
  async handleFavorites(request: Request, corsHeaders: Record<string, string>): Promise<Response> {
    const url = new URL(request.url);
    const method = request.method;

    if (method === 'POST') {
      // Add favorite
      const { projectId, fileId, userEmail, userName } = await request.json();
      
      const favoriteId = crypto.randomUUID();
      await this.env.LYTSITE_DB.prepare(`
        INSERT OR REPLACE INTO favorites (id, project_id, file_id, user_email, user_name)
        VALUES (?, ?, ?, ?, ?)
      `).bind(favoriteId, projectId, fileId, userEmail, userName).run();

      // Track analytics
      await this.trackEvent(projectId, fileId, userEmail, 'favorite');

      // Trigger notification
      await this.triggerNotification(projectId, 'new_favorite', {
        userEmail,
        userName,
        fileId
      });

      return new Response(JSON.stringify({ success: true, id: favoriteId }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (method === 'GET') {
      // Get favorites for project
      const projectId = url.searchParams.get('projectId');
      const fileId = url.searchParams.get('fileId');

      let query = 'SELECT * FROM favorites WHERE project_id = ?';
      let params: any[] = [projectId];

      if (fileId) {
        query += ' AND file_id = ?';
        params.push(fileId);
      }

      const result = await this.env.LYTSITE_DB.prepare(query).bind(...params).all();
      
      return new Response(JSON.stringify(result.results), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (method === 'DELETE') {
      // Remove favorite
      const { projectId, fileId, userEmail } = await request.json();
      
      await this.env.LYTSITE_DB.prepare(`
        DELETE FROM favorites WHERE project_id = ? AND file_id = ? AND user_email = ?
      `).bind(projectId, fileId, userEmail).run();

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  }

  // Comments API
  async handleComments(request: Request, corsHeaders: Record<string, string>): Promise<Response> {
    const method = request.method;

    if (method === 'POST') {
      // Add comment
      const { projectId, fileId, threadId, userEmail, userName, commentText } = await request.json();
      
      const commentId = crypto.randomUUID();
      await this.env.LYTSITE_DB.prepare(`
        INSERT INTO comments (id, project_id, file_id, thread_id, user_email, user_name, comment_text)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).bind(commentId, projectId, fileId, threadId, userEmail, userName, commentText).run();

      // Track analytics
      await this.trackEvent(projectId, fileId, userEmail, 'comment');

      // Trigger notification
      await this.triggerNotification(projectId, 'new_comment', {
        userEmail,
        userName,
        fileId,
        commentText
      });

      return new Response(JSON.stringify({ success: true, id: commentId }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (method === 'GET') {
      // Get comments for project/file with threading
      const url = new URL(request.url);
      const projectId = url.searchParams.get('projectId');
      const fileId = url.searchParams.get('fileId');

      // Get all comments and organize by thread
      const result = await this.env.LYTSITE_DB.prepare(`
        SELECT * FROM comments 
        WHERE project_id = ? AND file_id = ?
        ORDER BY created_at ASC
      `).bind(projectId, fileId).all();

      // Organize into threaded structure
      const comments = result.results as Comment[];
      const threaded = this.organizeComments(comments);

      return new Response(JSON.stringify(threaded), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  }

  // Approvals API
  async handleApprovals(request: Request, corsHeaders: Record<string, string>): Promise<Response> {
    const method = request.method;

    if (method === 'POST') {
      // Add/update approval
      const { projectId, fileId, userEmail, userName, status, notes } = await request.json();
      
      const approvalId = crypto.randomUUID();
      await this.env.LYTSITE_DB.prepare(`
        INSERT OR REPLACE INTO approvals (id, project_id, file_id, user_email, user_name, status, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).bind(approvalId, projectId, fileId, userEmail, userName, status, notes).run();

      // Track analytics
      await this.trackEvent(projectId, fileId, userEmail, 'approve', { status, notes });

      // Trigger notification
      await this.triggerNotification(projectId, 'approval_change', {
        userEmail,
        userName,
        fileId,
        status,
        notes
      });

      return new Response(JSON.stringify({ success: true, id: approvalId }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (method === 'GET') {
      // Get approvals for project
      const url = new URL(request.url);
      const projectId = url.searchParams.get('projectId');

      const result = await this.env.LYTSITE_DB.prepare(`
        SELECT * FROM approvals WHERE project_id = ? ORDER BY created_at DESC
      `).bind(projectId).all();

      return new Response(JSON.stringify(result.results), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  }

  // Analytics helpers
  async trackEvent(projectId: string, fileId: string | null, userEmail: string | null, eventType: string, metadata?: any): Promise<void> {
    const eventId = crypto.randomUUID();
    await this.env.LYTSITE_DB.prepare(`
      INSERT INTO analytics (id, project_id, file_id, user_email, event_type, metadata)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(eventId, projectId, fileId, userEmail, eventType, JSON.stringify(metadata)).run();
  }

  // Notification helpers  
  async triggerNotification(projectId: string, type: string, data: any): Promise<void> {
    // Get project settings to check if notifications are enabled
    const project = await this.env.LYTSITE_KV.get(`project:${projectId}`);
    if (!project) return;

    const projectData = JSON.parse(project);
    if (!projectData.settings?.enableNotifications) return;

    const notificationId = crypto.randomUUID();
    await this.env.LYTSITE_DB.prepare(`
      INSERT INTO notifications (id, project_id, recipient_email, notification_type, title, message, metadata)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      notificationId,
      projectId,
      projectData.authorEmail,
      type,
      this.getNotificationTitle(type, data),
      this.getNotificationMessage(type, data),
      JSON.stringify(data)
    ).run();
  }

  private getNotificationTitle(type: string, data: any): string {
    switch (type) {
      case 'new_favorite':
        return '❤️ New Favorite';
      case 'new_comment':
        return '💬 New Comment';
      case 'approval_change':
        return '✅ Approval Update';
      default:
        return 'Lytsite Update';
    }
  }

  private getNotificationMessage(type: string, data: any): string {
    switch (type) {
      case 'new_favorite':
        return `${data.userName || data.userEmail} favorited a file`;
      case 'new_comment':
        return `${data.userName || data.userEmail} left a comment: "${data.commentText.substring(0, 100)}..."`;
      case 'approval_change':
        return `${data.userName || data.userEmail} ${data.status} a file`;
      default:
        return 'New activity on your Lytsite';
    }
  }

  private organizeComments(comments: any[]): any[] {
    const commentMap = new Map();
    const rootComments: any[] = [];

    // First pass: create comment objects
    comments.forEach(comment => {
      comment.replies = [];
      commentMap.set(comment.id, comment);
    });

    // Second pass: organize into threads
    comments.forEach(comment => {
      if (comment.thread_id) {
        const parent = commentMap.get(comment.thread_id);
        if (parent) {
          parent.replies.push(comment);
        }
      } else {
        rootComments.push(comment);
      }
    });

    return rootComments;
  }
}
```

#### **3.2 Update Main Worker**

Modify `backend/src/index.ts`:

```typescript
import { AdvancedFeaturesAPI } from './api';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    
    // Handle API routes
    if (url.pathname.startsWith('/api/')) {
      const api = new AdvancedFeaturesAPI(env);
      return api.handleRequest(request);
    }

    // ... existing route handling
  }
};
```

---

### **Phase 4: Frontend Components (Week 4)**

#### **4.1 Create Advanced Features Components**

Create `src/components/advanced-features/`:

**FavoritesOverlay.tsx**
```tsx
import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '../ui/button';

interface FavoritesOverlayProps {
  projectId: string;
  fileId: string;
  enabled: boolean;
  userEmail: string;
  userName?: string;
}

export function FavoritesOverlay({ projectId, fileId, enabled, userEmail, userName }: FavoritesOverlayProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    checkFavoriteStatus();
  }, [projectId, fileId, userEmail]);

  const checkFavoriteStatus = async () => {
    try {
      const response = await fetch(`/api/favorites?projectId=${projectId}&fileId=${fileId}`);
      const favorites = await response.json();
      const userFavorite = favorites.find((f: any) => f.user_email === userEmail);
      setIsFavorited(!!userFavorite);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const toggleFavorite = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      if (isFavorited) {
        // Remove favorite
        await fetch('/api/favorites', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ projectId, fileId, userEmail })
        });
        setIsFavorited(false);
      } else {
        // Add favorite
        await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ projectId, fileId, userEmail, userName })
        });
        setIsFavorited(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!enabled) return null;

  return (
    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleFavorite}
        disabled={isLoading}
        className={`h-8 w-8 p-0 bg-white/90 hover:bg-white ${
          isFavorited ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
        }`}
      >
        <Heart 
          className={`h-4 w-4 ${isFavorited ? 'fill-current' : ''}`}
        />
      </Button>
    </div>
  );
}
```

**CommentsDrawer.tsx**
```tsx
import React, { useState, useEffect } from 'react';
import { MessageCircle, Send, Reply } from 'lucide-react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';

interface Comment {
  id: string;
  userEmail: string;
  userName?: string;
  commentText: string;
  createdAt: number;
  replies: Comment[];
  resolved: boolean;
}

interface CommentsDrawerProps {
  projectId: string;
  fileId: string;
  enabled: boolean;
  userEmail: string;
  userName?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function CommentsDrawer({ 
  projectId, 
  fileId, 
  enabled, 
  userEmail, 
  userName, 
  isOpen, 
  onClose 
}: CommentsDrawerProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!enabled || !isOpen) return;
    loadComments();
  }, [projectId, fileId, isOpen]);

  const loadComments = async () => {
    try {
      const response = await fetch(`/api/comments?projectId=${projectId}&fileId=${fileId}`);
      const commentsData = await response.json();
      setComments(commentsData);
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  const submitComment = async () => {
    if (!newComment.trim() || isSubmitting) return;
    setIsSubmitting(true);

    try {
      await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          fileId,
          threadId: replyTo,
          userEmail,
          userName,
          commentText: newComment
        })
      });

      setNewComment('');
      setReplyTo(null);
      await loadComments();
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!enabled) return null;

  return (
    <div className={`fixed inset-y-0 right-0 w-96 bg-white shadow-2xl transform transition-transform z-50 ${
      isOpen ? 'translate-x-0' : 'translate-x-full'
    }`}>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold">Comments</h3>
            <Badge variant="secondary">{comments.length}</Badge>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ×
          </Button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {comments.map(comment => (
            <CommentItem 
              key={comment.id}
              comment={comment}
              onReply={(commentId) => setReplyTo(commentId)}
              userEmail={userEmail}
              userName={userName}
            />
          ))}
        </div>

        {/* New Comment Input */}
        <div className="p-4 border-t">
          {replyTo && (
            <div className="mb-2 text-sm text-gray-600">
              Replying to comment
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setReplyTo(null)}
                className="ml-2 h-6 px-2"
              >
                Cancel
              </Button>
            </div>
          )}
          <div className="flex gap-2">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 min-h-[80px]"
            />
            <Button
              onClick={submitComment}
              disabled={!newComment.trim() || isSubmitting}
              size="sm"
              className="self-end"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CommentItem({ 
  comment, 
  onReply, 
  userEmail, 
  userName 
}: { 
  comment: Comment; 
  onReply: (id: string) => void;
  userEmail: string;
  userName?: string;
}) {
  return (
    <div className="space-y-2">
      <div className="bg-gray-50 rounded-lg p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium text-sm">
            {comment.userName || comment.userEmail}
          </span>
          <span className="text-xs text-gray-500">
            {new Date(comment.createdAt * 1000).toLocaleDateString()}
          </span>
        </div>
        <p className="text-sm text-gray-700">{comment.commentText}</p>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onReply(comment.id)}
          className="mt-2 h-6 px-2 text-xs"
        >
          <Reply className="w-3 h-3 mr-1" />
          Reply
        </Button>
      </div>

      {/* Replies */}
      {comment.replies.map(reply => (
        <div key={reply.id} className="ml-4">
          <CommentItem 
            comment={reply}
            onReply={onReply}
            userEmail={userEmail}
            userName={userName}
          />
        </div>
      ))}
    </div>
  );
}
```

**ApprovalsBar.tsx**
```tsx
import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface Approval {
  id: string;
  fileId?: string;
  userEmail: string;
  userName?: string;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
  createdAt: number;
}

interface ApprovalsBarProps {
  projectId: string;
  fileId?: string; // NULL for gallery-level
  enabled: boolean;
  userEmail: string;
  userName?: string;
}

export function ApprovalsBar({ projectId, fileId, enabled, userEmail, userName }: ApprovalsBarProps) {
  const [approval, setApproval] = useState<Approval | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    loadApproval();
  }, [projectId, fileId, userEmail]);

  const loadApproval = async () => {
    try {
      const response = await fetch(`/api/approvals?projectId=${projectId}`);
      const approvals = await response.json();
      const userApproval = approvals.find((a: Approval) => 
        a.user_email === userEmail && a.file_id === fileId
      );
      setApproval(userApproval || null);
    } catch (error) {
      console.error('Error loading approval:', error);
    }
  };

  const handleApproval = async (status: 'approved' | 'rejected', notes?: string) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      await fetch('/api/approvals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          fileId,
          userEmail,
          userName,
          status,
          notes
        })
      });

      await loadApproval();
    } catch (error) {
      console.error('Error submitting approval:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!enabled) return null;

  return (
    <div className="bg-white border rounded-lg p-4 mt-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="font-medium">
            {fileId ? 'File Approval' : 'Gallery Approval'}
          </span>
          {approval && (
            <Badge 
              variant={approval.status === 'approved' ? 'default' : 
                      approval.status === 'rejected' ? 'destructive' : 'secondary'}
            >
              {approval.status}
            </Badge>
          )}
        </div>

        {!approval || approval.status === 'pending' ? (
          <div className="flex gap-2">
            <Button
              onClick={() => handleApproval('approved')}
              disabled={isSubmitting}
              size="sm"
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              Approve
            </Button>
            <Button
              onClick={() => handleApproval('rejected')}
              disabled={isSubmitting}
              variant="outline"
              size="sm"
            >
              <XCircle className="w-4 h-4 mr-1" />
              Reject
            </Button>
          </div>
        ) : (
          <Button
            onClick={() => handleApproval('pending')}
            disabled={isSubmitting}
            variant="outline"
            size="sm"
          >
            <Clock className="w-4 h-4 mr-1" />
            Reset
          </Button>
        )}
      </div>

      {approval?.notes && (
        <p className="text-sm text-gray-600 mt-2">
          Notes: {approval.notes}
        </p>
      )}
    </div>
  );
}
```

---

### **Phase 5: Universal Template Integration (Week 5)**

#### **5.1 Update Universal Template Component**

Modify the generated site template to include advanced features:

Create `src/components/generated-site/UniversalSiteTemplate.tsx`:

```tsx
import React, { useState, useEffect } from 'react';
import { FavoritesOverlay } from '../advanced-features/FavoritesOverlay';
import { CommentsDrawer } from '../advanced-features/CommentsDrawer';
import { ApprovalsBar } from '../advanced-features/ApprovalsBar';
import { MessageCircle } from 'lucide-react';
import { Button } from '../ui/button';

declare global {
  interface Window {
    LYTSITE_DATA: any;
    LYTSITE_SLUG: string;
  }
}

export function UniversalSiteTemplate() {
  const [data, setData] = useState<any>(null);
  const [userSession, setUserSession] = useState<any>(null);
  const [showComments, setShowComments] = useState(false);
  const [activeFileComments, setActiveFileComments] = useState<string | null>(null);

  useEffect(() => {
    // Get data from window object (injected by backend)
    if (window.LYTSITE_DATA) {
      setData(window.LYTSITE_DATA);
    }

    // Initialize user session (guest user with email prompt)
    initializeUserSession();
  }, []);

  const initializeUserSession = () => {
    // Check if user has provided email for interactive features
    const storedEmail = localStorage.getItem(`lytsite-user-${window.LYTSITE_SLUG}`);
    if (storedEmail) {
      setUserSession({
        email: storedEmail,
        name: localStorage.getItem(`lytsite-user-name-${window.LYTSITE_SLUG}`) || undefined,
        userType: 'guest'
      });
    }
  };

  const promptForUserInfo = () => {
    const email = prompt('Enter your email to interact with this content:');
    if (email) {
      const name = prompt('Enter your name (optional):') || undefined;
      
      localStorage.setItem(`lytsite-user-${window.LYTSITE_SLUG}`, email);
      if (name) {
        localStorage.setItem(`lytsite-user-name-${window.LYTSITE_SLUG}`, name);
      }
      
      setUserSession({ email, name, userType: 'guest' });
    }
  };

  const handleCommentClick = (fileId: string) => {
    if (!userSession) {
      promptForUserInfo();
      return;
    }
    setActiveFileComments(fileId);
    setShowComments(true);
  };

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading content...</p>
        </div>
      </div>
    );
  }

  const settings = data.settings || {};

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            {data.title}
          </h1>
          <p className="text-slate-600 mb-4">{data.subLine}</p>
          <p className="text-sm text-slate-500">{data.tagLine}</p>
        </div>
      </div>

      {/* Gallery-level Approvals */}
      {settings.enableApprovals && (
        <div className="max-w-4xl mx-auto px-4 py-4">
          <ApprovalsBar
            projectId={window.LYTSITE_SLUG}
            enabled={settings.enableApprovals}
            userEmail={userSession?.email || ''}
            userName={userSession?.name}
          />
        </div>
      )}

      {/* Files Grid */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data.files.map((file: any, index: number) => (
            <div key={index} className="group relative bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              {/* File Preview */}
              <div className="aspect-square bg-slate-100 rounded-t-lg overflow-hidden relative">
                {file.thumbnailUrl ? (
                  <img 
                    src={file.thumbnailUrl} 
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-slate-200 rounded-lg flex items-center justify-center mx-auto mb-2">
                        📄
                      </div>
                      <span className="text-sm text-slate-600">{file.type}</span>
                    </div>
                  </div>
                )}

                {/* Favorites Overlay */}
                <FavoritesOverlay
                  projectId={window.LYTSITE_SLUG}
                  fileId={file.name} // Using filename as fileId for now
                  enabled={settings.enableFavorites}
                  userEmail={userSession?.email || ''}
                  userName={userSession?.name}
                />

                {/* Comments Button */}
                {settings.enableComments && (
                  <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      onClick={() => handleCommentClick(file.name)}
                      className="h-8 w-8 p-0 bg-blue-600 hover:bg-blue-700"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>

              {/* File Info */}
              <div className="p-4">
                <h3 className="font-medium text-slate-900 mb-1 truncate">
                  {file.name}
                </h3>
                <p className="text-sm text-slate-500 mb-3">
                  {file.size} • {file.type}
                </p>

                {/* Download Button */}
                <Button
                  onClick={() => {
                    // Track download event
                    if (settings.enableAnalytics && userSession) {
                      fetch('/api/analytics', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          projectId: window.LYTSITE_SLUG,
                          fileId: file.name,
                          userEmail: userSession.email,
                          eventType: 'download'
                        })
                      });
                    }
                    
                    // Trigger download
                    window.open(file.url, '_blank');
                  }}
                  className="w-full"
                  size="sm"
                >
                  Download
                </Button>

                {/* File-level Approvals */}
                {settings.enableApprovals && (
                  <ApprovalsBar
                    projectId={window.LYTSITE_SLUG}
                    fileId={file.name}
                    enabled={settings.enableApprovals}
                    userEmail={userSession?.email || ''}
                    userName={userSession?.name}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t mt-12">
        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
          <p className="text-slate-500 text-sm">
            Created with{' '}
            <a 
              href="https://lytsite.com" 
              className="text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Lytsite
            </a>
          </p>
          {settings.enableAnalytics && (
            <p className="text-xs text-slate-400 mt-2">
              {data.views} views
            </p>
          )}
        </div>
      </div>

      {/* Comments Drawer */}
      {settings.enableComments && activeFileComments && (
        <CommentsDrawer
          projectId={window.LYTSITE_SLUG}
          fileId={activeFileComments}
          enabled={settings.enableComments}
          userEmail={userSession?.email || ''}
          userName={userSession?.name}
          isOpen={showComments}
          onClose={() => {
            setShowComments(false);
            setActiveFileComments(null);
          }}
        />
      )}
    </div>
  );
}
```

#### **5.2 Update Build Configuration**

Create a separate build for the universal template:

Add to `vite.config.ts`:

```typescript
// ... existing config

// Add build option for universal template
export default defineConfig({
  // ... existing config
  
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        template: 'src/universal-template.html' // New entry point
      }
    }
  }
});
```

Create `src/universal-template.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Universal Template</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/universal-template-entry.tsx"></script>
</body>
</html>
```

Create `src/universal-template-entry.tsx`:

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { UniversalSiteTemplate } from './components/generated-site/UniversalSiteTemplate';
import './index.css';

// Mount the universal template
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <UniversalSiteTemplate />
  </React.StrictMode>
);
```

---

## 📊 Free vs Pro Feature Matrix

| Feature | Free Tier | Pro Tier ($29/mo) |
|---------|-----------|-------------------|
| **File Upload & Sharing** | ✅ Unlimited | ✅ Unlimited |
| **Basic Templates** | ✅ All templates | ✅ All templates |
| **Favorites (♥)** | ✅ Basic count only | ✅ Full details + CSV export |
| **Comments & Feedback** | ❌ | ✅ Threaded comments + notifications |
| **Approvals** | ✅ Gallery-level only | ✅ File-level + status dashboard |
| **Analytics** | ✅ Page views only | ✅ File-level insights + user breakdown |
| **Notifications** | ✅ Daily digest | ✅ Real-time email + Slack integration |
| **Branding** | Lytsite footer | ✅ Custom branding |
| **Advanced Features** | Basic interaction | ✅ Full engagement suite |

---

## 🛠️ Implementation Timeline

### **Week 1: Database & Infrastructure**
- [ ] Set up Cloudflare D1 database
- [ ] Create migration scripts
- [ ] Update backend types and environment
- [ ] Test database connections

### **Week 2: Backend API Development**  
- [ ] Build advanced features API endpoints
- [ ] Implement CRUD operations for favorites, comments, approvals
- [ ] Create analytics tracking system
- [ ] Add notification queue system

### **Week 3: Frontend Settings UI**
- [ ] Enhance upload modal with settings step
- [ ] Create feature toggle components
- [ ] Update upload handlers to include settings
- [ ] Test settings persistence

### **Week 4: Advanced UI Components**
- [ ] Build FavoritesOverlay component
- [ ] Create CommentsDrawer with threading
- [ ] Implement ApprovalsBar component  
- [ ] Add user session management

### **Week 5: Universal Template Integration**
- [ ] Update generated site template
- [ ] Integrate all advanced features
- [ ] Implement user prompts for guest interaction
- [ ] Test end-to-end functionality

### **Week 6: Testing & Polish**
- [ ] Cross-browser testing
- [ ] Mobile responsiveness
- [ ] Performance optimization
- [ ] Error handling and edge cases

---

## 🚀 Deployment Strategy

### **Development Environment**
1. Run database migrations locally
2. Test with Cloudflare D1 local development
3. Use Wrangler dev for backend testing

### **Staging Environment**  
1. Deploy to staging Cloudflare environment
2. Test with real D1 database
3. Validate all API endpoints

### **Production Deployment**
1. Run production database migrations
2. Deploy backend with new API endpoints
3. Deploy frontend with advanced features
4. Update generated site template
5. Monitor analytics and error rates

---

## 💡 Key Implementation Notes

### **User Experience Considerations**
- **Guest-friendly**: No forced registration, prompt only when needed
- **Progressive enhancement**: Basic functionality works without JavaScript
- **Mobile-first**: All advanced features work on mobile devices
- **Performance**: Lazy-load advanced features to maintain speed

### **Technical Considerations**
- **Privacy-focused**: Minimal data collection, user consent for tracking
- **Scalable architecture**: D1 database can handle growth
- **API-first design**: All features accessible via clean REST APIs
- **Error resilience**: Graceful degradation when features fail

### **Business Model Integration**
- **Freemium approach**: Core features free, advanced features paid
- **Value-driven pricing**: Pro features solve real business problems
- **Usage analytics**: Track feature adoption for product decisions
- **Upgrade prompts**: Contextual prompts for Pro features

This implementation plan provides a complete roadmap for adding all your requested advanced features while maintaining the current architecture and user experience! 🎯