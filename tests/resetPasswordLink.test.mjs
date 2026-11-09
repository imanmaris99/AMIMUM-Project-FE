import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  clearResetPasswordQuery,
  readResetPasswordParams,
} from '../src/lib/resetPasswordLink.ts';

test('reads reset credentials before the URL is cleaned', () => {
  assert.deepEqual(
    readResetPasswordParams('?email=owner%40example.com&code=654321'),
    { email: 'owner@example.com', code: '654321', hasCredentials: true },
  );
});

test('removes reset credentials from URL and preserves browser history state', () => {
  const calls = [];
  const location = {
    pathname: '/reset-password',
    search: '?email=owner%40example.com&code=654321&utm=mail',
    hash: '#campaign=autumn',
  };
  const history = {
    state: { __NA: true, key: 'router-state' },
    replaceState: (...args) => calls.push(args),
  };

  clearResetPasswordQuery(location, history);

  assert.deepEqual(calls, [[{ __NA: true, key: 'router-state' }, '', '/reset-password?utm=mail#campaign=autumn']]);
});

test('does not change a URL that contains no reset credentials', () => {
  const calls = [];
  clearResetPasswordQuery(
    { pathname: '/reset-password', search: '?campaign=mail' },
    { state: null, replaceState: (...args) => calls.push(args) },
  );
  assert.deepEqual(calls, []);
});

test('reads reset credentials from the URL fragment', () => {
  assert.deepEqual(
    readResetPasswordParams('', '#email=owner%40example.com&code=654321'),
    { email: 'owner@example.com', code: '654321', hasCredentials: true },
  );
});

test('preserves bare fragment anchors when removing reset credentials', () => {
  const calls = [];
  clearResetPasswordQuery(
    {
      pathname: '/reset-password',
      search: '',
      hash: '#email=owner%40example.com&code=654321&section',
    },
    { state: null, replaceState: (...args) => calls.push(args) },
  );
  assert.deepEqual(calls, [[null, '', '/reset-password#section']]);
});
