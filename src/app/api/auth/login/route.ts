import { NextRequest, NextResponse } from 'next/server';
import { CSRF_COOKIE, findJwt, getBackendApiUrl, getSessionExpiry, cookieOptions, SESSION_COOKIE, stripTokenFields, validateCsrf } from '@/lib/server/bff';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const valid = validateCsrf({
    origin: request.headers.get('origin'),
    requestOrigin: request.nextUrl.origin,
    cookieToken: request.cookies.get(CSRF_COOKIE)?.value,
    headerToken: request.headers.get('x-csrf-token'),
  });
  if (!valid) return NextResponse.json({ message: 'Invalid request origin or CSRF token' }, { status: 403 });

  const url = new URL('/user/login', getBackendApiUrl());
  const upstream = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: await request.text(),
    cache: 'no-store',
  });
  const body: unknown = await upstream.json().catch(() => ({}));
  const token = upstream.ok ? findJwt(body) : undefined;
  const expiry = token ? getSessionExpiry(token) : null;
  if (upstream.ok && (!token || !expiry)) {
    return NextResponse.json({ status_code: 502, message: 'Login could not establish a secure session.' }, { status: 502, headers: { 'Cache-Control': 'no-store' } });
  }
  const response = NextResponse.json(stripTokenFields(body), { status: upstream.status });
  response.headers.set('Cache-Control', 'no-store');
  if (token && expiry) {
    response.cookies.set(SESSION_COOKIE, token, cookieOptions(process.env.NODE_ENV === 'production', Math.max(0, expiry - Math.floor(Date.now() / 1000))));
  }
  return response;
}
