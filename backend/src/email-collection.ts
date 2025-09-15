import { Env } from './types';

export interface EmailCollectionData {
  email: string;
  trigger: string;
  projectId?: string;
  anonymousSessionId: string;
  timestamp: number;
}

/**
 * Handle email collection from progressive prompts
 */
export async function handleEmailCollection(request: Request, env: Env): Promise<Response> {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const data: EmailCollectionData = await request.json();
    const { email, trigger, projectId, anonymousSessionId, timestamp } = data;

    // Validate required fields
    if (!email || !trigger || !anonymousSessionId) {
      return new Response('Missing required fields', { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response('Invalid email format', { status: 400 });
    }

    // Store in database if available
    if (env.LYTSITE_DB) {
      try {
        // First, try to update existing project with email
        if (projectId) {
          await env.LYTSITE_DB.prepare(`
            UPDATE projects 
            SET notification_email = ?, email_collected_at = CURRENT_TIMESTAMP, email_collection_trigger = ?
            WHERE (id = ? OR slug = ?) AND anonymous_session_id = ?
          `).bind(email, trigger, projectId, projectId, anonymousSessionId).run();
        }

        // Store email collection event for analytics
        await env.LYTSITE_DB.prepare(`
          INSERT INTO email_collections 
          (email, trigger, project_id, anonymous_session_id, collected_at)
          VALUES (?, ?, ?, ?, ?)
        `).bind(email, trigger, projectId || null, anonymousSessionId, new Date(timestamp).toISOString()).run();

        console.log(`Email collected: ${email} via ${trigger} for project ${projectId}`);
      } catch (dbError) {
        console.warn('Failed to store email in database:', dbError);
        // Continue - we can still store in KV
      }
    }

    // Also store in KV for backup/analytics
    const emailData = {
      email,
      trigger,
      projectId,
      anonymousSessionId,
      timestamp,
      collectedAt: new Date().toISOString()
    };

    await env.LYTSITE_KV.put(
      `email_collection:${anonymousSessionId}:${timestamp}`, 
      JSON.stringify(emailData)
    );

    // Track conversion funnel in KV
    const conversionKey = `conversion:${anonymousSessionId}`;
    const existingConversion = await env.LYTSITE_KV.get(conversionKey);
    const conversionData = existingConversion ? JSON.parse(existingConversion) : {
      anonymous_session_id: anonymousSessionId,
      created_at: new Date().toISOString(),
      steps: []
    };

    conversionData.steps.push({
      step: 'email_collected',
      trigger: trigger,
      timestamp: new Date().toISOString(),
      project_id: projectId
    });

    conversionData.email = email;
    conversionData.email_collected_at = new Date().toISOString();

    await env.LYTSITE_KV.put(conversionKey, JSON.stringify(conversionData));

    return new Response(JSON.stringify({
      success: true,
      message: 'Email collected successfully'
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });

  } catch (error) {
    console.error('Email collection error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to collect email'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}

/**
 * Get email collection analytics
 */
export async function getEmailCollectionStats(env: Env): Promise<any> {
  if (!env.LYTSITE_DB) {
    return { error: 'Database not available' };
  }

  try {
    // Get collection stats by trigger
    const triggerStats = await env.LYTSITE_DB.prepare(`
      SELECT 
        trigger,
        COUNT(*) as count,
        COUNT(DISTINCT email) as unique_emails
      FROM email_collections 
      GROUP BY trigger
      ORDER BY count DESC
    `).all();

    // Get recent collections
    const recentCollections = await env.LYTSITE_DB.prepare(`
      SELECT email, trigger, project_id, collected_at
      FROM email_collections 
      ORDER BY collected_at DESC 
      LIMIT 10
    `).all();

    // Get conversion rates (emails collected vs projects created)
    const totalProjects = await env.LYTSITE_DB.prepare(`
      SELECT COUNT(*) as count FROM projects
    `).first();

    const emailsCollected = await env.LYTSITE_DB.prepare(`
      SELECT COUNT(DISTINCT email) as count FROM email_collections
    `).first();

    return {
      trigger_stats: triggerStats.results,
      recent_collections: recentCollections.results,
      conversion_rate: {
        total_projects: (totalProjects as any)?.count || 0,
        emails_collected: (emailsCollected as any)?.count || 0,
        rate: ((emailsCollected as any)?.count || 0) / ((totalProjects as any)?.count || 1)
      }
    };
  } catch (error) {
    console.error('Failed to get email collection stats:', error);
    return { error: 'Failed to get stats' };
  }
}