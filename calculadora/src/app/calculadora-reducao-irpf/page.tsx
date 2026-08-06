import IRPFClient from "./irpf-client";

export default async function IRPFPage() {
  const ano = 2026;

  // Fallback data oficial (Lei 15.270/2025)
  const parametros = {
    id: 'fallback', ano,
    limiteSimplificadoMensal: 607.20,
    limiteSimplificadoAnual: 17640.00,
    valorDependenteMensal: 189.59,
    valorDependenteAnual: 2275.08,
    limiteEducacaoAnual: 3561.50
  };

  const tabelasIrpf = [
    { id: '1', ano, tipo: 'MENSAL', faixaInicio: 0, faixaFim: 2428.80, aliquota: 0, deducao: 0 },
    { id: '2', ano, tipo: 'MENSAL', faixaInicio: 2428.81, faixaFim: 2826.65, aliquota: 0.075, deducao: 182.16 },
    { id: '3', ano, tipo: 'MENSAL', faixaInicio: 2826.66, faixaFim: 3751.05, aliquota: 0.15, deducao: 394.16 },
    { id: '4', ano, tipo: 'MENSAL', faixaInicio: 3751.06, faixaFim: 4664.68, aliquota: 0.225, deducao: 675.49 },
    { id: '5', ano, tipo: 'MENSAL', faixaInicio: 4664.69, faixaFim: null, aliquota: 0.275, deducao: 908.73 },
    { id: '6', ano, tipo: 'ANUAL', faixaInicio: 0, faixaFim: 29145.60, aliquota: 0, deducao: 0 },
    { id: '7', ano, tipo: 'ANUAL', faixaInicio: 29145.61, faixaFim: 33919.80, aliquota: 0.075, deducao: 2185.92 },
    { id: '8', ano, tipo: 'ANUAL', faixaInicio: 33919.81, faixaFim: 45012.60, aliquota: 0.15, deducao: 4729.91 },
    { id: '9', ano, tipo: 'ANUAL', faixaInicio: 45012.61, faixaFim: 55976.16, aliquota: 0.225, deducao: 8105.85 },
    { id: '10', ano, tipo: 'ANUAL', faixaInicio: 55976.17, faixaFim: null, aliquota: 0.275, deducao: 10904.66 }
  ];

  const tabelasInss = [
    { id: '1', ano, faixaInicio: 0, faixaFim: 1621.00, aliquota: 0.075, deducao: 0 },
    { id: '2', ano, faixaInicio: 1621.01, faixaFim: 2920.84, aliquota: 0.09, deducao: 22.77 },
    { id: '3', ano, faixaInicio: 2920.85, faixaFim: 4354.27, aliquota: 0.12, deducao: 106.59 },
    { id: '4', ano, faixaInicio: 4354.28, faixaFim: 8475.55, aliquota: 0.14, deducao: 190.40 }
  ];

  const regrasReducao = [
    { id: '1', ano, tipo: 'MENSAL', faixaInicio: 5000.01, faixaFim: 7350.00, valorBaseSubtracao: 978.62, multiplicadorRenda: 0.133145 },
    { id: '2', ano, tipo: 'ANUAL', faixaInicio: 60000.01, faixaFim: 88200.00, valorBaseSubtracao: 8429.73, multiplicadorRenda: 0.095575 }
  ];

  return (
    <IRPFClient 
      ano={ano}
      tabelasIrpf={tabelasIrpf}
      tabelasInss={tabelasInss}
      regrasReducao={regrasReducao}
      parametros={parametros}
    />
  );
}
