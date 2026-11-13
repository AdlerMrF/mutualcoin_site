import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { audiences, catalogue, useCases, paymentRails } from '../config/audiences.js';
import { languages, dictionaries, renderHTML, languagePath } from '../config/site.js';
import { resolvePath } from '../config/routes.js';
import { initAudienceNavigation, initCircuitMotion } from '../src/audience-navigation.js';

const template=readFileSync('index.html','utf8');
test('quatro portas e seis percursos completos, com disponibilidade por parceiro',()=>{
  assert.equal(audiences.length,4);assert.equal(useCases.length,6);
  for(const language of languages){
    for(const item of [...catalogue,...useCases])assert.deepEqual(resolvePath(languagePath(language,item.page)),{language,page:item.page});
    for(const c of useCases){
      const html=renderHTML(template,language,'https://mutucoin.local.invalid',c.page);
      const main=html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)[1];
      for(const key of ['safety.pending','catalog.partner','catalog.timing','catalog.illustration'])assert.ok(main.includes(dictionaries[language][key]));
      assert.equal([...main.matchAll(/data-availability="available"/g)].length,paymentRails.length);
      assert.equal([...main.matchAll(/class="flow-node"/g)].length,4);
      assert.ok(main.includes('class="circuit-pulse"'),'Mesmo componente de trilhas na orquestração e nos casos');
      assert.ok(main.includes(`href="${languagePath(language,'contact')}"`));
    }
    for(const key of ['catalog.specialist','case.cta','safety.pending','case.trade.pain1']){
      const original=dictionaries[language][key];
      try{delete dictionaries[language][key];assert.throws(()=>renderHTML(template,language,'https://mutucoin.local.invalid','case-trade'),/Tradução ausente/);}
      finally{dictionaries[language][key]=original;}
    }
  }
});

