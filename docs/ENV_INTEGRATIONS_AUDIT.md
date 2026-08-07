# Auditoria de variáveis e integrações

## Resumo

- Data e hora da auditoria: 22/07/2026, 01:25 (America/Sao_Paulo).
- Arquivos analisados: `.env.local` (não encontrado) e `.env.production` (não encontrado).
- Quantidade total de variáveis encontradas nos arquivos auditados: 0.
- Quantidade total de ferramentas identificadas: 7.
- Quantidade de ferramentas referenciadas no código: 7.
- Quantidade de ferramentas testadas: 1.
- Quantidade de ferramentas funcionais: 1 (GitHub Pages/domínio público).
- Quantidade de ferramentas com conectividade validada: 1.
- Quantidade de variáveis não utilizadas: 0.
- Quantidade de variáveis ausentes: 9.
- Quantidade de inconsistências encontradas: 11 (9 variáveis exigidas pelo código e 2 arquivos de ambiente ausentes).

Existe um arquivo `.env` na raiz do workspace, fora do diretório da aplicação. Seus valores não foram lidos, comparados ou documentados. A publicação atual usa Tagflow como fronteira central de analytics, porém o workflow define `NEXT_PUBLIC_TAGFLOW_ENABLED=false`. Não foram encontrados contêiner GTM, `dataLayer`, carregamento de `gtag.js` ou identificador GA4 válido no código-fonte nem no HTML público. Assim, GTM e GA4 não estão comprovadamente configurados ou coletando dados.

## Ferramentas disponíveis

| Ferramenta | Variáveis relacionadas | Ambiente | Referenciada no código | Arquivos de referência | Teste realizado | Status |
|---|---|---|---|---|---|---|
| Next.js / base path | `NEXT_PUBLIC_BASE_PATH` | Local e produção | Sim | `next.config.ts`, `src/app/manifest.ts`, `.github/workflows/deploy-pages.yml` | Typecheck e build local; 21 páginas estáticas geradas | Referenciada, mas não configurada. |
| WhatsApp | `NEXT_PUBLIC_WHATSAPP_NUMBER` | Local e produção | Sim | `src/config/contact.ts` | Não realizado: exige destino real | Erro de configuração. |
| E-mail comercial | `NEXT_PUBLIC_CONTACT_EMAIL` | Local e produção | Sim | `src/config/contact.ts` | Não realizado | Referenciada, mas não configurada. |
| Instagram | `NEXT_PUBLIC_INSTAGRAM_URL` | Local e produção | Sim | `src/config/contact.ts` | Não realizado | Referenciada, mas não configurada. |
| Facebook | `NEXT_PUBLIC_FACEBOOK_URL` | Local e produção | Sim | `src/config/contact.ts` | Não realizado | Referenciada, mas não configurada. |
| Tagflow | `NEXT_PUBLIC_TAGFLOW_ENABLED`, `NEXT_PUBLIC_TAGFLOW_ENDPOINT`, `NEXT_PUBLIC_TAGFLOW_SITE_ID`, `NEXT_PUBLIC_TAGFLOW_DEBUG` | Local e produção | Sim | `src/config/tagflow.ts`, `src/lib/tagflow.ts`, `src/components/tagflow/tagflow-tracker.tsx`, `.github/workflows/deploy-pages.yml` | HTML público inspecionado por GET; cliente presente, envio desabilitado | Erro de configuração. |
| GitHub Pages | `NEXT_PUBLIC_BASE_PATH` | Produção/workflow | Sim | `.github/workflows/deploy-pages.yml`, `next.config.ts` | GET na página pública, domínio, `robots.txt` e `sitemap.xml`; HTTP 200 | Conectividade validada. |

GTM e GA4 foram procurados como possíveis destinos de analytics, mas não entram na contagem de ferramentas configuradas porque não há variável, tag, contêiner ou snippet direto correspondente no projeto. A existência do código Tagflow não prova que esses destinos estejam cadastrados no serviço.

## Inventário de variáveis

| Variável | Arquivo de origem | Ferramenta | Referenciada | Quantidade de referências | Arquivos | Situação |
|---|---|---|---|---:|---|---|
| `NEXT_PUBLIC_BASE_PATH` | Ausente | Next.js / base path | Sim | 2 | `next.config.ts`, `src/app/manifest.ts` | Referenciada no código, mas ausente nos ambientes; definida apenas no workflow de produção. |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Ausente | WhatsApp | Sim | 1 | `src/config/contact.ts` | Referenciada no código, mas ausente; fallback de placeholder. |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Ausente | E-mail comercial | Sim | 1 | `src/config/contact.ts` | Referenciada no código, mas ausente no ambiente. |
| `NEXT_PUBLIC_INSTAGRAM_URL` | Ausente | Instagram | Sim | 1 | `src/config/contact.ts` | Referenciada no código, mas ausente no ambiente. |
| `NEXT_PUBLIC_FACEBOOK_URL` | Ausente | Facebook | Sim | 1 | `src/config/contact.ts` | Referenciada no código, mas ausente no ambiente. |
| `NEXT_PUBLIC_TAGFLOW_ENABLED` | Ausente | Tagflow | Sim | 1 | `src/config/tagflow.ts` | Ausente nos ambientes; configurada como `false` no workflow. |
| `NEXT_PUBLIC_TAGFLOW_ENDPOINT` | Ausente | Tagflow | Sim | 1 | `src/config/tagflow.ts` | Referenciada no código, mas ausente no ambiente e no workflow. |
| `NEXT_PUBLIC_TAGFLOW_SITE_ID` | Ausente | Tagflow | Sim | 1 | `src/config/tagflow.ts` | Referenciada no código, mas ausente; usa fallback não secreto. |
| `NEXT_PUBLIC_TAGFLOW_DEBUG` | Ausente | Tagflow | Sim | 1 | `src/config/tagflow.ts` | Referenciada no código, mas ausente; usa fallback desabilitado. |

