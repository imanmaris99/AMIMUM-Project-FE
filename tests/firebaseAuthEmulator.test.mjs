import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  connectFirebaseAuthEmulatorIfConfigured,
  getFirebaseAuthEmulatorUrl,
} from '../utils/firebase-auth-emulator.ts';

test('enables Auth Emulator only with explicit host and demo project ID', () => {
  assert.equal(
    getFirebaseAuthEmulatorUrl('127.0.0.1:9099', 'demo-amimum-staging'),
    'http://127.0.0.1:9099',
  );
});

test('refuses emulator mode for Production, malformed, or other project IDs', () => {
  assert.equal(getFirebaseAuthEmulatorUrl('127.0.0.1:9099', 'amimumherbal'), null);
  assert.equal(getFirebaseAuthEmulatorUrl('127.0.0.1:9099', 'demo-'), null);
  assert.equal(getFirebaseAuthEmulatorUrl('127.0.0.1:9099', 'demo-amimum staging'), null);
  assert.equal(getFirebaseAuthEmulatorUrl('127.0.0.1:9099', 'demo-AMIMUM-staging'), null);
  assert.equal(getFirebaseAuthEmulatorUrl('127.0.0.1:9099', 'demo-other-staging'), null);
});

test('does not connect to an emulator by default without an explicit host', () => {
  assert.equal(getFirebaseAuthEmulatorUrl(undefined, 'demo-amimum-staging'), null);
});

test('keeps Auth Emulator loopback-only, including for HTTPS staging hosts', () => {
  assert.equal(
    getFirebaseAuthEmulatorUrl('https://auth-staging.example.test', 'demo-amimum-staging'),
    null,
  );
  assert.equal(
    getFirebaseAuthEmulatorUrl('https://api-staging.tokoherbalamimum.web.id', 'demo-amimum-staging'),
    null,
  );
  assert.equal(
    getFirebaseAuthEmulatorUrl('https://127.0.0.1:9099', 'demo-amimum-staging'),
    'https://127.0.0.1:9099',
  );
});

test('rejects insecure remote emulator URLs and malformed or Production targets', () => {
  assert.equal(
    getFirebaseAuthEmulatorUrl('auth-staging.example.test:9099', 'demo-amimum-staging'),
    null,
  );
  assert.equal(
    getFirebaseAuthEmulatorUrl('https://auth-staging.example.test/other-path', 'demo-amimum-staging'),
    null,
  );
  assert.equal(
    getFirebaseAuthEmulatorUrl('https://user:pass@auth-staging.example.test', 'demo-amimum-staging'),
    null,
  );
  assert.equal(
    getFirebaseAuthEmulatorUrl('https://auth-staging.example.test:bad', 'demo-amimum-staging'),
    null,
  );
  assert.equal(
    getFirebaseAuthEmulatorUrl('https://identitytoolkit.googleapis.com', 'demo-amimum-staging'),
    null,
  );
  assert.equal(
    getFirebaseAuthEmulatorUrl('https://identitytoolkit.googleapis.com.', 'demo-amimum-staging'),
    null,
  );
  assert.equal(
    getFirebaseAuthEmulatorUrl('https://auth-staging.firebaseapp.com', 'demo-amimum-staging'),
    null,
  );
  assert.equal(
    getFirebaseAuthEmulatorUrl('https://auth-staging.firebaseapp.com.', 'demo-amimum-staging'),
    null,
  );
  assert.equal(
    getFirebaseAuthEmulatorUrl('https://auth-staging.web.app', 'demo-amimum-staging'),
    null,
  );
  assert.equal(
    getFirebaseAuthEmulatorUrl('https://auth-staging.web.app.', 'demo-amimum-staging'),
    null,
  );
  assert.equal(getFirebaseAuthEmulatorUrl('https://@auth-staging.example.test', 'demo-amimum-staging'), null);
  assert.equal(getFirebaseAuthEmulatorUrl('https://:@auth-staging.example.test', 'demo-amimum-staging'), null);
  assert.equal(getFirebaseAuthEmulatorUrl('https://auth-staging.example.test?', 'demo-amimum-staging'), null);
  assert.equal(getFirebaseAuthEmulatorUrl('https://auth-staging.example.test#', 'demo-amimum-staging'), null);
  assert.equal(getFirebaseAuthEmulatorUrl('https://.', 'demo-amimum-staging'), null);
  assert.equal(getFirebaseAuthEmulatorUrl('https://googleapis.com', 'demo-amimum-staging'), null);
});

test('calls the Firebase SDK only for a loopback host and exact staging project', () => {
  const auth = { name: 'fake-auth' };
  const calls = [];
  const connect = (...args) => calls.push(args);

  assert.equal(
    connectFirebaseAuthEmulatorIfConfigured(auth, undefined, 'demo-amimum-staging', connect),
    false,
  );
  assert.equal(
    connectFirebaseAuthEmulatorIfConfigured(auth, 'https://auth-staging.example.test', 'amimumherbal', connect),
    false,
  );
  assert.equal(
    connectFirebaseAuthEmulatorIfConfigured(auth, 'https://api-staging.tokoherbalamimum.web.id', 'demo-amimum-staging', connect),
    false,
  );
  assert.equal(
    connectFirebaseAuthEmulatorIfConfigured(auth, '127.0.0.1:9099', 'demo-amimum-staging', connect),
    true,
  );

  assert.deepEqual(calls, [[auth, 'http://127.0.0.1:9099']]);
});

test('Firebase configuration preserves Production defaults and uses the guarded emulator integration', () => {
  const source = readFileSync(new URL('../utils/firebase-config.ts', import.meta.url), 'utf8');

  assert.match(source, /authDomain:\s*process\.env\.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN\s*\|\|\s*"amimumherbal\.firebaseapp\.com"/);
  assert.match(source, /projectId:\s*process\.env\.NEXT_PUBLIC_FIREBASE_PROJECT_ID\s*\|\|\s*"amimumherbal"/);
  assert.match(source, /storageBucket:\s*process\.env\.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET\s*\|\|\s*"amimumherbal\.appspot\.com"/);
  assert.match(source, /messagingSenderId:\s*process\.env\.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID\s*\|\|\s*"930664033239"/);
  assert.match(source, /appId:\s*process\.env\.NEXT_PUBLIC_FIREBASE_APP_ID\s*\|\|\s*"1:930664033239:web:36e1297913103fb1473992"/);
  assert.match(source, /measurementId:\s*process\.env\.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID\s*\|\|\s*"G-QVM3PRYKV2"/);
  assert.match(source, /apiKey:\s*process\.env\.NEXT_PUBLIC_FIREBASE_API_KEY\s*\|\|\s*"[^"]+"/);
  assert.match(source, /connectFirebaseAuthEmulatorIfConfigured\(\s*auth,\s*process\.env\.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST,\s*firebaseConfig\.projectId,\s*connectAuthEmulator,\s*\)/);
});
