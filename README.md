# CIFRA - website institucional

Website em Next.js para a CIFRA - Consultoria Tributária de Obra.

## Desenvolvimento

```bash
npm install
npm run dev
```

Use `.env.example` como referência para criar `.env.local`. Variáveis com o prefixo `NEXT_PUBLIC_` ficam expostas no bundle; nunca inclua tokens, credenciais ou chaves privadas nelas.

## WhatsApp

Defina `NEXT_PUBLIC_WHATSAPP_NUMBER` no formato internacional, somente com dígitos (`55` + DDD + número). O valor padrão é deliberadamente inválido e não deve chegar a produção.

## Tagflow

A CIFRA envia eventos públicos e anonimizados somente ao Tagflow. GA4, Google Ads, Meta Pixel e Meta CAPI devem ser configurados e encaminhados pelo Tagflow/Cloudflare Worker, nunca diretamente neste frontend.

```env
NEXT_PUBLIC_TAGFLOW_ENABLED=true
NEXT_PUBLIC_TAGFLOW_ENDPOINT=https://SEU-ENDPOINT-TAGFLOW/events
NEXT_PUBLIC_TAGFLOW_SITE_ID=cifra
NEXT_PUBLIC_TAGFLOW_DEBUG=false
```

- `NEXT_PUBLIC_TAGFLOW_ENDPOINT`: endpoint público de ingestão, sem token ou query string.
- `NEXT_PUBLIC_TAGFLOW_SITE_ID`: deve ser `cifra`.
- `NEXT_PUBLIC_TAGFLOW_DEBUG`: habilita logs sem dados pessoais apenas no navegador de desenvolvimento.

Eventos: `page_view`, `view_form`, `form_start`, `form_submit`, `request_quote`, `lead`, `click_whatsapp`, `whatsapp_redirect`, `click_phone`, `click_email`, `click_facebook` e `cookie_consent_update`.

Todos recebem contexto de página, origem, dispositivo, consentimento, identificadores anônimos e UTMs disponíveis. O formulário envia somente classificações da obra; nome, telefone, e-mail, cidade, observações e valores não entram nos eventos.

## Validação do Tagflow

1. Use um endpoint de homologação e habilite `NEXT_PUBLIC_TAGFLOW_DEBUG=true`.
2. Abra o site com `?utm_source=teste&utm_medium=qa&utm_campaign=cifra`.
3. Teste recusa, somente métricas e aceite completo no banner de cookies.
4. Confirme no Tagflow o `siteId=cifra`, UTMs, consentimento e um `eventId` único por evento.
5. Valide `page_view`, formulário e cliques no WhatsApp no armazenamento/relatório do Tagflow.
6. No GA4 DebugView, confirme o mapeamento feito pelo Tagflow.
7. No Meta Events Manager, confirme Pixel e CAPI com o mesmo `event_id` para deduplicação.

O endpoint indisponível nunca bloqueia o formulário ou a abertura do WhatsApp. A tabela de evidências fica em `RELATORIO-DE-VALIDACAO.md`.

## Build

```bash
npm run typecheck
npm run build
```

O projeto usa exportação estática. O diretório de saída é `out/`.
