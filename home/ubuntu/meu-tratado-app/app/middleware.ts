import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { logger } from './lib/logger';

export function middleware(request: NextRequest) {
  // Log incoming requests
  logger.info('Incoming request', {
    url: request.url,
    method: request.method,
  });

  // Add CORS headers
  const response = NextResponse.next();
  
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS'
  );
  response.headers.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization'
  );

  return response;
}

export const config = {
  matcher: '/api/:path*',
};