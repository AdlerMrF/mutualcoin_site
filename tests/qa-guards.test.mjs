import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('molduras sem vídeo não interrompem as animações da página', () => {
  const source = readFileSync('src/videos.js', 'utf8');
  assert.match(source, /if \(!video \|\| !button\) return \[\]/);
});
import { mkdtemp,writeFile,rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { validateState,createLinkChecker,widths,themes } from '../scripts/lib/qa-guards.mjs';
import { languages } from '../config/routes.js';
const good={errors:[],csp:[],text:'Conteúdo válido',translationKeys:['title'],untranslated:[],width:360,scrollWidth:360,overflow:[],violations:[]};
for(const width of widths)for(const language of languages)for(const theme of themes){
  test(`guardas reprovam defeitos: ${width}/${language}/${theme}`,()=>{
    const state={...good,width,scrollWidth:width};
    validateState(state,{title:'Tradução'});
    for(const mutation of [
      {errors:['Erro de console']},{csp:['script-src']},
      {text:'undefined'},{text:'NaN'},{text:'{{title}}'},{text:'shield.faq.title'},
      {text:'catalog.title'},{text:'audience.business.title'},{text:'case.trade.title'},
      {text:'safety.pending'},{text:'orchestration.pause'},{text:'mega.security.title'},
      {text:'partners.issuers.title'},
      {translationKeys:['ausente']},{untranslated:['title']},
      {scrollWidth:width+2},{overflow:['botão']},
      {violations:[{id:'color-contrast'}]},
    ])assert.throws(()=>validateState({...state,...mutation},{title:'Tradução'}));
  });
}
test('links ausentes e âncoras quebradas reprovam de fato',async()=>{
  const directory=await mkdtemp(join(tmpdir(),'mutucoin-qa-'));
  try{
    await writeFile(join(directory,'index.html'),'<h1 id="presente">Título</h1>');
    const check=createLinkChecker(directory,'https://mutucoin.local.invalid');
    await check('/#presente','/');
    await assert.rejects(check('/ausente/','/'),/Link interno quebrado/);
    await assert.rejects(check('/#ausente','/'),/Seção ausente/);
  }finally{await rm(directory,{recursive:true,force:true});}
});
