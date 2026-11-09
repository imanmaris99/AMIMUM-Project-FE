import test from 'node:test';
import assert from 'node:assert/strict';
import { cookieOptions, findJwt, getOrCreateCsrfToken, getSessionExpiry, isAllowedBackendRoute, isConfirmedSessionRejection, stripTokenFields, validateCsrf } from '../src/lib/server/bff.ts';

test('token fields are recursively removed from browser-visible auth payloads', () => {
  const token = 'header.payload.signature';
  assert.deepEqual(stripTokenFields({ data: { user: { email: 'a@b.test' }, access_token: token, refresh_token: 'refresh' } }), {
    data: { user: { email: 'a@b.test' } },
  });
});
test('token fields are removed case-insensitively at every nesting level', () => {
  assert.deepEqual(stripTokenFields({ data: { Access_Token: 'access', 'refresh-token': 'refresh', nested: { AUTH_TOKEN: 'auth', Jwt: 'jwt', email: 'a@b.test' } } }), {
    data: { nested: { email: 'a@b.test' } },
  });
});

test('only confirmed unauthorized statuses reject a session', () => {
  assert.equal(isConfirmedSessionRejection(401), true);
  assert.equal(isConfirmedSessionRejection(403), true);
  for (const status of [0, 200, 429, 500, 502, 503]) assert.equal(isConfirmedSessionRejection(status), false);
});

test('findJwt traverses response wrappers and normalizes credential field spellings', () => {
  const token = 'header.payload.signature';
  assert.equal(findJwt({ status_code: 200, data: { user: { email: 'a@b.test' }, Access_Token: { AccessToken: token } } }), token);
});

test('session cookie is HttpOnly, host-only, SameSite Lax and production Secure', () => {
  assert.deepEqual(cookieOptions(false, 1700000000), {
    httpOnly: true, secure: false, sameSite: 'lax', path: '/', maxAge: 1700000000,
  });
  assert.equal(cookieOptions(true, 3600).secure, true);
  assert.equal('domain' in cookieOptions(true, 3600), false);
});

test('session expiry is bounded by upstream JWT exp and rejects malformed tokens', () => {
  const token = `header.${Buffer.from(JSON.stringify({ exp: 1900000000 })).toString('base64url')}.signature`;
  assert.equal(getSessionExpiry(token, 1800000000), 1900000000);
  assert.equal(getSessionExpiry(token, 2000000000), null);
  assert.equal(getSessionExpiry('not-a-jwt', 1800000000), null);
});

test('BFF allows only explicit backend route families and method combinations', () => {
  assert.equal(isAllowedBackendRoute('GET', '/user/profile'), true);
  assert.equal(isAllowedBackendRoute('POST', '/orders/checkout'), true);
  assert.equal(isAllowedBackendRoute('DELETE', '/courier/delete/7'), true);
  assert.equal(isAllowedBackendRoute('PUT', '/shipment-address/edit/7'), true);
  assert.equal(isAllowedBackendRoute('DELETE', '/shipment-address/delete/7'), true);
  assert.equal(isAllowedBackendRoute('DELETE', '/user/profile'), false);
  assert.equal(isAllowedBackendRoute('GET', '/admin/users'), false);
  assert.equal(isAllowedBackendRoute('POST', '/orders/checkout/../../admin'), false);
});

test('BFF exposes public product-rating reads while keeping rating writes method-scoped', () => {
  const productId = '372de215-e444-4cdf-b074-b5875c7edfe9';
  assert.equal(isAllowedBackendRoute('GET', `/rating/product/${productId}`), true);
  assert.equal(isAllowedBackendRoute('GET', `/rating/product/${productId}/eligible-variants`), true);
  assert.equal(isAllowedBackendRoute('GET', `/rating/product/${productId}/eligible-order-items`), true);
  assert.equal(isAllowedBackendRoute('POST', `/rating/product/${productId}/eligible-variants`), false);
  assert.equal(isAllowedBackendRoute('GET', `/rating/product/${productId}/unknown`), false);
});

test('CSRF requires exact same-origin and constant-time token equality', () => {
  assert.equal(validateCsrf({ origin: 'https://shop.test', requestOrigin: 'https://shop.test', cookieToken: 'abc', headerToken: 'abc' }), true);
  assert.equal(validateCsrf({ origin: 'https://evil.test', requestOrigin: 'https://shop.test', cookieToken: 'abc', headerToken: 'abc' }), false);
  assert.equal(validateCsrf({ origin: 'https://shop.test', requestOrigin: 'https://shop.test', cookieToken: 'abc', headerToken: 'abd' }), false);
});

test('CSRF token endpoint reuses a valid cookie rather than rotating it on concurrent requests', () => {
  const existing = 'a'.repeat(64);
  assert.equal(getOrCreateCsrfToken(existing), existing);
  const created = getOrCreateCsrfToken();
  assert.match(created, /^[a-f0-9]{64}$/);
  assert.notEqual(getOrCreateCsrfToken('invalid'), 'invalid');
});

test('token stripping removes ID, session, and bearer credential field variants', () => {
  assert.deepEqual(stripTokenFields({
    id_token: 1,
    idToken: 2,
    session_token: 3,
    sessionToken: 4,
    bearer_token: 5,
    bearerToken: 6,
    profile: { email: 'a@b.test' },
  }), { profile: { email: 'a@b.test' } });
});
