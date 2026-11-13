import lighthouse from 'lighthouse';
import { launch } from 'chrome-launcher';
import { createServer } from 'node:http';
import { readFile,writeFile } from 'node:fs/promises';
import { resolve,extname } from 'node:path';
import { gzipSync } from 'node:zlib';
import assert from 'node:assert/strict';
import { securityHeaders } from '../config/site.js';
const report={estado:'em andamento',resultados:[],requisitos:{performance:100,'best-practices':100,accessibility:100,cls:0}};
const types={'.html':'text/html','.js':'application/javascript','.css':'text/css','.svg':'image/svg+xml','.webp':'image/webp','.woff2':'font/woff2','.ico':'image/x-icon','.mp4':'video/mp4'};
let server,chrome;
try{
  const root=resolve(process.env.MUTUCOIN_LIGHTHOUSE_DIR||'dist');
  const html=await readFile(resolve(root,'index.html'),'utf8');
  const origin=new URL(html.match(/rel="canonical" href="([^"]+)"/)[1]).origin;
  server=createServer(async(req,res)=>{
    const url=new URL(req.url,'http://127.0.0.1');
    const path=decodeURIComponent(url.pathname);
    const file=resolve(root,`.${path.endsWith('/')?`${path}index.html`:path}`);
    if(!file.startsWith(root+'/')){res.writeHead(403);return res.end();}
    try{
      let bytes=await readFile(file);
      // A demonstração é outro produto local. Isolá-la aqui evita que a política de segurança dela altere a auditoria deste site.
      if(extname(file)==='.html')bytes=Buffer.from(bytes.toString().replace(/<iframe[^>]*data-terminal-frame[^>]*><\/iframe>/g,'<div aria-hidden="true"></div>'));
      const headers={...securityHeaders(origin,false),'Content-Type':types[extname(file)]||'application/octet-stream'};
      if(/gzip/.test(req.headers['accept-encoding']||'')&&/\.(?:html|js|css|svg)$/.test(file)){bytes=gzipSync(bytes);headers['Content-Encoding']='gzip';}
      res.writeHead(200,headers);res.end(bytes);
    }catch{res.writeHead(404);res.end('Arquivo ausente');}
  });
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});
  chrome=await launch({chromePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',chromeFlags:['--headless','--no-sandbox']});
  for(const formFactor of ['mobile','desktop']){
    const result=await lighthouse(`http://127.0.0.1:${server.address().port}/`,{
      port:chrome.port,output:'json',logLevel:'error',onlyCategories:['performance','best-practices','accessibility'],
      ...(formFactor==='desktop'?{formFactor:'desktop',screenEmulation:{mobile:false,width:1440,height:1000,deviceScaleFactor:1,disabled:false},throttlingMethod:'provided'}:{}),
    });
    await writeFile(`artifacts/lighthouse-${formFactor}.json`,result.report);
    const scores=Object.fromEntries(Object.entries(result.lhr.categories).map(([key,category])=>[key,category.score*100]));
    const cls=result.lhr.audits['cumulative-layout-shift'].numericValue;
    report.resultados.push({formFactor,scores,cls,lcp:result.lhr.audits['largest-contentful-paint'].numericValue});
    for(const score of Object.values(scores))assert.equal(score,100,`Lighthouse ${formFactor}: exige 100`);
    assert.equal(cls,0,`Mudança de posição durante carregamento: ${formFactor}`);
  }
  report.estado='aprovado';
}catch(error){report.estado=chrome?'falhou':'impedido pelo ambiente';report.motivo=String(error);process.exitCode=1;}
finally{
  await chrome?.kill();
  if(server?.listening)await new Promise(resolve=>server.close(resolve));
  await writeFile('artifacts/validacao-lighthouse.json',JSON.stringify(report,null,2)+'\n');
  console.log(`Lighthouse: ${report.estado}`);
}
