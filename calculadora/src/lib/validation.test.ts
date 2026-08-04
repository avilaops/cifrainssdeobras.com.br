import { describe, expect, it } from "vitest";
import { normalizeTelefone, simulacaoSchema } from "./validation";

const valid = { nomeCliente:"Cliente Teste", telefone:"(11) 99999-0000", email:"cliente@example.com", responsavel:"pf", uf:"sp", tipo:"residencial", areaConstrucao:100, areaReforma:0, areaDemolicao:0, areaPiscina:0, concretoUsinado:false, dataInicio:"2025-01-01", dataFim:"2026-01-01", vauManual:0, percHonorarios:0.3 };
describe("validação", () => {
  it("normaliza UF e telefone", () => { expect(simulacaoSchema.parse(valid).uf).toBe("SP"); expect(normalizeTelefone(valid.telefone)).toBe("11999990000"); });
  it("exige área positiva", () => { expect(() => simulacaoSchema.parse({ ...valid, areaConstrucao:0 })).toThrow(); });
  it("rejeita intervalo invertido e e-mail inválido", () => { expect(() => simulacaoSchema.parse({ ...valid, email:"invalido", dataFim:"2024-01-01" })).toThrow(); });
});
