# CIFRA - Consultoria Tributária de Obra (Portal do Cliente)

Sistema integrado (Calculadora + Website) para planejamento tributário e cálculo de redução de INSS de obra e Reforma Tributária.

> 📚 **[Acessar a Base de Conhecimento e Acervo Documental (Leis, Regras e Manuais)](file:///D:/Administrativo/Websites/CIFRA/docs/README.md)**

## Módulos do Sistema

## Arquitetura e Integração
Este projeto é uma aplicação **Next.js (App Router)** rodando em modo Server-Side Rendering (SSR). 
Ele funciona de forma independente, mas está **visualmente e estruturalmente integrado ao Website da CIFRA** (que é estático).

A integração ocorre via proxy no `website` (Next.js rewrites).
- O site roda na porta `3001` e a calculadora na porta `3002`.
- Requisições para `cifrainssdeobras.com.br/calculadora` são interceptadas pelo site e redirecionadas silenciosamente para esta aplicação.
- A calculadora compartilha os mesmos componentes de layout (Topbar, Header, Footer) para garantir uma experiência unificada e premium para o cliente.

## Tecnologias e Banco de Dados
- **ORM**: Prisma (`@prisma/client`)
- **Banco de Dados**: PostgreSQL
- **Geração de PDF**: `pdf-lib` para geração automática de relatórios de simulação.
- **Estilo**: TailwindCSS unificado com as cores da CIFRA.

## Desenvolvimento Local
Para rodar a calculadora junto com o site de forma integrada, utilize o script na raiz do repositório:
```bash
# Na pasta raiz do monorepo
.\scripts\start-integrated.ps1 -AdminUser "seu_usuario" -AdminPassword (ConvertTo-SecureString "sua_senha" -AsPlainText -Force) -SessionSecret (ConvertTo-SecureString "seu_secret" -AsPlainText -Force)
```

## Diferencial e Slogan
> *"Reduza o INSS da sua obra com planejamento, segurança e conformidade."*
Este projeto materializa a entrega de valor da CIFRA, permitindo cálculos rápidos, armazenamento de simulações e, no futuro, captação de leads.
