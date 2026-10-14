// The automatic submit button is DISABLED until a verified backend is configured.
// Public config contains no secrets. Enable by setting endpoint + Turnstile public sitekey.
(()=>{'use strict';
const config=window.IMPERMEABILIZAPRO_LEADS||{};
if(!config.endpoint||!config.sitekey)return;
const endpoint=new URL(config.endpoint,location.href);
if(endpoint.protocol!=='https:'||!/^https:\/\/[a-z0-9.-]+\/api\/leads$/i.test(endpoint.href))return;
const form=document.getElementById('simForm'),button=document.getElementById('automaticButton'),status=document.getElementById('automaticStatus'),slot=document.getElementById('automationFields');
if(!form||!button||!status||!slot)return;
slot.hidden=false;button.hidden=false;button.disabled=true;
let widgetId=null;
window.onLeadTurnstileLoaded=()=>{widgetId=turnstile.render('#turnstileWidget',{sitekey:config.sitekey,callback:()=>{button.disabled=false},'expired-callback':()=>{button.disabled=true},'error-callback':()=>{button.disabled=true}})};
const script=document.createElement('script');script.src='https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onLeadTurnstileLoaded&render=explicit';script.async=true;script.defer=true;document.head.appendChild(script);
button.addEventListener('click',async()=>{
if(!form.reportValidity())return;
const d=Object.fromEntries(new FormData(form));
if(!d.telefone&&!d.email){status.textContent='Para receber resposta, indique telemóvel ou email.';return}
if(!window.turnstile||widgetId===null){status.textContent='Verificação indisponível. Use o WhatsApp ou email.';return}
const turnstileToken=turnstile.getResponse(widgetId);
if(!turnstileToken){status.textContent='Conclua a verificação de segurança.';return}
button.disabled=true;status.textContent='A enviar pedido…';
const payload={...d,consent:!!form.elements.privacidade.checked,turnstile:turnstileToken};
delete payload.privacidade;
try{
const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),12000);
let response;try{response=await fetch(endpoint.href,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),signal:controller.signal})}finally{clearTimeout(timeout)}
const result=await response.json();
if(response.ok&&result.ok&&result.stored&&!result.ignored){status.textContent='Pedido registado com sucesso. Referência: '+result.id+'. Vamos analisar as informações e entrar em contacto.';button.hidden=true;return}
throw new Error('failed');
}catch{status.textContent='Não conseguimos confirmar o registo do pedido. Pode usar o WhatsApp ou email. Se tentou enviar, mencione que pode já ter submetido o formulário.';button.disabled=false;turnstile.reset(widgetId)}
});
})();
