// Tracker proxy utility to avoid CORS errors
export const setupTrackerProxy = () => {
  if (typeof window === 'undefined') return;

  // Save original methods
  const originalFetch = window.fetch;
  const originalXHR = window.XMLHttpRequest.prototype.open;
  
  // Override the global fetch function to intercept calls to tackker.com
  window.fetch = function(input: RequestInfo | URL, init?: RequestInit) {
    const url = input.toString();
    
    // Check if this is a request to tackker.com
    if (url.includes('tackker.com')) {
      console.log('Intercepted fetch request to tackker.com, redirecting to proxy');
      
      // Redirect to our proxy API instead
      return originalFetch('/api/proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originalUrl: url,
          method: init?.method || 'GET',
          headers: init?.headers || {},
          body: init?.body || null
        }),
      }).catch(error => {
        console.error('Error in proxied fetch request:', error);
        return Promise.reject(error);
      });
    }
    
    // For all other requests, use the original fetch
    return originalFetch(input, init);
  };

  // Override XMLHttpRequest to handle tackker.com requests
  window.XMLHttpRequest.prototype.open = function(method: string, url: string | URL, async: boolean = true, username?: string | null, password?: string | null) {
    const urlString = url.toString();
    
    if (urlString.includes('tackker.com')) {
      console.log('Intercepted XMLHttpRequest to tackker.com');
      // Redirect to our local proxy instead
      const proxyUrl = '/api/proxy';
      
      // Store the original URL to send in the request body later
      (this as any)._tackkerOriginalUrl = urlString;
      (this as any)._tackkerMethod = method;
      
      // Call the original open method with our proxy URL
      return originalXHR.call(this, 'POST', proxyUrl, async, username, password);
    }
    
    // For all other requests, use the original XHR open method
    return originalXHR.call(this, method, url, async, username, password);
  };
  
  // Override the send method to include the original URL in the request body
  const originalSend = window.XMLHttpRequest.prototype.send;
  window.XMLHttpRequest.prototype.send = function(body?: Document | XMLHttpRequestBodyInit) {
    if ((this as any)._tackkerOriginalUrl) {
      // This is a tackker.com request that we're proxying
      const proxyBody = JSON.stringify({
        originalUrl: (this as any)._tackkerOriginalUrl,
        method: (this as any)._tackkerMethod || 'GET',
        body: body || null
      });
      
      // Set the correct Content-Type header
      this.setRequestHeader('Content-Type', 'application/json');
      
      // Call the original send method with our modified body
      return originalSend.call(this, proxyBody);
    }
    
    // For all other requests, use the original send method
    return originalSend.call(this, body);
  };
  
  console.log('Enhanced tracker proxy setup complete');
}; 