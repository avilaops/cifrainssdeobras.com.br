/**
 * Planejador mensal do Fator de Ajuste (art. 33, IN RFB 2.021/2021).
 * Calcula, mês a mês, o mínimo de remuneração a declarar no eSocial/DCTFWeb
 * para manter a elegibilidade ao Fator de Ajuste durante toda a obra.
 */
import { ALIQUOTA_INSS, type SimulacaoInput, type SimulacaoResultado } from "./calculos";
import { mesesEntreDatas } from "./dados";

export type StatusMes = "retroativo" | "atual" | "futuro";

export interface MesPlano {
  competencia: string; // "jan/2026"
  status: StatusMes;
  remuneracaoMinima: number;
  inssMes: number;
  acumulado: number;
}

export interface PlanoMensal {
  minPercent: number;
  mesesTotal: number;
  rmtMinMensal: number;
  inssMensal: number;
  meses: MesPlano[];
}

export function gerarPlanoMensal(input: SimulacaoInput, resultado: SimulacaoResultado): PlanoMensal {
  const minP = resultado.areaTotal <= 350 ? 0.5 : 0.7;
  const minPercent = resultado.podeAjuste ? minP : 0;
  const mesesTotal = Math.max(1, mesesEntreDatas(input.dataInicio, input.dataFim));
  const rmtMes = resultado.rmtTotal / mesesTotal;
  const rmtMinMensal = rmtMes * minPercent;
  const inssMensal = rmtMinMensal * ALIQUOTA_INSS;

  const inicio = new Date(input.dataInicio);
  const fim = new Date(input.dataFim);
  const hoje = new Date();

  const meses: MesPlano[] = [];
  let acumulado = 0;
  for (const d = new Date(inicio); d <= fim; d.setMonth(d.getMonth() + 1)) {
    const mes = new Date(d);
    const isPassado = mes < hoje && !(mes.getFullYear() === hoje.getFullYear() && mes.getMonth() === hoje.getMonth());
    const isAtual = mes.getFullYear() === hoje.getFullYear() && mes.getMonth() === hoje.getMonth();
    const status: StatusMes = isPassado ? "retroativo" : isAtual ? "atual" : "futuro";
    acumulado += inssMensal;
    meses.push({
      competencia: mes.toLocaleDateString("pt-BR", { month: "short", year: "numeric" }).replace(".", ""),
      status,
      remuneracaoMinima: rmtMinMensal,
      inssMes: inssMensal,
      acumulado,
    });
  }

  return { minPercent, mesesTotal, rmtMinMensal, inssMensal, meses };
}
