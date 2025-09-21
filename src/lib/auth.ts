// Enhanced Authentication Utilities
import { createHash, randomBytes } from 'crypto';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: Date;
  lastLogin?: Date;
}

export interface AuthToken {
  token: string;
  expiresAt: Date;
  refreshToken: string;
}

// Secure token generation
export function generateSecureToken(): string {
  return randomBytes(32).toString('hex');
}

// Password hashing (for production, use bcrypt)
export function hashPassword(password: string): string {
  return createHash('sha256').update(password + process.env.PASSWORD_SALT).digest('hex');
}

// JWT-like token validation
export function validateToken(token: string): boolean {
  try {
    // In production, use proper JWT validation
    const decoded = JSON.parse(atob(token.split('.')[1]));
    return decoded.exp > Date.now() / 1000;
  } catch {
    return false;
  }
}

// Secure storage utilities
export class SecureStorage {
  private static readonly PREFIX = 'amimum_';
  
  static setItem(key: string, value: any): void {
    try {
      const encrypted = btoa(JSON.stringify(value));
      localStorage.setItem(this.PREFIX + key, encrypted);
    } catch (error) {
      console.error('Failed to store secure data:', error);
    }
  }
  
  static getItem<T>(key: string): T | null {
    try {
      const encrypted = localStorage.getItem(this.PREFIX + key);
      if (!encrypted) return null;
      return JSON.parse(atob(encrypted));
    } catch (error) {
      console.error('Failed to retrieve secure data:', error);
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

// Session management
export class SessionManager {
  private static readonly SESSION_KEY = 'user_session';
  private static readonly TOKEN_KEY = 'auth_token';
  
  static setSession(user: User, token: AuthToken): void {
    SecureStorage.setItem(this.SESSION_KEY, user);
    SecureStorage.setItem(this.TOKEN_KEY, token);
  }
  
  static getSession(): { user: User; token: AuthToken } | null {
    const user = SecureStorage.getItem<User>(this.SESSION_KEY);
    const token = SecureStorage.getItem<AuthToken>(this.TOKEN_KEY);
    
    if (!user || !token) return null;
    
    // Check token expiration
    if (!validateToken(token.token)) {
      this.clearSession();
      return null;
    }
    
    return { user, token };
  }
  
  static clearSession(): void {
    SecureStorage.removeItem(this.SESSION_KEY);
    SecureStorage.removeItem(this.TOKEN_KEY);
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
