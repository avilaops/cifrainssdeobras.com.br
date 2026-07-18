# Auditoria de variáveis e integrações

## Resumo

- Data e hora da auditoria: 18/07/2026, 14:26 (America/Sao_Paulo).
- Arquivos analisados: `.env.local` (não encontrado) e `.env.production` (não encontrado).
- Quantidade total de variáveis encontradas nos arquivos auditados: 0.
- Quantidade total de ferramentas identificadas: 8.
- Quantidade de ferramentas referenciadas no código: 7.
- Quantidade de ferramentas testadas: 1.
- Quantidade de ferramentas funcionais: 1 confirmada.
- Quantidade de ferramentas com conectividade validada: 1.
- Quantidade de variáveis não utilizadas: 0.
- Quantidade de variáveis ausentes: 10.
- Quantidade de inconsistências encontradas: 12 (10 variáveis ausentes e 2 arquivos de ambiente ausentes).

O projeto possui `.env.example`, mas esse arquivo é apenas um modelo. Existe também um `.env` na raiz do workspace, fora do diretório da aplicação; seus valores não foram lidos, comparados nem documentados. GA4, Meta Pixel, Meta CAPI, Google Ads e GTM deixaram de ser integrações diretas da CIFRA e passam a ser responsabilidade do Tagflow.

## Ferramentas disponíveis

