import { readdir, readFile, writeFile } from 'node:fs/promises';

const out = new URL('../out/', import.meta.url);
const configUrl = new URL('measurement/sites.json', out);
const config = JSON.parse(await readFile(configUrl, 'utf8'));
const site = config.sites.find(site => site.domain === 'cifrainssdeobras.com.br');
if (!site) throw new Error('CIFRA measurement configuration missing');
const files = (await readdir(out, { recursive: true })).map(path => path.replaceAll('\\', '/'));
site.publicPaths = files.filter(path => path.endsWith('.html') && path !== '404.html' && path !== '404/index.html').map(path => '/' + path.replace(/(?:^|\/)index\.html$/, '').replace(/\.html$/, '')).sort();
if (!site.publicPaths.includes('/')) throw new Error('Public root missing');
await writeFile(configUrl, JSON.stringify(config, null, 2) + '\n');
console.log('Medição CIFRA • ' + site.publicPaths.length + ' rotas públicas verificadas no build');