Contagens consideram referências executáveis; menções em README e relatórios não foram contabilizadas como uso no código.

## Variáveis usadas no código e ausentes no ambiente

Como `.env.local` e `.env.production` não existem, estão ausentes nos dois ambientes: `NEXT_PUBLIC_BASE_PATH`, `NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_CONTACT_EMAIL`, `NEXT_PUBLIC_INSTAGRAM_URL`, `NEXT_PUBLIC_FACEBOOK_URL`, `NEXT_PUBLIC_TAGFLOW_ENABLED`, `NEXT_PUBLIC_TAGFLOW_ENDPOINT`, `NEXT_PUBLIC_TAGFLOW_SITE_ID` e `NEXT_PUBLIC_TAGFLOW_DEBUG`.

`NEXT_PUBLIC_BASE_PATH` e `NEXT_PUBLIC_TAGFLOW_ENABLED` recebem valores no workflow de publicação, mas isso não substitui os dois arquivos auditados nem configura o endpoint do Tagflow.

## Variáveis declaradas e aparentemente não utilizadas

Nenhuma, pois `.env.local` e `.env.production` não existem. Referências dinâmicas podem não ser detectadas pela busca estática.

## Comparação local versus produção

Não foi possível comparar presença ou nomenclatura porque os dois arquivos estão ausentes. Nenhum valor secreto foi comparado ou documentado.

## Testes de conectividade

| Ferramenta | Endpoint mascarado | Método HTTP | Código | Resultado resumido | Data do teste |
|---|---|---|---:|---|---|
| Site/domínio oficial | `https://cifrainssdeobras.com.br/` | GET | 200 | Página pública acessível. | 22/07/2026 |
| GitHub Pages | `https://avilaops.github.io/cifra/` | GET | 200 | Espelho público acessível. | 22/07/2026 |
| SEO técnico | `https://cifrainssdeobras.com.br/robots.txt` | GET | 200 | Arquivo acessível. | 22/07/2026 |
| SEO técnico | `https://cifrainssdeobras.com.br/sitemap.xml` | GET | 200 | Sitemap acessível. | 22/07/2026 |
| GTM/GA4 | Página pública, sem query string | GET | 200 | Nenhum contêiner GTM, `dataLayer`, `gtag.js` ou Measurement ID GA4 válido detectado. | 22/07/2026 |
| Tagflow | Página pública, sem query string | GET | 200 | Cliente Tagflow presente no bundle, mas desabilitado no build de produção; destino não validado. | 22/07/2026 |

Nenhum POST, PUT, PATCH ou DELETE foi executado. Nenhum painel de Tagflow, GTM ou GA4 foi acessado; portanto, não há comprovação de eventos ou destinos ativos.

## Recomendações

- Definir uma única arquitetura de mensuração. Se Tagflow continuar como fronteira central, configurar seu endpoint e os destinos GTM/GA4 no painel/servidor, mantendo credenciais fora do frontend. Evitar instalar uma segunda coleta direta sem decisão explícita.
- Validar GA4 pelo relatório Tempo real/DebugView e pelo Tag Assistant somente após a configuração; a simples presença de uma variável ou script não basta.
- Criar `.env.local` e `.env.production` a partir de um modelo controlado, preenchendo apenas dados reais e mantendo arquivos com credenciais fora do Git.
- Substituir o fallback de WhatsApp antes de considerar o fluxo comercial pronto.
- Adicionar validação tipada das variáveis no build, separando obrigatórias de opcionais e falhando produção quando analytics estiver habilitado sem endpoint HTTPS.
- Manter `robots.txt`, `sitemap.xml`, canonicals, metadados por página e Schema.org já presentes; complementar SEO local somente com dados empresariais reais (nome, telefone, endereço ou área de atendimento).
- Validar manualmente Search Console, Core Web Vitals, indexação do sitemap e consistência do Perfil da Empresa no Google; esses estados não são demonstráveis apenas pelo repositório.
- Não criar Perfil da Empresa no Google se a empresa for exclusivamente on-line ou geração de leads. Confirmar atendimento presencial no endereço ou visita presencial ao cliente antes do cadastro.

## Histórico de auditorias

- 22/07/2026 - Domínio, GitHub Pages, robots e sitemap responderam HTTP 200; GTM/GA4 não detectados e Tagflow confirmado como desabilitado na publicação.
- 18/07/2026 15:00 - Deploy migrado e validado no GitHub Pages; projeto temporário do Cloudflare Pages removido.
- 18/07/2026 14:26 - Deploy no Cloudflare Pages validado por GET; domínio oficial associado, ainda pendente de DNS/TLS.
- 18/07/2026 13:52 - Analytics direto removido; Tagflow registrado como camada central. Dez variáveis ausentes e nenhuma conectividade externa validada.
- 18/07/2026 13:35 - Auditoria inicial: `.env.local` e `.env.production` não encontrados; nove variáveis/integrações mapeadas.
