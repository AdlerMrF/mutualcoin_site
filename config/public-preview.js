// A publicação institucional não inclui o painel nem conecta serviços operacionais.
// A versão completa continua disponível no ambiente local, sem alterar seus contratos.
export const publicPreview = process.env.MUTUCOIN_PUBLIC_PREVIEW === '1';
export const publicPage = (page, routes) => !routes[page].startsWith('app');

export const previewLabels = {
  'pt-BR': 'Prévia institucional · Em implantação',
  en: 'Institutional preview · In development',
  es: 'Vista institucional · En desarrollo',
  de: 'Institutionelle Vorschau · In Entwicklung',
  it: 'Anteprima istituzionale · In sviluppo',
  ja: '企業情報プレビュー · 開発中',
  ar: 'معاينة مؤسسية · قيد التطوير',
};

export function publicLinks(html, language) {
  const prefix = language === 'pt-BR' ? '' : `/${language}`;
  return html.replace(/href="\/(?:en\/|es\/|de\/|it\/|ja\/|ar\/)?app(?:\/[^"\s]*)?"/g,
    `href="${prefix}/contato/"`)
    .replace(/src="http:\/\/127\.0\.0\.1:4180\/\?embed=mutucoin"(?= data-terminal-frame)/g,
      'src="https://demonstracao.mutucoin.xyz/"')
    .replace(/href="http:\/\/127\.0\.0\.1:4180\/\?embed=mutucoin"(?= data-terminal-link)/g,
      'href="https://demonstracao.mutucoin.xyz/"')
    .replace(/<video\b([^>]*)>[\s\S]*?<\/video>/g, (_,attrs) => {
      const poster = attrs.match(/poster="([^"]+)"/)?.[1];
      if (!poster) throw new Error('Mídia institucional sem cartaz local.');
      return `<img class="preview-story-image" src="${poster}" alt="" width="1080" height="1920" loading="lazy" decoding="async">`;
    })
    .replace(/<div class="story-controls">[\s\S]*?<\/div>/g,'');
}
