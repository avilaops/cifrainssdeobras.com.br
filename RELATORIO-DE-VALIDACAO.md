# Relatório de validação

## Integração Tagflow

O frontend está preparado para emitir eventos anonimizados ao endpoint público do Tagflow. A validação externa permanece pendente até que um endpoint real de homologação ou produção seja configurado. Nenhuma credencial foi adicionada ao site.

Validação local em 18/07/2026: `npm run typecheck` e `npm run build` concluídos com sucesso; 20 páginas estáticas foram geradas.

Deploy GitHub Pages: concluído pelo workflow do repositório `avilaops/cifra`; home, `/obrigado/`, `/robots.txt`, `/sitemap.xml` e os assets sob `/cifra/_next/` responderam HTTP 200. O projeto temporário do Cloudflare Pages foi removido após a migração.

| Evento | Frontend | Tagflow | GA4 | Meta Pixel | Meta CAPI | Google Ads |
|---|---|---|---|---|---|---|
| `page_view` | Implementado | A validar | A validar | A validar | - | - |
| `click_whatsapp` | Implementado | A validar | A validar | A validar | A validar | - |
| `form_start` | Implementado | A validar | A validar | A validar | A validar | - |
| `form_submit` | Implementado | A validar | A validar | A validar | A validar | - |
| `request_quote` | Implementado | A validar | A validar | A validar | A validar | A validar |
| `whatsapp_redirect` | Implementado | A validar | A validar | A validar | A validar | - |

### Checklist

- [ ] Endpoint acessível.
- [x] `siteId` padrão definido como `cifra`.
- [x] `page_view` implementado.
- [x] `click_whatsapp` implementado em todos os links do componente compartilhado.
- [x] `form_start`, `form_submit` e `request_quote` implementados.
- [x] `whatsapp_redirect` usa `sendBeacon` com `fetch keepalive` como fallback.
- [x] Consentimento de analytics e marketing separado.
- [x] UTMs, `fbclid` e `gclid` preservados durante a sessão.
- [x] `eventId` único gerado no navegador.
- [x] Payload do formulário não contém nome, telefone, e-mail, cidade, observações ou valor.
- [x] Deduplicação preparada por `eventId` para encaminhamento pelo Worker.
- [ ] Meta Pixel recebido via Tagflow.
- [ ] Meta CAPI recebido via Worker.
- [ ] GA4 recebido via Tagflow.
- [ ] Google Ads recebido via Tagflow.
- [ ] Eventos armazenados e relatório disponível.

Os itens externos não podem ser considerados aprovados somente pela implementação do frontend. Devem ser confirmados nos painéis oficiais depois que `NEXT_PUBLIC_TAGFLOW_ENDPOINT` receber o endpoint real.
