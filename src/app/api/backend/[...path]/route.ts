import { NextRequest, NextResponse } from 'next/server';
import { CSRF_COOKIE, getBackendApiUrl, isAllowedBackendRoute, SESSION_COOKIE, validateCsrf } from '@/lib/server/bff';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Context = { params: Promise<{ path: string[] }> };
async function proxy(request: NextRequest, context: Context) {
  const { path } = await context.params;
  const backendPath = `/${path.join('/')}`;
  const method = request.method.toUpperCase();
  if (!isAllowedBackendRoute(method, backendPath)) return NextResponse.json({ message: 'Not found' }, { status: 404 });
  const unsafe = !['GET', 'HEAD', 'OPTIONS'].includes(method);
  if (unsafe && !validateCsrf({ origin: request.headers.get('origin'), requestOrigin: request.nextUrl.origin, cookieToken: request.cookies.get(CSRF_COOKIE)?.value, headerToken: request.headers.get('x-csrf-token') })) {
    return NextResponse.json({ message: 'Invalid request origin or CSRF token' }, { status: 403 });
  }
  const headers = new Headers({ Accept: request.headers.get('accept') || 'application/json' });
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (token) headers.set('Authorization', `Bearer ${token}`);
  const contentType = request.headers.get('content-type');
  if (contentType) headers.set('Content-Type', contentType);
  const url = new URL(backendPath, getBackendApiUrl());
  url.search = request.nextUrl.search;
  const upstream = await fetch(url, { method, headers, body: ['GET', 'HEAD'].includes(method) ? undefined : await request.arrayBuffer(), cache: 'no-store', redirect: 'manual' });
  const responseHeaders = new Headers();
  for (const name of ['content-type', 'cache-control']) { const value = upstream.headers.get(name); if (value) responseHeaders.set(name, value); }
  responseHeaders.set('Cache-Control', 'no-store');
  if (upstream.status === 401) {
    return new NextResponse(upstream.body, { status: 401, headers: responseHeaders });
  }
  return new NextResponse(upstream.body, { status: upstream.status, headers: responseHeaders });
}
export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
