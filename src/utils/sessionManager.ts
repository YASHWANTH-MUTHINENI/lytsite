/**
 * Anonymous Session Manager
 * Handles tracking anonymous users across their uploads and interactions
 * until they authenticate and claim their projects
 */

const ANONYMOUS_SESSION_KEY = 'lytsite_anonymous_session';

/**
 * Generate a unique anonymous session ID
 */
function generateAnonymousSessionId(): string {
  return `anon_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Get or create an anonymous session ID for the current browser session
 */
export function getAnonymousSessionId(): string {
  // Check if we already have a session ID in localStorage
  let sessionId = localStorage.getItem(ANONYMOUS_SESSION_KEY);
  
  if (!sessionId) {
    // Create a new session ID
    sessionId = generateAnonymousSessionId();
    localStorage.setItem(ANONYMOUS_SESSION_KEY, sessionId);
  }
  
  return sessionId;
}

/**
 * Clear the anonymous session (called after successful project claiming)
 */
export function clearAnonymousSession(): void {
  localStorage.removeItem(ANONYMOUS_SESSION_KEY);
}

/**
 * Check if there's an existing anonymous session
 */
export function hasAnonymousSession(): boolean {
  return localStorage.getItem(ANONYMOUS_SESSION_KEY) !== null;
}

// API base URL configuration
const API_BASE = process.env.NODE_ENV === 'production' 
  ? 'https://lytsite-backend.yashwanthvarmamuthineni.workers.dev'
  : 'https://lytsite-backend.yashwanthvarmamuthineni.workers.dev';

/**
 * Get projects created by the current anonymous session
 */
export async function getAnonymousProjects(): Promise<any[]> {
  const sessionId = getAnonymousSessionId();
  
  try {
    const response = await fetch(`${API_BASE}/api/projects/anonymous/${sessionId}`);
    
    if (response.ok) {
      const data = await response.json();
      return data.projects || [];
    }
  } catch (error) {
    console.error('Failed to fetch anonymous projects:', error);
  }
  
  return [];
}

/**
 * Claim all anonymous projects for a newly authenticated creator
 */
export async function claimAnonymousProjects(creatorId: string, authToken?: string): Promise<boolean> {
  const sessionId = localStorage.getItem(ANONYMOUS_SESSION_KEY);
  
  if (!sessionId) {
    return false; // No anonymous session to claim
  }
  
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    // Add authorization header if token is provided
    console.log('🔑 Claim: Token provided:', authToken ? 'Yes (length: ' + authToken.length + ')' : 'No');
    
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
      console.log('🔑 Claim: Authorization header set');
    } else {
      console.error('❌ Claim: No auth token provided to claimAnonymousProjects');
    }
    
    console.log('📤 Claim: Making request with headers:', Object.keys(headers));
    
    const response = await fetch(`${API_BASE}/api/creators/claim`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        anonymousSessionId: sessionId,
        creatorId: creatorId,
      }),
    });
    
    console.log('📥 Claim: Response status:', response.status);
    
    if (response.ok) {
      // Clear the anonymous session after successful claiming
      clearAnonymousSession();
      return true;
    }
  } catch (error) {
    console.error('Failed to claim anonymous projects:', error);
  }
  
  return false;
}

/**
 * Get engagement summary for anonymous session (limited data for conversion)
 */
export async function getAnonymousEngagementSummary(): Promise<any> {
  const sessionId = getAnonymousSessionId();
  
  try {
    const response = await fetch(`${API_BASE}/api/engagement/anonymous/${sessionId}`);
    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.error('Failed to fetch engagement summary:', error);
  }
  
  return null;
}

/**
 * Session Manager Hook for React components
 */
export function useAnonymousSession() {
  const sessionId = getAnonymousSessionId();
  
  return {
    sessionId,
    hasSession: hasAnonymousSession(),
    clearSession: clearAnonymousSession,
    claimProjects: claimAnonymousProjects,
    getProjects: getAnonymousProjects,
    getEngagementSummary: getAnonymousEngagementSummary,
  };
}