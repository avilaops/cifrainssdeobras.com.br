/**
 * Motor de cálculo INSS de Obra (Aferição Indireta - SERO / Receita Federal).
 * Base Legal: IN RFB nº 2.021/2021.
 * 
 * Regra Oficial:
 * 1. Área de Equivalência = Área Total × % Equivalência por Tipo (arredondado em 2 casas decimais)
 * 2. COD = Área de Equivalência × VAU (-5% se Concreto Usinado)
 * 3. COD com Fator Social = COD × Fator Social (tabela progressiva PF)
 * 4. RMT = COD com Fator Social × 20% (alíquota de mão de obra)
 * 5. INSS Devido (Sem Planejamento) = RMT × 36.80% (alíquota total de aferição indireta)
 * 6. Fator de Ajuste (Com Planejamento / DCTFWeb):
 *    - RMT Mínima exigida em DCTFWeb = RMT × 50% (obras ≤ 350m²) ou 70% (obras > 350m²)
 *    - INSS com Fator de Ajuste = RMT Mínima × 20% (alíquota patronal)
 */
import {
  type TipoObraKey,
  MULT_TIPO,
  PERCENTUAL_EQUIVALENCIA,
  PERCENTUAL_RMT_NAO_PREDIAL,
  TIPO_OBRA_VAU,
  getFatorSocial,
  getReducaoFatorAjuste,
  getVAU,
  isObraNaoPredial,
  mesesEntreDatas,
  mesesEntreDatasRaw,
} from "./dados";

/** Alíquota total INSS obras na Aferição Indireta (Patronal 20% + Empregado ~9% + Terceiros ~7,8%). */
export const ALIQUOTA_INSS = 0.368;

/** Alíquota Patronal devida no Fator de Ajuste via DCTFWeb. */
export const ALIQUOTA_PATRONAL = 0.20;

export interface SimulacaoInput {
  responsavel: "pf" | "pj";
  uf: string;
  tipo: TipoObraKey;
  material?: string;
  preMoldado?: boolean;
  areaConstrucao: number;
  areaReforma: number;
  areaDemolicao: number;
  areaPiscina: number;
  concretoUsinado: boolean;
  dataInicio: string;
  dataFim: string;
  vauManual?: number;
  percHonorarios: number;
}

export interface ItemMemoriaCalculoMensal {
  competencia: string;
  remuneracaoAtualizada: number;
  remuneracaoOriginal: number;
  cpp20: number;
  multa20: number;
  selicPercent: number;
  jurosSelic: number;
  totalDevidoMes: number;
}

export interface SimulacaoResultado {
  vauUsado: number;
  areaTotal: number;
  areaEquivalente: number;
  fatorSocial: number;
  codTotal: number;
  codComFatorSocial: number;
  rmtTotal: number;
  inssBruto: number;
  inssDevido: number;
  podeAjuste: boolean;
  minPercentDctfweb: number;
  rmtMinimaDctfweb: number;
  inssMinimoDctfweb: number;
  reducaoPercent: number;
  inssComReducao: number;
  economiaImposto: number;
  honorarios: number;
  economiaLiq: number;
  retroativo: number;
  futuro: number;
  mesesFuturos: number;
  mesesRetro: number;
  multaMaed: number;
  parcelaMensal: number;
  fatorCorrecaoSero: number;
  retroativoCorrigido: number;
  inssDevidoCorrigido: number;
  qtdParcelasEcacDevido: number;
  valorParcelaEcacDevido: number;
  qtdParcelasEcacAjustado: number;
  valorParcelaEcacAjustado: number;
  memoriaCalculoMensal: ItemMemoriaCalculoMensal[];
}

