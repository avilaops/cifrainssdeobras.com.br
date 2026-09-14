# CIFRA, Website e Calculadora de INSS de Obra

Plataforma digital da **CIFRA, Consultoria Tributária de Obra**, especializada em INSS de obra, CNO, SERO, aferição e regularização tributária.

O projeto reúne:

1. website: site institucional desenvolvido em Next.js e preparado para exportação estática;
2. calculadora: aplicação dinâmica utilizada para simulações e operações internas;
3. infraestrutura de proxy: responsável por encaminhar /calculadora para a aplicação dinâmica.

> Importante: a redução do INSS depende das características e da documentação de cada obra. A plataforma não garante percentual de economia antes da análise técnica.

## Visão geral

O objetivo da plataforma é estabelecer a presença digital da CIFRA e fornecer uma ferramenta robusta para o cálculo e planejamento tributário de obras civis. A experiência do cliente (Website) é separada da operação (Calculadora), mas ambas compartilham a mesma identidade visual e sistema de design para uma experiência unificada.

## Status do projeto

- **Website**: Em produção (cifrainssdeobras.com.br).
- **Calculadora**: Rota /calculadora em desenvolvimento/homologação. Atualmente dependente de deploy de backend e configuração de proxy reverso em produção.

## Funcionalidades

### Website (Público)
* Página inicial otimizada para conversão (Landing Page);
* Páginas institucionais: Sobre, Serviços (INSS de obra, CNO, SERO, Aferição, Planejamento), Parceiros e Contato;
* Páginas legais: Política de Privacidade, Termos de Uso e Procuração Eletrônica;
* Formulário de análise inicial integrado ao WhatsApp;
* Banner e gerenciamento de preferências de cookies (LGPD);
* PWA configurado (manifest.webmanifest).

### Calculadora (Interno/Dinâmico)
* Autenticação e sessão segura;
* Simulador detalhado de INSS de obra;
* Armazenamento de histórico de simulações no banco de dados;
* Geração de relatórios PDF.

## Arquitetura

O sistema adota uma arquitetura de **Monorepo com Frontends Desacoplados**.
- O **Website** é um Single Page Application (exportação estática), hospedado via CDN (ex.: Cloudflare Pages ou GitHub Pages). Ele entrega máxima performance, segurança e SEO.
- A **Calculadora** é uma aplicação Server-Side Rendered (SSR) com conexão a banco de dados relacional.

## Estrutura do monorepo

`
/
├── website/             # Site institucional (Next.js - Static Export)
├── calculadora/         # Aplicação interna (Next.js - SSR + Prisma)
├── scripts/             # Scripts de automação (Powershell)
└── inss-obra-facil/     # (Outros pacotes do ecossistema)
`

## Tecnologias

- **Framework**: Next.js (App Router) em ambos os projetos.
- **Linguagem**: TypeScript.
- **Estilização**: TailwindCSS (v4).
- **Banco de Dados (Calculadora)**: PostgreSQL + Prisma ORM.
- **Ícones**: Lucide React.
- **Animações**: Framer Motion.
- **Geração de PDF**: pdf-lib.
- **Gerenciador de Pacotes**: npm.
- **Node.js**: Versão mínima recomendada v20.x.

## Pré-requisitos

- Node.js (v20+)
- npm (v10+)
- PostgreSQL rodando localmente ou URL de conexão válida (para a calculadora).

## Instalação

Na raiz de cada projeto (website/ e calculadora/), execute:

`ash
npm install
`

## Variáveis de ambiente

### website/.env.local
* NEXT_PUBLIC_WHATSAPP_NUMBER: Número no formato internacional (ex: 5517997432052).
* NEXT_PUBLIC_TAGFLOW_ENABLED: 	rue ou alse.
* NEXT_PUBLIC_TAGFLOW_ENDPOINT: Endpoint de ingestão.
* NEXT_PUBLIC_TAGFLOW_SITE_ID: cifra.
* NEXT_PUBLIC_TAGFLOW_DEBUG: 	rue em dev para visualizar os logs.
* CALCULADORA_PROXY_URL: (Usado apenas localmente) URL de destino do proxy reverso.

### calculadora/.env.local
* DATABASE_URL: String de conexão com o PostgreSQL.
* NEXT_PUBLIC_BASE_PATH: /calculadora (para os assets resolverem corretamente na rota do proxy).
* CALCULADORA_ADMIN_USER: Usuário de acesso à calculadora.
* CALCULADORA_ADMIN_PASSWORD: Senha em formato hash ou texto (dependendo da implementação de auth).
* SESSION_SECRET: Chave para assinar cookies/sessões.

## Desenvolvimento local

### Executar separadamente
- **Website**: cd website -> 
pm run dev (Porta padrão: 3000)
- **Calculadora**: cd calculadora -> 
pm run dev (Porta padrão: 3000)

### Executar o monorepo completo (Integrado)
Na raiz do repositório, utilize o script Powershell para subir ambos os projetos com o proxy automático:

