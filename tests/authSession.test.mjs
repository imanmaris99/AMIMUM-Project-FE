import test from 'node:test';
import assert from 'node:assert/strict';
import { SessionManager } from '../src/lib/auth.ts';

let testLockQueue = Promise.resolve();
Object.defineProperty(globalThis, 'navigator', { configurable: true, value: { locks: { request: (_name, callback) => {
  const result = testLockQueue.then(callback);
  testLockQueue = result.then(() => undefined, () => undefined);
  return result;
} } } });

class MemoryStorage {
  values = new Map();
  getItem(key) { return this.values.get(key) ?? null; }
  setItem(key, value) { this.values.set(key, String(value)); }
  removeItem(key) { this.values.delete(key); }
  key(index) { return [...this.values.keys()][index] ?? null; }
  get length() { return this.values.size; }
}

class TestStorageEvent extends Event {
  constructor(type, init) { super(type); Object.assign(this, init); }
}

test('session changes notify same-tab storage listeners without storing credentials', async () => {
  const storage = new MemoryStorage();
  const events = [];
  globalThis.localStorage = storage;
  globalThis.StorageEvent = TestStorageEvent;
  globalThis.window = {
    location: { href: 'https://shop.test/account' },
    dispatchEvent(event) { events.push(event); return true; },
  };
  globalThis.fetch = async () => new Response('{}');

  await SessionManager.setSession({ id: '1', email: 'a@b.test', name: 'A', role: 'user', createdAt: new Date() });
  assert.deepEqual(events.map(({ key, newValue }) => [key, newValue]), [
    ['isLoggedIn', 'true'], ['userEmail', 'a@b.test'],
  ]);
  assert.equal(storage.getItem('isLoggedIn'), 'true');
  assert.equal(storage.getItem('auth_token'), null);

  events.length = 0;
  await SessionManager.clearSession();
  assert.deepEqual(events.map(({ key, newValue }) => [key, newValue]), [
    ['isLoggedIn', null], ['userEmail', null],
  ]);
  assert.equal(storage.getItem('isLoggedIn'), null);
});

test('stale unauthorized response cannot clear a newer cross-tab session', async () => {
  globalThis.localStorage = new MemoryStorage();
  globalThis.StorageEvent = TestStorageEvent;
  globalThis.window = {
    location: { href: 'https://shop.test/account' },
    dispatchEvent() { return true; },
  };

  await SessionManager.setSession({
    id: 'old-user',
    email: 'old@example.test',
    name: 'Old User',
    role: 'user',
    createdAt: new Date(),
  });
  const requestRevision = SessionManager.captureSessionRevision();
  await SessionManager.setSession({
    id: 'new-user',
    email: 'new@example.test',
    name: 'New User',
    role: 'user',
    createdAt: new Date(),
  });

  assert.equal(await SessionManager.clearLocalSessionIfRevisionMatches(requestRevision), false);
  assert.equal(SessionManager.getSession()?.user.email, 'new@example.test');
});

test('logout invalidates an in-flight bootstrap result', async () => {
  globalThis.localStorage = new MemoryStorage();
  globalThis.StorageEvent = TestStorageEvent;
  globalThis.window = {
    location: { href: 'https://shop.test/account' },
    dispatchEvent() { return true; },
  };
  globalThis.fetch = async (url) => url === '/api/auth/csrf'
    ? Response.json({ token: 'csrf-test-token' })
    : new Response('{}', { status: 200 });

  const bootstrapRevision = SessionManager.captureSessionRevision();
  const logout = SessionManager.clearSession();
  const staleResultApplied = await SessionManager.setSessionIfRevisionMatches({
    id: 'stale-user',
    email: 'stale@example.test',
    name: 'Stale User',
    role: 'user',
    createdAt: new Date(),
  }, bootstrapRevision);

  assert.equal(staleResultApplied, false);
  assert.equal(SessionManager.getSession(), null);
  assert.equal(await logout, true);
});

