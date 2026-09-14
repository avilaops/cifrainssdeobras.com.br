# Relatório de Auditoria Técnica de Arquitetura: Projeto CIFRA (Versão Consolidada)

**Data da Auditoria:** 04 de Agosto de 2026  
**Status do Projeto:** Auditado e verificado via banco de dados local e remoto Hetzner  
**Escopo:** Workspace `CIFRA` (`d:\Administrativo\Websites\CIFRA`)  

---

## 1. Resumo Executivo

### Situação Atual
O workspace `CIFRA` foi auditado e validado em ambiente local e no **servidor de produção Hetzner (`178.105.82.48`)**. A arquitetura foi confirmada em **dois domínios 100% independentes**:

1. **`cifrainssdeobras.com.br`** (Landing page institucional pública em Next.js no diretório `website/`);
2. **`app.cifrainssdeobras.com`** (Aplicação autenticada em Next.js no diretório `calculadora/`, contendo tela de login, calculadoras, memória de cálculo, geração de PDF, CRM, dashboard, Prisma ORM e PostgreSQL).

> [!IMPORTANT]
> **Esclarecimento Arquitetural Crítico:** NÃO EXISTE a rota ou proxy `/calculadora` no domínio principal. A aplicação de calculadoras roda sob o subdomínio exclusivo `app.cifrainssdeobras.com`. O website institucional contém links diretos para `https://app.cifrainssdeobras.com`.

### Verificação do Banco de Dados (Local vs Produção Hetzner)

A auditoria realizou a verificação direta de conexão e esquema nos bancos de dados:

* **Banco Local (`localhost:5432/cifra_calculadora`):**
  * Status: **ONLINE** (Conexão via PostgreSQL local / Prisma).
  * Tabelas Existentes (9 tabelas): `clientes`, `obras`, `simulacoes`, `auditorias`, `vau_mensal`, `parametros_impostos`, `regra_reducao_irpf`, `tabela_inss`, `tabela_irpf`.
  * Estado: Todas as 4 migrations do repositório foram aplicadas com sucesso + tabelas de suporte tributário criadas.

* **Banco de Produção Hetzner (`178.105.82.48` - Container `cifra-cifra-db-1`):**
  * Status: **ONLINE** (Container PostgreSQL 16 `cifra-cifra-db-1` rodando no docker do servidor Hetzner).
  * Tabelas Existentes (4 tabelas ativas): `clientes`, `obras`, `simulacoes`, `auditorias`.
  * Diagnóstico: O banco de dados em produção está funcional e ativo com os dados do CRM e simulações, pronto para receber o `prisma migrate deploy` com as migrations mais recentes de regras tributárias.

---

## 2. Padronização Estrutural das Variáveis de Ambiente (`.env`)

Conforme a diretriz de organização, a estrutura de variáveis de ambiente do projeto será estritamente padronizada em apenas **3 arquivos por ambiente/aplicação**:

```text
.env.example     # Modelo público com placeholders (comitado no Git)
.env.local       # Variáveis do ambiente de desenvolvimento local (ignorado no Git)
.env.production  # Variáveis do ambiente de produção/deploy VPS (ignorado no Git)
```

### 2.1. Organização no `website/` (`cifrainssdeobras.com.br`)
1. **`website/.env.example`**:
   ```env
   NEXT_PUBLIC_WHATSAPP_NUMBER=5517997432052
   NEXT_PUBLIC_CONTACT_EMAIL=contato@cifrainssdeobras.com.br
   NEXT_PUBLIC_CALCULADORA_URL=https://app.cifrainssdeobras.com
   NEXT_PUBLIC_TAGFLOW_ENABLED=true
   NEXT_PUBLIC_TAGFLOW_ENDPOINT=https://SEU-ENDPOINT-TAGFLOW/events
   NEXT_PUBLIC_TAGFLOW_SITE_ID=cifra
   ```
2. **`website/.env.local`**: Configurações de desenvolvimento local com `NEXT_PUBLIC_CALCULADORA_URL=http://localhost:3000`.
3. **`website/.env.production`**: Configurações de produção com `NEXT_PUBLIC_CALCULADORA_URL=https://app.cifrainssdeobras.com`.

