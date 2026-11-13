import { plataforma, platformPage } from './plataforma.js';
import { audiencePages, cataloguePages, casePages } from './audiences.js';
export const languages = ['pt-BR', 'en', 'es', 'de', 'it', 'ja', 'ar'];
export const navigationPages = {
  home: '',
  onchain: 'relatorios-on-chain',
  wallets: 'comprovacao-de-carteiras',
  blockchain: 'global-blockchain',
  vasp: 'vasp',
  hub: 'trading',
  ecosystem: 'ecossistema',
  status: 'estado',
  prices: 'cotacao',
  contact: 'contato',
  governance: 'governanca-e-conformidade',
  services: 'servicos',
  enterprise: 'infraestrutura-empresarial',
  app: 'app',
};
export const pages = {
  ...navigationPages,
  ...audiencePages,
  ...cataloguePages,
  ...casePages,
  ...Object.fromEntries(plataforma.map(item => [platformPage(item), item.rota.replace(/^\/|\/$/g, '')])),
};
export const languagePath = (language, page = 'home') =>
  `/${language === 'pt-BR' ? '' : `${language}/`}${pages[page] ? `${pages[page]}/` : ''}`;
export function resolvePath(pathname) {
  const parts = pathname.split('/').filter(Boolean);
  if (parts.at(-1) === 'index.html') parts.pop();
  const language = languages.includes(parts[0]) ? parts.shift() : 'pt-BR';
  const page = Object.keys(pages).find((key) => pages[key] === parts.join('/'));
  return { language, page };
}
