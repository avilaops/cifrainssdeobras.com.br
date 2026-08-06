Essa calculadora de **Desconto do IRPF** precisa seguir duas etapas distintas:

1. calcular o IRPF pela tabela progressiva;
2. aplicar a redução criada pela Lei nº 15.270/2025.

Na tela, o termo **“Outros descontos”** está perigoso e genérico. Não se pode simplesmente fazer `salário bruto − qualquer desconto informado`.

## Cálculo mensal em 2026

Para um salário bruto de **R$ 3.000,00**, primeiro é definida a base do IRPF:

[
\text{Base do IRPF}
===================

## \text{rendimento tributável}

\text{deduções legais}
]

As deduções podem incluir, conforme o caso:

* contribuição ao INSS;
* dependentes;
* pensão alimentícia dedutível;
* previdência complementar dedutível;
* ou o desconto simplificado mensal.

Em 2026, o desconto simplificado mensal é de até **R$ 607,20** e substitui as deduções legais quando for mais vantajoso. ([Serviços e Informações do Brasil][1])

### Exemplo simplificado da tela

Salário bruto:

[
R$ 3.000,00
]

Considerando o desconto simplificado de R$ 607,20:

[
3.000 - 607,20 = R$ 2.392,80
]

A base fica abaixo de R$ 2.428,80, portanto o IRPF calculado pela tabela progressiva seria zero. Além disso, rendimentos mensais de até R$ 5.000,00 têm redução suficiente para zerar o imposto devido, desde janeiro de 2026. ([Serviços e Informações do Brasil][1])

**Resultado esperado para R$ 3.000,00:**

```text
Base estimada: R$ 2.392,80
IRPF antes da redução: R$ 0,00
Redução da Lei nº 15.270/2025: R$ 0,00
IRPF final: R$ 0,00
```

Mesmo que a calculadora use R$ 100,00 em “outros descontos”, o resultado final provavelmente continuará zerado para R$ 3.000,00, mas isso não significa que a estrutura esteja correta.

## Fórmula completa

### 1. Escolha da dedução

```text
dedução utilizada =
maior entre:

a) deduções legais permitidas
b) desconto simplificado de até R$ 607,20
```

Não se deve somar o desconto simplificado às deduções legais.

### 2. Base tributável

```text
base = salário bruto − dedução utilizada
```

### 3. IRPF pela tabela progressiva de 2026

| Base mensal                  | Alíquota | Parcela a deduzir |
| ---------------------------- | -------: | ----------------: |
| Até R$ 2.428,80              |       0% |           R$ 0,00 |
| De R$ 2.428,81 a R$ 2.826,65 |     7,5% |         R$ 182,16 |
| De R$ 2.826,66 a R$ 3.751,05 |      15% |         R$ 394,16 |
| De R$ 3.751,06 a R$ 4.664,68 |    22,5% |         R$ 675,49 |
| Acima de R$ 4.664,68         |    27,5% |         R$ 908,73 |

A tabela oficial está publicada pela Receita Federal. ([Serviços e Informações do Brasil][1])

```text
IRPF inicial =
(base × alíquota)
− parcela a deduzir
```

### 4. Redução da Lei nº 15.270/2025

A redução considera os **rendimentos tributáveis mensais**, e não a base já reduzida pelas deduções.

Para rendimentos de até R$ 5.000,00:

```text
redução = limitada ao valor do imposto calculado
resultado final = zero
```

De R$ 5.000,01 até R$ 7.350,00:

```text
redução =
978,62 − (0,133145 × rendimento tributável mensal)
```

A redução não pode ultrapassar o IRPF inicialmente apurado.

Acima de R$ 7.350,00:

```text
redução = R$ 0,00
```

Essa fórmula e esses limites são os utilizados pela Receita Federal para 2026. ([Serviços e Informações do Brasil][1])

## O que eu mudaria na tela

Em vez de apenas:

> Outros descontos

usaria:

* Salário ou rendimento tributável;
* Contribuição ao INSS;
* Número de dependentes;
* Pensão alimentícia dedutível;
* Previdência complementar dedutível;
* Outras deduções legalmente permitidas;
* Aplicar desconto simplificado automaticamente;
* Tipo de cálculo: mensal ou anual.

A calculadora deveria comparar automaticamente:

```text
deduções legais × desconto simplificado
```

e escolher a alternativa mais vantajosa.

Também mudaria o título para:

> **Calculadora de redução do IRPF — Lei nº 15.270/2025**

“Desconto IRPF” pode dar a impressão de que qualquer despesa informada diminui diretamente o imposto, o que não é correto.

[1]: https://www.gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda/tabelas/2026?utm_source=chatgpt.com "Tributação de 2026 — Receita Federal - Portal Gov.br"

Para o cálculo **anual**, os dois modelos mudam somente a forma de determinar a **base tributável**. Depois disso, a tabela progressiva anual e a redução da Lei nº 15.270/2025 são aplicadas da mesma forma.

## 1. Modelo: Deduções legais

A base é:

[
\text{Base tributável}
======================

## \text{rendimento anual tributável}

\text{deduções legais}
]

A tela deve abrir campos específicos, por exemplo:

* contribuição ao INSS;
* número de dependentes;
* despesas médicas dedutíveis;
* despesas com educação;
* pensão alimentícia judicial;
* previdência complementar dedutível;
* livro-caixa, quando aplicável.

