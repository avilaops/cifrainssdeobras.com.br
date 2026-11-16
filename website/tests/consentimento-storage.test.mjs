import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';

test('revoking consent still dispatches denial and removes stale permission after a storage write failure', async () => {
  const source = await readFile(new URL('../src/lib/tagflow.ts', import.meta.url), 'utf8');
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  let raw = null;
  let blocked = false;
  const events = [];
  const localStorage = { getItem: () => raw, setItem: (_, value) => { if (blocked) throw new Error('Quota exceeded'); raw = value; }, removeItem: () => { raw = null; } };
  const exports = {};
  const browserWindow = { localStorage, dispatchEvent: event => events.push(event) };
  runInNewContext(code, { exports, require: () => ({ IS_TAGFLOW_CONFIGURED: false, TAGFLOW_CONFIG: {} }), window: browserWindow, localStorage, CustomEvent: class { constructor(type, options) { this.type = type; this.detail = options.detail; } }, console });
  exports.storeConsent({ analytics: true, marketing: false });
  blocked = true;
  exports.storeConsent({ analytics: false, marketing: false });
  assert.equal(events.length, 2);
  assert.equal(events.at(-1).detail.analytics, false);
  assert.equal(exports.getStoredConsent().analytics, false);
  assert.equal(raw, null);
  assert.equal(browserWindow.__cifraConsent?.analytics, false);
});
