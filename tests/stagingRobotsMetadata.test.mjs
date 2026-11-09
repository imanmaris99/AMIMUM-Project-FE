import test from 'node:test';
import assert from 'node:assert/strict';
import { getRobotsMetadata } from '../utils/seo-robots.ts';

test('staging customer host is emitted as noindex and nofollow', () => {
  assert.deepEqual(getRobotsMetadata('https://staging.tokoherbalamimum.web.id'), {
    index: false,
    follow: false,
  });
});

test('production customer hosts retain index and follow directives', () => {
  assert.deepEqual(getRobotsMetadata('https://www.tokoherbalamimum.web.id'), {
    index: true,
    follow: true,
  });
  assert.deepEqual(getRobotsMetadata('https://tokoherbalamimum.web.id'), {
    index: true,
    follow: true,
  });
});

test('staging subdomains with staging labels remain noindex', () => {
  assert.deepEqual(getRobotsMetadata('https://preview-staging.example.test'), {
    index: false,
    follow: false,
  });
});
