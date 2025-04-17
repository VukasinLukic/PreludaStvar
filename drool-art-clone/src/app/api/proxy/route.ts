import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const data = await request.json();
    const { originalUrl, method = 'GET', headers = {}, body = null } = data;
    
    console.log(`Proxying request to: ${originalUrl}`);
    
    // Prepare headers for the outgoing request
    const outgoingHeaders = new Headers();
    
    // Add common headers
    outgoingHeaders.set('Content-Type', 'application/json');
    outgoingHeaders.set('Origin', 'https://preludastvar.rs');
    outgoingHeaders.set('Referer', 'https://preludastvar.rs/');
    
    // Add any custom headers from the original request
    if (headers && typeof headers === 'object') {
      Object.entries(headers).forEach(([key, value]) => {
        if (typeof value === 'string') {
          outgoingHeaders.set(key, value);
        }
      });
    }
    
    // Forward the request to tackker.com
    const response = await fetch(originalUrl, {
      method,
      headers: outgoingHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });
    
    // Check if the response is valid
    if (!response.ok) {
      console.error(`Error response from ${originalUrl}: ${response.status} ${response.statusText}`);
      return NextResponse.json(
        { error: `Error from destination server: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }
    
    try {
      // Try to parse as JSON
      const responseData = await response.json();
      return NextResponse.json(responseData);
    } catch (e) {
      // If not JSON, return as text
      const textData = await response.text();
      return new NextResponse(textData, {
        status: 200,
        headers: {
          'Content-Type': response.headers.get('Content-Type') || 'text/plain',
        },
      });
    }
  } catch (error) {
    console.error('Error in proxy API route:', error);
    return NextResponse.json(
      { error: 'Failed to proxy request', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 