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

export class RateLimiter {
  private static readonly MAX_ATTEMPTS = 5;
  private static readonly WINDOW_MS = 15 * 60 * 1000;
  private static readonly STORAGE_KEY_PREFIX = 'rate_limit_';

  private static getStorageKey(identifier: string): string {
    return `${this.STORAGE_KEY_PREFIX}${identifier}`;
  }

  static checkLimit(identifier: string): boolean {
    if (typeof window === 'undefined') return true;

    const now = Date.now();
    const storageKey = this.getStorageKey(identifier);
    const stored = localStorage.getItem(storageKey);

    if (!stored) {
      return true;
    }

    try {
      const attempt = JSON.parse(stored);
      
      if (now > attempt.resetTime) {
        localStorage.removeItem(storageKey);
        return true;
      }

      return attempt.count < this.MAX_ATTEMPTS;
    } catch {
      localStorage.removeItem(storageKey);
      return true;
    }
  }

  static incrementAttempt(identifier: string): boolean {
    if (typeof window === 'undefined') return true;

    const now = Date.now();
    const storageKey = this.getStorageKey(identifier);
    const stored = localStorage.getItem(storageKey);

    let attempt: { count: number; resetTime: number };

    if (!stored) {
      attempt = { count: 1, resetTime: now + this.WINDOW_MS };
    } else {
      try {
        attempt = JSON.parse(stored);
        
        if (now > attempt.resetTime) {
          attempt = { count: 1, resetTime: now + this.WINDOW_MS };
        } else {
          attempt.count++;
        }
      } catch {
        attempt = { count: 1, resetTime: now + this.WINDOW_MS };
      }
    }

    localStorage.setItem(storageKey, JSON.stringify(attempt));
    return attempt.count < this.MAX_ATTEMPTS;
  }

  static getRemainingTime(identifier: string): number {
    if (typeof window === 'undefined') return 0;

    const storageKey = this.getStorageKey(identifier);
    const stored = localStorage.getItem(storageKey);

    if (!stored) return 0;

    try {
      const attempt = JSON.parse(stored);
      const remaining = attempt.resetTime - Date.now();
      return remaining > 0 ? remaining : 0;
    } catch {
      return 0;
    }
  }

  static resetLimit(identifier: string): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.getStorageKey(identifier));
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
