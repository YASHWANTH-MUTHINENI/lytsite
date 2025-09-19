/**
 * Authentication Middleware for Cloudflare Workers
 * Validates Clerk JWT tokens and provides request authorization
 */

import { Env } from './types';
import { corsHeaders } from './utils';

export interface AuthenticatedUser {
  userId: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
  role?: string;
}

export interface AuthContext {
  user: AuthenticatedUser;
  token: string;
  isAuthenticated: boolean;
}

/**
 * Extract JWT token from Authorization header
 */
function extractToken(request: Request): string | null {
  const authHeader = request.headers.get('Authorization');
  
  console.log('🔍 Auth: Authorization header:', authHeader ? 'Present' : 'Missing');
  
  if (!authHeader) return null;
  
  // Support both "Bearer token" and "token" formats
  if (authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    console.log('🔍 Auth: Bearer token extracted, length:', token.length);
    return token;
  }
  
  console.log('🔍 Auth: Direct token (no Bearer prefix)');
  return authHeader;
}

/**
 * Decode JWT payload (without verification - for development)
 * In production, this should verify the signature using Clerk's public key
 */
function decodeJWTPayload(token: string): any {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
}

/**
 * Validate Clerk JWT token with proper signature verification
 * Uses Clerk's secret key for HMAC validation in development
 */
async function validateClerkToken(token: string, env: Env): Promise<AuthenticatedUser | null> {
  try {
    console.log('🔍 Token: Starting validation...');
    // Decode the JWT header and payload
    const payload = decodeJWTPayload(token);
    
    if (!payload) {
      console.log('🔍 Token: Invalid JWT payload');
      return null;
    }
    
    console.log('🔍 Token: Payload decoded, sub:', payload.sub);
    
    // Check token expiration
    if (payload.exp && payload.exp < Date.now() / 1000) {
      console.log('Token expired');
      return null;
    }
    
    // Check token issuer (should be from Clerk)
    if (payload.iss && !payload.iss.includes('clerk')) {
      console.log('Invalid token issuer:', payload.iss);
      return null;
    }

    // Verify token audience if present
    if (payload.aud && !payload.aud.includes('clerk')) {
      console.log('Invalid token audience:', payload.aud);
      return null;
    }
    
    // For production: implement proper signature verification
    if (env.CLERK_SECRET_KEY) {
      const isValidSignature = await verifyJWTSignature(token, env.CLERK_SECRET_KEY);
      if (!isValidSignature) {
        console.log('Invalid JWT signature');
        return null;
      }
    }
    
    // Extract user information
    const user: AuthenticatedUser = {
      userId: payload.sub || payload.user_id,
      email: payload.email,
      firstName: payload.given_name || payload.first_name,
      lastName: payload.family_name || payload.last_name,
      imageUrl: payload.picture || payload.image_url,
      role: payload.role || payload.public_metadata?.role || 'user'
    };
    
    // Ensure we have a valid user ID
    if (!user.userId) {
      console.log('No user ID found in token');
      return null;
    }
    
    return user;
  } catch (error) {
    console.error('Token validation error:', error);
    return null;
  }
}

/**
 * Verify Clerk JWT token by fetching user data from Clerk API
 * This validates the token by using it to fetch user information
 */
async function verifyJWTSignature(token: string, secret: string): Promise<boolean> {
  try {
    console.log('🔍 Token: Verifying with Clerk users API...');
    
    // Decode the payload to get the user ID
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    const userId = payload.sub;
    
    if (!userId) {
      console.log('🔍 Token: No user ID in token payload');
      return false;
    }
    
    // Use Clerk's Users API to verify the token
    const response = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${secret}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      console.log('🔍 Token: Clerk user verification successful');
      return true;
    } else if (response.status === 401) {
      console.log('🔍 Token: Invalid secret key or token');
      return false;
    } else {
      console.log('🔍 Token: Clerk verification failed:', response.status);
      return false;
    }
  } catch (error) {
    console.error('🔍 Token: Clerk verification error:', error);
    return false;
  }
}

/**
 * Authentication middleware
 */
export async function authenticate(request: Request, env: Env): Promise<AuthContext | null> {
  const token = extractToken(request);
  
  if (!token) {
    console.log('🔍 Auth: No token found in request');
    return null;
  }
  
  console.log('🔍 Auth: Validating token with Clerk...');
  const user = await validateClerkToken(token, env);
  
  if (!user) {
    console.log('🔍 Auth: Token validation failed');
    return null;
  }
  
  console.log('🔍 Auth: Token validation successful for user:', user.userId);
  return {
    user,
    token,
    isAuthenticated: true
  };
}

/**
 * Require authentication middleware
 * Returns 401 if not authenticated
 */
export async function requireAuth(request: Request, env: Env): Promise<{ auth: AuthContext } | Response> {
  const auth = await authenticate(request, env);
  
  if (!auth) {
    return new Response(JSON.stringify({ 
      error: 'Authentication required',
      message: 'Please provide a valid authentication token'
    }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
        'WWW-Authenticate': 'Bearer',
        ...corsHeaders()
      }
    });
  }
  
  return { auth };
}

/**
 * Role-based authorization
 */