// Ambiente mínimo de eventos: exercita o controlador real sem substituir o navegador.
class Element {
  constructor(id='',type='div'){this.id=id;this.type=type;this.attrs={};this.children=[];this.handlers={};this.hidden=false;this.dataset={};this.textContent='';this.classes=new Set();this.classList={contains:name=>this.classes.has(name)};}
  append(...children){for(const child of children){child.parent=this;this.children.push(child);}return this;}
  addEventListener(name,handler){(this.handlers[name]??=[]).push(handler);}
  fire(name,props={}){const event={target:this,detail:1,preventDefault(){this.prevented=true;},stopImmediatePropagation(){this.stopped=true;},...props};for(const handler of this.handlers[name]??[]){handler(event);if(event.stopped)break;}return event;}
  setAttribute(key,value){this.attrs[key]=value;}
  getAttribute(key){return this.attrs[key];}
  contains(target){return this===target||this.children.some(child=>child.contains(target));}
  all(){return this.children.flatMap(child=>[child,...child.all()]);}
  querySelectorAll(selector){if(selector==='a')return this.all().filter(e=>e.type==='a');return this.all().filter(e=>['a','button','summary','select'].includes(e.type));}
  querySelector(selector){return this.all().find(e=>selector==='.audience-trigger'?e.trigger:selector==='[data-close-door]'?e.close:e.toggle);}
  getClientRects(){return this.hidden||this.parent?.getClientRects().length===0?[]:[{}];}
  closest(){return this.desktop?{}:null;}
  focus(){document.activeElement=this;}
}
function globals(values,run){
  const descriptors=Object.fromEntries(Object.keys(values).map(k=>[k,Object.getOwnPropertyDescriptor(globalThis,k)]));
  try{Object.assign(globalThis,values);run();}finally{for(const [key,descriptor] of Object.entries(descriptors)){if(descriptor)Object.defineProperty(globalThis,key,descriptor);else delete globalThis[key];}}
}
function navigationFixture(){
  const doc=new Element('document'),win=new Element('window'),mobile=new Element('mobile-menu'),mobileButton=new Element('mobile-menu-button','button');mobile.classes.add('hidden');
  const doors=audiences.map(a=>{
    const door=new Element(a.id);door.desktop=true;
    const trigger=new Element(`${a.id}-trigger`,'button');trigger.trigger=true;trigger.setAttribute('aria-controls',a.id+'-panel');
    const panel=new Element(a.id+'-panel');panel.hidden=true;
    const first=new Element(a.id+'-first','a'),middle=new Element(a.id+'-middle','a'),last=new Element(a.id+'-last','button');last.close=true;
    door.append(trigger,panel.append(first,middle,last));return {door,trigger,panel,first,middle,last};
  });
  doc.append(mobile,mobileButton,...doors.map(d=>d.door));
  doc.querySelectorAll=()=>doors.map(d=>d.door);
  doc.getElementById=id=>doc.all().find(el=>el.id===id);
  return {doc,win,mobile,mobileButton,doors};
}
test('menu real: clique, passagem do ponteiro, foco circular, Esc, fechamento e acordeão',()=>{
  const f=navigationFixture();
  globals({document:f.doc,window:f.win,getComputedStyle:()=>({visibility:'visible'})},()=>{
    initAudienceNavigation();
    for(const {door,trigger,panel,first,middle,last} of f.doors){
      trigger.focus();trigger.fire('click',{detail:0});
      assert.equal(trigger.getAttribute('aria-expanded'),'true');assert.equal(panel.hidden,false);assert.equal(document.activeElement,first);
      last.focus();assert.ok(document.fire('keydown',{key:'Tab'}).prevented);assert.equal(document.activeElement,first);
      assert.ok(document.fire('keydown',{key:'Tab',shiftKey:true}).prevented);assert.equal(document.activeElement,last);
      middle.focus();assert.ok(!document.fire('keydown',{key:'Tab'}).prevented);
      document.fire('keydown',{key:'Escape'});assert.equal(panel.hidden,true);assert.equal(document.activeElement,trigger);
      door.fire('pointerenter',{pointerType:'mouse'});assert.equal(panel.hidden,false);
      trigger.fire('click');assert.equal(panel.hidden,false,'Clique após hover mantém o painel aberto');
      last.fire('click');assert.equal(panel.hidden,true);assert.equal(document.activeElement,trigger);
      trigger.fire('keydown',{key:'ArrowDown'});assert.equal(document.activeElement,first);
      trigger.fire('keydown',{key:'ArrowUp'});assert.equal(document.activeElement,last);
      f.win.fire('resize');assert.equal(panel.hidden,true);
      door.desktop=false;door.fire('pointerenter',{pointerType:'mouse'});assert.equal(panel.hidden,true,'Celular abre por toque');
      trigger.fire('click');assert.equal(panel.hidden,false);
      document.fire('click',{target:f.mobileButton});assert.equal(panel.hidden,true);
    }
    f.doors[0].trigger.fire('click');f.doors[1].trigger.fire('click');
    assert.equal(f.doors[0].panel.hidden,true);assert.equal(f.doors[1].panel.hidden,false,'Somente um grupo aberto');
    f.mobileButton.fire('click');
    f.mobile.classes.delete('hidden');
    const first=new Element('mobile-first','button'),last=new Element('mobile-last','a');f.mobile.append(first,last);
    f.mobileButton.focus();document.fire('keydown',{key:'Tab'});assert.equal(document.activeElement,first);
    first.focus();document.fire('keydown',{key:'Tab',shiftKey:true});assert.equal(document.activeElement,last);
    last.focus();document.fire('keydown',{key:'Tab'});assert.equal(document.activeElement,first);
  });
});

test('animação real respeita pausa, saída da tela, aba oculta e movimento reduzido nos sete idiomas',()=>{
  for(const language of languages)for(const reduce of [false,true]){
    const doc=new Element('document'),figure=new Element('figure'),button=new Element('button','button');button.toggle=true;figure.append(button);
    const copy=new Element('runtime-copy');copy.textContent=JSON.stringify(dictionaries[language]);
    doc.getElementById=()=>copy;doc.querySelectorAll=()=>[figure];doc.hidden=false;
    const preference=new Element('preference');preference.matches=reduce;let intersect;
    globals({document:doc,matchMedia:()=>preference,IntersectionObserver:class{constructor(callback){intersect=callback;}observe(){}}},()=>{
      initCircuitMotion();assert.equal(figure.dataset.playing,'false');
      intersect([{isIntersecting:true}]);assert.equal(figure.dataset.playing,String(!reduce));
      assert.equal(button.textContent,dictionaries[language][reduce?'orchestration.play':'orchestration.pause']);
      button.fire('click');assert.equal(figure.dataset.playing,'false');
      button.fire('click');assert.equal(figure.dataset.playing,String(!reduce));
      doc.hidden=true;doc.fire('visibilitychange');assert.equal(figure.dataset.playing,'false');
      doc.hidden=false;doc.fire('visibilitychange');assert.equal(figure.dataset.playing,String(!reduce));
      intersect([{isIntersecting:false}]);assert.equal(figure.dataset.playing,'false');
      preference.matches=true;preference.fire('change');intersect([{isIntersecting:true}]);assert.equal(figure.dataset.playing,'false');
    });
  }
});
