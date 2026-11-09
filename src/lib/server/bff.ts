import { randomBytes, timingSafeEqual } from 'node:crypto';

export const SESSION_COOKIE = 'amimum_session';
export const CSRF_COOKIE = 'amimum_csrf';

export function cookieOptions(secure: boolean, maxAge: number) {
  return { httpOnly: true, secure, sameSite: 'lax' as const, path: '/', maxAge };
}

export function getSessionExpiry(token: string, nowSeconds = Math.floor(Date.now() / 1000)): number | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8')) as { exp?: unknown };
    if (typeof payload.exp !== 'number' || !Number.isFinite(payload.exp) || payload.exp <= nowSeconds) return null;
    return payload.exp;
  } catch { return null; }
}

const allowed: Array<[string, RegExp]> = [
  ['GET', /^\/(?:categories\/all|user\/profile|production\/(?:all|promo)|brand\/(?:all|promo|detail\/\d+|loader(?:\/categories\/\d+)?)|product\/(?:all|detail\/[^/]+|discount\/production\/\d+|production\/\d+(?:\/[^/]+)?|[^/]+)|articles\/all|cart\/(?:my-cart|total-items)|courier\/(?:my-courier|shipping-cost)|shipment\/(?:my-list)|shipment-address\/(?:my-address|owner-address)|orders\/(?:my-orders|detail\/[^/]+|complete-details\/[^/]+)|rajaongkir\/(?:provinces|cities\/\d+|districts\/\d+)|rating\/(?:my-rating-products-list|product\/[^/]+(?:\/eligible-(?:variants|order-items))?)|wishlist\/(?:my-products-wishlist|total-items))$/],
  ['POST', /^\/(?:user\/(?:register|forgot-password|password-reset\/confirm|verify-email|resend-verification)|shipment-address\/(?:create)|courier\/shipping-cost|shipment\/(?:create-shipment|new-shipment)|orders\/(?:checkout(?:\/direct)?|[^/]+\/qris-payment-confirmation)|payments\/(?:create|notifications)|rajaongkir\/shipping-cost|rating\/product\/[^/]+|cart\/product\/[^/]+\/[^/]+|wishlist\/product\/[^/]+)$/],
  ['PUT', /^\/(?:user\/(?:edit-info|edit-photo)|cart\/(?:update-quantity\/[^/]+|update-activate(?:\/[^/]+|-all))|shipment\/activate\/[^/]+|shipment-address\/(?:create|edit\/\d+)|courier\/edit-courier\/[^/]+|rating\/edit\/\d+)$/],
  ['PATCH', /^\/(?:user\/edit-info|cart\/update-quantity\/[^/]+|rating\/edit\/\d+)$/],
  ['DELETE', /^\/(?:cart\/delete\/[^/]+|shipment\/delete\/[^/]+|shipment-address\/delete\/\d+|courier\/delete\/[^/]+|rating\/delete\/\d+|wishlist\/delete\/\d+)$/],
];
export function isAllowedBackendRoute(method: string, path: string): boolean {
  if (!path.startsWith('/') || path.startsWith('//') || path.includes('..') || path.includes('\\')) return false;
  return allowed.some(([verb, pattern]) => verb === method.toUpperCase() && pattern.test(path));
}

export function validateCsrf(input: { origin: string | null; requestOrigin: string; cookieToken: string | undefined; headerToken: string | null }): boolean {
  if (!input.origin || input.origin !== input.requestOrigin || !input.cookieToken || !input.headerToken) return false;
  const a = Buffer.from(input.cookieToken);
  const b = Buffer.from(input.headerToken);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function isConfirmedSessionRejection(status: number): boolean {
  return status === 401 || status === 403;
}

export function createCsrfToken(): string { return randomBytes(32).toString('hex'); }
export function getOrCreateCsrfToken(cookieToken?: string): string {
  return cookieToken && /^[a-f0-9]{64}$/.test(cookieToken) ? cookieToken : createCsrfToken();
}
export function getBackendApiUrl(): string {
  const value = process.env.BACKEND_API_URL || (process.env.NODE_ENV !== 'production' ? process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL : '');
  if (!value) throw new Error('BACKEND_API_URL is required');
  const url = new URL(value);
  if (url.protocol !== 'https:' && process.env.NODE_ENV === 'production') throw new Error('BACKEND_API_URL must use HTTPS in production');
  return url.origin;
}

export function stripTokenFields<T>(body: T): T {
  const keys = new Set(['token', 'accesstoken', 'refreshtoken', 'idtoken', 'sessiontoken', 'bearertoken', 'jwt', 'authtoken']);
  const walk = (value: unknown): unknown => {
    if (Array.isArray(value)) return value.map(walk);
    if (!value || typeof value !== 'object') return value;
    return Object.fromEntries(Object.entries(value).filter(([key]) => !keys.has(key.toLowerCase().replace(/[_-]/g, ''))).map(([key, child]) => [key, walk(child)]));
  };
  return walk(body) as T;
}

export function findJwt(value: unknown): string | undefined {
  const jwtPattern = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/;
  const credentialKeys = new Set(['token', 'accesstoken', 'jwt', 'authtoken']);
  const visit = (current: unknown, credentialContext = false): string | undefined => {
    if (typeof current === 'string') return credentialContext && jwtPattern.test(current) ? current : undefined;
    if (Array.isArray(current)) {
      for (const child of current) {
        const found = visit(child, credentialContext);
        if (found) return found;
      }
      return undefined;
    }
    if (current && typeof current === 'object') {
      for (const [key, child] of Object.entries(current)) {
        const normalizedKey = key.toLowerCase().replace(/[_-]/g, '');
        const found = visit(child, credentialContext || credentialKeys.has(normalizedKey));
        if (found) return found;
      }
    }
    return undefined;
  };
  return visit(value);
}
