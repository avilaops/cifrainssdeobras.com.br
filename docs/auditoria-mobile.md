# Auditoria mobile do app CIFRA

Data: 03/09/2026
Alvo: `app.cifrainssdeobras.com.br` (pasta `calculadora/`)
Base: telas do iPhone enviadas pelo Nicolas + leitura do código em `/opt/cifra` (idêntico à árvore local nos arquivos auditados).

Os problemas estão em ordem de gravidade. Cada um aponta o arquivo e a linha.

---

## 0. O que só apareceu no screenshot real

### 0.1 O conteúdo ocupava 60% da tela

**Onde:** `calculadora/src/app/layout.tsx:44` (antes da correção)

```tsx
<body className="flex h-full min-h-screen bg-[#f5f5ef]">
  <AppSidebar />
  <div className="flex min-w-0 flex-1 flex-col ...">
```

O `AppSidebar` devolve um fragmento com três irmãos: a barra do menu do celular (`sticky ... md:hidden`), o overlay e o `<aside>`. Com o `body` em `flex` (linha), a barra do menu virava um **item de flex ao lado do conteúdo**: uma coluna vazia de ~40% à esquerda, em toda tela do app no celular. É a faixa clara à esquerda nas 4 fotos originais (e a razão de os cartões, filtros e tabelas parecerem espremidos).

Não estava no levantamento por leitura de código. Só apareceu ao rodar o Playwright em 390 px depois do primeiro deploy: o overflow horizontal do `/simulacoes` e do relatório vinha daí.

**Correção (03/09):** `flex-col` abaixo de `md`, `md:flex-row` acima. Verificado com screenshot: overflow zero nas 14 telas capturadas.

---

## 1. Bloqueantes (a tela quebra)

### 1.1 O painel rola de lado e corta o conteúdo

**Onde:** `calculadora/src/components/dashboard/dashboard-charts.tsx:39`

```tsx
<div className="w-full max-w-4xl space-y-6 mt-8">
```

`max-w-4xl` é 896 px. A tela do iPhone tem 390 px. O container do gráfico nunca encolhe abaixo de 896 px, então a página inteira ganha rolagem horizontal. É exatamente o que aparece nas fotos 2 e 3: as abas "Redução X INSS / Cliente X INSS / Data X INSS" continuam para fora da tela, o card fica cortado no meio e o dedo tem que arrastar de lado para ler.

O `dashboard/page.tsx:64` até define `max-w-5xl px-4`, mas o filho de 896 px estoura o pai.

**Correção:** trocar por `w-full space-y-6 mt-8` e deixar o pai controlar a largura.

### 1.2 As três abas não cabem lado a lado

**Onde:** `dashboard-charts.tsx:41-70`

As três abas são `flex-1` numa linha só, cada uma com `px-4` e texto `text-sm`. Em 390 px isso dá menos de 100 px úteis por aba, e "Redução X INSS" quebra em duas linhas com altura desigual (visível na foto 3).

**Correção:** rolagem horizontal só na régua de abas (`overflow-x-auto` + `snap`) com rótulos curtos no celular ("Redução", "Cliente", "Data") e o rótulo completo a partir de `sm:`.

### 1.3 A pizza fica ilegível

**Onde:** `dashboard-charts.tsx:75-95`

Três defeitos somados, todos visíveis na foto 2:

- `outerRadius={100}` é fixo. Com o container estourado, a pizza é desenhada num espaço maior que a viewport e sai cortada nas laterais (as duas fatias aparecem como um bloco chapado, sem forma de círculo).
- O `label` escreve o nome inteiro da fatia por fora ("Economia Gerada 62%"). Em 390 px o texto sai da área de desenho e é cortado. Some com a porcentagem, que é o dado que importa.
- A `Legend` embaixo quebra em três linhas e come a altura de 300 px reservada ao gráfico, empurrando o desenho para cima.

**Correção:** raio responsivo (percentual, `outerRadius="70%"`), rótulo só com a porcentagem dentro da fatia no celular, e legenda em duas colunas com fonte menor.

### 1.4 O tooltip do gráfico vaza para fora da tela

**Onde:** `dashboard-charts.tsx:96` (o `<Tooltip>` sem `wrapperStyle`)

