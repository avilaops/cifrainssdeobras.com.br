import { describe, expect, it } from "vitest";
import { calcularIRPF, IRPFInput } from "./irpf";

const mockTabelasIrpf = [
  { id: "1", ano: 2026, tipo: "MENSAL", faixaInicio: 0, faixaFim: 2259.20, aliquota: 0, deducao: 0 },
  { id: "2", ano: 2026, tipo: "MENSAL", faixaInicio: 2259.21, faixaFim: 2826.65, aliquota: 0.075, deducao: 169.44 },
  { id: "3", ano: 2026, tipo: "MENSAL", faixaInicio: 2826.66, faixaFim: 3751.05, aliquota: 0.15, deducao: 381.44 },
];

const mockRegrasReducao = [
  { id: "1", ano: 2026, tipo: "MENSAL", faixaInicio: 0, faixaFim: 5000, valorBaseSubtracao: 500, multiplicadorRenda: 0.1 },
];

const mockParametros = {
  id: "1",
  ano: 2026,
  limiteSimplificadoMensal: 564.80,
  limiteSimplificadoAnual: 16754.34,
  valorDependenteMensal: 189.59,
  valorDependenteAnual: 2275.08,
  limiteEducacaoAnual: 3561.50,
};

describe("engine IRPF (Lei 15.270/2025)", () => {
  it("calcula desconto simplificado mensal e aplicação de faixa", () => {
    const input: IRPFInput = {
      tipoCalculo: "mensal",
      salarioBruto: 3000,
      outrosDescontos: 0,
      rendimentoAnual: 0,
      modelo: "simplificado",
      descontosLegais: 0,
    };

    const res = calcularIRPF(input, mockTabelasIrpf, mockRegrasReducao, mockParametros);
    expect(res.rendimentoBruto).toBe(3000);
    expect(res.descontos).toBe(564.80);
    expect(res.baseDeCalculo).toBeCloseTo(2435.20, 2);
    expect(res.irpfInicial).toBeGreaterThan(0);
  });
});
