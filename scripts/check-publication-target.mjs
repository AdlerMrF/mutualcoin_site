import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const policy = JSON.parse(readFileSync(new URL('../config/publication-policy.json', import.meta.url), 'utf8'));
const expected = {
  repository: 'https://github.com/Mutual-Capital/mutucoin-site.git',
  branch: 'main',
  cloudflareAccountId: '14aeea46282365ca4559b74416191550',
  cloudflarePagesProject: 'mutucoin-institucional',
  publicOrigin: 'https://mutucoin.xyz',
  publicDirectory: 'dist-public',
  legacySourceUse: 'historical-reference-only',
  googleCloudDeployment: false,
  newPaidSubscriptions: false,
};
for (const [key,value] of Object.entries(expected)) assert.equal(policy[key],value,`Destino de publicação não autorizado: ${key}`);
const git = (...args) => execFileSync('git',args,{encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();
const remote = git('remote','get-url','origin');
const accepted = [policy.repository,'https://github.com/Mutual-Capital/mutucoin-site','git@github.com:Mutual-Capital/mutucoin-site.git'];
assert.ok(accepted.includes(remote),'A origem do código deve ser o GitHub Mutual-Capital/mutucoin-site.');
assert.equal(git('remote'),'origin','Manter somente o endereço oficial como remoto operacional.');
for (const args of [['--all'],['--push','--all']]) {
  for (const address of git('remote','get-url',...args,'origin').split('\n')) {
    assert.ok(accepted.includes(address),'Endereço de leitura ou envio fora do repositório oficial.');
  }
}
if (process.argv.includes('--release')) {
  assert.equal(git('branch','--show-current'),policy.branch,'Publicar somente a versão principal já enviada ao GitHub.');
  assert.equal(git('status','--porcelain'),'','Há alterações locais ainda não registradas.');
  const head = git('rev-parse','HEAD');
  const published = git('ls-remote','--exit-code','origin',`refs/heads/${policy.branch}`).split(/\s+/)[0];
  assert.equal(head,published,'A versão local ainda não corresponde à versão principal no GitHub.');
}
console.log(JSON.stringify({estado:'aprovado',repositorio:policy.repository,conta:policy.cloudflareAccountName,projeto:policy.cloudflarePagesProject,dominio:policy.publicOrigin},null,2));
