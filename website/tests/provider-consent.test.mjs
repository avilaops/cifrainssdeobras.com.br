import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

async function loadModule(path) {
  const source = await readFile(new URL(path, import.meta.url), 'utf8');
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
  return import('data:text/javascript;base64,' + Buffer.from(code).toString('base64'));
}
const { createMetaConsent } = await loadModule('../src/lib/meta-consent.ts');
const { createConsentPageViewGate } = await loadModule('../src/lib/consent-pageviews.ts');

test('Meta does not load before permission and a pending load cannot send a revoked PageView', () => {
  const permissions = [];
  let ready;
  let loads = 0;
  let views = 0;
  const controller = createMetaConsent({ enabled: true, pushConsent: value => permissions.push(value), load: callback => { loads++; ready = callback; }, initialize: () => { views++; } });
  controller.apply(false);
  assert.equal(loads, 0);
  controller.apply(true);
  assert.equal(loads, 1);
  assert.equal(views, 0, 'No PageView is queued before the SDK is ready');
  controller.apply(false);
  ready();
  assert.equal(views, 0);
  assert.equal(permissions.at(-1), false);
  controller.apply(true);
  controller.apply(true);
  assert.equal(loads, 1);
  assert.equal(views, 1);
  controller.apply(false);
  assert.equal(permissions.at(-1), false);
});

test('an unconfigured Meta Pixel never initializes and a failed SDK load can retry', () => {
  let loads = 0;
  let fail;
  const callbacks = { pushConsent() {}, load: (_, rejected) => { loads++; fail = rejected; }, initialize() {} };
  createMetaConsent({ enabled: false, ...callbacks }).apply(true);
  assert.equal(loads, 0);
  const controller = createMetaConsent({ enabled: true, ...callbacks });
  controller.apply(true);
  fail();
  controller.apply(true);
  assert.equal(loads, 2);
});

test('saving the same analytics choice does not duplicate an internal page view', () => {
  const visit = createConsentPageViewGate();
  assert.equal(visit('/', false), false);
  assert.equal(visit('/', true), true);
  assert.equal(visit('/', true), false);
  assert.equal(visit('/contato/', true), true);
  assert.equal(visit('/contato/', true), false);
  assert.equal(visit('/contato/', false), false);
  assert.equal(visit('/contato/', true), true);
});