Para 2026, a dedução anual por dependente é de **R$ 2.275,08**, e a despesa com instrução possui limite anual de **R$ 3.561,50 por pessoa**. Despesas médicas dedutíveis, quando válidas e comprovadas, não seguem esse mesmo limite da educação. ([Serviços e Informações do Brasil][1])

Exemplo:

```text
Rendimento anual:             R$ 70.000,00
INSS:                         R$ 7.000,00
1 dependente:                 R$ 2.275,08
Educação dedutível:           R$ 3.000,00
Despesas médicas:             R$ 2.000,00
------------------------------------------------
Total de deduções legais:     R$ 14.275,08
Base tributável:              R$ 55.724,92
```

## 2. Modelo: Simplificado

No modelo simplificado, não são informadas individualmente as despesas. A calculadora aplica:

[
\text{Desconto simplificado}
============================

20% \times \text{rendimentos tributáveis}
]

limitado, no ano-calendário de 2026, a:

[
\boxed{R$ 17.640,00}
]

A Receita Federal publica esse valor como limite anual do desconto simplificado para a declaração do exercício de 2027, relativa aos rendimentos de 2026. ([Serviços e Informações do Brasil][1])

Exemplo com renda anual de R$ 70.000:

[
70.000 \times 20% = 14.000
]

Como R$ 14.000 está abaixo do limite de R$ 17.640:

[
\text{Base tributável}=70.000-14.000=56.000
]

Para uma renda anual de R$ 100.000:

[
100.000 \times 20%=20.000
]

Como ultrapassa o limite:

[
\text{Desconto utilizado}=17.640
]

[
\text{Base tributável}=100.000-17.640=82.360
]

## 3. Aplicação da tabela anual

Depois de encontrar a base tributável, aplica-se a tabela progressiva anual de 2026:

| Base tributável anual       | Alíquota | Parcela a deduzir |
| --------------------------- | -------: | ----------------: |
| Até R$ 29.145,60            |       0% |           R$ 0,00 |
| R$ 29.145,61 a R$ 33.919,80 |     7,5% |       R$ 2.185,92 |
| R$ 33.919,81 a R$ 45.012,60 |      15% |       R$ 4.729,91 |
| R$ 45.012,61 a R$ 55.976,16 |    22,5% |       R$ 8.105,85 |
| Acima de R$ 55.976,16       |    27,5% |      R$ 10.904,66 |

([Serviços e Informações do Brasil][1])

A fórmula é:

[
\text{IRPF apurado}
===================

## (\text{base tributável}\times\text{alíquota})

\text{parcela a deduzir}
]

## 4. Redução anual da Lei nº 15.270/2025

A redução é calculada com base no **rendimento tributável anual**, e não na base após as deduções.

### Até R$ 60.000 por ano

A redução é limitada ao imposto apurado, de modo que o resultado final seja zero:

[
\text{IRPF final}=0
]

### De R$ 60.000,01 a R$ 88.200

[
\text{Redução}
==============

## 8.429,73

(0,095575 \times \text{rendimento tributável anual})
]

### Acima de R$ 88.200

[
\text{Redução}=0
]

A redução nunca pode superar o imposto inicialmente calculado. ([Presidência da República][2])

## Comparação entre os dois modelos

Usando o exemplo de R$ 70.000 anuais:

### Deduções legais

```text
Deduções legais: R$ 14.275,08
Base: R$ 55.724,92
IR antes da redução:
55.724,92 × 22,5% − 8.105,85
= R$ 4.432,26
```

### Simplificado

```text
Desconto simplificado: R$ 14.000,00
Base: R$ 56.000,00
IR antes da redução:
56.000 × 27,5% − 10.904,66
= R$ 4.495,34
```

Redução anual:

[
8.429,73-(0,095575\times70.000)
]

[
=R$1.739,48
]

Resultados:

```text
Deduções legais:
R$ 4.432,26 − R$ 1.739,48
= R$ 2.692,78

Simplificado:
R$ 4.495,34 − R$ 1.739,48
= R$ 2.755,86
```

Nesse exemplo, **deduções legais seriam mais vantajosas**.

## Como a tela deveria funcionar

Ao selecionar **Deduções legais**, exibir os campos detalhados das deduções.

Ao selecionar **Simplificado**, não exibir campos de despesas. Mostrar apenas:

```text
Desconto simplificado:
20% do rendimento tributável,
limitado a R$ 17.640,00
```

Idealmente, a calculadora não deveria exigir que o usuário escolha antecipadamente. Ela pode calcular os dois cenários e apresentar:

```text
Modelo pelas deduções legais: R$ X
Modelo simplificado:          R$ Y

Opção mais vantajosa: Deduções legais
Economia estimada:            R$ Z
```

Essa comparação automática é mais segura e replica a lógica do programa da declaração da Receita, que compara as duas formas de tributação. ([Serviços e Informações do Brasil][3])

[1]: https://www.gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda/tabelas/2026 "Tributação de 2026 — Receita Federal"
[2]: https://www.planalto.gov.br/ccivil_03/leis/l9250.htm "L9250"
[3]: https://www.gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda/preenchimento/manual-mir/resumo?utm_source=chatgpt.com "Resumo — Receita Federal - Portal Gov.br"
