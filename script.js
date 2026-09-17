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

// Final CRO/mobile overrides. Kept here so the same behaviour applies to every landing.
const croStyle=document.createElement('style');
croStyle.textContent=`
.manage-cookies{background:none;border:0;padding:0;color:#fff;text-decoration:underline;cursor:pointer;font:inherit}
.mobile-header-cta{display:none}
.quick-card .privacy{line-height:1.45}
@media(max-width:640px){
  .urgent-in{justify-content:space-between;gap:10px;min-height:40px}
  .urgent-in span{display:block;font-size:11px;line-height:1.25}
  .urgent-in span strong{display:inline}
  .urgent-in>a{white-space:nowrap;font-size:12px}
  .header{position:sticky}
  .header-in{gap:10px}
  .brand span b{font-size:14px}
  .mobile-header-cta{display:inline-flex;align-items:center;justify-content:center;min-height:40px;padding:0 12px;border-radius:5px;background:var(--blue);color:#fff;text-decoration:none;font-size:12px;font-weight:850;margin-left:auto}
}
`;
document.head.appendChild(croStyle);

function applyFinalCRO(){
  // Homepage: bring the contact action immediately after proof/cases.
  if(service==='geral'){
    const request=document.querySelector('.quick-section');
    const technical=document.querySelector('.technical-authority');
    if(request&&technical&&technical.compareDocumentPosition(request)&Node.DOCUMENT_POSITION_FOLLOWING){
      technical.parentNode.insertBefore(request,technical);
    }
  }

  // Keep a useful action in the mobile header without adding visual clutter.
  const headerIn=document.querySelector('.header-in');
  if(headerIn&&!headerIn.querySelector('.mobile-header-cta')){
    const a=document.createElement('a');
    a.className='mobile-header-cta';
    a.href='#pedido';
    a.textContent='Orçamento';
    headerIn.appendChild(a);
  }

  // Reduce pressure around m² and make the WhatsApp-only flow explicit.
  const quickCopy=document.querySelector('.quick-copy');
  if(quickCopy){
    const h2=quickCopy.querySelector('h2');
    const p=quickCopy.querySelector('p:not(.eyebrow)');
    if(service==='geral'){
      if(h2)h2.textContent='Peça uma avaliação para a sua impermeabilização.';
      if(p)p.textContent='Diga-nos o essencial. Se souber, indique uma área aproximada; pode continuar mesmo sem saber os m².';
    }else if(service==='telhados'){
      if(h2)h2.textContent='Peça uma avaliação para o seu telhado ou cobertura.';
      if(p)p.textContent='Indique a localidade e a situação. Se souber, acrescente uma área aproximada; não precisa de uma medição técnica.';
    }else if(service==='terracos'){
      if(h2)h2.textContent='Peça uma avaliação para o seu terraço ou varanda.';
      if(p)p.textContent='Indique a localidade e a situação. Se souber, acrescente uma área aproximada; pode continuar mesmo sem saber os m².';
    }
    quickCopy.querySelectorAll('li').forEach(li=>{
      if(/Área aproximada/i.test(li.textContent))li.textContent='Área aproximada, se souber';
      if(/Fotografias/i.test(li.textContent))li.textContent='Fotografias ou vídeo podem ser enviados depois pelo WhatsApp';
    });
  }

  const areaField=document.querySelector('.area-field');
  if(areaField){
    const help=areaField.querySelector('.area-help');
    if(help)help.textContent='Opcional. Se souber, indique uma área aproximada. Pode continuar mesmo sem saber os m².';
  }

  const submit=document.querySelector('#quickForm button[type="submit"]');
  if(submit)submit.textContent='Preparar pedido no WhatsApp';
  const privacy=document.querySelector('#quickForm .privacy');
  if(privacy)privacy.textContent='Ao clicar, abrimos o WhatsApp com a informação preenchida. A mensagem só é enviada quando confirmar no WhatsApp.';

  // Avoid relying on an unverified experience number in the most prominent trust areas.
  document.querySelectorAll('.micro').forEach(el=>{
    el.innerHTML='Não precisa de saber os m² exatos · Fotografias são opcionais · Orçamento gratuito';
  });
  document.querySelectorAll('.proof-grid>div').forEach(card=>{
    if(/7 anos/i.test(card.textContent)){
      const b=card.querySelector('b');
      const span=card.querySelector('span');
      if(b)b.textContent='Obras reais';
      if(span)span.textContent='execução documentada';
    }
  });
  document.querySelectorAll('.identity-role').forEach(el=>el.textContent='Contacto direto para avaliação e orçamento');
  document.querySelectorAll('.person-photo figcaption').forEach(el=>{
    if(/7 anos/i.test(el.textContent))el.textContent='Vinícius Nascimento · ImpermeabilizaPro';
  });

  // FAQ: reassure visitors who do not know the area yet.
  document.querySelectorAll('.faq-section details').forEach(detail=>{
    const summary=detail.querySelector('summary');
    if(summary&&/m²/i.test(summary.textContent)){
      const p=detail.querySelector('p');
      if(p)p.textContent='Não. Se souber, indique uma área aproximada. Não precisa de uma medição técnica e pode continuar mesmo sem saber os m².';
    }
  });

  // Footer cookie preference control.
  const note=document.querySelector('.footer-note');
  if(note&&!document.getElementById('manageCookies')){
    note.append(' · ');
    const btn=document.createElement('button');
    btn.type='button';
    btn.className='manage-cookies';
    btn.id='manageCookies';
    btn.textContent='Gerir cookies';
    note.appendChild(btn);
  }

  // Improve the final homepage CTA wording.
  if(service==='geral'){
    const final=document.querySelector('#cta-final');
    if(final){
      const h2=final.querySelector('h2');
      const p=final.querySelector('p:not(.eyebrow)');
      if(h2)h2.textContent='Quer perceber a solução adequada para a sua obra?';
      if(p)p.textContent='Envie a localidade e algumas informações. Se tiver fotografias, pode enviá-las pelo WhatsApp.';
    }
  }
}
applyFinalCRO();

