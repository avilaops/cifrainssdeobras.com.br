export type TipoCalculo = 'mensal' | 'anual';
export type ModeloDeclaracao = 'legais' | 'simplificado';

export interface TabelaIRPFItem {
  id?: string;
  ano?: number;
  tipo: string;
  faixaInicio: number;
  faixaFim: number | null;
  aliquota: number;
  deducao: number;
}

export interface RegraReducaoIRPFItem {
  id?: string;
  ano?: number;
  tipo: string;
  faixaInicio: number;
  faixaFim: number;
  valorBaseSubtracao: number;
  multiplicadorRenda: number;
}

export interface ParametrosImpostosData {
  limiteSimplificadoMensal: number;
  limiteSimplificadoAnual: number;
}

export interface IRPFInput {
  tipoCalculo: TipoCalculo;
  salarioBruto: number;       // Mensal
  outrosDescontos: number;    // Mensal
  rendimentoAnual: number;    // Anual
  modelo: ModeloDeclaracao;   // Anual
  descontosLegais: number;    // Anual (quando modelo for 'legais')
}

export interface IRPFResult {
  tipoCalculo: TipoCalculo;
  rendimentoBruto: number;
  descontos: number;
  baseDeCalculo: number;
  irpfInicial: number;
  reducao: number;
  irpfFinal: number;
  isento: boolean;
  aliquotaEfetiva: number;
}

/**
 * Engine oficial de cálculo de IRPF com Redução (Lei 15.270/2025).
 */
export function calcularIRPF(
  input: IRPFInput,
  tabelasIrpf: TabelaIRPFItem[],
  regrasReducao: RegraReducaoIRPFItem[],
  parametros: ParametrosImpostosData
): IRPFResult {
  let rendimentoBruto = 0;
  let descontos = 0;
  let baseDeCalculo = 0;
  let irpfInicial = 0;
  let reducao = 0;
  let irpfFinal = 0;

  const tipoDb = input.tipoCalculo === 'mensal' ? 'MENSAL' : 'ANUAL';
  const tabelasValidas = tabelasIrpf.filter(t => t.tipo === tipoDb);
  const regrasValidas = regrasReducao.filter(r => r.tipo === tipoDb);

  if (input.tipoCalculo === 'mensal') {
    rendimentoBruto = input.salarioBruto;
    const descSimples = Math.min(rendimentoBruto * 0.20, parametros.limiteSimplificadoMensal);
    descontos = Math.max(input.outrosDescontos, descSimples);
    baseDeCalculo = Math.max(0, rendimentoBruto - descontos);
  } else {
    rendimentoBruto = input.rendimentoAnual;
    if (input.modelo === 'simplificado') {
      descontos = Math.min(rendimentoBruto * 0.20, parametros.limiteSimplificadoAnual);
    } else {
      descontos = input.descontosLegais;
    }
    baseDeCalculo = Math.max(0, rendimentoBruto - descontos);
  }

  // Achar faixa da tabela IRPF
  const faixa = tabelasValidas.find(t => 
    baseDeCalculo >= t.faixaInicio && (t.faixaFim === null || baseDeCalculo <= t.faixaFim)
  ) || tabelasValidas[tabelasValidas.length - 1];

  if (faixa) {
    irpfInicial = Math.max(0, (baseDeCalculo * faixa.aliquota) - faixa.deducao);
  }

  // Achar regra de redução
  const regra = regrasValidas.find(r => rendimentoBruto > r.faixaInicio && rendimentoBruto <= r.faixaFim);
  
  if (rendimentoBruto <= (regrasValidas[0]?.faixaInicio || 0)) {
    reducao = irpfInicial;
  } else if (regra) {
    const reducaoCalc = regra.valorBaseSubtracao - (regra.multiplicadorRenda * rendimentoBruto);
    reducao = Math.min(Math.max(0, reducaoCalc), irpfInicial);
  }

  irpfFinal = Math.max(0, irpfInicial - reducao);

  return {
    tipoCalculo: input.tipoCalculo,
    rendimentoBruto,
    descontos,
    baseDeCalculo,
    irpfInicial,
    reducao,
    irpfFinal,
    isento: irpfFinal === 0,
    aliquotaEfetiva: rendimentoBruto > 0 ? irpfFinal / rendimentoBruto : 0
  };
}
