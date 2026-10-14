# Mapa da Infiltração — entrega automática segura (pendente de ligação)
Data: 2026-10-14

## Estado
O simulador está alojado no GitHub Pages (website estático). Neste momento NÃO envia os dados automaticamente: prepara um WhatsApp ou email, e o visitante tem de confirmar o envio. Nunca mostrar «pedido recebido» sem resposta positiva do servidor.

## Implementação recomendada (sem credenciais no GitHub)
1. Criar endpoint HTTPS serverless dedicado POST /api/leads com segredo apenas no serviço, fora do repositório público.
2. Configurar allowlist de origem https://impermeabilizapro.pt, CORS rigoroso, limite de tamanho de payload, validação de dados no servidor, rate limiting, honeypot e proteção anti-abuso.
3. Aceitar só dados necessários: tipo, situação, localidade, area opcional, acessos, momento, base, descrição, contacto fornecido e consentimento. Não enviar dados de contacto ao Analytics.
4. Guardar pedido em base de dados privada com ID e timestamp, usar encriptação em trânsito, retenção definida e acesso restrito ao responsável.
5. Disparar notificação por email empresarial através de fornecedor transacional com domínio autenticado (SPF/DKIM/DMARC); não usar senha do Gmail nem API key no navegador.
6. Responder ao frontend com ID do pedido após persistência bem-sucedida. Falhas de notificação devem gerar tentativa posterior e não perder o registo.
7. Mostrar «Pedido recebido» somente após POST confirmado; em erro mostrar recuperação WhatsApp/email sem duplicar envio.
8. Fotos: fase posterior com upload privado de ficheiros, controlo de tamanho/tipo, antivírus, URLs temporárias e políticas de retenção.
9. Revisão RGPD: finalidade e fundamento, transparência, prazo de retenção, contacto e direitos, operador/subcontratantes e eventual transferência internacional.
10. Fazer testes com pedido fictício autorizado, recetividade, validação do email, bloqueio de spam e dispositivo móvel antes de ativar.

## Dependências
É necessário decidir fornecedor de endpoint, armazenamento e envio de emails e configurar DNS/segredos com acesso autorizado. Não ativar sem confirmação técnica do circuito ponta a ponta. Enquanto isso manter WhatsApp/email manual operacionais e explícitos.