test('login metadata commit runs inside the cookie transition and cannot restore a logged-out session', async () => {
  globalThis.localStorage = new MemoryStorage();
  globalThis.StorageEvent = TestStorageEvent;
  globalThis.window = {
    location: { href: 'https://shop.test/account' },
    dispatchEvent() { return true; },
  };
  globalThis.fetch = async (url) => url === '/api/auth/csrf'
    ? Response.json({ token: 'csrf-test-token' })
    : new Response('{}', { status: 200 });

  let finishLogin;
  const responseReady = new Promise((resolve) => { finishLogin = resolve; });
  const initialRevision = SessionManager.captureSessionRevision();
  const order = [];
  let committed;
  const login = SessionManager.withAuthCookieTransition(
    async () => responseReady,
    (user) => {
      order.push('metadata-commit');
      committed = SessionManager.setSessionInAuthTransitionIfRevisionMatches(user, initialRevision);
    },
  );
  const logout = SessionManager.clearSession();
  finishLogin({
    id: 'login-user',
    email: 'login@example.test',
    name: 'Login User',
    role: 'user',
    createdAt: new Date(),
  });

  const transitionResult = await login;
  const loggedOut = await logout;

  assert.equal(transitionResult.id, 'login-user');
  assert.equal(committed, true);
  assert.equal(loggedOut, true);
  assert.deepEqual(order, ['metadata-commit']);
  assert.equal(SessionManager.getSession(), null);
});

test('guarded metadata commit waits behind logout and cannot restore its stale snapshot', async () => {
  globalThis.localStorage = new MemoryStorage();
  globalThis.StorageEvent = TestStorageEvent;
  globalThis.window = {
    location: { href: 'https://shop.test/account' },
    dispatchEvent() { return true; },
  };
  globalThis.fetch = async (url) => url === '/api/auth/csrf'
    ? Response.json({ token: 'csrf-test-token' })
    : new Response('{}', { status: 200 });

  const revision = SessionManager.captureSessionRevision();
  let releaseLogout;
  const logoutInProgress = new Promise((resolve) => { releaseLogout = resolve; });
  const logout = SessionManager.withAuthCookieTransition(async () => {
    await logoutInProgress;
    return true;
  }, () => SessionManager.clearLocalSessionInAuthTransitionIfRevisionMatches(revision));
  const commit = SessionManager.setSessionIfRevisionMatches({
    id: 'stale-user', email: 'stale@example.test', name: 'Stale', role: 'user', createdAt: new Date(),
  }, revision);

  releaseLogout();
  await logout;
  assert.equal(await commit, false);
  assert.equal(SessionManager.getSession(), null);
});

test('session revision invalidates earlier bootstrap responses after login or logout', async () => {
  globalThis.localStorage = new MemoryStorage();
  globalThis.StorageEvent = TestStorageEvent;
  globalThis.window = {
    location: { href: 'https://shop.test/account' },
    dispatchEvent() { return true; },
  };
  globalThis.fetch = async (url) => url === '/api/auth/csrf'
    ? Response.json({ token: 'csrf-test-token' })
    : new Response('{}', { status: 200 });

  const beforeLogin = SessionManager.captureSessionRevision();
  await SessionManager.setSession({
    id: 'fresh-user',
    email: 'fresh@example.test',
    name: 'Fresh User',
    role: 'user',
    createdAt: new Date(),
  });
  assert.equal(SessionManager.isSessionRevisionCurrent(beforeLogin), false);

  const beforeLogout = SessionManager.captureSessionRevision();
  const logout = SessionManager.clearSession();
  assert.equal(await logout, true);
  assert.equal(SessionManager.isSessionRevisionCurrent(beforeLogout), false);
});