`powershell
.\scripts\start-integrated.ps1 -AdminUser "admin" -AdminPassword (ConvertTo-SecureString "123456" -AsPlainText -Force) -SessionSecret (ConvertTo-SecureString "secreto" -AsPlainText -Force)
`
Isso iniciará o site na porta **3001** e a calculadora na porta **3002**. Ao acessar http://localhost:3001/calculadora, o tráfego será perfeitamente roteado.

## Scripts disponíveis

* 
pm run dev: Inicia o servidor de desenvolvimento.
* 
pm run build: Gera o build de produção (exportação estática no website, build SSR na calculadora).
* 
pm run lint: Executa validações de código.
* 
pm run typecheck: Valida a tipagem TypeScript (	sc --noEmit).
* 
pm run test: Roda os testes unitários via Vitest.

## Rotas públicas

O website responde pelas rotas / (Home), /sobre, /servicos, /parceiros, /contato, /politica-de-privacidade, /termos-de-uso e /obrigado (oculta de indexação).

## Formulário e integração com WhatsApp

O formulário principal atua como um captador de leads. Ele coleta o Tipo de Obra e a Área e redireciona o usuário para o WhatsApp formatando automaticamente a mensagem. Dados sensíveis do formulário **não** são gravados no frontend, apenas classificados para o envio ao WhatsApp e aos eventos do Tagflow.

## Calculadora

A calculadora é protegida por autenticação local e permite cadastrar clientes, salvar simulações (INSS devido, Economia e Honorários) e emitir os cálculos finais. 
Sua interface visual é idêntica à do site, pois os componentes de Header e Footer são compartilhados, criando uma imersão total.

## Proxy reverso

**ATENÇÃO**: Um site Next.js exportado (output: "export") **não executa proxy reverso (rewrites) em tempo de execução**. 
As configurações em 
ext.config.ts só afetam o ambiente local. 

Para que a rota /calculadora/ funcione em produção:
1. O backend da calculadora precisa estar hospedado e acessível publicamente (ex.: Render, Vercel, Railway).
2. O servidor CDN do website (ex.: Cloudflare Pages, Nginx, Caddy) deve realizar o proxy HTTP Status 200 da rota /calculadora/* para a URL da calculadora.
*(Um arquivo public/_redirects foi fornecido no website para gerenciar esse proxy via Cloudflare Pages).*

## Tagflow e eventos

A CIFRA envia eventos públicos e anonimizados ao Tagflow. Meta Pixel, GA4 e Google Ads são acionados **pelo servidor do Tagflow**, nunca carregados no frontend para garantir velocidade máxima e compliance.
* **Eventos mapeados**: page_view, iew_form, orm_start, orm_submit, equest_quote, lead, click_whatsapp, click_phone, click_email, cookie_consent_update.

## Consentimento e LGPD

O banner de cookies gerencia as preferências (Marketing, Analytics). Os dados inseridos no formulário (Nome, Telefone, E-mail) trafegam exclusivamente via link de WhatsApp (criptografia de ponta a ponta) direto para o consultor CIFRA. O banco de dados da calculadora possui políticas de restrição de acesso e não é indexado pelo Google.

## SEO e indexação

* obots.txt e sitemap.xml otimizados e dinâmicos;
* Canonical URLs, Open Graph (OG) e Twitter Cards configurados em todos os metadados.
* Schema.org (JSON-LD) completo com Organization, WebSite, ProfessionalService e FAQPage implementados para leitura rica pelos motores de busca.
* A URL /calculadora é propositalmente bloqueada de indexação (obots: noindex).

## Build

* No website, o comando 
pm run build cria os artefatos na pasta out/.
* Na calculadora, o build gera o pacote padrão .next/.

## Deploy

* **Website**: Pode ser deployado no Cloudflare Pages conectando a branch principal. O comando de build é 
pm run build e o diretório de saída é out.
* **Calculadora**: O deploy requer um Web Service compatível com Node.js + Banco de Dados (como Render ou Railway). O comando de start é 
pm run start.

## Validação

1. **Testes locais**: Use 
pm run test (Vitest).
2. **Homologação do Tagflow**: Confirme os eventos em ?utm_source=teste observando o console do navegador e o painel remoto do Tagflow.
3. **Build local**: Sempre valide 
pm run typecheck antes do commit.

## Segurança

* Nenhuma secret token no client-side (.env vs NEXT_PUBLIC_).
* A senha da calculadora deve usar hash no banco de dados.
* Proteção contra vazamento de CNDs e dados fiscais do cliente nas rotas da calculadora.

## Troubleshooting

- **Rota /calculadora retornando 404 em Produção**: O provedor estático (Cloudflare) não está interpretando o _redirects ou o servidor de backend da calculadora está offline. Verifique os logs do Cloudflare Pages e certifique-se de que a calculadora terminou o deploy.
- **Formulário do WhatsApp não abre**: Verifique se a variável NEXT_PUBLIC_WHATSAPP_NUMBER está definida e se não há bloqueadores de pop-up agressivos no navegador do cliente.
