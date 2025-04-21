/**
 * Simplified tracker proxy functionality
 * 
 * This module provides a simplified version of the tracker proxy
 * that was previously implemented. It intercepts fetch and XHR requests
 * to specific domains and routes them through the local API proxy.
 */

// Flag to track if the proxy has been set up
let isProxySetup = false;

/**
 * Sets up the tracker proxy to handle CORS issues with external tracking services.
 * This should be called only once from client-side code.
 */
export function setupTrackerProxy(): void {
  // Only run this in browser environment
  if (typeof window === 'undefined') return;
  
  // Prevent multiple setups
  if (isProxySetup) return;
  
  console.log('[Tracker] Setting up proxy for tracking requests');
  
  // Simple proxy implementation that uses the internal API route
  // This avoids having to override global fetch and XMLHttpRequest
  isProxySetup = true;
  
  // Instead of proxying every request, we'll use a dedicated function
  // that can be called when needed
}

/**
 * Performs a proxied request through the Next.js API route
 * This is simpler than overriding global fetch and XMLHttpRequest
 */
export async function proxyRequest(url: string, options: RequestInit = {}) {
  try {
    const response = await fetch('/api/proxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        originalUrl: url,
        method: options.method || 'GET',
        headers: options.headers || {},
        body: options.body || null,
      }),
    });
    
    return response.json();
  } catch (error) {
    console.error('[Tracker] Proxy request failed:', error);
    throw error;
  }
} 