import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (path) => readFile(new URL(path, import.meta.url), 'utf8');

test('CSRF token response is not cached', async () => {
  const source = await read('../src/app/api/auth/csrf/route.ts');
  assert.match(source, /headers\.set\(['\"]Cache-Control['\"], ['\"]no-store['\"]\)/);
});

test('session bootstrap 401 cannot unconditionally clear a newer cookie', async () => {
  const source = await read('../src/app/api/auth/session/route.ts');
  const bootstrapHandler = source.split('export async function DELETE')[0];
  assert.match(bootstrapHandler, /isConfirmedSessionRejection\(upstream\.status\)/);
  assert.doesNotMatch(bootstrapHandler, /cookies\.set\(SESSION_COOKIE/);
});

test('backend proxy 401 cannot emit a session-cookie deletion', async () => {
  const source = await read('../src/app/api/backend/[...path]/route.ts');
  assert.match(source, /upstream\.status === 401/);
  assert.doesNotMatch(source, /cookies\.set\(SESSION_COOKIE/);
});

test('failed password login only writes the session cookie after a valid JWT is established', async () => {
  const source = await read('../src/app/api/auth/login/route.ts');
  assert.match(source, /if \(token && expiry\)\s*\{\s*response\.cookies\.set\(SESSION_COOKIE/);
  assert.doesNotMatch(source, /cookies\.set\(SESSION_COOKIE, ''/);
});

test('password and Google login services admit the captured revision before CSRF or BFF requests', async () => {
  const password = await read('../src/services/api/login/index.ts');
  const google = await read('../src/services/api/google-login/index.ts');
  for (const [flow, source, endpoint] of [
    ['password', password, "'/api/auth/login'"],
    ['Google', google, "'/api/auth/google-login'"],
  ]) {
    assert.match(source, /withSessionRevisionTransition\(loginRevision, async \(getCsrfToken\)/, `${flow} flow must enter revision-guarded serialized transition`);
    const admission = source.indexOf('withSessionRevisionTransition(loginRevision');
    const csrf = source.indexOf('await getCsrfToken()', admission);
    const request = source.indexOf(`axios.post<`, csrf);
    assert.ok(admission >= 0 && csrf > admission && request > csrf, `${flow} flow must guard before CSRF and POST`);
    assert.ok(source.includes(endpoint), `${flow} endpoint should remain unchanged`);
  }

  const passwordPage = await read('../src/app/(auth_layout)/login/page.tsx');
  const googleFlow = await read('../src/lib/googleAuth.ts');
  assert.match(passwordPage, /const loginRevision = SessionManager\.captureSessionRevision\(\);[\s\S]*?postLogin\(loginPayload, loginRevision/);
  assert.match(googleFlow, /const loginRevision = SessionManager\.captureSessionRevision\(\);[\s\S]*?signInWithPopup[\s\S]*?postGoogleLogin\([\s\S]*?loginRevision/);
});

test('password and Google login expose the explicit unsupported-browser guidance', async () => {
  const auth = await read('../src/lib/auth.ts');
  const googleFlow = await read('../src/lib/googleAuth.ts');
  const loginPage = await read('../src/app/(auth_layout)/login/page.tsx');
  assert.match(auth, /AUTH_LOCK_UNSUPPORTED_MESSAGE = 'Secure sign-in requires a supported, current browser/);
  assert.match(loginPage, /setApiError\(errorMessage\)/);
  assert.match(googleFlow, /supportsAuthCookieTransitions\(\)[\s\S]*?AUTH_LOCK_UNSUPPORTED_MESSAGE[\s\S]*?signInWithPopup/);
});

test('session bootstrap strips credential fields from upstream profile payloads', async () => {
  const source = await read('../src/app/api/auth/session/route.ts');
  assert.match(source, /stripTokenFields\(body\)/);
});
