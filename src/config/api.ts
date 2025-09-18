// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://lytsite-backend.yashwanth-muthineni.workers.dev';

export const apiConfig = {
  baseUrl: API_BASE_URL,
  endpoints: {
    creators: {
      sync: '/api/creators/sync',
      projects: (creatorId: string) => `/api/creators/projects/${creatorId}`,
      analytics: (creatorId: string) => `/api/creators/analytics/${creatorId}`,
    },
    projects: {
      anonymous: (sessionId: string) => `/api/projects/anonymous/${sessionId}`,
    },
    health: '/api/health'
  }
};

// Helper function to build full API URLs
export function buildApiUrl(endpoint: string): string {
  return `${apiConfig.baseUrl}${endpoint}`;
}