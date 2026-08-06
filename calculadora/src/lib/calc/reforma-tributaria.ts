export interface DadosReforma {
  tipoOperacao: string;
  usoResidencial: boolean; // Novo: para aluguéis
  valorOperacao: number;
  anoCbsIbs: string;
  redutorSocial: number; // Agora deve ser auto-calculado: max 600
  redutorAjuste: number; // Somente para alienação/incorporação
  outrasDeducoes: number; // Exclusões legais
  
  // Créditos separados por tributo
  creditosCbs: number;
  creditosIbs: number;
  
  informarAliquotaEfetiva: boolean;
}

export interface ResultadoReformaTabela1 {
  nome: string;
  aliquota: number;
  reducao: number;
  aliquotaReduzida: number;
  debitoBruto: number;
}

export interface ResultadoReformaTabela2 {
  subtotalCbs: number;
  creditosCbs: number;
  cbsAPagar: number;
  
  subtotalIbs: number;
  creditosIbs: number;
  ibsAPagar: number;

  totalAPagar: number;
  aliquotaEfetiva: number;
}

export interface ResultadoReformaTabela3 {
  nome: string;
  aliquotas: number;
  comparativo27: number;
  comparativo28: number;
  comparativo29: number;
}

export interface ResultadoReforma {
  baseCalculo: number;
  tabela1: ResultadoReformaTabela1[];
  tabela1Total: Omit<ResultadoReformaTabela1, 'nome'>;
  tabela2: ResultadoReformaTabela2;
  tabela3: ResultadoReformaTabela3[];
  tabela3Total: Omit<ResultadoReformaTabela3, 'nome'>;
}

// Valores baseados no print
const ALIQUOTA_CBS_BASE = 0.0840; // 8.40%
const ALIQUOTA_IBS_ESTADUAL_BASE = 0.0005; // 0.05%
const ALIQUOTA_IBS_MUNICIPAL_BASE = 0.0005; // 0.05%
const REDUCAO_BASE = 0.70; // 70.00%

export function calcularReformaTributaria(dados: DadosReforma): ResultadoReforma {
  // 1. Redutor Social (Somente locação/cessão residencial, limite de R$ 600)
  const isAluguel = dados.tipoOperacao.includes('Aluguel') || dados.tipoOperacao.includes('locação');
  let redutorSocialAplicado = 0;
  if (isAluguel && dados.usoResidencial) {
    // Redutor máximo de 600, limitado ao valor da operação
    redutorSocialAplicado = Math.min(600, dados.valorOperacao);
  }

  // 2. Base de Cálculo do IBS/CBS
  // Redutor de Ajuste aplica-se normalmente a Alienação. Para aluguel deve vir 0 da UI.
  const baseCalculo = Math.max(0, dados.valorOperacao - redutorSocialAplicado - dados.redutorAjuste - dados.outrasDeducoes);

  // 3. Aplicação das Alíquotas (Débito Bruto)
  const calcImposto = (aliquotaBase: number, reducao: number) => {
    // Redução de 70% -> Aplica-se 30% da alíquota normal
    const aliquotaReduzida = aliquotaBase * (1 - reducao);
    const debitoBruto = baseCalculo * aliquotaReduzida;
    return { aliquota: aliquotaBase, reducao, aliquotaReduzida, debitoBruto };
  };

  const reducao = REDUCAO_BASE; 
  const cbs = calcImposto(ALIQUOTA_CBS_BASE, reducao);
  const ibsEst = calcImposto(ALIQUOTA_IBS_ESTADUAL_BASE, reducao);
  const ibsMun = calcImposto(ALIQUOTA_IBS_MUNICIPAL_BASE, reducao);

  const totalAliquota = cbs.aliquota + ibsEst.aliquota + ibsMun.aliquota;
  const totalAliquotaReduzida = cbs.aliquotaReduzida + ibsEst.aliquotaReduzida + ibsMun.aliquotaReduzida;
  const totalDebito = cbs.debitoBruto + ibsEst.debitoBruto + ibsMun.debitoBruto;

  const tabela1: ResultadoReformaTabela1[] = [
    { nome: 'CBS', ...cbs },
    { nome: 'IBS ESTADUAL', ...ibsEst },
    { nome: 'IBS MUNICIPAL', ...ibsMun },
  ];

  const tabela1Total = {
    aliquota: totalAliquota,
    reducao: reducao,
    aliquotaReduzida: totalAliquotaReduzida,
    debitoBruto: totalDebito,
  };

  // 4. Apuração Final (Tributo Líquido)
  const subtotalCbs = cbs.debitoBruto;
  const cbsAPagar = subtotalCbs - dados.creditosCbs;
  
  const subtotalIbs = ibsEst.debitoBruto + ibsMun.debitoBruto;
  const ibsAPagar = subtotalIbs - dados.creditosIbs;
  
  const totalAPagar = cbsAPagar + ibsAPagar;
  const aliquotaEfetiva = dados.valorOperacao > 0 ? (totalAPagar / dados.valorOperacao) : 0;

  const tabela2: ResultadoReformaTabela2 = {
    subtotalCbs,
    creditosCbs: dados.creditosCbs,
    cbsAPagar,
    subtotalIbs,
    creditosIbs: dados.creditosIbs,
    ibsAPagar,
    totalAPagar,
    aliquotaEfetiva,
  };

  // 4. Tabela 3 (Resumo das Alíquotas e Comparativos)
  // Valores estáticos por enquanto, baseados no print
  const tabela3: ResultadoReformaTabela3[] = [
    { nome: 'IRPJ', aliquotas: 0.05, comparativo27: 0.05, comparativo28: 0.05, comparativo29: 0.05 },
    { nome: 'CSLL', aliquotas: 0.05, comparativo27: 0.05, comparativo28: 0.05, comparativo29: 0.05 },
    // O valor do print para CBS/IBS é 3.65% (0.0365) - pode ser uma constante do ano
    { nome: 'CBS/IBS', aliquotas: 0.0365, comparativo27: 0.00, comparativo28: 0.00, comparativo29: 0.00 },
  ];

  const somaAliquotas = tabela3.reduce((acc, curr) => acc + curr.aliquotas, 0);
  const soma27 = tabela3.reduce((acc, curr) => acc + curr.comparativo27, 0);
  const soma28 = tabela3.reduce((acc, curr) => acc + curr.comparativo28, 0);
  const soma29 = tabela3.reduce((acc, curr) => acc + curr.comparativo29, 0);

  const tabela3Total = {
    aliquotas: somaAliquotas,
    comparativo27: soma27,
    comparativo28: soma28,
    comparativo29: soma29,
  };

  return {
    baseCalculo,
    tabela1,
    tabela1Total,
    tabela2,
    tabela3,
    tabela3Total
  };
}
