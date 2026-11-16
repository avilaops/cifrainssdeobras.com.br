import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolveRoute } from '../out/measurement/core.mjs';

test('the published CIFRA inventory admits real pages and rejects arbitrary private references', async () => {
  const config = JSON.parse(await readFile(new URL('../out/measurement/sites.json', import.meta.url)));
  const site = config.sites.find(site => site.domain === 'cifrainssdeobras.com.br');
  assert.ok(site.publicPaths.length > 1);
  assert.equal(resolveRoute(config, 'https://cifrainssdeobras.com.br/').measurementId, 'G-4BWJR3WMMR');
  assert.equal(resolveRoute(config, 'https://cifrainssdeobras.com.br/404'), null);
  assert.equal(resolveRoute(config, 'https://cifrainssdeobras.com.br/cliente/CLIENTE-PRIVATE'), null);
  assert.equal(resolveRoute(config, 'https://app.cifrainssdeobras.com.br/'), null);
});
