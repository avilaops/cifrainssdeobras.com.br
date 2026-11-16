import test from 'node:test';
import assert from 'node:assert/strict';
import { installCifraConsent } from '../public/consentimento-medicao.mjs';

function fixture(consent = null, hostname = 'cifrainssdeobras.com.br') {
  let value = consent && JSON.stringify(consent);
  const handlers = {};
  const window = { location: { hostname }, localStorage: { getItem: () => value }, addEventListener: (name, fn) => { handlers[name] = fn; } };
  const document = { cookie: '' };
  return { window, document, change: async next => { value = JSON.stringify(next); await handlers['cifra:consent-change']?.({ detail: next }); }, emit: async next => handlers['cifra:consent-change']?.({ detail: next }) };
}

test('CIFRA uses analytics permission independently of marketing and revokes the initialized runtime', async () => {
  const f = fixture({ analytics: false, marketing: true });
  let loads = 0;
  const calls = [];
  installCifraConsent({ ...f, loadRuntime: async () => { loads++; return { setConsent: value => calls.push(value) }; } });
  assert.equal(loads, 0);
  await f.change({ analytics: true, marketing: false });
  assert.equal(loads, 1);
  assert.deepEqual(calls, [true]);
  await f.change({ analytics: false, marketing: true });
  assert.deepEqual(calls, [true, false]);
  await f.change({ analytics: true, marketing: false });
  assert.equal(loads, 1);
});

test('a revocation during loading wins over a previously granted choice', async () => {
  const f = fixture();
  const calls = [];
  let release;
  installCifraConsent({ ...f, loadRuntime: () => new Promise(resolve => { release = resolve; }) });
  const pending = f.change({ analytics: true, marketing: false });
  await f.change({ analytics: false, marketing: false });
  release({ setConsent: value => calls.push(value) });
  await pending;
  assert.deepEqual(calls, [false]);
});

test('a later consent attempt can recover from a failed bootstrap', async () => {
  const f = fixture();
  let loads = 0;
  const calls = [];
  installCifraConsent({ ...f, loadRuntime: async () => { if (++loads === 1) throw new Error('503'); return { setConsent: value => calls.push(value) }; } });
  await f.change({ analytics: true, marketing: false });
  assert.deepEqual(calls, []);
  await f.change({ analytics: true, marketing: false });
  assert.equal(loads, 2);
  assert.deepEqual(calls, [true]);
});

test('preview and the calculator host do not receive the institutional integration', () => {
  for (const host of ['preview.pages.dev', 'app.cifrainssdeobras.com.br', 'cifrainssdeobras.com.br.evil.example']) {
    const f = fixture({ analytics: true, marketing: true }, host);
    let loads = 0;
    installCifraConsent({ ...f, loadRuntime: () => { loads++; } });
    assert.equal(loads, 0, host);
  }
});

test('an explicit revocation overrides stale storage when persistence fails', async () => {
  const f = fixture();
  const calls = [];
  installCifraConsent({ ...f, loadRuntime: async () => ({ setConsent: value => calls.push(value) }) });
  await f.change({ analytics: true, marketing: false });
  await f.emit({ analytics: false, marketing: false });
  assert.deepEqual(calls, [true, false]);
});

test('a module loaded after revocation respects the in-memory denial before reading stale storage', () => {
  const f = fixture({ analytics: true, marketing: true });
  f.window.__cifraConsent = { analytics: false, marketing: false };
  let loads = 0;
  installCifraConsent({ ...f, loadRuntime: () => { loads++; return Promise.resolve({ setConsent() {} }); } });
  assert.equal(loads, 0);
});
