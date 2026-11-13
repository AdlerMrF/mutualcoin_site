const focusable = root => [...root.querySelectorAll('a[href],button:not([disabled]),summary,select')].filter(el=>el.getClientRects().length && getComputedStyle(el).visibility!=='hidden');

export function initAudienceNavigation(){
  const doors=[...document.querySelectorAll('[data-audience-door]')];
  let active=null;
  function close(restore=false){
    if(!active)return;
    const {panel,trigger}=active;
    panel.hidden=true;
    trigger.setAttribute('aria-expanded','false');
    active=null;
    if(restore)trigger.focus();
  }
  function open(door,keyboard=false,hovered=false){
    const trigger=door.querySelector('.audience-trigger'),panel=document.getElementById(trigger.getAttribute('aria-controls'));
    if(active?.trigger===trigger){if(keyboard)focusable(panel)[0]?.focus();return;}
    keyboard ||= Boolean(active?.panel.contains(document.activeElement));
    close();
    panel.hidden=false;trigger.setAttribute('aria-expanded','true');active={door,trigger,panel,hovered};
    if(keyboard)focusable(panel)[0]?.focus();
  }
  doors.forEach(door=>{
    const trigger=door.querySelector('.audience-trigger');
    trigger.addEventListener('click',event=>{
      if(active?.trigger===trigger&&active.hovered){active.hovered=false;if(event.detail===0)focusable(active.panel)[0]?.focus();}
      else if(active?.trigger===trigger)close(true);else open(door,event.detail===0);
    });
    trigger.addEventListener('keydown',event=>{
      if(['ArrowDown','ArrowUp'].includes(event.key)){
        event.preventDefault();open(door,true);
        if(event.key==='ArrowUp')focusable(active.panel).at(-1)?.focus();
      }
    });
    door.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse'&&door.closest('.audience-navigation'))open(door,false,true);});
    door.querySelector('[data-close-door]').addEventListener('click',()=>close(true));
    door.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>close()));
  });
  document.addEventListener('keydown',event=>{
    if(!active){
      const mobile=document.getElementById('mobile-menu');
      if(event.key==='Tab'&&mobile&&!mobile.classList.contains('hidden')){
        const items=focusable(mobile),current=document.activeElement;
        if(!mobile.contains(current)||(event.shiftKey&&current===items[0])||(!event.shiftKey&&current===items.at(-1))){
          event.preventDefault();(event.shiftKey?items.at(-1):items[0])?.focus();
        }
      }
      return;
    }
    if(event.key==='Escape'){
      event.preventDefault();event.stopImmediatePropagation();close(true);return;
    }
    if(event.key==='Tab'){
      const items=focusable(active.panel),current=document.activeElement;
      if(!active.panel.contains(current)||(event.shiftKey&&current===items[0])||(!event.shiftKey&&current===items.at(-1))){
        event.preventDefault();(event.shiftKey?items.at(-1):items[0])?.focus();
      }
    }
  },true);
  document.addEventListener('click',event=>{if(active&&!active.door.contains(event.target))close();});
  document.getElementById('mobile-menu-button')?.addEventListener('click',()=>close());
  window.addEventListener('resize',()=>close());
  // O menu móvel inteiro também mantém o foco até ser fechado.
  const mobile=document.getElementById('mobile-menu');
  mobile?.addEventListener('keydown',event=>{
    if(active||event.key!=='Tab')return;
    const items=focusable(mobile),first=items[0],last=items.at(-1);
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}
  });
}

export function initCircuitMotion(){
  const copy=JSON.parse(document.getElementById('runtime-copy').textContent);
  const preference=matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelectorAll('[data-circuit-motion]').forEach(figure=>{
    let visible=false,paused=preference.matches;
    const button=figure.querySelector('.circuit-toggle');
    const update=()=>{
      figure.dataset.playing=String(visible&&!paused&&!document.hidden&&!preference.matches);
      button.setAttribute('aria-pressed',String(paused));
      const key=paused?'orchestration.play':'orchestration.pause';
      button.dataset.i18n=key;button.textContent=copy[key];
    };
    button.addEventListener('click',()=>{paused=!paused;update();});
    const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;update();});
    observer.observe(figure);
    document.addEventListener('visibilitychange',update);
    preference.addEventListener('change',()=>{paused=preference.matches;update();});
    update();
  });
}
