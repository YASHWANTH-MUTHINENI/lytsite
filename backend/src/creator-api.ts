import { Env } from './types';

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
    const stmt = this.db.prepare(`
      SELECT p.*, ps.* 
      FROM projects p
      LEFT JOIN project_settings ps ON p.id = ps.project_id
      WHERE p.anonymous_session_id = ?
      ORDER BY p.created_at DESC
    `);
    
    const results = await stmt.bind(anonymousSessionId).all();
    
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
}

// HTTP Request Handlers
export async function handleCreatorAPI(request: IRequest, env: Env): Promise<Response> {
  const api = new CreatorAPI(env);
  const url = new URL(request.url);
  const path = url.pathname.replace('/api/creators', '');

  try {
    switch (request.method) {
      case 'POST':
        if (path === '/sync') {
          // Sync creator from Clerk (called after sign-up/sign-in)
          const body = await request.json() as CreateCreatorData;
          const creator = await api.createOrUpdateCreator(body);
          return new Response(JSON.stringify({ creator }), {
            headers: { 'Content-Type': 'application/json' },
          });
        }
        
        if (path === '/claim') {
          // Claim anonymous projects
          const body = await request.json() as { anonymousSessionId: string; creatorId: string };
          const result = await api.claimAnonymousProject(body.anonymousSessionId, body.creatorId);
          return new Response(JSON.stringify(result), {
            headers: { 'Content-Type': 'application/json' },
          });
        }
        break;

      case 'GET':
        if (path.startsWith('/projects/')) {
          // Get creator projects: /api/creators/projects/{creatorId}
          const creatorId = path.split('/')[2];
          const projects = await api.getCreatorProjects(creatorId);
          return new Response(JSON.stringify({ projects }), {
            headers: { 'Content-Type': 'application/json' },
          });
        }
        
        if (path.startsWith('/analytics/')) {
          // Get creator analytics: /api/creators/analytics/{creatorId}
          const creatorId = path.split('/')[2];
          const analytics = await api.getCreatorAnalytics(creatorId);
          return new Response(JSON.stringify({ analytics }), {
            headers: { 'Content-Type': 'application/json' },
          });
        }
        
        if (path.startsWith('/clerk/')) {
          // Get creator by Clerk ID: /api/creators/clerk/{clerkUserId}
          const clerkUserId = path.split('/')[2];
          const creator = await api.getCreatorByClerkId(clerkUserId);
          return new Response(JSON.stringify({ creator }), {
            headers: { 'Content-Type': 'application/json' },
          });
        }
        break;
    }

    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Creator API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}