import { NextResponse } from 'next/server';

interface RateLimitStore {
  [key: string]: {
    tokens: number;
    lastRefill: number;
  };
}

const store: RateLimitStore = {};

// Rate limit configuration
const RATE_LIMIT_TOKENS = 30; // Maximum tokens per window
const REFILL_RATE = 0.5; // Tokens per second
const TOKEN_COST = 1; // Cost per request

export function rateLimit(ip: string): { limited: boolean; response?: NextResponse } {
  const now = Date.now();
  
  // Initialize bucket for new IPs
  if (!store[ip]) {
    store[ip] = {
      tokens: RATE_LIMIT_TOKENS,
      lastRefill: now,
    };
  }

  // Refill tokens based on time passed
  const timePassed = (now - store[ip].lastRefill) / 1000; // Convert to seconds
  const tokensToAdd = timePassed * REFILL_RATE;
  
  store[ip].tokens = Math.min(
    RATE_LIMIT_TOKENS,
    store[ip].tokens + tokensToAdd
  );
  store[ip].lastRefill = now;

  // Check if enough tokens and consume
  if (store[ip].tokens < TOKEN_COST) {
    const waitTime = Math.ceil((TOKEN_COST - store[ip].tokens) / REFILL_RATE);
    return {
      limited: true,
      response: new NextResponse(
        JSON.stringify({
          error: 'Too many requests',
          retryAfter: waitTime,
        }),
        {
          status: 429,
          headers: {
            'Retry-After': waitTime.toString(),
            'Content-Type': 'application/json',
          },
        }
      ),
    };
  }

  // Consume token
  store[ip].tokens -= TOKEN_COST;
  return { limited: false };
}

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  const expiryTime = 1 * 60 * 60 * 1000; // 1 hour
  
  Object.keys(store).forEach(ip => {
    if (now - store[ip].lastRefill > expiryTime) {
      delete store[ip];
    }
  });
}, 60 * 60 * 1000); // Run every hour