const consent=localStorage.getItem('ip_consent');
const cookie=document.getElementById('cookie');
function consentValue(v){return v==='accepted'?'granted':'denied'}
function updateConsent(v){
  const granted=consentValue(v);
  gtag('consent','update',{ad_storage:granted,analytics_storage:granted,ad_user_data:granted,ad_personalization:granted});
}
function openConsentSettings(){
  if(!cookie)return;
  cookie.classList.add('show');
  window.dispatchEvent(new CustomEvent('ip:consent-panel',{detail:{open:true}}));
}
if(cookie){
  if(!consent){cookie.classList.add('show')}
  else updateConsent(consent);

  function setConsent(v){
    localStorage.setItem('ip_consent',v);
    updateConsent(v);
    push('ip_consent_update',{consent_choice:v});
    cookie.classList.remove('show');
    window.dispatchEvent(new CustomEvent('ip:consent-panel',{detail:{open:false}}));
  }
  const accept=document.getElementById('accept');
  const essential=document.getElementById('essential');
  if(accept)accept.onclick=()=>setConsent('accepted');
  if(essential)essential.onclick=()=>setConsent('rejected');
}
const manageCookies=document.getElementById('manageCookies');
if(manageCookies)manageCookies.addEventListener('click',openConsentSettings);

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
    push('form_start',trackingContext({page_path:pagePath,form_type:'whatsapp_request_builder'}));
  }
  quickForm.addEventListener('click',markStart,{once:true});
  quickForm.addEventListener('focusin',markStart,{once:true});

  const legacyAreaGroup=quickForm.querySelector('.choice-grid[data-name="area"]');
  if(legacyAreaGroup){
    const fieldset=legacyAreaGroup.closest('fieldset');
    const step=service==='geral'?'3':'2';
    if(fieldset){
      fieldset.outerHTML=`<label class="field area-field">${step}. Quantos m² tem aproximadamente? <span aria-hidden="true">(opcional)</span><div class="area-input"><input id="areaM2" name="areaM2" type="number" inputmode="numeric" min="1" step="1" placeholder="Ex.: 84"><span>m²</span></div><small class="area-help">Opcional. Se souber, indique uma área aproximada. Pode continuar mesmo sem saber os m².</small><span class="checkline"><input id="areaUnknown" type="checkbox"> Ainda não sei os m²</span></label>`;
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
    if(!locality)missing.push('a localidade');
    if(missing.length){
      if(error){error.textContent='Indique '+missing.join(', ')+'.';error.hidden=false}
      return;
    }
    if(error)error.hidden=true;
    const area=doesNotKnowArea||!areaValue?'Não indicado':`${areaValue} m²`;
    const msg=[
      directMessages[service]||directMessages.geral,
      `Zona: ${state.tipo}`,
      `Situação: ${state.situacao}`,
      `Área aproximada: ${area}`,
      `Localidade: ${locality}`,
      'Se ajudar na avaliação, posso enviar fotografias ou vídeo.'
    ].join('\n');
    const tracking=trackingContext({request_type:state.tipo,request_situation:state.situacao,request_area:area,page_path:pagePath,form_type:'whatsapp_request_builder'});

    // This is deliberately a microconversion: opening WhatsApp does not prove a message was sent.
    push('ip_whatsapp_request_prepared',tracking);
    push('ip_quick_request',tracking);
    push('ip_contact_click',trackingContext({contact_action:'whatsapp_request_prepared',page_path:pagePath}));
    window.open(`https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`,'_blank','noopener,noreferrer');
  });
}

// Mobile contact bar only appears after the hero and hides around conversion areas/cookie controls.
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
  window.addEventListener('ip:consent-panel',render);
  render();
}