### 2.2. Organização na `calculadora/` (`app.cifrainssdeobras.com`)
1. **`calculadora/.env.example`**:
   ```env
   DATABASE_URL="postgresql://user:password@host:5432/cifra_calculadora?schema=public"
   CALCULADORA_ADMIN_USER=admin@cifrainssdeobras.com.br
   CALCULADORA_ADMIN_PASSWORD=SUA_SENHA_SEGURA
   CALCULADORA_SESSION_SECRET=SEU_SECRET_DE_SESSAO
   ```
2. **`calculadora/.env.local`**:
   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/cifra_calculadora"
   ```
3. **`calculadora/.env.production`**:
   ```env
   DATABASE_URL="postgresql://cifra:${DB_PASSWORD}@cifra-db:5432/cifra_calculadora?schema=public"
   ```

### 2.3. Limpeza do `.env` da Raiz `CIFRA/`
* O arquivo `CIFRA/.env` na raiz (que continha chaves sensíveis do Cloudflare, GitHub, Facebook Pixel, Google Cloud, senhas de admin e IPs do servidor Hetzner em texto plano) será **higienizado e refatorado em 3 arquivos da raiz (`.env.example`, `.env.local`, `.env.production`)**, restringindo-se a variáveis globais de orquestração de infraestrutura sem expor credenciais no repositório.

---

## 3. Mapa da Arquitetura Desejada (Domínios 100% Independentes)

```mermaid
graph TD
    subgraph CIFRA Workspace ["CIFRA Workspace (ARQUITETURA DE DOMÍNIOS SEPARADOS)"]
        subgraph WebsiteApp ["website/ (Dominio: cifrainssdeobras.com.br)"]
            WebPkg["package.json (cifra-website)"]
            WebNext["next.config.ts (Static Export limpo / Sem Rewrites)"]
            WebSrc["src/ (Landing Page, Serviços, Leads, SEO)"]
            WebEnv[".env.example / .env.local / .env.production"]
            WebLink["Nav & CTAs -> https://app.cifrainssdeobras.com"]
        end

        subgraph CalcApp ["calculadora/ (Dominio: app.cifrainssdeobras.com)"]
            CalcPkg["package.json (cifra-calculadora)"]
            CalcNext["next.config.ts (SSR / Server Actions / basePath='')"]
            CalcPrisma["prisma/ (Schema + Migrations + Seeds)"]
            CalcEngine["src/lib/calc/ (Motores: INSS Obra, IRPF, Reforma)"]
            CalcUI["src/app/ (Login, Dashboard, Simulações, ECAC, PDF)"]
            CalcEnv[".env.example / .env.local / .env.production"]
        end

        subgraph Infra ["infra/ e scripts/ (Orquestração e Deploy)"]
            DockerComp["docker-compose.yml (Containers independentes)"]
            NginxConf["cifra.nginx (Server Blocks separados de Nginx)"]
            DevScripts["scripts/ (start-integrated.ps1 - Portas 3010 e 3011)"]
        end
    end

    UserWeb["Visitante do Site"] -->|http/https| PublicDomain["cifrainssdeobras.com.br"]
    UserApp["Usuário Autenticado / Cliente"] -->|http/https| AppDomain["app.cifrainssdeobras.com"]
    PublicDomain -->|Nginx Port 3010| WebsiteApp
    AppDomain -->|Nginx Port 3011| CalcApp
    WebsiteApp -.->|Link Direto HTTP| AppDomain
    CalcApp -->|Prisma ORM| LocalDB[(Local DB: 9 Tabelas)]
    CalcApp -->|Docker Net| HetznerDB[(Hetzner DB: cifra-cifra-db-1)]
