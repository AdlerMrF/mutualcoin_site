import configuracao from './leitura-publica.json' with { type: 'json' };

export function origemPublica(base) {
  const url = new URL(base);
  if (url.protocol !== 'https:' || url.username || url.password || url.pathname !== '/' || url.search || url.hash) {
    throw new Error('A base da consulta pública deve ser somente uma origem HTTPS, sem credenciais.');
  }
  return url.origin;
}
export const leituraPublica = Object.freeze({ ...configuracao, base: origemPublica(configuracao.base),
  caminhos: Object.freeze(configuracao.caminhos.map(item => Object.freeze({ ...item }))),
});