test('clearSession reports failure when the CSRF request fails after local logout', async () => {
  const storage = new MemoryStorage();
  storage.setItem('amimum_user_session', 'display metadata');
  storage.setItem('isLoggedIn', 'true');
  globalThis.localStorage = storage;
  globalThis.StorageEvent = TestStorageEvent;
  globalThis.window = {
    location: { href: 'https://shop.test/account' },
    dispatchEvent() { return true; },
  };
  let calls = 0;
  globalThis.fetch = async () => { calls += 1; return new Response('{}', { status: 503 }); };

  const serverLogoutSucceeded = await SessionManager.clearSession();

  assert.equal(serverLogoutSucceeded, false);
  assert.equal(calls, 1);
  assert.equal(storage.getItem('isLoggedIn'), null);
  assert.equal(storage.getItem('amimum_user_session'), null);
});

test('clearSession confirms success only after cookie deletion request succeeds', async () => {
  const storage = new MemoryStorage();
  globalThis.localStorage = storage;
  globalThis.StorageEvent = TestStorageEvent;
  globalThis.window = {
    location: { href: 'https://shop.test/account' },
    dispatchEvent() { return true; },
  };
  const calls = [];
  globalThis.fetch = async (_url, options = {}) => {
    calls.push(options);
    return calls.length === 1
      ? Response.json({ token: 'csrf-test-token' })
      : new Response('{}', { status: 200 });
  };

  const serverLogoutSucceeded = await SessionManager.clearSession();

  assert.equal(serverLogoutSucceeded, true);
  assert.equal(calls.length, 2);
  assert.equal(calls[1].method, 'DELETE');
  assert.equal(calls[1].headers['X-CSRF-Token'], 'csrf-test-token');
});

test('concurrent clearSession calls share one CSRF/logout request pair', async () => {
  globalThis.localStorage = new MemoryStorage();
  globalThis.StorageEvent = TestStorageEvent;
  globalThis.window = {
    location: { href: 'https://shop.test/account' },
    dispatchEvent() { return true; },
  };
  const calls = [];
  globalThis.fetch = async (url, options = {}) => {
    calls.push([url, options]);
    if (url === '/api/auth/csrf') return Response.json({ token: `csrf-${calls.length}` });
    return new Response('{}', { status: 200 });
  };

  const results = await Promise.all([
    SessionManager.clearSession(),
    SessionManager.clearSession(),
  ]);

  assert.deepEqual(results, [true, true]);
  assert.equal(calls.length, 2);
  assert.equal(calls[1][1].headers['X-CSRF-Token'], 'csrf-1');
});

test('competing login attempt is rejected inside the transition before making its request', async () => {
  globalThis.localStorage = new MemoryStorage();
  globalThis.StorageEvent = TestStorageEvent;
  globalThis.window = {
    location: { href: 'https://shop.test/login' },
    dispatchEvent() { return true; },
  };
  const capturedRevision = SessionManager.captureSessionRevision();
  let finishFirst;
  const firstResponse = new Promise((resolve) => { finishFirst = resolve; });
  let secondRequestCount = 0;

  const firstLogin = SessionManager.withSessionRevisionTransition(
    capturedRevision,
    async () => firstResponse,
    () => SessionManager.setSessionInAuthTransitionIfRevisionMatches({
      id: 'first-user', email: 'first@example.test', name: 'First', role: 'user', createdAt: new Date(),
    }, capturedRevision),
  );
  const competingLogin = SessionManager.withSessionRevisionTransition(
    capturedRevision,
    async () => { secondRequestCount += 1; return 'second-response'; },
  );
  finishFirst('first-response');

  assert.equal(await firstLogin, 'first-response');
  await assert.rejects(competingLogin, /Login attempt was superseded/);
  assert.equal(secondRequestCount, 0);
  assert.equal(SessionManager.getSession()?.user.email, 'first@example.test');
});

