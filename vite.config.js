import { defineConfig, loadEnv } from 'vite';
import { languages, pages, languagePath, renderHTML, securityHeaders, headerFile } from './config/site.js';
import { resolvePath } from './config/routes.js';
import { publicPreview, publicPage } from './config/public-preview.js';

export default defineConfig(({ mode }) => {
  const env = { ...loadEnv(mode, process.cwd(), ''), ...process.env };
  if (env.VITE_PUBLICAR === '1') throw new Error('Esta versão é exclusivamente local e permanece bloqueada para indexação.');
  const origin = (env.VITE_SITE_URL || 'https://mutucoin.local.invalid').replace(/\/$/, '');
  const siteURL = new URL(origin);
  if (siteURL.protocol !== 'https:' || siteURL.pathname !== '/' || siteURL.search || siteURL.hash) throw new Error('VITE_SITE_URL deve conter apenas a origem HTTPS do site.');
  const headers = securityHeaders(origin, false);
  return {
    base: '/',
    preview: { host: '127.0.0.1', headers },
    // lp-app/index.html: página experimental adaptada do template 8B; fica fora da prévia pública.
    build: { assetsInlineLimit: 0, rollupOptions: { input: publicPreview ? { main: 'index.html' } : { main: 'index.html', lpApp: 'lp-app/index.html' } }, modulePreload: { polyfill: !publicPreview, resolveDependencies: (file, deps) => deps.filter((dep) => !dep.includes('animations')) } },
    plugins: [{
      name: 'mutucoin-static-pages-languages-seo',
      enforce: 'post',
      // Os dicionários e páginas são lidos uma vez pela configuração; ao mudarem, o servidor reinicia para não servir cópia antiga.
      configureServer(server) {
        server.watcher.add(['src/i18n', 'config']);
        server.watcher.on('change', (file) => { if (/[\\/](src[\\/]i18n|config)[\\/]/.test(file)) server.restart(); });
      },
      transformIndexHtml: {
        order: 'pre',
        handler(html, context) {
          if (publicPreview) html = html.replace('src="/index.js"', 'src="/src/public-preview.js"');
          if (!context.server) return html;
          const requestURL = new URL(context.originalUrl || '/', 'http://127.0.0.1');
          const { language, page } = resolvePath(requestURL.pathname);
          return page ? renderHTML(html, language, origin, page) : html;
        },
      },
      generateBundle(options, bundle) {
        const template = bundle['index.html'].source;
        for (const language of languages) for (const page of Object.keys(pages)) {
          if (publicPreview && !publicPage(page,pages)) continue;
          const fileName = `${languagePath(language,page).slice(1)}index.html`;
          const source = renderHTML(template, language, origin, page);
          if (fileName === 'index.html') bundle['index.html'].source = source;
          else this.emitFile({ type: 'asset', fileName, source });
        }
        const files = {
          '_headers': headerFile(headers),
          'robots.txt': 'User-agent: *\nDisallow: /\n',
          'sitemap.xml': `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${Object.keys(pages).flatMap((page) => languages.map((language) => `<url><loc>${origin}${languagePath(language,page)}</loc>${[...languages,'x-default'].map((lang) => `<xhtml:link rel="alternate" hreflang="${lang}" href="${origin}${languagePath(lang === 'x-default' ? 'pt-BR' : lang,page)}"/>`).join('')}</url>`)).join('\n')}</urlset>\n`,
        };
        if (publicPreview) {
          files['sitemap.xml'] = files['sitemap.xml'].replace(/<url><loc>[^<]*\/(?:en\/|es\/|de\/|it\/|ja\/|ar\/)?app(?:\/|<)[\s\S]*?<\/url>/g, '');
          files['404.html'] = '<!doctype html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width"><meta name="robots" content="noindex, nofollow, noarchive"><title>Página indisponível | Mutucoin</title></head><body><main><h1>404</h1><p>Esta página não está disponível nesta versão institucional.</p><a href="/">Voltar para a Mutucoin</a></main></body></html>';
        }
        for (const [fileName, source] of Object.entries(files)) {
          if (bundle[fileName]) bundle[fileName].source = source;
          else this.emitFile({ type: 'asset', fileName, source });
        }
      },
    }],
  };
});
