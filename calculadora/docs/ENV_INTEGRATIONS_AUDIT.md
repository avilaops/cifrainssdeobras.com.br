# Auditoria de variáveis e integrações

## Resumo
- Data e hora da auditoria: 2026-07-22 07:03:00 -03:00
- Arquivos analisados: `.env.local`
- Arquivos ausentes: `.env.production`
- Quantidade total de variáveis encontradas: 1
- Quantidade total de ferramentas identificadas: 3
- Quantidade de ferramentas referenciadas no código: 3
- Quantidade de ferramentas com conectividade validada: 1
- Quantidade de ferramentas funcionais: 1
- Quantidade de variáveis não utilizadas: 0
- Quantidade de variáveis ausentes: 4
- Quantidade de inconsistências encontradas: 5

## Ferramentas disponíveis

| Ferramenta | Variáveis relacionadas | Ambiente | Referenciada no código | Arquivos de referência | Teste realizado | Status |
|---|---|---|---|---|---|---|
| PostgreSQL via Prisma | `DATABASE_URL` | Local | Sim | `prisma.config.ts`, `src/lib/prisma.ts` | `prisma migrate status` e create/delete controlado via Prisma | Conectividade validada |
| Autenticação da calculadora | `CALCULADORA_ADMIN_USER`, `CALCULADORA_ADMIN_PASSWORD`, `CALCULADORA_SESSION_SECRET` | Processo local temporário | Sim | `src/lib/auth.ts`, `src/app/login/actions.ts`, `src/proxy.ts` | Testes automatizados de assinatura e adulteração | Configurada e referenciada |
| Base path da calculadora | `NEXT_PUBLIC_BASE_PATH` | Processo local temporário | Sim | `next.config.ts`, `src/proxy.ts`, `src/app/login/actions.ts`, `src/components/pdf-button.tsx` | Build com `/calculadora` | Configurada e referenciada |

## Inventário de variáveis

| Variável | Arquivo de origem | Ferramenta | Referenciada | Quantidade de referências | Arquivos | Situação |
|---|---|---|---|---:|---|---|
| `DATABASE_URL` | `.env.local` | PostgreSQL via Prisma | Sim | 2 | `prisma.config.ts`, `src/lib/prisma.ts` | Referenciada e utilizada |
| `CALCULADORA_ADMIN_USER` | Ausente | Autenticação da calculadora | Sim | 1 | `src/lib/auth.ts` | Referenciada no código, mas ausente no ambiente |
| `CALCULADORA_ADMIN_PASSWORD` | Ausente | Autenticação da calculadora | Sim | 2 | `src/lib/auth.ts` | Referenciada no código, mas ausente no ambiente |
| `CALCULADORA_SESSION_SECRET` | Ausente | Autenticação da calculadora | Sim | 1 | `src/lib/auth.ts` | Referenciada no código, mas ausente no arquivo de ambiente |
| `NEXT_PUBLIC_BASE_PATH` | Ausente | Base path da calculadora | Sim | 5 | `next.config.ts`, `src/proxy.ts`, `src/app/login/actions.ts`, `src/components/pdf-button.tsx` | Referenciada no código, mas ausente no arquivo de ambiente |

## Variáveis usadas no código e ausentes no ambiente

Variáveis referenciadas no código e ausentes em `.env.local`:

- `CALCULADORA_ADMIN_USER`
- `CALCULADORA_ADMIN_PASSWORD`
- `CALCULADORA_SESSION_SECRET`
- `NEXT_PUBLIC_BASE_PATH`

`.env.production` não existe, portanto `DATABASE_URL`, `CALCULADORA_ADMIN_USER` e `CALCULADORA_ADMIN_PASSWORD` estão ausentes no ambiente de produção.

## Variáveis declaradas e aparentemente não utilizadas

Nenhuma variável declarada em `.env.local` ficou sem referência encontrada. Referências dinâmicas podem não ser detectadas.

## Comparação local versus produção

| Variável | `.env.local` | `.env.production` | Observação |
|---|---|---|---|
| `DATABASE_URL` | Presente | Ausente | Necessária para Prisma em produção se houver persistência de simulações |
| `CALCULADORA_ADMIN_USER` | Ausente | Ausente | Necessária para proteger a calculadora em produção |
| `CALCULADORA_ADMIN_PASSWORD` | Ausente | Ausente | Necessária para proteger a calculadora em produção |
| `CALCULADORA_SESSION_SECRET` | Ausente | Ausente | Necessária para assinar o cookie de sessão fora do processo local atual |
| `NEXT_PUBLIC_BASE_PATH` | Ausente | Ausente | Usada como `/calculadora` na execução integrada local |

## Testes de conectividade

| Ferramenta | Endpoint mascarado | Método HTTP | Código de resposta | Resultado resumido | Data do teste |
|---|---|---|---|---|---|
| PostgreSQL via Prisma | Banco local via `DATABASE_URL` mascarado | Prisma Client | N/A | Conexão validada; migrations atualizadas; create/delete controlado em `simulacoes` concluído sem persistir registro de teste | 2026-07-22 05:31:55 -03:00 |
| Autenticação Basic Auth da calculadora | N/A | N/A | N/A | Teste não executado; usuário e senha não estão configurados no ambiente | 2026-07-22 05:41:30 -03:00 |
| Login integrado da calculadora | `/calculadora/login` | GET | 200 | Tela de login acessível pelo website CIFRA | 2026-07-22 06:19:48 -03:00 |
| Health integrado da calculadora | `/calculadora/api/health` | GET | 200 | Banco conectado através da rota integrada | 2026-07-22 06:19:48 -03:00 |

## Recomendações

- Criar `.env.production` com `DATABASE_URL` antes de deploy que salve simulações.
- Configurar `CALCULADORA_ADMIN_USER` e `CALCULADORA_ADMIN_PASSWORD` no ambiente de produção.
- Configurar `CALCULADORA_SESSION_SECRET` fora do código em qualquer ambiente persistente.
- Repetir `prisma migrate deploy` no ambiente de produção antes de publicar a calculadora com persistência.
- Adicionar validação tipada de ambiente para falhar cedo quando `DATABASE_URL` estiver ausente no servidor.
- Não há evidência de exposição de credenciais; rotação não é indicada por esta auditoria.

## Histórico de auditorias

- 2026-07-22 07:03:00 -03:00: arquivos reavaliados após correção do redirect com base path; `.env.local` mantém apenas `DATABASE_URL` e `.env.production` continua ausente.
- 2026-07-22 06:38:00 -03:00: referências recontadas após autenticação assinada e PDF; 1 variável local, 4 ausentes e nenhum valor sensível registrado.
- 2026-07-22 06:19:48 -03:00: calculadora integrada ao website em `/calculadora`; login e health validados; novas variáveis ainda existem apenas no processo local temporário.
- 2026-07-22 05:41:30 -03:00: adicionadas variáveis esperadas de autenticação da calculadora; ambas ainda ausentes nos ambientes locais e de produção.
- 2026-07-22 05:31:55 -03:00: `DATABASE_URL` local validada com Prisma; schema do banco atualizado; `.env.production` permanece ausente.
- 2026-07-22 05:08:30 -03:00: auditoria inicial da calculadora; 1 variável local, 1 ferramenta identificada, `.env.production` ausente.