test('auth transition rejects without Web Locks before invoking its operation or requesting CSRF', async () => {
  const originalNavigator = globalThis.navigator;
  Object.defineProperty(globalThis, 'navigator', { configurable: true, writable: true, value: {} });
  let operationCalls = 0;
  let fetchCalls = 0;
  globalThis.fetch = async () => { fetchCalls += 1; return Response.json({ token: 'csrf' }); };

  try {
    await assert.rejects(
      SessionManager.withAuthCookieTransition(async (getCsrfToken) => {
        operationCalls += 1;
        return getCsrfToken();
      }),
      /secure sign-in requires a supported, current browser/i,
    );
    assert.equal(operationCalls, 0);
    assert.equal(fetchCalls, 0);
  } finally {
    Object.defineProperty(globalThis, 'navigator', { configurable: true, writable: true, value: originalNavigator });
  }
});

test('logout remains locally cleared and reports failure when Web Locks are unavailable', async () => {
  const originalNavigator = globalThis.navigator;
  Object.defineProperty(globalThis, 'navigator', { configurable: true, writable: true, value: {} });
  const storage = new MemoryStorage();
  storage.setItem('isLoggedIn', 'true');
  globalThis.localStorage = storage;
  globalThis.window = { location: { href: 'https://shop.test/account' }, dispatchEvent() { return true; } };
  let fetchCalls = 0;
  globalThis.fetch = async () => { fetchCalls += 1; return new Response('{}'); };

  try {
    assert.equal(await SessionManager.clearSession(), false);
    assert.equal(storage.getItem('isLoggedIn'), null);
    assert.equal(fetchCalls, 0);
  } finally {
    Object.defineProperty(globalThis, 'navigator', { configurable: true, writable: true, value: originalNavigator });
  }
});

test('CSRF token can be acquired without Web Locks for ordinary mutating requests', async () => {
  const originalNavigator = Object.getOwnPropertyDescriptor(globalThis, 'navigator');
  const originalDocument = Object.getOwnPropertyDescriptor(globalThis, 'document');
  Object.defineProperty(globalThis, 'navigator', { configurable: true, writable: true, value: {} });
  Object.defineProperty(globalThis, 'document', { configurable: true, value: { cookie: '' } });
  let calls = 0;
  globalThis.fetch = async (url, options) => {
    calls += 1;
    assert.equal(url, '/api/auth/csrf');
    assert.equal(options.credentials, 'same-origin');
    return Response.json({ token: 'csrf-test-token' });
  };

  try {
    assert.equal(await SessionManager.getCsrfToken(), 'csrf-test-token');
    assert.equal(calls, 1);
  } finally {
    if (originalNavigator) Object.defineProperty(globalThis, 'navigator', originalNavigator);
    else delete globalThis.navigator;
    if (originalDocument) Object.defineProperty(globalThis, 'document', originalDocument);
    else delete globalThis.document;
  }
});

test('concurrent CSRF initialization without Web Locks shares one token request', async () => {
  const originalNavigator = Object.getOwnPropertyDescriptor(globalThis, 'navigator');
  const originalDocument = Object.getOwnPropertyDescriptor(globalThis, 'document');
  Object.defineProperty(globalThis, 'navigator', { configurable: true, writable: true, value: {} });
  const documentStub = { cookie: '' };
  Object.defineProperty(globalThis, 'document', { configurable: true, value: documentStub });
  let calls = 0;
  const resolvers = [];
  globalThis.fetch = async () => {
    calls += 1;
    return new Promise((resolve) => resolvers.push(resolve));
  };
  const requests = [SessionManager.getCsrfToken(), SessionManager.getCsrfToken()];

  try {
    assert.equal(calls, 1);
  } finally {
    documentStub.cookie = 'amimum_csrf=csrf-shared-token';
    for (const resolve of resolvers) resolve(Response.json({ token: 'csrf-shared-token' }));
    if (originalNavigator) Object.defineProperty(globalThis, 'navigator', originalNavigator);
    else delete globalThis.navigator;
    if (originalDocument) Object.defineProperty(globalThis, 'document', originalDocument);
    else delete globalThis.document;
  }
  assert.deepEqual(await Promise.all(requests), ['csrf-shared-token', 'csrf-shared-token']);
});
