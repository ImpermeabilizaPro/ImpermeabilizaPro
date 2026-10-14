// ImpermeabilizaPro private lead intake. Deploy separately as a Cloudflare Worker.
// Bind D1 database as LEADS_DB. Set TURNSTILE_SECRET, RESEND_API_KEY,
// RESEND_FROM, LEADS_TO as encrypted Worker secrets/variables, never in GitHub.
const ORIGIN='https://impermeabilizapro.pt';
const headers={'Access-Control-Allow-Origin':ORIGIN,'Access-Control-Allow-Methods':'POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type','Vary':'Origin','Cache-Control':'no-store','Content-Type':'application/json; charset=utf-8'};
const reply=(body,status=200)=>new Response(JSON.stringify(body),{status,headers});
const clean=(value,max)=>String(value??'').trim().slice(0,max);
const esc=(value)=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const allowedTypes=['Terraço ou cobertura plana','Varanda','Parede com infiltrações','Garagem ou cave','Casa de banho / interior','Outra intervenção'];
async function notify(env,lead){
 if(!env.RESEND_API_KEY||!env.RESEND_FROM||!env.LEADS_TO)return false;
 const fields=['id','tipo','area','local','estado','acesso','prazo','momento','base','descricao','nome','telefone','email'];
 const html='<h2>Novo pedido Mapa da Infiltração</h2><table>'+fields.map(k=>'<tr><th align="left">'+esc(k)+'</th><td>'+esc(lead[k]||'—')+'</td></tr>').join('')+'</table><p>Pedido guardado no D1. ID: '+esc(lead.id)+'</p>';
 const response=await fetch('https://api.resend.com/emails',{method:'POST',headers:{'Authorization':'Bearer '+env.RESEND_API_KEY,'Content-Type':'application/json'},body:JSON.stringify({from:env.RESEND_FROM,to:[env.LEADS_TO],subject:'Novo pedido impermeabilização · '+lead.local,html,reply_to:lead.email||undefined})});
 return response.ok;
}
export default {
 async fetch(request,env,ctx){
 const url=new URL(request.url);
 if(request.method==='OPTIONS')return request.headers.get('Origin')===ORIGIN?new Response(null,{status:204,headers}):new Response(null,{status:403});
 if(url.pathname!=='/api/leads'||request.method!=='POST')return reply({error:'not_found'},404);
 if(request.headers.get('Origin')!==ORIGIN)return reply({error:'origin'},403);
 if(!env.LEADS_DB||!env.TURNSTILE_SECRET)return reply({error:'service_unconfigured'},503);
 if(Number(request.headers.get('content-length')||0)>12000)return reply({error:'too_large'},413);
 let d;try{const raw=await request.text();if(raw.length>12000)return reply({error:'too_large'},413);d=JSON.parse(raw)}catch{return reply({error:'invalid_json'},400)}
 if(d.website)return reply({ok:true,ignored:true}); // honeypot
 if(d.consent!==true||!allowedTypes.includes(d.tipo))return reply({error:'invalid_fields'},400);
 const lead={id:crypto.randomUUID(),tipo:clean(d.tipo,70),area:clean(d.area,20),local:clean(d.local,100),estado:clean(d.estado,100),acesso:clean(d.acesso,100),prazo:clean(d.prazo,80),momento:clean(d.momento,100),base:clean(d.base,100),descricao:clean(d.descricao,1400),nome:clean(d.nome,100),telefone:clean(d.telefone,30),email:clean(d.email,180)};
 if(!lead.local||!lead.estado||(!lead.telefone&&!lead.email)||lead.telefone&&!/^[+0-9 ()-]{9,25}$/.test(lead.telefone)||lead.email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email))return reply({error:'invalid_fields'},400);
 const captcha=clean(d.turnstile,2200);
 if(!captcha)return reply({error:'captcha_missing'},400);
 let check;try{check=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',body:new URLSearchParams({secret:env.TURNSTILE_SECRET,response:captcha})}).then(r=>r.json())}catch{return reply({error:'captcha_unavailable'},503)}
 if(!check.success||check.hostname!=='impermeabilizapro.pt')return reply({error:'captcha_invalid'},400);
 try{
 await env.LEADS_DB.prepare('INSERT INTO leads (id, created_at, tipo, area, local, estado, acesso, prazo, momento, base, descricao, nome, telefone, email, consent_at, email_status) VALUES (?, datetime(\'now\'), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime(\'now\'), ?)').bind(lead.id,lead.tipo,lead.area,lead.local,lead.estado,lead.acesso,lead.prazo,lead.momento,lead.base,lead.descricao,lead.nome,lead.telefone,lead.email,'pending').run();
 }catch{return reply({error:'storage_unavailable'},503)}
 ctx.waitUntil((async()=>{let sent=false;try{sent=await notify(env,lead)}catch{}try{await env.LEADS_DB.prepare('UPDATE leads SET email_status=? WHERE id=?').bind(sent?'sent':'failed',lead.id).run()}catch{}})());
 return reply({ok:true,id:lead.id,stored:true});
 }
};
