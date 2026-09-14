# Operação do site CIFRA

Este arquivo é a fonte de verdade versionada para acompanhar a saúde técnica do
site `cifrainssdeobras.com.br`. Credenciais e segredos nunca devem ser
registrados aqui; eles permanecem nas variáveis de ambiente da VPS.

## Painel atual

Atualizado em: 19/08/2026

| Área | Estado | Evidência atual | Próxima revisão |
| --- | --- | --- | --- |
| Produção | Aprovado | Home e rotas estratégicas retornando HTTP 200 | Após cada deploy |
| Calculadora | Aprovado | `/calculadora/` redireciona ao login de `app.cifrainssdeobras.com.br` | Após cada deploy |
| Build | Aprovado | TypeScript e 22 rotas estáticas | Após cada mudança |
| Dependências | Aprovado | `npm audit --omit=dev` com zero vulnerabilidades | Semanal |
| JavaScript inicial | Em melhoria | Home reduzida de 197 KB para 157 KB | A cada release |
| Segurança HTTP | Aprovado | CSP, HSTS, Permissions Policy, Referrer Policy, nosniff e proteção de frame | Mensal |
| Analytics | Parcial | GA4 recebeu `page_view` após consentimento; validar também no painel Realtime | Semanal |
| Tagflow | Aguardando endpoint | Placeholder é bloqueado pelo código e não gera requisições | Quando houver endpoint real |
| Core Web Vitals | A medir | Requer medição de campo e trace com Chrome DevTools | Mensal |
| Uptime | Preparado | Endpoint `/healthz` disponível para monitor externo | Diário |

## Rotina após cada deploy

- [ ] Confirmar `HTTP 200` na home.
- [ ] Confirmar `HTTP 200` em `/robots.txt`, `/sitemap.xml` e `/manifest.webmanifest`.
- [ ] Confirmar o redirecionamento de `/calculadora/` para o login correto.
- [ ] Abrir a home em desktop e mobile.
- [ ] Abrir e fechar o menu mobile.
- [ ] Testar as três escolhas do aviso de cookies.
- [ ] Conferir console sem erros.
- [ ] Conferir envio do `page_view` somente após consentimento de métricas.
- [ ] Conferir CSP, HSTS, `X-Content-Type-Options` e `X-Frame-Options`.
- [ ] Registrar data, responsável, resultado e evidência no histórico abaixo.

## Rotina semanal

- [ ] Rodar `npm audit --omit=dev`.
- [ ] Verificar Search Console: cobertura, sitemap, páginas excluídas e ações manuais.
- [ ] Verificar GA4: sessões, conversões, origem/mídia e páginas de entrada.
- [ ] Verificar disponibilidade e latência do `/healthz`.
- [ ] Testar formulário, WhatsApp, telefone, e-mail e calculadora.
- [ ] Conferir erros 4xx/5xx nos logs da borda e da VPS.

## Rotina mensal

- [ ] Medir LCP, INP e CLS em dados de campo e em laboratório.
- [ ] Revisar títulos, descrições, canonicals, sitemap e dados estruturados.
- [ ] Revisar dependências, imagem Docker e versão do Nginx.
- [ ] Testar restauração do serviço e documentar o tempo de recuperação.
- [ ] Revisar política de cookies, privacidade e retenção de dados.
- [ ] Comparar conversão por dispositivo, canal e página de entrada.

## Indicadores comerciais

| Indicador | Fórmula | Meta inicial |
| --- | --- | --- |
| Conversão em lead | Leads válidos / sessões | 10% ou mais nas landing pages |
| Clique no WhatsApp | Cliques únicos / sessões | Acompanhar tendência semanal |
| Lead qualificado | Leads qualificados / leads totais | Definir após 30 dias de dados |
| CAC | Investimento comercial / novos clientes | Abaixo do LTV dividido por 3 |
| LTV/CAC | Valor do cliente / custo de aquisição | 3 ou mais |
| Abandono do formulário | Inícios sem envio / inícios | Redução contínua |

## Histórico de publicação

| Data | Alteração | Validação | Responsável |
| --- | --- | --- | --- |
| 19/08/2026 | Performance, calculadora, Nginx, headers e analytics pós-consentimento | Build, Docker, desktop, mobile, HTTP e navegador real aprovados | Avila Ops |
