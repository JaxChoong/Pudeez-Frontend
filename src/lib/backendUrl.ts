/**
 * Get the correct backend URL based on environment
 * Handles both development and production environments
 */
export function getBackendUrl(): string {
  // Check if we're in production (deployed)
  const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
  
  if (isProduction) {
    // Use production backend URL
    return import.meta.env.VITE_PRODUCTION_BACKEND_URL || 'https://pudeez-backend-neon.vercel.app';
  } else {
    // Use development backend URL
    return import.meta.env.VITE_BACKEND_URL || 'http://localhost:3111';
  }
}

/**
 * Create a properly formatted API URL
 * Ensures no double slashes and proper URL formatting
 */
export function createApiUrl(endpoint: string): string {
  const baseUrl = getBackendUrl();
  
  // Remove trailing slash from base URL if present
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  
  // Ensure endpoint starts with /
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  return `${cleanBaseUrl}${cleanEndpoint}`;
}
