import assert from 'node:assert/strict';
import test from 'node:test';
import { collectBrandLoaderPages } from '../src/lib/server/brandLoader.ts';

test('an empty brand-loader 404 is an empty catalog, not an outage', async () => {
  const calls = [];
  const brands = await collectBrandLoaderPages(async (skip, limit) => {
    calls.push([skip, limit]);
    return new Response('', { status: 404 });
  });

  assert.deepEqual(brands, []);
  assert.deepEqual(calls, [[0, 50]]);
});

test('brand-loader server errors remain errors', async () => {
  await assert.rejects(
    () => collectBrandLoaderPages(async () => new Response('', { status: 500 })),
    /Data brand belum bisa dimuat/,
  );
});

test('brand-loader pages are accumulated without losing pagination', async () => {
  const calls = [];
  const pages = [
    new Response(JSON.stringify({ data: [{ id: 1 }], has_more: true }), { status: 200 }),
    new Response(JSON.stringify({ data: [{ id: 2 }], has_more: false }), { status: 200 }),
  ];
  const brands = await collectBrandLoaderPages(async (skip, limit) => {
    calls.push([skip, limit]);
    return pages.shift();
  });

  assert.deepEqual(brands, [{ id: 1 }, { id: 2 }]);
  assert.deepEqual(calls, [[0, 50], [1, 50]]);
});