Na foto 2, a caixa "Economia Gerada : R$ 1..." é cortada no meio, o valor não aparece. Como no celular o toque é o único jeito de ver o número, o gráfico deixa de informar. Precisa de `allowEscapeViewBox={{ x: false }}` e largura máxima.

### 1.5 A tabela de simulações força 900 px

**Onde:** `calculadora/src/app/simulacoes/page.tsx:225`

```tsx
<table className="w-full min-w-[900px] text-sm">
```

Tem `overflow-x-auto` no pai (linha 224), então não estoura a página, mas no celular vira uma tabela que só se lê arrastando, sem indicação de que há mais colunas. É a tela de Relatórios, uma das oito do menu.

**Correção:** virar lista de cartões abaixo de `md:` (um cartão por simulação: cliente, INSS devido, economia, data, ação) e manter a tabela só no desktop.

### 1.6 O simulador esconde o resultado no celular

**Onde:** `calculadora/src/app/simulador-obra-predial/page.tsx:19` e `_components/summary-panel.tsx:15`

```tsx
<div className="flex h-screen w-full flex-col lg:flex-row">
...
<aside className="flex h-screen flex-col ... lg:w-[340px]">
```

Abaixo de `lg` o painel de resumo vira uma segunda coluna empilhada **com `h-screen` própria**. Ou seja: o formulário ocupa uma tela cheia e o resultado (INSS devido, economia, botão Salvar) fica uma tela inteira abaixo, sem nenhuma pista de que existe. O usuário calcula e não vê o número.

Esse é o pior dos seis, porque é a ferramenta principal do produto.

**Correção:** no celular o resumo vira uma barra fixa no rodapé com o número principal, que abre em folha (sheet) ao toque, no padrão de `docs/auditoria-mobile-ios.md` do monorepo. `h-screen` só a partir de `lg:`.

---

## 2. Graves (usável, mas errado)

### 2.1 Falta o `viewport` do Next

**Onde:** `calculadora/src/app/layout.tsx` (não existe o export)

Sem `export const viewport`, o app não declara `viewportFit: "cover"` nem `themeColor`. Consequências no iPhone: a barra do Safari não pega a cor da marca e o conteúdo não respeita a área segura embaixo (o indicador de home fica por cima do conteúdo, visível na foto 1, onde "Sair" encosta na borda).

### 2.2 Menu lateral sem área segura

**Onde:** `calculadora/src/components/layout/sidebar.tsx:120-124` e o rodapé em `:263`

O `<aside>` usa `h-screen` puro. No iOS, `100vh` é maior que a área visível quando a barra do navegador está presente, então "Configurações" e "Sair" ficam parcialmente atrás da barra inferior do Safari. Confere com a foto 1: os dois itens estão colados no limite e o "Sair" está meio encoberto.

**Correção:** `h-[100dvh]` e `pb-[env(safe-area-inset-bottom)]` no rodapé.

### 2.3 Oito itens de menu, seis são "em breve"

**Onde:** `sidebar.tsx:21-67`

Contando os destinos: de 24 links do menu, **18 apontam para `/em-breve/...`**. Planejamento inteiro (3 de 3), Cálculos inteiro (5 de 5), Documentos inteiro (4 de 4) e Clientes são telas vazias. Só funcionam: Obra Predial, Simulador IBS/CBS, Desconto IRPF e Relatórios.

No desktop passa, porque o cadeado aparece ao lado. No celular o menu ocupa a tela inteira (foto 1) e o cliente abre item por item para descobrir que não tem nada. Isso é problema de percepção de produto, não só de layout.

**Correção:** ou agrupar os indisponíveis numa seção "Em breve" no fim do menu, ou marcar visualmente no item pai (badge com a contagem do que está pronto).

### 2.4 A área de toque dos itens é menor que o mínimo

**Onde:** `sidebar.tsx:186` (`py-2` nos módulos) e `:238` (`py-1.5` nos subitens)

`py-1.5` com `text-xs` dá cerca de 30 px de altura. O mínimo da Apple é 44 px. Os subitens do menu (Obra Predial, GFIP, etc.) são difíceis de acertar com o polegar.

### 2.5 Tabelas sem wrapper de rolagem

**Onde:**
- `calculadora/src/app/simulacoes/[id]/page.tsx:146` e `:161` (Dados utilizados, Resultado tributário)
- `calculadora/src/app/calculadora-reducao-irpf/irpf-client.tsx:228`, `:257`, `:285` (três tabelas de faixas)
- `calculadora/src/app/simulador-reforma-tributaria/page.tsx:268`, `:302`, `:337`

