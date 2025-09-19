import { Env, ProjectSettings, UserSession, Favorite, Comment, Approval, AnalyticsEvent, Notification } from './types';

export class AdvancedFeaturesAPI {
  constructor(private env: Env) {}

  async handleRequest(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;
    
    console.log('🔥 AdvancedFeaturesAPI.handleRequest called:', { method, path, url: request.url });

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
        console.log('🚀 Routing to handleComments method');
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
      
      console.log('🔍 Favorites: Received data:', { projectId, fileId, userEmail, userName });
      
      // Validate required fields
      if (!projectId || !fileId || !userEmail) {
        return new Response(JSON.stringify({ 
          error: 'Missing required fields',
          details: 'projectId, fileId, and userEmail are required'
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      // Check if database exists
      if (!this.env.LYTSITE_DB) {
        return new Response(JSON.stringify({ 
          error: 'Database not configured' 
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      const favoriteId = crypto.randomUUID();
      
      console.log('🔍 Generated favoriteId:', favoriteId);
      
      if (!favoriteId) {
        return new Response(JSON.stringify({ 
          error: 'Failed to generate favorite ID'
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      try {
        console.log('🔍 Database: Binding values:', {
          favoriteId,
          projectId,
          fileId,
          userEmail,
          userName: userName || 'Anonymous'
        });
        
        const stmt = this.env.LYTSITE_DB.prepare(`
          INSERT OR REPLACE INTO favorites (id, project_id, file_id, user_email, user_name, created_at)
          VALUES (?, ?, ?, ?, ?, ?)
        `);
        
        console.log('🔍 Database: About to bind and run query...');
        
        // First, let's check if the table exists
        try {
          const tableCheck = await this.env.LYTSITE_DB.prepare(`
            SELECT name FROM sqlite_master WHERE type='table' AND name='favorites'
          `).first();
          console.log('🔍 Table check result:', tableCheck);
          
          // Let's also check the table schema
          const schemaCheck = await this.env.LYTSITE_DB.prepare(`
            PRAGMA table_info(favorites)
          `).all();
          console.log('🔍 Favorites table schema:', schemaCheck);
          
          if (!tableCheck) {
            console.log('🔍 Favorites table does not exist! Creating it...');
            // Create the table if it doesn't exist
            await this.env.LYTSITE_DB.prepare(`
              CREATE TABLE IF NOT EXISTS favorites (
                id TEXT PRIMARY KEY,
                project_id TEXT NOT NULL,
                file_id TEXT NOT NULL,
                user_email TEXT NOT NULL,
                user_name TEXT,
                created_at INTEGER DEFAULT (unixepoch()),
                UNIQUE(project_id, file_id, user_email)
              )
            `).run();
            console.log('🔍 Favorites table created successfully');
          }
        } catch (tableError) {
          console.error('🔍 Table check/creation error:', tableError);
        }
        
        // Try with explicit null handling and timestamp
        const timestamp = Math.floor(Date.now() / 1000);
        const safeUserName = userName || 'Anonymous';
        
        console.log('🔍 About to bind with timestamp:', timestamp);
        
        const result = await stmt.bind(
          favoriteId, 
          projectId, 
          fileId, 
          userEmail, 
          safeUserName,
          timestamp
        ).run();
        
        console.log('🔍 Database insert result:', result);
      } catch (dbError) {
        console.error('Database error in favorites:', dbError);
        return new Response(JSON.stringify({ 
          error: 'Database operation failed',
          details: String(dbError) 
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

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
      const userEmail = url.searchParams.get('userEmail'); // Get user session ID from query params

      let query = 'SELECT * FROM favorites WHERE project_id = ?';
      let params: any[] = [projectId];

      if (fileId) {
        query += ' AND file_id = ?';
        params.push(fileId);
      }

      const result = await this.env.LYTSITE_DB.prepare(query).bind(...params).all();
      const favorites = result.results || [];
      
      // Check if current user has favorited this file
      const isFavorited = userEmail ? favorites.some((fav: any) => fav.user_email === userEmail) : false;
      const count = favorites.length;
      
      console.log('🔍 Favorites GET response:', { projectId, fileId, userEmail, isFavorited, count, favorites });
      
      return new Response(JSON.stringify({ 
        isFavorited, 
        count, 
        favorites 
      }), {
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
      
      console.log('🔍 Comments: Received data:', { projectId, fileId, threadId, userEmail, userName, commentText });
      
      // Validate required fields
      if (!projectId || !fileId || !userEmail || !commentText) {
        return new Response(JSON.stringify({ 
          error: 'Missing required fields',
          details: 'projectId, fileId, userEmail, and commentText are required'
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      const commentId = crypto.randomUUID();
      const timestamp = Math.floor(Date.now() / 1000);
      const safeUserName = userName || 'Anonymous';
      const safeThreadId = threadId || commentId; // Use comment ID as thread ID if not provided
      
      console.log('🔍 Comments: Binding values:', {
        commentId,
        projectId,
        fileId,
        threadId: safeThreadId,
        userEmail,
        userName: safeUserName,
        commentText,
        timestamp
      });

      try {
        // Check comments table schema first
        const schemaCheck = await this.env.LYTSITE_DB.prepare(`
          PRAGMA table_info(comments)
        `).all();
        console.log('🔍 Comments table schema:', schemaCheck);

        const result = await this.env.LYTSITE_DB.prepare(`
          INSERT INTO comments (id, project_id, file_id, thread_id, user_email, user_name, comment_text, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(commentId, projectId, fileId, safeThreadId, userEmail, safeUserName, commentText, timestamp).run();
        
        console.log('🔍 Comments: Database insert result:', result);
      } catch (dbError) {
        console.error('🔍 Comments: Database error:', dbError);
        return new Response(JSON.stringify({ 
          error: 'Database operation failed',
          details: String(dbError) 
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

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

      return new Response(JSON.stringify({ comments: threaded }), {
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
      
      console.log('🔍 Approvals: Received data:', { projectId, fileId, userEmail, userName, status, notes });
      
      // Validate required fields
      if (!projectId || !fileId || !userEmail || !status) {
        return new Response(JSON.stringify({ 
          error: 'Missing required fields',
          details: 'projectId, fileId, userEmail, and status are required'
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      const approvalId = crypto.randomUUID();
      const timestamp = Math.floor(Date.now() / 1000);
      const safeUserName = userName || 'Anonymous';
      const safeNotes = notes || '';
      
      console.log('🔍 Approvals: Binding values:', {
        approvalId,
        projectId,
        fileId,
        userEmail,
        userName: safeUserName,
        status,
        notes: safeNotes,
        timestamp
      });

      try {
        // Check approvals table schema first
        const schemaCheck = await this.env.LYTSITE_DB.prepare(`
          PRAGMA table_info(approvals)
        `).all();
        console.log('🔍 Approvals table schema:', schemaCheck);

        const result = await this.env.LYTSITE_DB.prepare(`
          INSERT OR REPLACE INTO approvals (id, project_id, file_id, user_email, user_name, status, notes, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(approvalId, projectId, fileId, userEmail, safeUserName, status, safeNotes, timestamp).run();
        
        console.log('🔍 Approvals: Database insert result:', result);
      } catch (dbError) {
        console.error('🔍 Approvals: Database error:', dbError);
        return new Response(JSON.stringify({ 
          error: 'Database operation failed',
          details: String(dbError) 
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

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

      // Get updated counts for this file
      const countsResult = await this.env.LYTSITE_DB.prepare(`
        SELECT status, COUNT(*) as count 
        FROM approvals 
        WHERE project_id = ? AND file_id = ? 
        GROUP BY status
      `).bind(projectId, fileId).all();

      const counts = { approved: 0, rejected: 0 };
      (countsResult.results as any[]).forEach(row => {
        if (row.status === 'approved') counts.approved = row.count;
        if (row.status === 'rejected') counts.rejected = row.count;
      });

      return new Response(JSON.stringify({ success: true, id: approvalId, counts }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (method === 'GET') {
      // Get approvals for project/file
      const url = new URL(request.url);
      const projectId = url.searchParams.get('projectId');
      const fileId = url.searchParams.get('fileId');

      // Get approval counts
      const countsResult = await this.env.LYTSITE_DB.prepare(`
        SELECT status, COUNT(*) as count 
        FROM approvals 
        WHERE project_id = ? ${fileId ? 'AND file_id = ?' : ''}
        GROUP BY status
      `).bind(projectId, ...(fileId ? [fileId] : [])).all();

      const counts = { approved: 0, rejected: 0 };
      (countsResult.results as any[]).forEach(row => {
        if (row.status === 'approved') counts.approved = row.count;
        if (row.status === 'rejected') counts.rejected = row.count;
      });

      // Get all approvals for detailed view
      const allResult = await this.env.LYTSITE_DB.prepare(`
        SELECT * FROM approvals 
        WHERE project_id = ? ${fileId ? 'AND file_id = ?' : ''}
        ORDER BY created_at DESC
      `).bind(projectId, ...(fileId ? [fileId] : [])).all();

      return new Response(JSON.stringify({ 
        counts, 
        approvals: allResult.results 
      }), {
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
      const fileId = url.searchParams.get('fileId');
      const detailed = url.searchParams.get('detailed') === 'true';

      try {
        console.log('🔍 Analytics: Loading for project:', projectId, 'detailed:', detailed);

        // Get favorites count
        let favoritesQuery = 'SELECT COUNT(*) as count FROM favorites WHERE project_id = ?';
        let favoritesParams = [projectId];
        if (fileId) {
          favoritesQuery += ' AND file_id = ?';
          favoritesParams.push(fileId);
        }
        
        const favoritesResult = await this.env.LYTSITE_DB.prepare(favoritesQuery).bind(...favoritesParams).first() as any;
        const favoritesCount = favoritesResult?.count || 0;

        // Get comments count
        let commentsQuery = 'SELECT COUNT(*) as count FROM comments WHERE project_id = ?';
        let commentsParams = [projectId];
        if (fileId) {
          commentsQuery += ' AND file_id = ?';
          commentsParams.push(fileId);
        }
        
        console.log('🔍 Analytics: Comments query:', commentsQuery, 'params:', commentsParams);
        
        let commentsCount = 0;
        try {
          const commentsResult = await this.env.LYTSITE_DB.prepare(commentsQuery).bind(...commentsParams).first() as any;
          commentsCount = commentsResult?.count || 0;
          console.log('🔍 Analytics: Comments result:', commentsResult, 'count:', commentsCount);
        } catch (commentsError) {
          console.error('🔍 Analytics: Comments query failed:', commentsError);
          // Check if comments table exists
          try {
            const tableCheck = await this.env.LYTSITE_DB.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='comments'").first();
            console.log('🔍 Analytics: Comments table exists:', tableCheck);
          } catch (tableCheckError) {
            console.error('🔍 Analytics: Table check failed:', tableCheckError);
          }
        }

        // Get approvals count
        let approvalsQuery = 'SELECT status, COUNT(*) as count FROM approvals WHERE project_id = ?';
        let approvalsParams = [projectId];
        if (fileId) {
          approvalsQuery += ' AND file_id = ?';
          approvalsParams.push(fileId);
        }
        approvalsQuery += ' GROUP BY status';
        
        const approvalsResult = await this.env.LYTSITE_DB.prepare(approvalsQuery).bind(...approvalsParams).all();
        const approvals = {
          approved: 0,
          rejected: 0,
          pending: 0
        };
        
        (approvalsResult.results || []).forEach((row: any) => {
          if (row.status === 'approved') approvals.approved = row.count;
          else if (row.status === 'rejected') approvals.rejected = row.count;
          else if (row.status === 'pending') approvals.pending = row.count;
        });

        // Get views count from analytics table (if it exists)
        let viewsCount = 0;
        try {
          let viewsQuery = "SELECT COUNT(*) as count FROM analytics WHERE project_id = ? AND event_type = 'view'";
          let viewsParams = [projectId];
          if (fileId) {
            viewsQuery += ' AND file_id = ?';
            viewsParams.push(fileId);
          }
          
          const viewsResult = await this.env.LYTSITE_DB.prepare(viewsQuery).bind(...viewsParams).first() as any;
          viewsCount = viewsResult?.count || 0;
        } catch (error) {
          console.log('🔍 Analytics table may not exist yet, defaulting views to 0');
        }

        const analytics = {
          views: viewsCount,
          downloads: 0, // Could be tracked similarly if needed
          favorites: favoritesCount,
          comments: commentsCount,
          approvals
        };

        console.log('🔍 Analytics result:', { projectId, fileId, analytics });

        return new Response(JSON.stringify({ 
          success: true,
          analytics 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } catch (error) {
        console.error('🔍 Analytics error:', error);
        
        // Return default analytics on error
        return new Response(JSON.stringify({ 
          success: false,
          analytics: {
            views: 0,
            downloads: 0,
            favorites: 0,
            comments: 0,
            approvals: { approved: 0, rejected: 0, pending: 0 }
          },
          error: String(error)
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
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
    try {
      console.log('🔍 TrackEvent: Starting analytics insert for:', { projectId, fileId, userEmail, eventType });
      
      const eventId = crypto.randomUUID();
      const timestamp = Math.floor(Date.now() / 1000);
      
      const result = await this.env.LYTSITE_DB.prepare(`
        INSERT INTO analytics (id, project_id, file_id, user_email, event_type, metadata, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).bind(eventId, projectId, fileId, userEmail, eventType, JSON.stringify(metadata), timestamp).run();
      
      console.log('🔍 TrackEvent: Analytics insert successful:', result);
    } catch (error) {
      console.error('🔍 TrackEvent: Analytics insert failed:', error);
      // Don't throw - analytics should not break the main functionality
    }
  }

  async triggerNotification(projectId: string, type: string, data: any): Promise<void> {
    try {
      console.log('🔍 TriggerNotification: Starting for:', { projectId, type });
      
      // Get project settings to check if notifications are enabled
      const project = await this.env.LYTSITE_KV.get(`project:${projectId}`);
      if (!project) {
        console.log('🔍 TriggerNotification: No project found, skipping');
        return;
      }

      const projectData = JSON.parse(project);
      if (!projectData.settings?.enableNotifications) {
        console.log('🔍 TriggerNotification: Notifications disabled, skipping');
        return;
      }

      const notificationId = crypto.randomUUID();
      const timestamp = Math.floor(Date.now() / 1000);
      
      const result = await this.env.LYTSITE_DB.prepare(`
        INSERT INTO notifications (id, project_id, recipient_email, notification_type, title, message, metadata, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        notificationId,
        projectId,
        projectData.authorEmail,
        type,
        this.getNotificationTitle(type, data),
        this.getNotificationMessage(type, data),
        JSON.stringify(data),
        timestamp
      ).run();
      
      console.log('🔍 TriggerNotification: Success:', result);
    } catch (error) {
      console.error('🔍 TriggerNotification: Failed:', error);
      // Don't throw - notifications should not break the main functionality
    }
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
      if (comment.thread_id && comment.thread_id !== comment.id) {
        // This is a reply - find its parent thread
        const parent = commentMap.get(comment.thread_id);
        if (parent) {
          parent.replies.push(comment);
        }
      } else {
        // This is a root comment (no thread_id or thread_id equals own id)
        rootComments.push(comment);
      }
    });

    return rootComments;
  }
}