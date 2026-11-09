import { NextRequest, NextResponse } from 'next/server';
import { createCsrfToken, CSRF_COOKIE, getBackendApiUrl, isConfirmedSessionRejection, SESSION_COOKIE, stripTokenFields, validateCsrf } from '@/lib/server/bff';

export async function GET(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return NextResponse.json({ authenticated: false }, { status: 401, headers: { 'Cache-Control': 'no-store' } });
  const upstream = await fetch(new URL('/user/profile', getBackendApiUrl()), {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }, cache: 'no-store',
  }).catch(() => null);
  if (!upstream) return NextResponse.json({ authenticated: false }, { status: 503, headers: { 'Cache-Control': 'no-store' } });
  if (isConfirmedSessionRejection(upstream.status)) {
    return NextResponse.json({ authenticated: false }, { status: 401, headers: { 'Cache-Control': 'no-store' } });
  }
  const body = await upstream.json().catch(() => ({}));
  return NextResponse.json({ authenticated: upstream.ok, profile: stripTokenFields(body) }, { status: upstream.status, headers: { 'Cache-Control': 'no-store' } });
}

export async function DELETE(request: NextRequest) {
  const valid = validateCsrf({ origin: request.headers.get('origin'), requestOrigin: request.nextUrl.origin, cookieToken: request.cookies.get(CSRF_COOKIE)?.value, headerToken: request.headers.get('x-csrf-token') });
  if (!valid) return NextResponse.json({ message: 'Invalid request origin or CSRF token' }, { status: 403 });
  const response = NextResponse.json({ success: true });
  response.cookies.set(SESSION_COOKIE, '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 0 });
  response.cookies.set(CSRF_COOKIE, createCsrfToken(), { httpOnly: false, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/' });
  return response;
}
