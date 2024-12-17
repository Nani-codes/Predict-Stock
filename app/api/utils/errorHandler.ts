import { NextResponse } from 'next/server';

export interface ApiError extends Error {
  status?: number;
  code?: string;
}

export function handleApiError(error: unknown): NextResponse {
  console.error('API Error:', error);

  const apiError = error as ApiError;
  
  // Default error response
  let status = 500;
  let message = 'An unexpected error occurred';
  let code = 'INTERNAL_SERVER_ERROR';
  let retryAfter: number | undefined;

  // Handle known error types
  if (apiError.message?.includes('rate limit')) {
    status = 429;
    message = 'Rate limit exceeded';
    code = 'RATE_LIMIT_EXCEEDED';
    retryAfter = 60;
  } else if (apiError.message?.includes('not found')) {
    status = 404;
    message = 'Resource not found';
    code = 'NOT_FOUND';
  } else if (apiError.message?.includes('invalid')) {
    status = 400;
    message = 'Invalid request';
    code = 'INVALID_REQUEST';
  }

  // Use custom status if provided
  if (apiError.status) {
    status = apiError.status;
  }

  const errorResponse = {
    error: {
      message,
      code: apiError.code || code,
      ...(retryAfter && { retryAfter }),
    },
  };

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (retryAfter) {
    headers['Retry-After'] = retryAfter.toString();
  }

  return NextResponse.json(errorResponse, {
    status,
    headers,
  });
}