Todas com `w-full` e sem `overflow-x-auto` no pai. Cada linha tem valores em Real, que no celular não quebram bem: "R$ 101.886,51 – R$ 158.400,00" numa célula de 100 px. O texto espreme ou empurra a tabela para fora.

**Correção:** wrapper `overflow-x-auto` em todas, e nas de duas colunas (`[id]/page.tsx`) trocar por lista de pares rótulo/valor no celular.

### 2.6 O simulador tem `h-screen` aninhado

**Onde:** `simulador-obra-predial/page.tsx:19` combinado com `layout.tsx:44`

O `<body>` já é `flex h-full min-h-screen` e a coluna principal é `md:h-screen md:overflow-y-auto`. O simulador abre outro `h-screen` dentro. No iOS isso produz rolagem dupla: o conteúdo rola dentro de uma caixa que também rola. É o efeito de "travar" ao arrastar.

---

## 3. Acabamento

### 3.1 O gráfico usa uma paleta que não é da marca

**Onde:** `dashboard-charts.tsx:20` e `:120`, `:140`

```tsx
const COLORS = ["#f59e0b", "#d97706", "#b45309", "#78350f", "#451a03"];
```

Laranja âmbar e, nas barras, `#002D62` (azul-marinho) com título `text-[#002D62]`. A marca é verde pinho (`#1b3629`, `#2e5240`) e off-white, como o resto do painel. Nas fotos 2 e 3 o card do gráfico parece de outro sistema. O `font-serif` do título também destoa: o app usa Manrope e Oswald (`layout.tsx:6-17`), serifa não está no tema.

### 3.2 O rodapé do painel repete o óbvio

**Onde:** `dashboard/page.tsx:151`

"Métricas consolidadas com base nas 3 simulações salvas no sistema." O card de cima já diz "3 — memórias de cálculo geradas". No celular essa linha ocupa duas linhas de altura para não dizer nada de novo.

### 3.3 A saudação capitaliza errado

**Onde:** `dashboard/page.tsx:72`

`username.split("@")[0]` com capitalização manual. Para `vinicius` sai "Vinicius" (foto 4, correto), mas para um login como `maria.silva` sai "Maria.silva". Vale tratar o ponto e o hífen.

### 3.4 Os atalhos ficam apertados em duas colunas

**Onde:** `dashboard/page.tsx:127`

`grid-cols-2` com `text-xs` e rótulos como "Reforma Tributária" e "Simulações salvas": o texto quebra em duas linhas e os quatro cartões ficam com alturas diferentes. Uma régua horizontal deslizante resolveria melhor.

### 3.5 Não existe estado vazio de verdade

**Onde:** `dashboard-charts.tsx:73`, `:110`, `:131`

"Nenhum dado disponível" em cinza, centralizado. Para um cliente que acabou de entrar, o painel inteiro é isso. Cabe um convite para a primeira simulação, com o botão.

---

## Resumo por arquivo

| Arquivo | Itens |
|---|---|
| `components/dashboard/dashboard-charts.tsx` | 1.1, 1.2, 1.3, 1.4, 3.1, 3.5 |
| `components/layout/sidebar.tsx` | 2.2, 2.3, 2.4 |
| `app/simulador-obra-predial/page.tsx` + `summary-panel.tsx` | 1.6, 2.6 |
| `app/simulacoes/page.tsx` | 1.5 |
| `app/simulacoes/[id]/page.tsx` | 2.5 |
| `app/calculadora-reducao-irpf/irpf-client.tsx` | 2.5 |
| `app/simulador-reforma-tributaria/page.tsx` | 2.5 |
| `app/layout.tsx` | 2.1 |
| `app/dashboard/page.tsx` | 3.2, 3.3, 3.4 |

## Ordem sugerida de execução

1. **1.6** (o resultado do simulador escondido) — é a ferramenta que o cliente paga para usar.
2. **1.1 a 1.4** (o painel inteiro) — é a primeira tela depois do login.
3. **2.1 e 2.2** (viewport e área segura) — duas linhas de código, arruma o enquadramento em todas as telas.
4. **1.5 e 2.5** (tabelas).
5. **2.3 e 2.4** (menu).
6. **3.x** (acabamento), junto com a próxima alteração de cada arquivo.
