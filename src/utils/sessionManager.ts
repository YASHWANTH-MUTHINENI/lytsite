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

/**
 * Get projects created by the current anonymous session
 */
export async function getAnonymousProjects(): Promise<any[]> {
  const sessionId = getAnonymousSessionId();
  
  try {
    const response = await fetch(`/api/projects/anonymous/${sessionId}`);
    
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
export async function claimAnonymousProjects(creatorId: string): Promise<boolean> {
  const sessionId = localStorage.getItem(ANONYMOUS_SESSION_KEY);
  
  if (!sessionId) {
    return false; // No anonymous session to claim
  }
  
  try {
    const response = await fetch('/api/creators/claim', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        anonymousSessionId: sessionId,
        creatorId: creatorId,
      }),
    });
    
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
  };
}