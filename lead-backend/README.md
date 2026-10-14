# Instalação da receção automática
O projeto está no GitHub Pages, que não executa código de backend. Estes ficheiros são uma implementação preparada, **não um endpoint ativo**.

## Infraestrutura proposta
- Cloudflare Worker em `https://leads.impermeabilizapro.pt/api/leads` (só depois de configurar DNS/domínio).
- Cloudflare D1: base de dados privada com tabela em `schema.sql`, binding `LEADS_DB`.
- Cloudflare Turnstile em `impermeabilizapro.pt`, com chave pública `sitekey` no cliente e segredo `TURNSTILE_SECRET` no Worker.
- Resend para notificação ao `proimpermeabiliza@gmail.com`, com domínio de envio verificado, variável `RESEND_FROM` e segredo `RESEND_API_KEY`.
- `LEADS_TO=proimpermeabiliza@gmail.com`.

## Configuração sem expor segredos
1. Criar D1 e executar o SQL.
2. Criar Worker com `worker.js`, ligar a D1. Definir segredos nas configurações do Worker.
3. Criar Turnstile validando o domínio e obter sitekey pública.
4. Verificar domínio de envio no Resend e configurar SPF, DKIM, DMARC.
5. Instalar rota e DNS HTTPS. Testar com pedidos fictícios e verificar D1 + email.
6. **Só após testes**, inserir antes de `lead-delivery.js` no HTML:
```html
<script>window.IMPERMEABILIZAPRO_LEADS={endpoint:"https://leads.impermeabilizapro.pt/api/leads",sitekey:"CHAVE_PUBLICA_REAL"};</script>
```
7. Testar telemóvel, desktop, indisponibilidade de rede, spam e duplicados.
8. Rever política de privacidade, prazo de retenção, eliminação e acesso seguro aos pedidos. Implementar reenvio de emails falhados e limpeza periódica dos registos antes do lançamento.

## Atenção
- O registo é confirmado depois de persistir no D1, independentemente de o email ter sido enviado. Monitorizar `email_status`, nunca depender exclusivamente da caixa de email.
- Sem chave pública ou endpoint configurados, o botão automático fica oculto e WhatsApp/email continuam ativos.
- Não publicar credenciais, dados pessoais de testes ou exports da base no GitHub.
- Falta rate limiting no perímetro, política de retenção automatizada, gestão de falhas e testes ponta a ponta antes do lançamento de produção.
