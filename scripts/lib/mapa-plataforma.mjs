// Extrai apenas o inventário público; não copia observações, exemplos de credenciais ou dados pessoais.
export function parseMapa(markdown) {
  const section = (start, end) => {
    const from = markdown.indexOf(start), to = markdown.indexOf(end, from + start.length);
    if (from < 0 || to < 0) throw new Error(`Seção ausente no mapa: ${start}`);
    return markdown.slice(from, to);
  };
  const abas = [...section('### 3.1 ', '### 3.2 ').matchAll(/^\| `([^`]+)`[^|]*\| \*\*([^*]+)\*\*([^\n]+)$/gm)]
    .map(([, id, nome, row]) => ({ id, nome, move_valor: /\*\*SIM/.test(row.split('|').at(-2)) }));
  const modulos = [...section('### 3.3 ', '## 4. ').matchAll(/^\| ([^|]+) \| ([^|]+) \| ✅/gm)]
    .map(([, nome, tabs]) => ({ nome: nome.trim(), abas: [...tabs.matchAll(/`([^`]+)`/g)].map(([, id]) => id) }));
  const rotas = [...section('### 3.2 ', '### 3.3 ').matchAll(/^\| ([^|]+) \|/gm)]
    .flatMap(([, cell]) => [...cell.matchAll(/`(\/[^`]*)`/g)].map(([, route]) => route))
    .filter(route => !/\.(?:js|css|svg)(?:\?|$)/.test(route));
  const extras = [...section('## 4. ', '## 5. ').matchAll(/^(\d+)\. (.+)$/gm)]
    .map(([, id, line]) => ({ id: Number(id), nome: [...line.matchAll(/\*\*([^*]+)\*\*/g)].map(([, value]) => value).filter(value => !/Não tem aba/.test(value)).join(' · ') }));
  const endpoints = [...new Set([...section('## 2. ', '## 3. ').matchAll(/^\| (GET|POST|PUT|DELETE|ANY|\(vários\)) \| `([^`]+)`/gm)]
    .map(([, method, path]) => `${method} ${path}`))];
  if (abas.length !== 15 || rotas.length !== 6 || modulos.length !== 14 || extras.length !== 12 || endpoints.length < 100) {
    throw new Error(`Inventário do mapa inesperado: ${abas.length} abas, ${rotas.length} rotas, ${modulos.length} módulos, ${extras.length} itens adicionais, ${endpoints.length} endpoints. Revise a fonte.`);
  }
  return { fonte: '../mutucoin-api-mapa.md', data: '2026-10-28', abas, rotas, modulos, extras, endpoints };
}
