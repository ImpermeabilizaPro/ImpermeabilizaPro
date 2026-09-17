const GTM='GTM-KTCT795B';
const PHONE='351930446198';
const params=new URLSearchParams(location.search);

// Preserve old ad/landing links while moving to stable, indexable URLs.
if(location.pathname==='/' && ['telhados','terracos'].includes(params.get('servico'))){
  const service=params.get('servico');
  params.delete('servico');
  const query=params.toString();
  location.replace(`/${service}/${query?`?${query}`:''}`);
}

function push(event,extra={}){
  window.dataLayer=window.dataLayer||[];
  window.dataLayer.push({event,...extra});
}
function loadGTM(){
  if(window.__gtmLoaded)return;
  window.__gtmLoaded=true;
  const s=document.createElement('script');
  s.async=true;
  s.src='https://www.googletagmanager.com/gtm.js?id='+GTM;
  document.head.appendChild(s);
}
loadGTM();

const attributionKeys=['utm_source','utm_medium','utm_campaign','utm_term','utm_content','gclid'];
const currentAttribution={};
attributionKeys.forEach(key=>{if(params.get(key))currentAttribution[key]=params.get(key)});
let storedAttribution={};
try{storedAttribution=JSON.parse(sessionStorage.getItem('ip_attribution')||'{}')}catch(e){}
const attribution={...storedAttribution,...currentAttribution};
try{sessionStorage.setItem('ip_attribution',JSON.stringify(attribution))}catch(e){}

const service=document.body.dataset.service||'geral';
const pagePath=location.pathname+location.search;
function trackingContext(extra={}){return {landing_page:location.pathname,servico:service,...attribution,...extra}}

const consent=localStorage.getItem('ip_consent');
const cookie=document.getElementById('cookie');
if(cookie){
  if(!consent){cookie.classList.add('show')}
  else{
    const granted=consent==='accepted'?'granted':'denied';
    gtag('consent','update',{ad_storage:granted,analytics_storage:granted,ad_user_data:granted,ad_personalization:granted});
  }
  function setConsent(v){
    localStorage.setItem('ip_consent',v);
    const granted=v==='accepted'?'granted':'denied';
    gtag('consent','update',{ad_storage:granted,analytics_storage:granted,ad_user_data:granted,ad_personalization:granted});
    push('ip_consent_update',{consent_choice:v});
    cookie.classList.remove('show');
  }
  const accept=document.getElementById('accept');
  const essential=document.getElementById('essential');
  if(accept)accept.onclick=()=>setConsent('accepted');
  if(essential)essential.onclick=()=>setConsent('rejected');
}

const directMessages={
  geral:'Olá. Gostaria de pedir uma avaliação para um trabalho de impermeabilização.',
  telhados:'Olá. Gostaria de pedir uma avaliação para impermeabilização de um telhado/cobertura.',
  terracos:'Olá. Gostaria de pedir uma avaliação para impermeabilização de um terraço/varanda.'
};
document.querySelectorAll('.wa-direct').forEach(a=>{
  a.href=`https://wa.me/${PHONE}?text=${encodeURIComponent(directMessages[service]||directMessages.geral)}`;
  a.addEventListener('click',()=>push('ip_whatsapp_click',trackingContext({placement:a.dataset.placement||'direct',page_path:pagePath})));
});

document.querySelectorAll('[data-track]').forEach(a=>a.addEventListener('click',()=>{
  push('ip_phone_click',trackingContext({placement:a.dataset.track,page_path:pagePath}));
}));