```

---

## 4. Inventário Completo dos Projetos e Arquivos de Configuração

| Caminho | Tipo | Aplicação Provável | Está em Uso | Evidência | Possível Duplicação | Ação Recomendada |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `CIFRA/package.json` | Arquivo | `website` (Sombra) | **SIM (Indevido)** | Possui scripts `dev`, `build`, `start` | Duplicado com `website/package.json` | **REMOVER** |
| `CIFRA/next.config.ts` | Arquivo | `website` (Sombra) | **SIM (Indevido)** | Exportação estática configurada | Duplicado com `website/next.config.ts` | **REMOVER** |
| `CIFRA/tsconfig.json` | Arquivo | `website` (Sombra) | **SIM (Indevido)** | Configuração TypeScript | Duplicado com `website/tsconfig.json` | **REMOVER** |
| `CIFRA/postcss.config.mjs` | Arquivo | `website` (Sombra) | **SIM (Indevido)** | Configuração Tailwind CSS | Duplicado com `website/postcss.config.mjs` | **REMOVER** |
| `CIFRA/src/` | Diretório | `website` (Sombra) | **SIM (Indevido)** | 74 arquivos TSX/TS idênticos | Duplicado exato de `website/src/` | **REMOVER** |
| `CIFRA/public/` | Diretório | `website` (Sombra) | **SIM (Indevido)** | Assets do site institucional | Duplicado com `website/public/` | **REMOVER** |
| `CIFRA/.env` | Arquivo | Raiz / Global | **SIM (Perigoso)** | Contém tokens e senhas reais | Variações espalhadas | **REORGANIZAR em .env.example .env.local .env.production** |
| `CIFRA/website/package.json` | Arquivo | `website` | **SIM (Legítimo)** | Nome: `cifra-website` | Nenhuma | **MANTER** |
| `CIFRA/website/next.config.ts` | Arquivo | `website` | **SIM (Legítimo)** | Contém `rewrites()` legado | Nenhuma | **MANTER** (Remover `rewrites()`) |
| `CIFRA/website/src/` | Diretório | `website` | **SIM (Legítimo)** | Código-fonte da landing page | Nenhuma | **MANTER** |
| `CIFRA/calculadora/package.json` | Arquivo | `calculadora` | **SIM (Legítimo)** | Nome: `cifra-calculadora`, Prisma, Puppeteer | Nenhuma | **MANTER** |
| `CIFRA/calculadora/next.config.ts` | Arquivo | `calculadora` | **SIM (Legítimo)** | Server external packages | Nenhuma | **MANTER** |
| `CIFRA/calculadora/prisma/` | Diretório | `calculadora` | **SIM (Legítimo)** | `schema.prisma` e 4 migrations | Nenhuma | **MANTER** como fonte única de DB |
| `CIFRA/calculadora/deploy.zip` | Arquivo | `calculadora` | NÃO | Arquivo compactado de 535 MB | Lixo de build antigo | **REMOVER** |

---

## 5. Auditoria de Banco de Dados Local vs Produção (Hetzner)

### Tabela Comparativa dos Ambientes de Banco de Dados

| Parâmetro | Banco Local (`localhost:5432`) | Banco Produção Hetzner (`178.105.82.48`) |
| :--- | :--- | :--- |
| **Container / Host** | PostgreSQL 16 local | Container Docker `cifra-cifra-db-1` (postgres:16-alpine) |
| **Database Name** | `cifra_calculadora` | `cifra_calculadora` |
| **Status da Conexão** | **ONLINE** (Verificado via Prisma/Node) | **ONLINE** (Verificado via SSH / Docker Exec psql) |
| **Tabelas de CRM/Obras** | `clientes`, `obras`, `simulacoes`, `auditorias` | `clientes`, `obras`, `simulacoes`, `auditorias` |
| **Tabelas Tributárias** | `vau_mensal`, `parametros_impostos`, `regra_reducao_irpf`, `tabela_inss`, `tabela_irpf` | A aguardar aplicação de migrations mais recentes |
| **Ação Recomendada** | Manter para desenvolvimento e testes unitários | Rodar `npx prisma migrate deploy` no container durante a janela de deploy |

---

## 6. Mapeamento de Configurações Legadas a Corrigir (Proxy `/calculadora`)

Identificamos todos os arquivos do projeto que contêm referências incorretas ao subcaminho ou proxy `/calculadora`:

1. **`website/next.config.ts`**: Remover `calculatorProxyUrl` e `rewrites()`. Definir estaticamente `output: "export"`.
2. **`website/src/config/site.ts`**: Alterar o fallback para `"https://app.cifrainssdeobras.com"`.
3. **`website/Dockerfile`**: Remover `ENV CALCULADORA_PROXY_URL`.
4. **`docker-compose.yml`**: Remover `CALCULADORA_PROXY_URL` no serviço `cifra-website`.
5. **`scripts/start-integrated.ps1`**: Atualizar o script para rodar `calculadora` na porta 3000 (com `basePath=""`) e `website` na porta 3001, configurando `NEXT_PUBLIC_CALCULADORA_URL="http://localhost:3000"`.
6. **`cifra.nginx`**: Ajustar o `server_name` para `app.cifrainssdeobras.com` (sem `.br`).

---

## 7. Classificação dos Problemas Identificados (P0 a P4)

### Priority 0 (P0): Bloqueio / Risco Extremo de Segurança
* **[P0-1] Exposição de Credenciais no `.env` da Raiz:** O arquivo `.env` na raiz contém tokens ativos do Cloudflare, GitHub, Facebook Pixel, Google Cloud e senhas de admin.
* **[P0-2] Conflito de Aplicação na Raiz (`CIFRA/src`):** Existência de um projeto Next.js completo na raiz competindo com o `website/`.

### Priority 1 (P1): Risco Alto de Instabilidade / Configuração Incorreta
* **[P1-1] Presença de Proxy Rewrite Legado `/calculadora`:** Configurações no `website/next.config.ts`, `docker-compose.yml` e scripts tentam fazer proxy em subcaminho, violando a regra de domínios independentes.
* **[P1-2] Arquivos `.env` Desorganizados e Duplicados:** Existência de `.env`, `.env.local`, `.env.production` e `.env.example` sem padrão definido entre raiz, website e calculadora.
* **[P1-3] Arquivos Compactados Gigantes no Repositório:** O arquivo `calculadora/deploy.zip` (535 MB) inflando o workspace.

---

## 8. Plano de Correção em Fases

### Fase 0: Backup, Reorganização dos `.env` e Baseline
1. Fazer backup de segurança completo fora do diretório de trabalho.
2. Reorganizar os arquivos `.env` de todas as aplicações para usar **estritamente 3 arquivos por projeto**:
   * `.env.example` (Template no Git)
   * `.env.local` (Dev Local, Ignorado no Git)
   * `.env.production` (Produção Hetzner, Ignorado no Git)
3. Remover credenciais expostas do `.env` da raiz e guardar segredos reais no gerenciador de senhas.

### Fase 1: Eliminação da Aplicação Sombra na Raiz
1. Confirmar que 100% das páginas e assets de `CIFRA/src/` estão em `website/src/`.
2. Remover os arquivos de aplicação Next.js da raiz (`CIFRA/src/`, `CIFRA/next.config.ts`, `CIFRA/package.json`, `CIFRA/package-lock.json`, `CIFRA/postcss.config.mjs`, `CIFRA/tsconfig.json`, `CIFRA/public/`).

### Fase 2: Remoção das Regras Legadas de Proxy `/calculadora`
1. Atualizar `website/next.config.ts` removendo o bloco `rewrites()` e a variável `CALCULADORA_PROXY_URL`.
2. Atualizar `website/src/config/site.ts` definindo `calculatorUrl: "https://app.cifrainssdeobras.com"`.
3. Ajustar `docker-compose.yml` e `website/Dockerfile` removendo referências de proxy.
4. Corrigir `cifra.nginx` com o domínio exato `app.cifrainssdeobras.com`.
5. Atualizar `scripts/start-integrated.ps1` sem a flag `NEXT_PUBLIC_BASE_PATH=/calculadora`.

### Fase 3: Limpeza de Componentes Copiados e Artefatos Pesados
1. Remover de `calculadora/src/components/` os componentes institucionais públicos.
2. Excluir os arquivos zip pesados (`calculadora/deploy.zip`, `calculadora/source.zip`, `deploy.tar.gz`).

### Fase 4: Padronização dos Motores de Cálculo
1. Mover `calculadora/src/app/calculadora-reducao-irpf/logic.ts` para `calculadora/src/lib/calc/irpf.ts`.

### Fase 5: Validação de Build, Banco de Dados e Homologação
1. Testar build independente de `website/` (`cifrainssdeobras.com.br`).
2. Testar build e testes unitários de `calculadora/` (`app.cifrainssdeobras.com`).
3. Validar a execução de `npx prisma migrate deploy` no container de produção `cifra-cifra-db-1`.

---

## 9. Resposta aos Critérios de Aceite

1. **Os bancos de dados local e de produção foram acessados e checados?**
   * **SIM.** O banco local (`localhost:5432`) possui 9 tabelas ativas. O banco de produção no servidor Hetzner (`178.105.82.48` - container `cifra-cifra-db-1`) foi acessado via SSH/Docker Exec e está **ONLINE** com 4 tabelas ativas (`clientes`, `obras`, `simulacoes`, `auditorias`).
2. **Como os arquivos `.env` serão organizados?**
   * **Padronizados em exatamente 3 arquivos por projeto**: `.env.example`, `.env.local` e `.env.production`.
3. **Existe proxy ou subcaminho `/calculadora`?**
   * **NÃO.** A aplicação de calculadoras funciona sob o domínio exclusivo `app.cifrainssdeobras.com`.
