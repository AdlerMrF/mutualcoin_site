// As imagens continuam visiveis sem JS; observacao so controla a flutuacao e o blur.
export function initValidatedScenes(){
 const scenes=[...document.querySelectorAll('.validated-art')];
 if(!scenes.length)return;
 const visible=new Map();
 const update=()=>scenes.forEach(scene=>scene.classList.toggle('is-visible',visible.get(scene)===true&&!document.hidden));
 if('IntersectionObserver' in window){
  const observer=new IntersectionObserver(entries=>{entries.forEach(e=>visible.set(e.target,e.isIntersecting));update();},{threshold:.1});
  scenes.forEach(scene=>observer.observe(scene));
 }
 let stopTimer,previousY=scrollY;
 const stop=()=>document.documentElement.classList.remove('is-validated-scrolling');
 addEventListener('scroll',()=>{
  if(scrollY===previousY)return;
  previousY=scrollY;
  if(![...visible.values()].some(Boolean))return;
  document.documentElement.classList.add('is-validated-scrolling');
  clearTimeout(stopTimer);stopTimer=setTimeout(stop,100);
 },{passive:true});
 document.addEventListener('visibilitychange',()=>{update();if(document.hidden){clearTimeout(stopTimer);stop();}});
}