function round2(num: number): number {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

export interface DbParametros {
  percentualUsinado: number;
  preMoldadoMenor40: number;
  preMoldadoMaior40: number;
}

export interface DbRegras {
  minPercentDctfwebAte350: number; // usually 0.50
  minPercentDctfwebMais350: number; // usually 0.70
}

/** VAU oficial (e-CAC/Receita) para a UF+competência da simulação, por coluna da tabela (ver TIPO_OBRA_VAU). */
export type DbVau = Partial<Record<string, number>>;

/** Taxas SELIC Acumuladas por Competência ("MM/YYYY" -> taxaPercent). */
export type DbSelic = Record<string, number>;

function resolveVau(p: SimulacaoInput, tipo: TipoObraKey, dbVau: DbVau | undefined): number {
  const coluna = TIPO_OBRA_VAU[tipo];
  if (dbVau) {
    if (coluna && dbVau[coluna] !== undefined) {
      return dbVau[coluna]!;
    }
    const baseDb = dbVau["RESIDENCIAL_UNIFAMILIAR"] ?? Object.values(dbVau)[0];
    if (baseDb !== undefined) {
      const mult = MULT_TIPO[tipo] ?? 1;
      return Math.round(baseDb * mult);
    }
  }
  return getVAU(p.uf, tipo, p.material);
}

export function calcularINSS(
  p: SimulacaoInput,
  dbParam?: DbParametros,
  dbRegras?: DbRegras,
  dbVau?: DbVau,
  dbSeroFator?: number,
  dbSelic?: DbSelic
): SimulacaoResultado {
  const hoje = new Date();

  const vauManual = p.vauManual ?? 0;
  const vau = vauManual > 0 ? vauManual : resolveVau(p, p.tipo, dbVau);
  const vauReforma = vauManual > 0 ? vauManual * 0.55 : resolveVau(p, "reforma", dbVau);
  const vauDemolicao = vauManual > 0 ? vauManual * 0.3 : resolveVau(p, "demolicao", dbVau);
  const vauPiscina = vauManual > 0 ? vauManual * 0.9 : resolveVau(p, "piscina", dbVau);

  const areaConstrucao = p.areaConstrucao || 0;
  const areaReforma = p.areaReforma || 0;
  const areaDemolicao = p.areaDemolicao || 0;
  const areaPiscina = p.areaPiscina || 0;
  const areaTotal = round2(areaConstrucao + areaReforma + areaDemolicao + areaPiscina);

  // 1. Percentual de Equivalência e Área Equivalente por Destinação (SERO arredonda a área equivalente em 2 casas)
  const percEquivConstrucao = PERCENTUAL_EQUIVALENCIA[p.tipo] ?? 0.89;
  const percEquivReforma = PERCENTUAL_EQUIVALENCIA.reforma ?? 1.0;
  const percEquivDemolicao = PERCENTUAL_EQUIVALENCIA.demolicao ?? 1.0;
  const percEquivPiscina = PERCENTUAL_EQUIVALENCIA.piscina ?? 1.0;

  let areaEquivTotal = 0;
  areaEquivTotal += round2(areaConstrucao * percEquivConstrucao);
  areaEquivTotal += round2(areaReforma * percEquivReforma);
  areaEquivTotal += round2(areaDemolicao * percEquivDemolicao);
  areaEquivTotal += round2(areaPiscina * percEquivPiscina);
  const areaEquivalente = round2(areaEquivTotal);

  // 2. COD - Custo da Obra por Destinação (-5% se uso de concreto usinado)
  const percentualUsinado = dbParam ? dbParam.percentualUsinado : 0.05;
  const multiplicadorUsinado = p.concretoUsinado ? (1 - percentualUsinado) : 1;
  const codTotal = round2(areaEquivalente * vau * multiplicadorUsinado);

  // 3. Fator Social (apenas Pessoa Física em Obras Prediais)
  const fatorSocial = p.responsavel === "pf" && !isObraNaoPredial(p.tipo) ? getFatorSocial(areaTotal) : 1.0;
  const codComFatorSocial = round2(codTotal * fatorSocial);

  // 4. RMT (Remuneração da Mão de Obra Total)
  const percMO = PERCENTUAL_RMT_NAO_PREDIAL[p.tipo] ?? 0.20; // 20% para obras prediais (IN 2.021/2021)
  const rmtTotal = round2(codComFatorSocial * percMO);

  // 5. INSS Devido Sem Planejamento (Aferição Indireta = RMT x 36.80%)
  const inssBruto = round2(rmtTotal * ALIQUOTA_INSS);
  const inssDevido = inssBruto;

  // 6. Fator de Ajuste (Art. 33 IN 2.021/2021)
  const podeAjuste = p.responsavel === "pf" && !isObraNaoPredial(p.tipo);
  
  let minPercentDctfweb = 0;
  if (podeAjuste) {
    if (dbRegras) {
      minPercentDctfweb = areaTotal <= 350 ? dbRegras.minPercentDctfwebAte350 : dbRegras.minPercentDctfwebMais350;
    } else {
      minPercentDctfweb = getReducaoFatorAjuste(areaTotal);
    }
  }
  const rmtMinimaDctfweb = round2(rmtTotal * minPercentDctfweb);
  
  // INSS no Fator de Ajuste = RMT Mínima x 20% (alíquota patronal)
  const inssMinimoDctfweb = podeAjuste ? round2(rmtMinimaDctfweb * ALIQUOTA_PATRONAL) : inssDevido;
  const inssComReducao = inssMinimoDctfweb;

  // 7. Multa MAED (Atraso DCTFWeb) e Parcelamento
  const dataInicio = p.dataInicio;
  const dataFim = p.dataFim;
  const hojeStr = hoje.toISOString().slice(0, 10);

  const diffRetro = mesesEntreDatasRaw(dataInicio, hojeStr);
  const mesesRetro = Math.max(0, diffRetro);
  const multaMaed = podeAjuste ? mesesRetro * 100 : 0;
  
  const diffFuturo = mesesEntreDatasRaw(hojeStr, dataFim);
  const mesesFuturos = Math.max(0, diffFuturo);
  const mesesTotal = Math.max(1, mesesEntreDatas(dataInicio, dataFim));

  const proporcaoRetro = Math.min(1, mesesRetro / mesesTotal);
  const proporcaoFuturo = 1 - proporcaoRetro;

  const retroativo = round2(inssComReducao * proporcaoRetro);
  const futuro = round2(inssComReducao * proporcaoFuturo);
  const parcelaMensal = mesesFuturos > 0 ? round2(futuro / mesesFuturos) : 0;

  // 8. Correção Monetária SERO (via banco de dados)
  const fatorCorrecaoSero = dbSeroFator ?? 0;
  const retroativoCorrigido = round2(retroativo * (1 + fatorCorrecaoSero));
  const inssDevidoCorrigido = round2(inssDevido * (1 + fatorCorrecaoSero));

  // 9. Economia Gerada (O custo total com planejamento é INSS + MAED)
  const economiaImposto = round2(inssDevido - (inssComReducao + multaMaed));
  const reducaoPercent = inssDevido > 0 ? (economiaImposto / inssDevido) * 100 : 0;
  const honorarios = round2(economiaImposto * (p.percHonorarios ?? 0.30));
  const economiaLiq = round2(economiaImposto - honorarios);

  // 10. Parcelamento e-CAC (Receita Federal — até 60 parcelas mensais, mínimo R$100 PF / R$500 PJ)
  const minParcela = p.responsavel === "pf" ? 100 : 500;

  const qtdParcelasEcacDevido = inssDevido > 0 ? Math.min(60, Math.max(1, Math.floor(inssDevido / minParcela))) : 1;
  const valorParcelaEcacDevido = round2(inssDevido / qtdParcelasEcacDevido);

  const qtdParcelasEcacAjustado = inssComReducao > 0 ? Math.min(60, Math.max(1, Math.floor(inssComReducao / minParcela))) : 1;
  const valorParcelaEcacAjustado = round2(inssComReducao / qtdParcelasEcacAjustado);

  // 11. Memória de Cálculo Mensal Detalhada (Mês a Mês: RMT, CPP 20%, Multa 20%, SELIC Acumulada)
  const memoriaCalculoMensal: ItemMemoriaCalculoMensal[] = [];
  const dInicio = new Date(p.dataInicio);
  const dFim = new Date(p.dataFim);

  const mesesContados = Math.max(1, mesesEntreDatas(p.dataInicio, p.dataFim));
  const rmtPorMesAtualizada = round2(rmtTotal / mesesContados);
  const fatorCorr = dbSeroFator ?? 0;
  const rmtPorMesOriginal = fatorCorr > 0 ? round2(rmtPorMesAtualizada / (1 + fatorCorr)) : rmtPorMesAtualizada;

  for (let d = new Date(dInicio); d <= dFim; d.setMonth(d.getMonth() + 1)) {
    const mes = new Date(d);
    const mStr = String(mes.getUTCMonth() + 1).padStart(2, "0");
    const yStr = mes.getUTCFullYear();
    const comp = `${mStr}/${yStr}`;

    const selicPercent = dbSelic?.[comp] ?? 0;
    const cpp20 = round2(rmtPorMesOriginal * 0.20);
    const multa20 = round2(cpp20 * 0.20);
    const jurosSelic = round2(cpp20 * (selicPercent / 100));
    const totalDevidoMes = round2(cpp20 + multa20 + jurosSelic);

    memoriaCalculoMensal.push({
      competencia: comp,
      remuneracaoAtualizada: rmtPorMesAtualizada,
      remuneracaoOriginal: rmtPorMesOriginal,
      cpp20,
      multa20,
      selicPercent,
      jurosSelic,
      totalDevidoMes,
    });
  }

  return {
    vauUsado: vau,
    areaTotal,
    areaEquivalente,
    fatorSocial,
    codTotal,
    codComFatorSocial,
    rmtTotal,
    inssBruto,
    inssDevido,
    podeAjuste,
    minPercentDctfweb,
    rmtMinimaDctfweb,
    inssMinimoDctfweb,
    reducaoPercent,
    inssComReducao,
    economiaImposto,
    honorarios,
    economiaLiq,
    retroativo,
    futuro,
    mesesFuturos,
    mesesRetro,
    multaMaed,
    parcelaMensal,
    fatorCorrecaoSero,
    retroativoCorrigido,
    inssDevidoCorrigido,
    qtdParcelasEcacDevido,
    valorParcelaEcacDevido,
    qtdParcelasEcacAjustado,
    valorParcelaEcacAjustado,
    memoriaCalculoMensal,
  };
}

export function brl(v: number): string {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function num(v: number, c = 2): string {
  return v.toLocaleString("pt-BR", { minimumFractionDigits: c, maximumFractionDigits: c });
}
