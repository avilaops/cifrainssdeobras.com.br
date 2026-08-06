# Memória de Cálculo - Reforma Tributária (LCP 214)

Este documento traduz as regras da Lei Complementar nº 214/2025 para as fórmulas matemáticas aplicadas na Calculadora de Reforma Tributária da CIFRA.

## 1. Redutor Social (Uso Residencial)
A legislação estabelece um limite de redução na base de cálculo para aluguéis de uso residencial.

**Fórmula:**
`Redutor Social Aplicado = Min(600, Valor da Operação)`

**Condição no Código:**
O redutor só é aplicado se `TipoOperação` contiver "Aluguel" ou "locação" E a flag `usoResidencial` for verdadeira. O input livre do usuário foi removido para evitar erros (ex: usuário inserir R$ 1000).

## 2. Redutor de Ajuste
Aplica-se normalmente a alienação (venda) de imóveis e incorporação, refletindo o custo do bem (artigos relacionados à preservação do custo fiscal).

**Condição no Código:**
Se for "Aluguel", o `redutorAjuste` é forçado para R$ 0,00 no motor de cálculo, e a interface esconde o input correspondente.

## 3. Base de Cálculo (CBS e IBS)
A base tributável nunca pode ser negativa. Abatem-se da Receita Bruta apenas os redutores legais e outras deduções aplicáveis *antes* de calcular o imposto.

**Fórmula:**
`Base de Cálculo = Max(0, Valor Operação - Redutor Social Aplicado - Redutor Ajuste - Outras Deduções Legais)`

## 4. Aplicação das Alíquotas (Débito Bruto)
Para locação, cessão onerosa e arrendamento de imóveis, as alíquotas-padrão do IBS e da CBS recebem redução de 70%.

**Fórmula:**
`Débito Bruto CBS = Base de Cálculo * Alíquota Base CBS * (1 - 0.70)`
`Débito Bruto IBS = Base de Cálculo * Alíquota Base IBS * (1 - 0.70)`

*(Nota: a redução multiplica a alíquota por 0.30)*

## 5. Abatimento de Créditos Tributários
Os créditos não diminuem a base de cálculo (o que seria uma dedução incorreta que alteraria a progressividade). Eles são abatidos do **Débito Bruto** já calculado. A calculadora exige a separação dos créditos por tributo para evitar mesclas ilegais de CBS (União) com IBS (Estados/Municípios).

**Fórmulas:**
`CBS Líquido a Pagar = Débito Bruto CBS - Créditos Aproveitáveis CBS`
`IBS Líquido a Pagar = Débito Bruto IBS - Créditos Aproveitáveis IBS`

## 6. Carga Tributária Total e Efetiva
Representa a proporção do imposto realmente pago em relação ao montante bruto.

**Fórmula:**
`Total a Pagar = CBS Líquido a Pagar + IBS Líquido a Pagar`
`Alíquota Efetiva = Total a Pagar / Valor Operação`
