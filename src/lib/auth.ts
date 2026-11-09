// Enhanced Authentication Utilities
import { createHash } from 'crypto';

export interface User {
  id: string;
  email: string;
  name: string;
  firstname?: string;
  photoUrl?: string;
  role: 'user' | 'admin';
  createdAt: Date;
  lastLogin?: Date;
}

// Secure token generation
export function generateSecureToken(): string {
  // Generate secure token for browser environment
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Password hashing (for production, use bcrypt)
export function hashPassword(password: string): string {
  return createHash('sha256').update(password + process.env.PASSWORD_SALT).digest('hex');
}

// Secure storage utilities
export class SecureStorage {
  private static readonly PREFIX = 'amimum_';
  
  static setItem<T>(key: string, value: T): void {
    try {
      const encrypted = btoa(JSON.stringify(value));
      localStorage.setItem(this.PREFIX + key, encrypted);
    } catch {
    }
  }
  
  static getItem<T>(key: string): T | null {
    try {
      const encrypted = localStorage.getItem(this.PREFIX + key);
      if (!encrypted) return null;
      return JSON.parse(atob(encrypted));
    } catch {
      return null;
    }
  }
  
  static removeItem(key: string): void {
    localStorage.removeItem(this.PREFIX + key);
  }
  
  static clear(): void {
    const keys = Object.keys(localStorage).filter(key => key.startsWith(this.PREFIX));
    keys.forEach(key => localStorage.removeItem(key));
  }
}

// Session management stores display metadata only; backend credentials stay in the HttpOnly cookie.
type AuthCookieLockManager = {
  request<T>(name: string, callback: () => Promise<T>): Promise<T>;
};

export class SessionManager {
  static readonly AUTH_LOCK_UNSUPPORTED_MESSAGE = 'Secure sign-in requires a supported, current browser. Please update your browser and try again.';

  static supportsAuthCookieTransitions(): boolean {
    return typeof navigator !== 'undefined' && typeof (navigator as Navigator & { locks?: AuthCookieLockManager }).locks?.request === 'function';
  }

  static withAuthCookieTransition<T>(
    operation: (getCsrfToken: () => Promise<string>) => Promise<T>,
    onComplete?: (result: T) => void,
  ): Promise<T> {
    if (!this.supportsAuthCookieTransitions()) {
      return Promise.reject(new Error(this.AUTH_LOCK_UNSUPPORTED_MESSAGE));
    }
    const run = async () => {
      const result = await operation(() => this.readOrCreateCsrfToken());
      onComplete?.(result);
      return result;
    };
    const locks = (navigator as Navigator & { locks: AuthCookieLockManager }).locks;
    return locks.request('amimum-auth-cookie-transition', run);
  }

  static withSessionRevisionTransition<T>(
    expectedRevision: string | null,
    operation: (getCsrfToken: () => Promise<string>) => Promise<T>,
    onComplete?: (result: T) => void,
  ): Promise<T> {
    return this.withAuthCookieTransition(async (getCsrfToken) => {
      if (!this.isSessionRevisionCurrent(expectedRevision)) {
        throw new Error('Login attempt was superseded');
      }
      return operation(getCsrfToken);
    }, onComplete);
  }

  private static pendingCsrfToken: Promise<string> | null = null;

  static getCsrfToken(): Promise<string> {
    if (this.supportsAuthCookieTransitions()) {
      return this.withAuthCookieTransition((getToken) => getToken());
    }
    if (this.pendingCsrfToken) return this.pendingCsrfToken;

    const request = this.readOrCreateCsrfToken();
    this.pendingCsrfToken = request;
    const clearPending = () => {
      if (this.pendingCsrfToken === request) this.pendingCsrfToken = null;
    };
    void request.then(clearPending, clearPending);
    return request;
  }

  private static async readOrCreateCsrfToken(): Promise<string> {
    const match = typeof document !== 'undefined'
      ? document.cookie.match(/(?:^|;\s*)amimum_csrf=([^;]+)/)
      : null;
    if (match?.[1]) return decodeURIComponent(match[1]);

    const response = await fetch('/api/auth/csrf', {
      credentials: 'same-origin',
      cache: 'no-store',
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) throw new Error('Could not establish CSRF protection');
    const body = await response.json() as { token?: unknown };
    if (typeof body.token !== 'string' || !body.token) throw new Error('Could not establish CSRF protection');
    return body.token;
  }

  private static readonly SESSION_KEY = 'user_session';
  private static readonly AUTH_FLAG_KEY = 'isLoggedIn';
  private static readonly SESSION_REVISION_KEY = 'amimum_session_revision';

  static captureSessionRevision(): string | null {
    return localStorage.getItem(this.SESSION_REVISION_KEY);
  }

  static isSessionRevisionCurrent(expectedRevision: string | null): boolean {
    return this.captureSessionRevision() === expectedRevision;
  }

  static setSessionIfRevisionMatches(user: User, expectedRevision: string | null): Promise<boolean> {
    return this.withAuthCookieTransition(async () => this.setSessionInAuthTransitionIfRevisionMatches(user, expectedRevision));
  }

  static setSessionInAuthTransitionIfRevisionMatches(user: User, expectedRevision: string | null): boolean {
    if (!this.isSessionRevisionCurrent(expectedRevision)) return false;
    this.writeSessionMetadata(user);
    return true;
  }

  static clearLocalSessionIfRevisionMatches(expectedRevision: string | null): Promise<boolean> {
    return this.withAuthCookieTransition(async () => this.clearLocalSessionInAuthTransitionIfRevisionMatches(expectedRevision));
  }

  static clearLocalSessionInAuthTransitionIfRevisionMatches(expectedRevision: string | null): boolean {
    if (!this.isSessionRevisionCurrent(expectedRevision)) return false;
    this.clearLocalSessionMetadata();
    return true;
  }

  private static rotateSessionRevision(): void {
    localStorage.setItem(this.SESSION_REVISION_KEY, generateSecureToken());
  }

  private static clearLocalSessionMetadata(): void {
    this.rotateSessionRevision();
    SecureStorage.removeItem(this.SESSION_KEY);
    SecureStorage.removeItem('auth_token');
    localStorage.removeItem(this.AUTH_FLAG_KEY);
    localStorage.removeItem('userEmail');
    this.notifyStorageChange(this.AUTH_FLAG_KEY, null);
    this.notifyStorageChange('userEmail', null);
  }
  private static notifyStorageChange(key: string, newValue: string | null): void {
    if (typeof window === 'undefined') return;
    window.dispatchEvent(new StorageEvent('storage', {
      key,
      newValue,
      storageArea: localStorage,
      url: window.location.href,
    }));
  }

  static setSession(user: User): Promise<void> {
    return this.withAuthCookieTransition(async () => { this.writeSessionMetadata(user); });
  }

  private static writeSessionMetadata(user: User): void {
    this.rotateSessionRevision();
    SecureStorage.setItem(this.SESSION_KEY, user);
    SecureStorage.removeItem('auth_token');
    localStorage.setItem(this.AUTH_FLAG_KEY, 'true');
    localStorage.setItem('userEmail', user.email);
    this.notifyStorageChange(this.AUTH_FLAG_KEY, 'true');
    this.notifyStorageChange('userEmail', user.email);
  }

  static getSession(): { user: User } | null {
    SecureStorage.removeItem('auth_token');
    const user = SecureStorage.getItem<User>(this.SESSION_KEY);
    return user ? { user } : null;
  }

  private static pendingClearSession: Promise<boolean> | null = null;

  static clearSession(): Promise<boolean> {
    if (typeof window === 'undefined') return Promise.resolve(false);
    if (!this.supportsAuthCookieTransitions()) {
      this.clearLocalSessionMetadata();
      return Promise.resolve(false);
    }
    if (this.pendingClearSession) return this.pendingClearSession;

    const request = this.withAuthCookieTransition(async (getCsrfToken) => {
      this.clearLocalSessionMetadata();
      try {
        return await this.clearServerSessionCookie(await getCsrfToken());
      } catch {
        return false;
      }
    }).catch(() => false);
    this.pendingClearSession = request;
    void request.then(() => {
      if (this.pendingClearSession === request) this.pendingClearSession = null;
    });
    return request;
  }

  private static async clearServerSessionCookie(csrfToken: string): Promise<boolean> {
    try {
      const logoutResponse = await fetch('/api/auth/session', {
        method: 'DELETE',
        credentials: 'same-origin',
        cache: 'no-store',
        signal: AbortSignal.timeout(5000),
        headers: { 'X-CSRF-Token': csrfToken },
      });
      return logoutResponse.ok;
    } catch {
      return false;
    }
  }

  static isAuthenticated(): boolean {
    return this.getSession() !== null;
  }
}

// Input sanitization
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/['"]/g, '') // Remove quotes
    .trim();
}

// Email validation
export function validateEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

// XSS protection
export function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
