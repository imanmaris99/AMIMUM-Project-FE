import test from 'node:test';
import assert from 'node:assert/strict';
import Module from 'node:module';
import path from 'node:path';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

function loadErrorHandler() {
  const toastCalls = [];
  const toast = Object.fromEntries(['error', 'loading', 'success'].map((type) => [
    type,
    (...args) => toastCalls.push({ type, args }),
  ]));
  const sourcePath = path.resolve('src/lib/errorHandler.ts');
  const source = readFileSync(sourcePath, 'utf8');
  const compiledSource = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const loaded = new Module(sourcePath);
  loaded.filename = sourcePath;
  loaded.paths = Module._nodeModulePaths(path.dirname(sourcePath));
  const requireOriginal = loaded.require.bind(loaded);
  loaded.require = (specifier) => specifier === 'react-hot-toast'
    ? { toast }
    : requireOriginal(specifier);
  loaded._compile(compiledSource, sourcePath);
  return { ErrorHandler: loaded.exports.ErrorHandler, toastCalls };
}

function saveGlobals(keys) {
  return new Map(keys.map((key) => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
}

function restoreGlobals(descriptors) {
  for (const [key, descriptor] of descriptors) {
    if (descriptor) Object.defineProperty(globalThis, key, descriptor);
    else Reflect.deleteProperty(globalThis, key);
  }
}

test('SSR error handling skips browser-only access, retry, and toast effects', async () => {
  const { ErrorHandler, toastCalls } = loadErrorHandler();
  const browserGlobals = ['window', 'localStorage', 'navigator'];
  const descriptors = saveGlobals(browserGlobals);
  let retryAttempts = 0;

  try {
    for (const key of browserGlobals) Reflect.deleteProperty(globalThis, key);
    await assert.doesNotReject(() => ErrorHandler.handleError(
      new Error('SSR-only test failure'),
      'SSR test',
      true,
      async () => { retryAttempts += 1; },
    ));
    assert.equal(retryAttempts, 0);
    assert.deepEqual(toastCalls, []);
  } finally {
    restoreGlobals(descriptors);
  }
});

test('browser storage access errors do not break client error reporting', async () => {
  const { ErrorHandler, toastCalls } = loadErrorHandler();
  const browserGlobals = ['window', 'localStorage', 'navigator'];
  const descriptors = saveGlobals(browserGlobals);

  try {
    for (const key of browserGlobals) Reflect.deleteProperty(globalThis, key);
    Object.defineProperty(globalThis, 'window', {
      configurable: true,
      value: {
        get localStorage() { throw new Error('storage blocked'); },
        location: { href: 'https://staging.example.test/detail' },
      },
    });
    Object.defineProperty(globalThis, 'navigator', {
      configurable: true,
      value: { userAgent: 'SSR regression test' },
    });

    await assert.doesNotReject(() => ErrorHandler.handleError(new Error('Client test failure')));
    assert.equal(toastCalls.filter(({ type }) => type === 'error').length, 1);
  } finally {
    restoreGlobals(descriptors);
  }
});
