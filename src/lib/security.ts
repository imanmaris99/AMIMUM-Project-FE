// Security Configuration and Utilities
import { escapeHtml, sanitizeInput } from './auth';
import { API_BASE_URL } from './apiConfig';

// Content Security Policy configuration
export const CSP_CONFIG = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'", "https://apis.google.com"],
  'style-src': ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
  'font-src': ["'self'", "https://fonts.gstatic.com"],
  'img-src': ["'self'", "data:", "https:"],
  'connect-src': ["'self'", API_BASE_URL],
  'frame-src': ["'none'"],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'frame-ancestors': ["'none'"],
};

// Rate limiting configuration
export class RateLimiter {
  private static attempts: Map<string, { count: number; resetTime: number }> = new Map();
  private static readonly MAX_ATTEMPTS = 5;
  private static readonly WINDOW_MS = 15 * 60 * 1000; // 15 minutes

  static checkLimit(identifier: string): boolean {
    const now = Date.now();
    const attempt = this.attempts.get(identifier);

    if (!attempt || now > attempt.resetTime) {
      this.attempts.set(identifier, { count: 1, resetTime: now + this.WINDOW_MS });
      return true;
    }

    if (attempt.count >= this.MAX_ATTEMPTS) {
      return false;
    }

    attempt.count++;
    return true;
  }

  static resetLimit(identifier: string): void {
    this.attempts.delete(identifier);
  }
}

// Input validation schemas
export const VALIDATION_SCHEMAS = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  phone: /^\+62\d{10,11}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  name: /^[a-zA-Z\s]{2,50}$/,
  address: /^[a-zA-Z0-9\s.,-]{10,200}$/,
};

// Validation functions
export function validateEmail(email: string): boolean {
  return VALIDATION_SCHEMAS.email.test(email);
}

export function validatePhone(phone: string): boolean {
  return VALIDATION_SCHEMAS.phone.test(phone);
}

export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  if (!/[@$!%*?&]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return { valid: errors.length === 0, errors };
}

export function validateName(name: string): boolean {
  return VALIDATION_SCHEMAS.name.test(name);
}

export function validateAddress(address: string): boolean {
  return VALIDATION_SCHEMAS.address.test(address);
}

// Data sanitization
export function sanitizeUserInput<T>(input: T): T {
  if (typeof input === 'string') {
    return sanitizeInput(escapeHtml(input)) as T;
  }
  
  if (Array.isArray(input)) {
    return input.map(sanitizeUserInput) as T;
  }
  
  if (input && typeof input === 'object') {
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(input)) {
      sanitized[sanitizeInput(key)] = sanitizeUserInput(value);
    }
    return sanitized as T;
  }
  
  return input;
}

// CSRF protection
export function generateCSRFToken(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

export function validateCSRFToken(token: string, sessionToken: string): boolean {
  return token === sessionToken;
}

// Security headers
export function getSecurityHeaders() {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  };
}

// API security middleware
export function createSecureAPIClient(baseURL: string) {
  return {
    async request(endpoint: string, options: RequestInit = {}) {
      const url = new URL(endpoint, baseURL);
      
      // Add security headers
      const headers = new Headers(options.headers);
      headers.set('Content-Type', 'application/json');
      headers.set('X-Requested-With', 'XMLHttpRequest');
      
      // Add CSRF token if available
      const csrfToken = localStorage.getItem('csrf_token');
      if (csrfToken) {
        headers.set('X-CSRF-Token', csrfToken);
      }
      
      const response = await fetch(url.toString(), {
        ...options,
        headers,
        credentials: 'include',
      });
      
      // Check for security violations
      if (response.status === 403) {
        throw new Error('Access forbidden - possible CSRF attack');
      }
      
      if (response.status === 429) {
        throw new Error('Rate limit exceeded - please try again later');
      }
      
      return response;
    }
  };
}
