import { themeBootstrap } from './theme.js';
import { faqEntries } from './blindagem.js';
import { leituraPublica } from './leitura-publica.js';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { languages, pages, languagePath } from './routes.js';
import { renderHeader, renderFooter, renderPage, titleKey, descKey } from './pages.js';
import { platformDictionary } from './plataforma.js';
import { publicPreview, publicLinks, previewLabels } from './public-preview.js';
export { languages, pages, languagePath };
export const dictionaries = Object.fromEntries(languages.map((language) => [language, {
  ...JSON.parse(readFileSync(new URL(`../src/i18n/${language}.json`, import.meta.url), 'utf8')),
  ...platformDictionary(language),
  ...(publicPreview ? { local: previewLabels[language] } : {}),
}]));
export const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const jsonText = (data) => JSON.stringify(data).replace(/</g, '\\u003c');
export const runtimeCopy = (language) => jsonText(Object.fromEntries(Object.entries(dictionaries[language]).filter(([key]) => key.startsWith('video.') || key.startsWith('market.') || key.startsWith('menu.') || key.startsWith('reading.') || key.startsWith('motion.') || key.startsWith('theme.') || key.startsWith('orchestration.'))));
export function schema(language, origin, page = 'home') {
  const d = dictionaries[language], url = `${origin}${languagePath(language,page)}`;
  return jsonText({ '@context': 'https://schema.org', '@graph': [
    { '@type': 'Organization', '@id': `${origin}/#organization`, name: 'Mutucoin', legalName: d['legal.company'], taxID: '09.232.421/0001-12', url: origin,
      address: { '@type': 'PostalAddress', streetAddress: 'Rua Aguaçu, 171, Bloco E, Sala M17, Alphaville', addressLocality: 'Campinas', addressRegion: 'SP', postalCode: '13098-321', addressCountry: 'BR' } },
    { '@type': 'Service', '@id': `${url}#service`, name: d[titleKey(page)], description: d[descKey(page)], provider: { '@id': `${origin}/#organization` }, url },
    ...(page === 'home' ? [{ '@type': 'FAQPage', mainEntity: faqEntries.map(([question,answer]) => ({ '@type': 'Question', name: d[question], acceptedAnswer: { '@type': 'Answer', text: d[answer] } })) }] : []),
    { '@type': 'WebSite', '@id': `${origin}/#website`, name: 'Mutucoin', url: origin, inLanguage: languages },
    { '@type': 'WebPage', '@id': `${url}#page`, name: d[titleKey(page)], description: d[descKey(page)], url, inLanguage: language, isPartOf: { '@id': `${origin}/#website` } },
    { '@type': 'BreadcrumbList', '@id': `${url}#breadcrumb`, itemListElement: [
      { '@type': 'ListItem', position: 1, name: d['nav.home'], item: `${origin}${languagePath(language)}` },
      ...(page === 'home' ? [] : [{ '@type': 'ListItem', position: 2, name: d[`nav.${page}`], item: url }]),
    ] },
  ] });
}
export function securityHeaders(origin, publish) {
  // Os blocos application/json e application/ld+json são dados inertes, não código.
  // Só o inicializador de tema precisa de autorização para executar código inline.
  const hashes = [themeBootstrap].map((content) => `'sha256-${createHash('sha256').update(content).digest('base64')}'`);
  return {
    'Content-Security-Policy': ["default-src 'none'", `script-src 'self' ${[...new Set(hashes)].join(' ')}`, "script-src-attr 'none'", "style-src 'self'", "style-src-attr 'none'", "font-src 'self'", "img-src 'self' data:", "media-src 'self'", publicPreview ? "connect-src 'none'" : `connect-src ${leituraPublica.base}`, publicPreview ? 'frame-src https://demonstracao.mutucoin.xyz' : 'frame-src http://127.0.0.1:4180 https://s.tradingview.com https://www.tradingview-widget.com', "base-uri 'self'", "object-src 'none'", "form-action 'none'", "frame-ancestors 'none'"].join('; '),
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': publicPreview ? 'no-referrer' : 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'accelerometer=(), autoplay=(self), camera=(), display-capture=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), midi=(), payment=(), usb=(), browsing-topics=(), fullscreen=()',
    'Cache-Control': 'public, max-age=0, must-revalidate, no-transform',
    'X-Frame-Options': 'DENY',
    'X-Robots-Tag': 'noindex, nofollow, noarchive',
  };
}
export const headerFile = (headers) => `/*\n${Object.entries(headers).map(([key,value]) => `  ${key}: ${value}`).join('\n')}\n`;
export function renderHTML(html, language, origin, page = 'home') {
  const d = { ...dictionaries[language], 'meta.title': `${dictionaries[language][titleKey(page)]}${page === 'home' ? '' : ' | Mutucoin'}`, 'meta.description': dictionaries[language][descKey(page)] };
  const url = `${origin}${languagePath(language,page)}`;
  const translated = (key) => {
    const value = d[key];
    if (typeof value !== 'string' || !value.trim()) throw new Error(`Tradução ausente: ${language} / ${key}`);
    return escapeHTML(value);
  };
  html = html.replace('<!-- site:header -->', renderHeader(language,page))
    .replace('<!-- site:page -->', renderPage(language,page))
    .replace('<!-- site:footer -->', renderFooter(language,page));
  html = html.replace(/<html lang="[^"]*" dir="[^"]*">/, `<html lang="${language}" dir="${language === 'ar' ? 'rtl' : 'ltr'}">`);
  html = html.replace(/(<([\w-]+)\b[^>]*\bdata-i18n="([^"]+)"[^>]*>)[\s\S]*?(<\/\2>)/g, (_, open, tag, key, close) => `${open}${translated(key)}${close}`);
  html = html.replace(/<[^>]+data-i18n-(?:content|alt|aria-label|title)="[^"]+"[^>]*>/g, (tag) => {
    for (const [, attr, key] of tag.matchAll(/data-i18n-(content|alt|aria-label|title)="([^"]+)"/g)) {
      tag = tag.replace(new RegExp(`(?<![\\w-])${attr}="[^"]*"\\s*`), '');
      tag = tag.replace(/>$/, ` ${attr}="${translated(key)}">`);
    }
    return tag;
  });
  html = html.replace(/<option value="([^" ]+)"/g, (match, value) => `${match}${value === language ? ' selected' : ''}`);
  const locales = { 'pt-BR': 'pt_BR', en: 'en_US', es: 'es_ES', de: 'de_DE', it: 'it_IT', ja: 'ja_JP', ar: 'ar_AR' };
  const meta = (attr,key,value) => `<meta ${attr}="${key}" content="${escapeHTML(value)}">`;
  const tags = [
    `<link rel="canonical" href="${url}">`,
    ...[...languages,'x-default'].map((lang) => `<link rel="alternate" hreflang="${lang}" href="${origin}${languagePath(lang === 'x-default' ? 'pt-BR' : lang,page)}">`),
    meta('property','og:type','website'), meta('property','og:site_name','Mutucoin'), meta('property','og:title',d['meta.title']), meta('property','og:description',d['meta.description']), meta('property','og:url',url), meta('property','og:locale',locales[language]),
    ...languages.filter((lang) => lang !== language).map((lang) => meta('property','og:locale:alternate',locales[lang])),
    meta('property','og:image',`${origin}/img/mutucoin-social.webp`), meta('property','og:image:width','1200'), meta('property','og:image:height','630'), meta('property','og:image:alt',d['meta.title']),
    meta('name','twitter:card','summary_large_image'), meta('name','twitter:title',d['meta.title']), meta('name','twitter:description',d['meta.description']), meta('name','twitter:image',`${origin}/img/mutucoin-social.webp`), meta('name','twitter:image:alt',d['meta.title']),
    `<link rel="preload" href="/fonts/montserrat-latin.woff2" as="font" type="font/woff2" crossorigin>`,
    `<script type="application/ld+json">${schema(language,origin,page)}</script>`,
    `<script type="application/json" id="runtime-copy">${runtimeCopy(language)}</script>`,
  ];
  html = html.replace('<!-- theme:build -->', `<script data-theme-bootstrap>${themeBootstrap}</script>`).replace('<!-- seo:build -->', tags.join('\n'));
  return publicPreview ? publicLinks(html, language).replace('<html ', '<html data-public-preview="true" ') : html;
}
