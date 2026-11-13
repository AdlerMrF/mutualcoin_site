// Inventário editorial da rodada portas e catálogo. Não habilita operações.
export const catalogue = [
  ['accounts','contas-globais','app-carteira-multi-rede'],
  ['vault','guarda-segregada','app-carteira'],
  ['liquidity','liquidez','app-cotacao'],
  ['payments','pagamentos-globais','app-checkout'],
  ['exchange','exchange','app-mtcswap'],
  ['wealth','wealth','contact'],
  ['institutional','produtos-institucionais','app-white-label'],
  ['ramp','on-off-ramp','app-checkout'],
  ['treasury','tesouraria-global','app-controle'],
  ['api','api','app-documentacao'],
].map(([id,slug,module])=>({id,slug,module,page:`service-${id}`}));
export const useCases = [
  ['trade','importacao-exportacao',['accounts','liquidity','payments']],
  ['logistics','logistica',['accounts','payments','treasury']],
  ['fintech','fintechs-psps',['api','ramp','payments']],
  ['commerce','e-commerce-internacional',['exchange','accounts','treasury']],
  ['agro','agro-commodities',['liquidity','ramp','payments']],
  ['treasury','tesouraria-stablecoin',['treasury','vault','exchange']],
].map(([id,slug,resources])=>({id,slug,resources,page:`case-${id}`}));
export const paymentRails = [
  ['pix','Pix','BRL'],['spei','SPEI','MXN'],['cvu','CVU','ARS'],
  ['bre-b','Bre-B / Nequi','COP'],['yape','Yape / CCI','PEN'],
  ['usd','USD','USD'],['eur','EUR','EUR'],['cnh','CNH','CNH'],
  ['tron','TRON','USDT · USDC · BTC'],['ethereum','Ethereum','USDT · USDC · BTC'],
  ['solana','Solana','USDT · USDC · BTC'],['polygon','Polygon','USDT · USDC · BTC'],
].map(([id,name,assets])=>({id,name,assets}));
// Cripto: ativo/rede compatíveis são confirmados com o parceiro, sem sugerir
// que todo ativo existe nativamente em todas as redes.
const item=(id,page,hash='')=>({id,page,hash});
export const audiences = [
  {id:'personal',slug:'para-voce',services:['accounts','exchange','wealth'],items:[
    item('wallet','app-carteira-multi-rede'),item('swap','app-mtcswap'),
    item('international','service-payments'),item('miles','app-milhas'),item('private','service-wealth'),
  ],extra:['prices','app-explorer','app']},
  {id:'business',slug:'para-sua-empresa',services:['treasury','payments','ramp','accounts','institutional','api'],items:[
    item('otc','hub'),item('accounts','service-accounts'),item('vault','service-vault'),
    item('liquidity','service-liquidity'),item('treasury','service-treasury'),item('exchange','service-exchange'),
    item('ramp','service-ramp'),item('tokenization','app-tokenizar'),item('institutional','service-institutional'),
  ],extra:['app-cartorio','app-contratos','app-compliance','app-pessoa','app-hub','app-documentacao','services','app']},
  {id:'partners',slug:'seja-nosso-parceiro',services:['institutional','api','liquidity'],items:[
    item('join','partners','join'),item('fintech','case-fintech'),item('institutions','service-institutional'),
    item('corporates','partners','corporates'),item('brokers','partners','brokers'),
    item('wealth','service-wealth'),item('developers','service-api'),
  ],extra:['app-white-label','app-webhooks','app-api-v1','app-documentacao','services']},
  {id:'structure',slug:'nossa-estrutura',services:['liquidity','vault'],items:[
    item('about','blockchain'),item('security','structure','security'),item('governance','governance'),
    item('explorer','app-explorer'),item('faq','home','faq'),
  ],extra:['ecosystem','onchain','wallets','status','vasp','app-dashboard','app-fatos-rede','app']},
];
export const audiencePages = Object.fromEntries(audiences.map(a=>[a.id,a.slug]));
export const homeSectionsByAudience = {
  personal:[['servicos-mutual','enterprise.services.title'],['demonstracao','enterprise.demo.title']],
  business:[['setores','enterprise.sectors.title'],['servicos-mutual','enterprise.services.title'],['cobertura-global','enterprise.coverage.title'],['protecao','enterprise.security.title']],
  partners:[['servicos-mutual','enterprise.services.title'],['responsabilidades','enterprise.roles.title'],['jornada','enterprise.journey.title'],['contato','contact.title']],
  structure:[['hero','enterprise.title'],['demonstracao','enterprise.demo.title'],['arquitetura','enterprise.layers.title'],['transparencia','enterprise.trust.title'],['faq','shield.faq.title']],
};
export const cataloguePages = Object.fromEntries(catalogue.map(s=>[s.page,`servicos/${s.slug}`]));
export const casePages = Object.fromEntries(useCases.map(c=>[c.page,`casos-de-uso/${c.slug}`]));
