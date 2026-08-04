/**
 * calculos.js - Motor de calculo INSS de Obra (aferição indireta)
 * Base: IN RFB n 2.021/2021
 * Aliquota total verificada: 36.8% sobre RMT (patronal 20% + empregado ~9% + terceiros ~7.8%)
 */

/**
 * Percentual combinado (perc_destinação × perc_MO) por tipo de obra.
 * Verificado com dados reais do SERO jul/2026 SP:
 * - Comercial 330m²: RMT=104981 / (330×2642.22) = 12.04%
 * - Residencial 220m²: INSS=21038 → RMT=57168 / (220.18×VAU_res) ≈ 12%
 */
const PERC_COMBINED = {
  residencial:   0.1200,
  multifamiliar: 0.1150,
  comercial:     0.1204,
  industrial:    0.0780,
  reforma:       0.1480,
  demolicao:     0.1800,
  piscina:       0.1300,
  mista:         0.1202,
};

/** Aliquota total INSS obras (patronal + empregado + terceiros) */
const ALIQUOTA_INSS = 0.368;

/**
 * Calcula todos os valores da simulação de INSS de obra.
 */
function calcularINSS(p) {
  const hoje = new Date();

  const vau = p.vauManual > 0 ? p.vauManual : getVAU(p.uf, p.tipo);
  const vauReforma  = p.vauManual > 0 ? p.vauManual * 0.55 : getVAU(p.uf, 'reforma');
  const vauPiscina  = p.vauManual > 0 ? p.vauManual * 0.90 : getVAU(p.uf, 'piscina');

  const areaTotal = (p.areaConstrucao || 0) + (p.areaReforma || 0) + (p.areaPiscina || 0);

  // COD = Area × VAU (bruto, antes de qualquer fator)
  let codBrutoConstrucao = (p.areaConstrucao || 0) * vau;
  const codBrutoReforma  = (p.areaReforma   || 0) * vauReforma;
  const codBrutoPiscina  = (p.areaPiscina   || 0) * vauPiscina;

  // Deducao concreto usinado (-5% sobre COD de construcao)
  if (p.concretoUsinado) codBrutoConstrucao *= 0.95;

  // RMT = COD_bruto × perc_combined (perc_dest × perc_MO)
  const percC     = PERC_COMBINED[p.tipo] || PERC_COMBINED.residencial;
  const percReforma = PERC_COMBINED.reforma;
  const percPiscina = PERC_COMBINED.piscina;

  const rmtConstrucao = codBrutoConstrucao * percC;
  const rmtReforma    = codBrutoReforma    * percReforma;
  const rmtPiscina    = codBrutoPiscina    * percPiscina;
  const rmtTotal      = rmtConstrucao + rmtReforma + rmtPiscina;

  // COD total exibido = soma dos CODs brutos
  const codTotal = codBrutoConstrucao + codBrutoReforma + codBrutoPiscina;

  // INSS Bruto (sem qualquer redução)
  const inssBruto = rmtTotal * ALIQUOTA_INSS;

  // Fator Social (só PF)
  const fatorSocial = (p.responsavel === 'pf') ? getFatorSocial(areaTotal) : 1.0;
  const inssDevido  = inssBruto * fatorSocial;

  // Fator de Ajuste (só PF, art. 33 IN 2.021)
  const podeAjuste = p.responsavel === 'pf';
  const reducaoFA  = podeAjuste ? getReducaoFatorAjuste(areaTotal) : 0;
  const inssComReducao = podeAjuste ? inssDevido * (1 - reducaoFA) : inssDevido;

  // Economia
  const economiaImposto = inssDevido - inssComReducao;
  const honorarios      = economiaImposto * (p.percHonorarios || 0.30);
  const economiaLiq     = economiaImposto - honorarios;

  // Parcelamento
  const dataInicio = p.dataInicio;
  const dataFim    = p.dataFim;
  const hojeStr    = hoje.toISOString().slice(0, 10);

  const mesesRetro   = Math.max(0, mesesEntreDatas(dataInicio, hojeStr));
  const mesesFuturos = Math.max(0, mesesEntreDatas(hojeStr, dataFim));
  const mesesTotal   = Math.max(1, mesesEntreDatas(dataInicio, dataFim));

  const proporcaoRetro  = Math.min(1, mesesRetro / mesesTotal);
  const proporcaoFuturo = 1 - proporcaoRetro;

  const retroativo     = inssComReducao * proporcaoRetro;
  const futuro         = inssComReducao * proporcaoFuturo;
  const parcelaMensal  = mesesFuturos > 0 ? futuro / mesesFuturos : 0;

  return {
    vauUsado: vau, areaTotal, fatorSocial,
    codTotal, rmtTotal,
    inssBruto, inssDevido, inssComReducao,
    economiaImposto, honorarios, economiaLiq,
    reducaoPercent: reducaoFA * 100,
    retroativo, futuro, mesesFuturos, parcelaMensal,
    podeAjuste,
  };
}

function brl(v) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
function num(v, c = 2) {
  return v.toLocaleString('pt-BR', { minimumFractionDigits: c, maximumFractionDigits: c });
}
