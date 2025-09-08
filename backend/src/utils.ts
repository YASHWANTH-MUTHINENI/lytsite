import { customAlphabet } from 'nanoid';

// Generate short, URL-safe slugs
export function generateSlug(): string {
  const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 8);
  return nanoid();
}

// Generate unique file IDs
export function generateId(): string {
  const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 16);
  return nanoid();
}

// Get file extension
export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}

// Check if file is an image
export function isImage(mimeType: string): boolean {
  return mimeType.startsWith('image/');
}

// Check if file is a PDF
export function isPDF(mimeType: string): boolean {
  return mimeType === 'application/pdf';
}

// Format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// CORS headers for API responses
export function corsHeaders(): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

// Handle CORS preflight
export function handleCORS(): Response {
  return new Response(null, {
    status: 200,
    headers: corsHeaders()
  });
}
