import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { handleInternalError } from '@/lib/api/errorHandler';

export async function middleware(request: NextRequest) {
  // Only apply middleware to API routes
  if (!request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  try {
    // Continue to the actual route handler
    const response = NextResponse.next();
    return response;
  } catch (error) {
    // Catch any uncaught errors in middleware
    console.error('Global middleware caught an error:', error);
    return handleInternalError(error as Error);
  }
}

export const config = {
  matcher: [
    // Apply this middleware to all API routes
    '/api/:path*',
  ],
};
