import { Env } from './types';
import { corsHeaders } from './utils';
import { requireAuth, optionalAuth, requireOwnership, AuthContext } from './auth-middleware';

interface IRequest extends Request {
  query?: Record<string, string>;
}

interface Creator {
  id: string;
  clerk_user_id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

interface CreateCreatorData {
  clerk_user_id: string;
  email: string;
  name?: string;
  avatar_url?: string;
}

export class CreatorAPI {
  constructor(private env: Env) {}
  
  private get db(): D1Database {
    return this.env.LYTSITE_DB;
  }

  // Create or update creator from Clerk webhook/data
  async createOrUpdateCreator(creatorData: CreateCreatorData): Promise<Creator> {
    const existingCreator = await this.getCreatorByClerkId(creatorData.clerk_user_id);
    
    if (existingCreator) {
      // Update existing creator
      const stmt = this.db.prepare(`
        UPDATE creators 
        SET email = ?, name = ?, avatar_url = ?, updated_at = CURRENT_TIMESTAMP
        WHERE clerk_user_id = ?
      `);
      
      await stmt.bind(
        creatorData.email,
        creatorData.name || null,
        creatorData.avatar_url || null,
        creatorData.clerk_user_id
      ).run();
      
      return this.getCreatorByClerkId(creatorData.clerk_user_id) as Promise<Creator>;
    } else {
      // Create new creator
      const creatorId = `creator_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const stmt = this.db.prepare(`
        INSERT INTO creators (id, clerk_user_id, email, name, avatar_url)
        VALUES (?, ?, ?, ?, ?)
      `);
      
      await stmt.bind(
        creatorId,
        creatorData.clerk_user_id,
        creatorData.email,
        creatorData.name || null,
        creatorData.avatar_url || null
      ).run();
      
      return this.getCreatorByClerkId(creatorData.clerk_user_id) as Promise<Creator>;
    }
  }

  // Get creator by Clerk user ID
  async getCreatorByClerkId(clerkUserId: string): Promise<Creator | null> {
    const stmt = this.db.prepare(`
      SELECT * FROM creators WHERE clerk_user_id = ?
    `);
    
    const result = await stmt.bind(clerkUserId).first();
    return result as Creator | null;
  }

  // Get creator by internal ID
  async getCreatorById(creatorId: string): Promise<Creator | null> {
    const stmt = this.db.prepare(`
      SELECT * FROM creators WHERE id = ?
    `);
    
    const result = await stmt.bind(creatorId).first();
    return result as Creator | null;
  }

  // Get projects by anonymous session ID
  async getAnonymousProjects(anonymousSessionId: string) {
    console.log('Searching for anonymous projects with session ID:', anonymousSessionId);
    const stmt = this.db.prepare(`
      SELECT p.*, ps.* 
      FROM projects p
      LEFT JOIN project_settings ps ON p.id = ps.project_id
      WHERE p.anonymous_session_id = ?
      ORDER BY p.created_at DESC
    `);
    
    const results = await stmt.bind(anonymousSessionId).all();
    console.log('Database query results:', results);
    console.log('Results.results length:', results.results?.length || 0);
    
    return results.results?.map((row: any) => ({
      id: row.id,
      slug: row.slug,
      title: row.title,
      description: row.description,
      created_at: row.created_at,
      updated_at: row.updated_at,
      settings: {
        enable_favorites: row.enable_favorites || false,
        enable_comments: row.enable_comments || false,
        enable_approvals: row.enable_approvals || false,
        enable_analytics: row.enable_analytics || true,
        enable_notifications: row.enable_notifications || false,
      }
    })) || [];
  }

  // Get all projects for a creator
  async getCreatorProjects(creatorId: string) {
    const stmt = this.db.prepare(`
      SELECT p.*, ps.* 
      FROM projects p
      LEFT JOIN project_settings ps ON p.id = ps.project_id
      WHERE p.creator_id = ?
      ORDER BY p.created_at DESC
    `);
    
    const results = await stmt.bind(creatorId).all();
    
    return results.results?.map((row: any) => ({
      id: row.id,
      slug: row.slug,
      title: row.title,
      description: row.description,
      created_at: row.created_at,
      updated_at: row.updated_at,
      settings: {
        enable_favorites: row.enable_favorites || false,
        enable_comments: row.enable_comments || false,
        enable_approvals: row.enable_approvals || false,
        enable_analytics: row.enable_analytics || true,
        enable_notifications: row.enable_notifications || false,
      }
    })) || [];
  }

  // Link anonymous project to creator
  async claimAnonymousProject(anonymousSessionId: string, creatorId: string) {
    // Update projects
    const projectStmt = this.db.prepare(`
      UPDATE projects 
      SET creator_id = ?, anonymous_session_id = null, updated_at = CURRENT_TIMESTAMP
      WHERE anonymous_session_id = ?
    `);
    
    await projectStmt.bind(creatorId, anonymousSessionId).run();

    // Update project settings
    const settingsStmt = this.db.prepare(`
      UPDATE project_settings 
      SET creator_id = ?, anonymous_session_id = null, updated_at = CURRENT_TIMESTAMP
      WHERE anonymous_session_id = ?
    `);
    
    await settingsStmt.bind(creatorId, anonymousSessionId).run();

    return { success: true, message: 'Anonymous projects claimed successfully' };
  }

  // Get anonymous engagement summary (limited data for conversion)
  async getAnonymousEngagementSummary(anonymousSessionId: string) {
    // Check if session has expired (7 days from first project creation)
    const projectAgeStmt = this.db.prepare(`
      SELECT MIN(created_at) as first_project_date, COUNT(*) as project_count
      FROM projects 
      WHERE anonymous_session_id = ?
    `);
    
    const projectAge = await projectAgeStmt.bind(anonymousSessionId).first() as any;
    
    if (!projectAge?.first_project_date) {
      return null; // No projects found
    }

    const firstProjectDate = new Date(projectAge.first_project_date);
    const now = new Date();
    const daysSinceCreation = Math.floor((now.getTime() - firstProjectDate.getTime()) / (1000 * 60 * 60 * 24));
    const daysRemaining = Math.max(0, 7 - daysSinceCreation);
    
    // If expired, return expired status
    if (daysRemaining <= 0) {
      return {
        expired: true,
        message: 'Analytics access has expired. Sign up to restore your data!'
      };
    }

    // Get project IDs for this session
    const projectIdsStmt = this.db.prepare(`
      SELECT id FROM projects WHERE anonymous_session_id = ?
    `);
    const projectIdsResult = await projectIdsStmt.bind(anonymousSessionId).all();
    const projectIdList = (projectIdsResult.results as any[]).map((row: any) => row.id);

    if (projectIdList.length === 0) {
      return null;
    }

    // Get aggregated engagement counts (no detailed breakdown)
    let totalInteractions = 0;
    let hasComments = false;
    let hasFavorites = false;
    let hasApprovals = false;

    // Check for comments
    const commentsStmt = this.db.prepare(`
      SELECT COUNT(*) as count FROM comments 
      WHERE project_id IN (${projectIdList.map(() => '?').join(',')})
    `);
    const commentCount = await commentsStmt.bind(...projectIdList).first() as any;
    const commentsNum = commentCount?.count || 0;
    if (commentsNum > 0) {
      hasComments = true;
      totalInteractions += commentsNum;
    }

    // Check for favorites
    const favoritesStmt = this.db.prepare(`
      SELECT COUNT(*) as count FROM favorites 
      WHERE project_id IN (${projectIdList.map(() => '?').join(',')})
    `);
    const favoriteCount = await favoritesStmt.bind(...projectIdList).first() as any;
    const favoritesNum = favoriteCount?.count || 0;
    if (favoritesNum > 0) {
      hasFavorites = true;
      totalInteractions += favoritesNum;
    }

    // Check for approvals
    const approvalsStmt = this.db.prepare(`
      SELECT COUNT(*) as count FROM approvals 
      WHERE project_id IN (${projectIdList.map(() => '?').join(',')})
    `);
    const approvalCount = await approvalsStmt.bind(...projectIdList).first() as any;
    const approvalsNum = approvalCount?.count || 0;
    if (approvalsNum > 0) {
      hasApprovals = true;
      totalInteractions += approvalsNum;
    }

    const expiresAt = new Date(firstProjectDate);
    expiresAt.setDate(expiresAt.getDate() + 7);

    return {
      total_interactions: totalInteractions,
      has_comments: hasComments,
      has_favorites: hasFavorites,
      has_approvals: hasApprovals,
      days_remaining: daysRemaining,
      expires_at: expiresAt.toISOString(),
      project_count: projectAge.project_count,
      expired: false
    };
  }

  // Get creator analytics summary
  async getCreatorAnalytics(creatorId: string) {
    // Get project count
    const projectCountStmt = this.db.prepare(`
      SELECT COUNT(*) as count FROM projects WHERE creator_id = ?
    `);
    const projectCount = await projectCountStmt.bind(creatorId).first();

    // Get total views across all projects
    const viewsStmt = this.db.prepare(`
      SELECT COUNT(*) as views FROM analytics a
      JOIN projects p ON a.project_id = p.id
      WHERE p.creator_id = ? AND a.event_type = 'view'
    `);
    const totalViews = await viewsStmt.bind(creatorId).first();

    // Get total favorites
    const favoritesStmt = this.db.prepare(`
      SELECT COUNT(*) as favorites FROM favorites f
      JOIN projects p ON f.project_id = p.id
      WHERE p.creator_id = ?
    `);
    const totalFavorites = await favoritesStmt.bind(creatorId).first();

    // Get total comments
    const commentsStmt = this.db.prepare(`
      SELECT COUNT(*) as comments FROM comments c
      JOIN projects p ON c.project_id = p.id
      WHERE p.creator_id = ?
    `);
    const totalComments = await commentsStmt.bind(creatorId).first();

    return {
      projects: (projectCount as any)?.count || 0,
      views: (totalViews as any)?.views || 0,
      favorites: (totalFavorites as any)?.favorites || 0,
      comments: (totalComments as any)?.comments || 0
    };
  }

  // Get comprehensive project details for dashboard
  async getProjectDetails(projectId: string) {
    console.log('📊 CreatorAPI: Getting details for project:', projectId);
    
    // Get basic project info with settings
    const projectStmt = this.db.prepare(`
      SELECT 
        p.id, p.title, p.slug, p.description, p.created_at,
        COALESCE(ps.enable_favorites, 0) as enable_favorites,
        COALESCE(ps.enable_comments, 0) as enable_comments,
        COALESCE(ps.enable_approvals, 0) as enable_approvals,
        COALESCE(ps.enable_analytics, 1) as enable_analytics,
        COALESCE(ps.enable_notifications, 0) as enable_notifications
      FROM projects p
      LEFT JOIN project_settings ps ON p.id = ps.project_id
      WHERE p.id = ?
    `);
    const project = await projectStmt.bind(projectId).first() as any;
    
    if (!project) {
      throw new Error('Project not found');
    }

    // Get all project files from analytics events (assuming files are tracked when viewed)
    const filesStmt = this.db.prepare(`
      SELECT DISTINCT file_id, COUNT(*) as view_count
      FROM analytics 
      WHERE project_id = ? AND file_id IS NOT NULL AND file_id != ''
      GROUP BY file_id
    `);
    const fileResults = await filesStmt.bind(projectId).all();
    const fileIds = (fileResults.results as any[]).map(r => r.file_id);
    
    console.log('📊 Found files:', fileIds);

    // Build file details
    const files = await Promise.all(fileIds.map(async (fileId: string) => {
      // Get favorites for this file
      const favoritesStmt = this.db.prepare(`
        SELECT id, user_email, user_name, created_at
        FROM favorites 
        WHERE project_id = ? AND file_id = ?
        ORDER BY created_at DESC
      `);
      const favorites = await favoritesStmt.bind(projectId, fileId).all();

      // Get comments for this file
      const commentsStmt = this.db.prepare(`
        SELECT id, user_email, user_name, comment_text, created_at, thread_id
        FROM comments 
        WHERE project_id = ? AND file_id = ?
        ORDER BY created_at DESC
      `);
      const comments = await commentsStmt.bind(projectId, fileId).all();

      // Get approvals for this file
      const approvalsStmt = this.db.prepare(`
        SELECT id, user_email, user_name, status, notes, created_at
        FROM approvals 
        WHERE project_id = ? AND file_id = ?
        ORDER BY created_at DESC
      `);
      const approvals = await approvalsStmt.bind(projectId, fileId).all();

      // Get analytics for this file
      const analyticsStmt = this.db.prepare(`
        SELECT 
          COUNT(*) as total_views,
          COUNT(CASE WHEN event_type = 'download' THEN 1 END) as downloads,
          COUNT(DISTINCT user_email) as unique_visitors
        FROM analytics 
        WHERE project_id = ? AND file_id = ?
      `);
      const analytics = await analyticsStmt.bind(projectId, fileId).first() as any;

      return {
        id: fileId,
        name: fileId, // We'll use fileId as name for now
        type: 'unknown', // Could be enhanced to detect type
        uploadedAt: new Date().toISOString(), // Placeholder
        favorites: (favorites.results as any[]).map(f => ({
          id: f.id,
          userEmail: f.user_email,
          userName: f.user_name,
          createdAt: new Date(f.created_at * 1000).toISOString()
        })),
        comments: (comments.results as any[]).map(c => ({
          id: c.id,
          userEmail: c.user_email,
          userName: c.user_name,
          commentText: c.comment_text,
          createdAt: new Date(c.created_at * 1000).toISOString()
        })),
        approvals: (approvals.results as any[]).map(a => ({
          id: a.id,
          userEmail: a.user_email,
          userName: a.user_name,
          status: a.status,
          notes: a.notes,
          createdAt: new Date(a.created_at * 1000).toISOString()
        })),
        analytics: {
          views: analytics?.total_views || 0,
          downloads: analytics?.downloads || 0,
          uniqueVisitors: analytics?.unique_visitors || 0
        }
      };
    }));

    // Calculate project totals
    const totalFavorites = files.reduce((sum, file) => sum + file.favorites.length, 0);
    const totalComments = files.reduce((sum, file) => sum + file.comments.length, 0);
    const totalApprovals = files.reduce((acc, file) => {
      file.approvals.forEach(approval => {
        acc[approval.status as keyof typeof acc]++;
      });
      return acc;
    }, { approved: 0, rejected: 0, pending: 0 });
    const totalViews = files.reduce((sum, file) => sum + file.analytics.views, 0);
    const totalDownloads = files.reduce((sum, file) => sum + file.analytics.downloads, 0);
    
    // Get unique users count across all interactions
    const uniqueUsersStmt = this.db.prepare(`
      SELECT COUNT(DISTINCT user_email) as unique_users
      FROM (
        SELECT user_email FROM analytics WHERE project_id = ? AND user_email IS NOT NULL
        UNION
        SELECT user_email FROM favorites WHERE project_id = ?
        UNION  
        SELECT user_email FROM comments WHERE project_id = ?
        UNION
        SELECT user_email FROM approvals WHERE project_id = ?
      )
    `);
    const uniqueUsers = await uniqueUsersStmt.bind(projectId, projectId, projectId, projectId).first() as any;

    return {
      id: project.id,
      title: project.title,
      slug: project.slug,
      description: project.description,
      created_at: new Date(project.created_at).toISOString(),
      settings: {
        enable_favorites: Boolean(project.enable_favorites),
        enable_comments: Boolean(project.enable_comments),
        enable_approvals: Boolean(project.enable_approvals),
        enable_analytics: Boolean(project.enable_analytics),
        enable_notifications: Boolean(project.enable_notifications)
      },
      files,
      totals: {
        totalFiles: files.length,
        totalFavorites,
        totalComments,
        totalApprovals,
        totalViews,
        totalDownloads,
        uniqueUsers: uniqueUsers?.unique_users || 0
      }
    };
  }
}

// HTTP Request Handlers
export async function handleCreatorAPI(request: IRequest, env: Env): Promise<Response> {
  const api = new CreatorAPI(env);
  const url = new URL(request.url);
  const path = url.pathname.replace('/api/creators', '');

  // Handle CORS preflight requests
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders()
    });
  }

  try {
    // Handle authentication based on endpoint
    let auth: AuthContext | null = null;
    
    // Public endpoints (no auth required)
    const publicEndpoints = ['/sync'];
    const isPublicEndpoint = publicEndpoints.some(endpoint => path === endpoint);
    
    if (!isPublicEndpoint) {
      // Protected endpoints require authentication
      const authResult = await requireAuth(request, env);
      if (authResult instanceof Response) {
        return authResult; // Return auth error
      }
      auth = authResult.auth;
    }

    switch (request.method) {
      case 'POST':
        if (path === '/sync') {
          // Sync creator from Clerk (called after sign-up/sign-in)
          const body = await request.json() as CreateCreatorData;
          const creator = await api.createOrUpdateCreator(body);
          return new Response(JSON.stringify({ creator }), {
            headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
          });
        }
        
        if (path === '/claim') {
          // Claim anonymous projects
          const body = await request.json() as { anonymousSessionId: string; creatorId: string };
          const result = await api.claimAnonymousProject(body.anonymousSessionId, body.creatorId);
          return new Response(JSON.stringify(result), {
            headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
          });
        }
        break;

      case 'GET':
        if (path.startsWith('/projects/')) {
          // Get creator projects: /api/creators/projects/{creatorId}
          const creatorId = path.split('/')[2];
          
          // Verify ownership - users can only access their own projects
          if (auth) {
            const ownershipResult = await requireOwnership(request, env, creatorId);
            if (ownershipResult instanceof Response) {
              return ownershipResult; // Return ownership error
            }
          }
          
          const projects = await api.getCreatorProjects(creatorId);
          return new Response(JSON.stringify({ projects }), {
            headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
          });
        }
        
        if (path.startsWith('/analytics/')) {
          // Get creator analytics: /api/creators/analytics/{creatorId}
          const creatorId = path.split('/')[2];
          
          // Verify ownership - users can only access their own analytics
          if (auth) {
            const ownershipResult = await requireOwnership(request, env, creatorId);
            if (ownershipResult instanceof Response) {
              return ownershipResult; // Return ownership error
            }
          }
          
          const analytics = await api.getCreatorAnalytics(creatorId);
          return new Response(JSON.stringify({ analytics }), {
            headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
          });
        }
        
        if (path.startsWith('/clerk/')) {
          // Get creator by Clerk ID: /api/creators/clerk/{clerkUserId}
          const clerkUserId = path.split('/')[2];
          const creator = await api.getCreatorByClerkId(clerkUserId);
          return new Response(JSON.stringify({ creator }), {
            headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
          });
        }
        break;
    }

    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Creator API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
    });
  }
}