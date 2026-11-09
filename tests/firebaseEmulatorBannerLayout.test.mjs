import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import postcss from 'postcss';

const css = readFileSync(new URL('../src/app/globals.css', import.meta.url), 'utf8');
const root = postcss.parse(css);
const mobileBlocks = root.nodes.filter((node) => node.type === 'atrule' && /max-width:\s*480px/.test(node.params));

test('staging Auth Emulator warning leaves the mobile bottom navigation visible', () => {
  const mobile = mobileBlocks.find((block) => block.nodes.some((node) => node.type === 'rule' && node.selector === '.firebase-emulator-warning'));
  assert.ok(mobile, 'mobile warning breakpoint exists');
  const warning = mobile.nodes.find((node) => node.type === 'rule' && node.selector === '.firebase-emulator-warning');
  assert.ok(warning, 'emulator warning has a mobile-safe style');
  const value = (property) => warning.nodes.find((node) => node.type === 'decl' && node.prop === property)?.value;
  assert.match(value('bottom') || '', /65px/);
  assert.equal(value('z-index'), '49');
  assert.equal(value('pointer-events'), 'none');

  const content = mobile.nodes.find((node) => node.type === 'rule' && node.selector === 'body:has(.firebase-emulator-warning) main');
  assert.ok(content, 'mobile content reserves space for the warning');
  const reservedSpace = content.nodes.find((node) => node.type === 'decl' && node.prop === 'padding-bottom');
  assert.ok(reservedSpace, 'main reserves footer clearance');
  assert.match(reservedSpace.value, /112px/, 'reserved space clears the warning and fixed bottom navigation');
});
