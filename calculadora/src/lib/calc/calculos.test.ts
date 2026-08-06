import { describe, expect, it } from "vitest";
import { calcularINSS } from "./calculos";

describe("motor de cálculo (IN RFB 2.021/2021)", () => {
  it("valida cálculo oficial do espelho Ciccarelli (158,25 m², VAU R$ 2.410,53)", () => {
    const input = {
      responsavel: "pf" as const,
      uf: "SP",
      tipo: "residencial" as const,
      areaConstrucao: 158.25,
      areaReforma: 0,
      areaDemolicao: 0,
      areaPiscina: 0,
      concretoUsinado: false,
      dataInicio: "2026-08-01",
      dataFim: "2027-08-01",
      vauManual: 2410.53,
      percHonorarios: 0.3,
    };

    const res = calcularINSS(input);
    expect(res.areaEquivalente).toBeCloseTo(140.84, 2);
    expect(res.codTotal).toBeCloseTo(339499.05, 1);
    expect(res.fatorSocial).toBe(0.4);
    expect(res.codComFatorSocial).toBeCloseTo(135799.62, 1);
    expect(res.rmtTotal).toBeCloseTo(27159.92, 1);
    expect(res.inssDevido).toBeCloseTo(9994.85, 1);
    expect(res.rmtMinimaDctfweb).toBeCloseTo(13579.96, 1);
    expect(res.inssComReducao).toBeCloseTo(2715.99, 1);
    expect(res.economiaImposto).toBeCloseTo(7178.86, 1);
  });

  it("não aplica fator social nem ajuste em obra não predial", () => {
    const input = {
      responsavel: "pf" as const,
      uf: "SP",
      tipo: "pavimentacao" as const,
      areaConstrucao: 1000,
      areaReforma: 0,
      areaDemolicao: 0,
      areaPiscina: 0,
      concretoUsinado: false,
      dataInicio: "2025-01-01",
      dataFim: "2025-12-01",
      vauManual: 100,
      percHonorarios: 0.3,
    };

    const res = calcularINSS(input);
    expect(res.fatorSocial).toBe(1);
    expect(res.podeAjuste).toBe(false);
    expect(res.inssComReducao).toBe(res.inssDevido);
  });

  it("reduz em 5% apenas o COD da construção com concreto usinado", () => {
    const base = {
      responsavel: "pf" as const,
      uf: "SP",
      tipo: "residencial" as const,
      areaConstrucao: 100,
      areaReforma: 0,
      areaDemolicao: 0,
      areaPiscina: 0,
      concretoUsinado: false,
      dataInicio: "2025-01-01",
      dataFim: "2027-01-01",
      vauManual: 2000,
      percHonorarios: 0.3,
    };

    const normal = calcularINSS(base);
    const concrete = calcularINSS({ ...base, concretoUsinado: true });
    expect(concrete.codTotal).toBeCloseTo(normal.codTotal * 0.95);
  });
});
