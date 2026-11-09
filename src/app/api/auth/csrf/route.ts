import { NextRequest, NextResponse } from 'next/server';
import { getOrCreateCsrfToken, CSRF_COOKIE } from '@/lib/server/bff';

export async function GET(request: NextRequest) {
  const token = getOrCreateCsrfToken(request.cookies.get(CSRF_COOKIE)?.value);
  const response = NextResponse.json({ token });
  response.headers.set('Cache-Control', 'no-store');
  response.cookies.set(CSRF_COOKIE, token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
  return response;
}
