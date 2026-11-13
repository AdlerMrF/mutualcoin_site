import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { pages as routes, languages } from '../config/routes.js';
import { publicPage } from '../config/public-preview.js';

const root = resolve('dist-public');
const restricted = /cust\u00f3d|cust\u006fd|self[- ]cust|Verwahrung|Verwahrungs|カストディ|حفظ الأصول/i;
const files = [];
async function walk(dir) {
  for (const name of await readdir(dir)) {
    const path = join(dir,name);
    if ((await stat(path)).isDirectory()) await walk(path); else files.push(path);
  }
}
await walk(root);
const headers = await readFile(join(root,'_headers'),'utf8');
for (const rule of ["connect-src 'none'", 'frame-src https://demonstracao.mutucoin.xyz', "form-action 'none'", "frame-ancestors 'none'", "script-src-attr 'none'", 'X-Content-Type-Options: nosniff', 'X-Robots-Tag: noindex, nofollow, noarchive']) assert.ok(headers.includes(rule),rule);
assert.ok(!/unsafe-inline|unsafe-eval/.test(headers));
assert.ok((await readFile(join(root,'robots.txt'),'utf8')).includes('Disallow: /'));
assert.ok(!/<loc>[^<]*\/app(?:\/|<)/.test(await readFile(join(root,'sitemap.xml'),'utf8')));
let pages = 0;
let terminalFrames = 0;
for (const path of files.filter(p=>p.endsWith('.html'))) {
  const relative = path.slice(root.length).replaceAll('\\','/');
  assert.ok(!/^\/(?:en\/|es\/|de\/|it\/|ja\/|ar\/)?app(?:\/|$)/.test(relative));
  const html = await readFile(path,'utf8');
  assert.ok(html.includes('noindex, nofollow, noarchive'),relative);
  assert.equal([...html.matchAll(/<h1\b/g)].length,1,relative);
  assert.ok(!/<form\b|type="password"|<video\b|\.mp4|\son\w+=|<[^>]+\sstyle=|<style\b/.test(html),relative);
  assert.ok(!/127\.0\.0\.1|localhost/.test(html),relative);
  const frames = [...html.matchAll(/<iframe\b[^>]*>/g)].map(match=>match[0]);
  for (const frame of frames) {
    assert.ok(frame.includes('src="https://demonstracao.mutucoin.xyz/"'),relative);
    assert.ok(frame.includes('sandbox="allow-scripts allow-same-origin"'),relative);
    terminalFrames++;
  }
  assert.ok(!/href="\/(?:en\/|es\/|de\/|it\/|ja\/|ar\/)?app(?:\/|"|#)/.test(html),relative);
  assert.ok(!/undefined|\{\{|<!-- (?:site|seo):/.test(html),relative);
  const withoutNotice = html.replace(/<section id="aviso-legal"[\s\S]*?<\/section>/g,'');
  assert.ok(!restricted.test(withoutNotice),`Posicionamento fora do aviso legal: ${relative}`);
  if (relative !== '/404.html') {
    assert.ok(html.includes('data-public-preview="true"'),relative);
    assert.ok(html.includes('https://mutucoin.xyz'),relative);
  }
  for (const [,href] of html.matchAll(/href="(\/[^"#?]*)[^"]*"/g)) {
    if (href.startsWith('//')) throw new Error('Endereço externo sem protocolo');
    const file = resolve(root,`.${href.endsWith('/') ? `${href}index.html` : href}`);
    assert.ok(file.startsWith(root+'/'));
    await stat(file);
  }
  pages++;
}
for (const path of files.filter(p=>p.endsWith('.js'))) {
  const js = await readFile(path,'utf8');
  assert.ok(!/api\.mutucoin\.net|s\.tradingview\.com|\bfetch\s*\(|new WebSocket|sendBeacon|\beval\s*\(/.test(js),path);
}
for (const path of files.filter(p=>p.endsWith('.css'))) {
  const css = await readFile(path,'utf8');
  assert.ok(!/@import[^;]+https?:|url\(['"]?https?:/.test(css),path);
}
assert.ok(files.some(p=>p.endsWith('/404.html')));
assert.equal(pages,languages.length * Object.keys(routes).filter(p=>publicPage(p,routes)).length + 1);
assert.equal(terminalFrames,languages.length);
console.log(JSON.stringify({estado:'aprovado',paginas:pages,arquivos:files.length,operacoesFinanceiras:false,consultasExternas:false,indexacao:false},null,2));