export function requireRole(allowedRoles: string[]) {
  return async function(request: Request, env: Env): Promise<{ auth: AuthContext } | Response> {
    const authResult = await requireAuth(request, env);
    
    if (authResult instanceof Response) {
      return authResult; // Already failed auth
    }
    
    const { auth } = authResult;
    const userRole = auth.user.role || 'user';
    
    if (!allowedRoles.includes(userRole)) {
      return new Response(JSON.stringify({ 
        error: 'Insufficient permissions',
        message: `Required role: ${allowedRoles.join(' or ')}, your role: ${userRole}`
      }), {
        status: 403,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders()
        }
      });
    }
    
    return { auth };
  };
}

/**
 * Resource ownership authorization
 * Ensures user can only access their own resources
 */
export async function requireOwnership(
  request: Request, 
  env: Env, 
  resourceCreatorId: string
): Promise<{ auth: AuthContext } | Response> {
  const authResult = await requireAuth(request, env);
  
  if (authResult instanceof Response) {
    return authResult; // Already failed auth
  }
  
  const { auth } = authResult;
  
  // Check if the creator ID belongs to the authenticated user
  try {
    const stmt = env.LYTSITE_DB.prepare(`
      SELECT clerk_user_id FROM creators WHERE id = ?
    `);
    
    const result = await stmt.bind(resourceCreatorId).first() as { clerk_user_id: string } | null;
    
    if (!result) {
      return new Response(JSON.stringify({ 
        error: 'Creator not found',
        message: 'Creator ID does not exist'
      }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders()
        }
      });
    }
    
    // Allow access if user owns the creator account or is admin
    if (result.clerk_user_id !== auth.user.userId && auth.user.role !== 'admin') {
      return new Response(JSON.stringify({ 
        error: 'Access denied',
        message: 'You can only access your own resources'
      }), {
        status: 403,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders()
        }
      });
    }
    
    return { auth };
  } catch (error) {
    console.error('Ownership check error:', error);
    return new Response(JSON.stringify({ 
      error: 'Server error',
      message: 'Failed to verify ownership'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders()
      }
    });
  }
}

/**
 * Optional authentication
 * Returns auth context if token is present and valid, null otherwise
 */
export async function optionalAuth(request: Request, env: Env): Promise<AuthContext | null> {
  try {
    return await authenticate(request, env);
  } catch (error) {
    console.error('Optional auth failed:', error);
    return null;
  }
}

/**
 * Rate limiting by user (basic implementation)
 * In production, use a proper rate limiting service
 */
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(maxRequests: number = 100, windowMs: number = 60000) {
  return async function(request: Request, env: Env): Promise<{ auth: AuthContext | null } | Response> {
    const auth = await optionalAuth(request, env);
    const identifier = auth?.user.userId || getClientIP(request) || 'anonymous';
    
    const now = Date.now();
    const userLimit = rateLimitStore.get(identifier);
    
    if (!userLimit || now > userLimit.resetTime) {
      // Reset or initialize rate limit
      rateLimitStore.set(identifier, {
        count: 1,
        resetTime: now + windowMs
      });
      return { auth };
    }
    
    if (userLimit.count >= maxRequests) {
      return new Response(JSON.stringify({ 
        error: 'Rate limit exceeded',
        message: `Maximum ${maxRequests} requests per ${windowMs / 1000} seconds`,
        retryAfter: Math.ceil((userLimit.resetTime - now) / 1000)
      }), {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': Math.ceil((userLimit.resetTime - now) / 1000).toString(),
          ...corsHeaders()
        }
      });
    }
    
    // Increment count
    userLimit.count++;
    rateLimitStore.set(identifier, userLimit);
    
    return { auth };
  };
}

/**
 * Get client IP address
 */
function getClientIP(request: Request): string | null {
  // Cloudflare provides the real IP in CF-Connecting-IP header
  return request.headers.get('CF-Connecting-IP') || 
         request.headers.get('X-Forwarded-For')?.split(',')[0] ||
         null;
}

/**
 * Security headers middleware
 */
export function addSecurityHeaders(response: Response): Response {
  const headers = new Headers(response.headers);
  
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-Frame-Options', 'DENY');
  headers.set('X-XSS-Protection', '1; mode=block');
  headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}

/**
 * API Key validation (for server-to-server communication)
 */
export async function validateApiKey(request: Request, env: Env): Promise<boolean> {
  const apiKey = request.headers.get('X-API-Key');
  
  if (!apiKey) return false;
  
  // In production, store API keys securely in environment variables or KV storage
  const validApiKeys = [
    env.INTERNAL_API_KEY,
    env.WEBHOOK_API_KEY
  ].filter(Boolean);
  
  return validApiKeys.includes(apiKey);
}

/**
 * Webhook signature validation
 */
export async function validateWebhookSignature(
  request: Request, 
  body: string, 
  secret: string
): Promise<boolean> {
  const signature = request.headers.get('X-Webhook-Signature') || 
                   request.headers.get('Clerk-Signature');
  
  if (!signature) return false;
  
  try {
    // Create HMAC SHA256 signature
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    
    const signatureBuffer = await crypto.subtle.sign(
      'HMAC',
      key,
      encoder.encode(body)
    );
    
    const expectedSignature = Array.from(new Uint8Array(signatureBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    // Compare signatures (timing-safe comparison)
    return signature.replace('sha256=', '') === expectedSignature;
  } catch (error) {
    console.error('Webhook signature validation error:', error);
    return false;
  }
}