| Ferramenta | Variáveis relacionadas | Ambiente | Referenciada no código | Arquivos de referência | Teste realizado | Status |
|---|---|---|---|---|---|---|
| Next.js / base path | `NEXT_PUBLIC_BASE_PATH` | Local e produção | Sim | `next.config.ts` | Build local | Referenciada, mas não configurada. |
| WhatsApp | `NEXT_PUBLIC_WHATSAPP_NUMBER` | Local e produção | Sim | `src/config/contact.ts` | Não realizado: número real não configurado | Erro de configuração. |
| E-mail comercial | `NEXT_PUBLIC_CONTACT_EMAIL` | Local e produção | Sim | `src/config/contact.ts` | Não realizado | Referenciada, mas não configurada. |
| Instagram | `NEXT_PUBLIC_INSTAGRAM_URL` | Local e produção | Sim | `src/config/contact.ts` | Não realizado | Referenciada, mas não configurada. |
| Facebook | `NEXT_PUBLIC_FACEBOOK_URL` | Local e produção | Sim | `src/config/contact.ts` | Não realizado | Referenciada, mas não configurada. |
| Tagflow | `NEXT_PUBLIC_TAGFLOW_ENABLED`, `NEXT_PUBLIC_TAGFLOW_ENDPOINT`, `NEXT_PUBLIC_TAGFLOW_SITE_ID`, `NEXT_PUBLIC_TAGFLOW_DEBUG` | Local e produção | Sim | `src/config/tagflow.ts`, `src/lib/tagflow.ts` | Não realizado: endpoint real não fornecido | Referenciada, mas não configurada. |
| Cloudflare Turnstile | `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Local e produção | Apenas em configuração planejada | `src/components/forms/lead-form.tsx` | Não realizado: integração ainda não implementada | Teste não seguro ou não disponível. |
| Cloudflare Pages | `CLOUDFLARE_TOKEN` | Operacional, fora do bundle | Não referenciada pelo frontend | Deploy via Wrangler | Deploy e GET público realizados; HTTP 200 | Conectividade validada. |

## Inventário de variáveis

| Variável | Arquivo de origem | Ferramenta | Referenciada | Quantidade de referências | Arquivos | Situação |
|---|---|---|---|---:|---|---|
| `NEXT_PUBLIC_BASE_PATH` | Ausente | Next.js / base path | Sim | 1 | `next.config.ts` | Referenciada no código, mas ausente no ambiente. |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Ausente | WhatsApp | Sim | 1 | `src/config/contact.ts` | Referenciada no código, mas ausente; fallback inválido ativo. |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Ausente | E-mail comercial | Sim | 1 | `src/config/contact.ts` | Referenciada no código, mas ausente no ambiente. |
| `NEXT_PUBLIC_INSTAGRAM_URL` | Ausente | Instagram | Sim | 1 | `src/config/contact.ts` | Referenciada no código, mas ausente no ambiente. |
| `NEXT_PUBLIC_FACEBOOK_URL` | Ausente | Facebook | Sim | 1 | `src/config/contact.ts` | Referenciada no código, mas ausente no ambiente. |
| `NEXT_PUBLIC_TAGFLOW_ENABLED` | Ausente | Tagflow | Sim | 1 | `src/config/tagflow.ts` | Referenciada no código, mas ausente no ambiente. |
| `NEXT_PUBLIC_TAGFLOW_ENDPOINT` | Ausente | Tagflow | Sim | 1 | `src/config/tagflow.ts` | Referenciada no código, mas ausente no ambiente. |
| `NEXT_PUBLIC_TAGFLOW_SITE_ID` | Ausente | Tagflow | Sim | 1 | `src/config/tagflow.ts` | Referenciada no código, mas ausente; fallback `cifra`. |
| `NEXT_PUBLIC_TAGFLOW_DEBUG` | Ausente | Tagflow | Sim | 1 | `src/config/tagflow.ts` | Referenciada no código, mas ausente; fallback desabilitado. |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Ausente | Cloudflare Turnstile | Não; somente comentário | 0 | `src/components/forms/lead-form.tsx` | Referenciada apenas em configuração planejada. |

## Variáveis usadas no código e ausentes no ambiente

Os dois arquivos de ambiente correspondentes estão ausentes. Faltam `NEXT_PUBLIC_BASE_PATH`, `NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_CONTACT_EMAIL`, `NEXT_PUBLIC_INSTAGRAM_URL`, `NEXT_PUBLIC_FACEBOOK_URL`, `NEXT_PUBLIC_TAGFLOW_ENABLED`, `NEXT_PUBLIC_TAGFLOW_ENDPOINT`, `NEXT_PUBLIC_TAGFLOW_SITE_ID`, `NEXT_PUBLIC_TAGFLOW_DEBUG` e `NEXT_PUBLIC_TURNSTILE_SITE_KEY`.

## Variáveis declaradas e aparentemente não utilizadas

Nenhuma, pois `.env.local` e `.env.production` não existem. Referências dinâmicas podem não ser detectadas pela busca estática.

## Comparação local versus produção

Não foi possível comparar presença ou nomenclatura: os dois arquivos estão ausentes. Nenhum valor secreto foi comparado ou documentado.

## Testes de conectividade

Nenhum teste externo do Tagflow foi executado. O endpoint presente em `.env.example` é um placeholder e não pode ser consultado. A integração não deve ser considerada funcional até que um endpoint real seja configurado e os eventos sejam confirmados no Tagflow e nos destinos encaminhados pelo Worker.

Cloudflare Pages foi validado separadamente: o projeto `cifra` recebeu o build estático e a URL pública respondeu HTTP 200. O domínio oficial foi associado, mas permanece pendente por ausência de resolução DNS acessível à conta/token utilizado.

## Recomendações

- Configurar um endpoint público real do Tagflow, sem token ou query string, em cada ambiente.
- Manter tokens de Meta CAPI, Google, banco e demais credenciais exclusivamente no Worker/servidor do Tagflow.
- Configurar um número real de WhatsApp antes de validar o fluxo comercial.
- Validar consentimento, UTMs, armazenamento, relatórios e deduplicação com o mesmo `eventId` no Tagflow e Meta.
- Implementar a validação do Turnstile no Worker antes de declarar a proteção ativa.
- Adicionar validação tipada de ambiente no build de produção.

## Histórico de auditorias

- 18/07/2026 14:26 - Deploy no Cloudflare Pages validado por GET; domínio oficial associado, ainda pendente de DNS/TLS.
- 18/07/2026 13:52 - Analytics direto removido; Tagflow registrado como camada central. Dez variáveis ausentes e nenhuma conectividade externa validada.
- 18/07/2026 13:35 - Auditoria inicial: `.env.local` e `.env.production` não encontrados; nove variáveis/integrações mapeadas.