const quickForm=document.getElementById('quickForm');
if(quickForm){
  const state={
    tipo:service==='telhados'?'Telhado / cobertura':service==='terracos'?'Terraço / varanda':'',
    situacao:'',
    area:''
  };
  let formStarted=false;
  function markStart(){
    if(formStarted)return;
    formStarted=true;
    push('form_start',trackingContext({page_path:pagePath}));
  }
  quickForm.addEventListener('click',markStart,{once:true});
  quickForm.addEventListener('focusin',markStart,{once:true});

  // Old service pages used area ranges. Convert them into an exact-number field at runtime.
  const legacyAreaGroup=quickForm.querySelector('.choice-grid[data-name="area"]');
  if(legacyAreaGroup){
    const fieldset=legacyAreaGroup.closest('fieldset');
    const step=service==='geral'?'3':'2';
    if(fieldset){
      fieldset.outerHTML=`<label class="field area-field">${step}. Quantos m² tem aproximadamente?<div class="area-input"><input id="areaM2" name="areaM2" type="number" inputmode="numeric" min="1" step="1" placeholder="Ex.: 84"><span>m²</span></div><small class="area-help">Escreva um número aproximado em vez de escolher um intervalo.</small><span class="checkline"><input id="areaUnknown" type="checkbox"> Ainda não sei os m²</span></label>`;
    }
  }

  document.querySelectorAll('.choice-grid').forEach(group=>{
    const name=group.dataset.name;
    if(!name)return;
    group.querySelectorAll('button').forEach(btn=>{
      if(btn.dataset.value===state[name])btn.classList.add('active');
      btn.addEventListener('click',()=>{
        state[name]=btn.dataset.value;
        group.querySelectorAll('button').forEach(b=>b.classList.toggle('active',b===btn));
      });
    });
  });

  const areaInput=document.getElementById('areaM2');
  const areaUnknown=document.getElementById('areaUnknown');
  if(areaUnknown&&areaInput){
    areaUnknown.addEventListener('change',()=>{
      areaInput.disabled=areaUnknown.checked;
      if(areaUnknown.checked)areaInput.value='';
    });
    areaInput.addEventListener('input',()=>{if(areaInput.value)areaUnknown.checked=false});
  }

  quickForm.addEventListener('submit',e=>{
    e.preventDefault();
    markStart();
    const locality=document.getElementById('localidade')?.value.trim()||'';
    const areaValue=areaInput?.value.trim()||'';
    const doesNotKnowArea=!!areaUnknown?.checked;
    const error=document.getElementById('formError');
    const missing=[];
    if(!state.tipo)missing.push('onde é o trabalho');
    if(!state.situacao)missing.push('o que precisa');
    if(!areaValue&&!doesNotKnowArea)missing.push('os m² aproximados ou “Ainda não sei”');
    if(!locality)missing.push('a localidade');
    if(missing.length){
      if(error){error.textContent='Indique '+missing.join(', ')+'.';error.hidden=false}
      return;
    }
    if(error)error.hidden=true;
    const area=doesNotKnowArea?'Não sei':`${areaValue} m²`;
    const msg=[
      directMessages[service]||directMessages.geral,
      `Zona: ${state.tipo}`,
      `Situação: ${state.situacao}`,
      `Área aproximada: ${area}`,
      `Localidade: ${locality}`,
      'Posso enviar fotografias ou vídeo se ajudar na avaliação.'
    ].join('\n');
    const tracking=trackingContext({request_type:state.tipo,request_situation:state.situacao,request_area:area,page_path:pagePath,form_type:'quick_whatsapp'});
    push('ip_quick_request',tracking);
    push('ip_form_submitted',tracking);
    push('ip_contact_click',trackingContext({contact_action:'whatsapp_quick_request',page_path:pagePath}));
    window.open(`https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`,'_blank','noopener,noreferrer');
  });
}

// Mobile contact bar only appears after the hero and hides around conversion areas.
const mobileContact=document.getElementById('mobileContact');
const hero=document.querySelector('.hero');
if(mobileContact && hero && 'IntersectionObserver' in window){
  let heroVisible=true;
  const blocked=new Set();
  const render=()=>mobileContact.classList.toggle('is-hidden',heroVisible||blocked.size>0||cookie?.classList.contains('show'));
  new IntersectionObserver(entries=>{heroVisible=entries[0].isIntersecting;render()},{threshold:.08}).observe(hero);
  ['pedido','cta-final'].forEach(id=>{
    const el=document.getElementById(id);
    if(!el)return;
    new IntersectionObserver(entries=>{
      if(entries[0].isIntersecting)blocked.add(id);else blocked.delete(id);
      render();
    },{threshold:.08}).observe(el);
  });
  render();
}
