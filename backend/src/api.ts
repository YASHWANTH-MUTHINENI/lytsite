import { Env, ProjectSettings, UserSession, Favorite, Comment, Approval, AnalyticsEvent, Notification } from './types';

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
      } else if (path.startsWith('/api/project-settings')) {
        return this.handleProjectSettings(request, corsHeaders);
      }

      return new Response('Not found', { status: 404, headers: corsHeaders });
    } catch (error) {
      console.error('API Error:', error);
      return new Response('Internal error', { status: 500, headers: corsHeaders });
    }
  }

  // Project Settings API
  async handleProjectSettings(request: Request, corsHeaders: Record<string, string>): Promise<Response> {
    const url = new URL(request.url);
    const method = request.method;

    if (method === 'POST') {
      // Save project settings
      const { projectId, settings } = await request.json();
      
      await this.env.LYTSITE_DB.prepare(`
        INSERT OR REPLACE INTO project_settings 
        (project_id, enable_favorites, enable_comments, enable_approvals, enable_analytics, enable_notifications, notification_email, slack_webhook)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        projectId,
        settings.enableFavorites ? 1 : 0,
        settings.enableComments ? 1 : 0,
        settings.enableApprovals ? 1 : 0,
        settings.enableAnalytics ? 1 : 0,
        settings.enableNotifications ? 1 : 0,
        settings.notificationEmail || null,
        settings.slackWebhook || null
      ).run();

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (method === 'GET') {
      // Get project settings
      const projectId = url.searchParams.get('projectId');
      
      const result = await this.env.LYTSITE_DB.prepare(`
        SELECT * FROM project_settings WHERE project_id = ?
      `).bind(projectId).first();

      const settings = result ? {
        enableFavorites: Boolean((result as any).enable_favorites),
        enableComments: Boolean((result as any).enable_comments),
        enableApprovals: Boolean((result as any).enable_approvals),
        enableAnalytics: Boolean((result as any).enable_analytics),
        enableNotifications: Boolean((result as any).enable_notifications),
        notificationEmail: (result as any).notification_email,
        slackWebhook: (result as any).slack_webhook
      } : {
        enableFavorites: false,
        enableComments: false,
        enableApprovals: false,
        enableAnalytics: true,
        enableNotifications: false
      };

      return new Response(JSON.stringify(settings), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
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
      const comments = result.results as any[];
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

  // Analytics API
  async handleAnalytics(request: Request, corsHeaders: Record<string, string>): Promise<Response> {
    const method = request.method;

    if (method === 'POST') {
      // Track analytics event
      const { projectId, fileId, userEmail, eventType, metadata } = await request.json();
      
      await this.trackEvent(projectId, fileId, userEmail, eventType, metadata);

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (method === 'GET') {
      // Get analytics for project
      const url = new URL(request.url);
      const projectId = url.searchParams.get('projectId');

      const result = await this.env.LYTSITE_DB.prepare(`
        SELECT event_type, COUNT(*) as count, file_id
        FROM analytics 
        WHERE project_id = ? 
        GROUP BY event_type, file_id
        ORDER BY count DESC
      `).bind(projectId).all();

      return new Response(JSON.stringify(result.results), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  }

  // Notifications API (placeholder)
  async handleNotifications(request: Request, corsHeaders: Record<string, string>): Promise<Response> {
    return new Response(JSON.stringify({ message: 'Notifications API - Coming soon' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  // Helper methods
  async trackEvent(projectId: string, fileId: string | null, userEmail: string | null, eventType: string, metadata?: any): Promise<void> {
    const eventId = crypto.randomUUID();
    await this.env.LYTSITE_DB.prepare(`
      INSERT INTO analytics (id, project_id, file_id, user_email, event_type, metadata)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(eventId, projectId, fileId, userEmail, eventType, JSON.stringify(metadata)).run();
  }

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
        return `${data.userName || data.userEmail} favorited a file in your project`;
      case 'new_comment':
        return `${data.userName || data.userEmail} left a comment: "${data.commentText.substring(0, 100)}${data.commentText.length > 100 ? '...' : ''}"`;
      case 'approval_change':
        return `${data.userName || data.userEmail} ${data.status} ${data.fileId ? 'a file' : 'your project'}`;
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