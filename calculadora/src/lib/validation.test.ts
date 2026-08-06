import { describe, expect, it } from "vitest";
import { normalizeTelefone, leadFormSchema } from "./validations";

const valid = {
  nome: "Cliente Teste",
  telefone: "(11) 99999-0000",
  email: "cliente@example.com",
  cidade: "São Paulo",
  estado: "SP",
  tipoCliente: "Proprietário",
  situacaoObra: "Ainda não iniciada",
  tipoObra: "Residencial unifamiliar",
  area: "150",
  origem: "Google",
  dataInicio: "2025-01-01",
  dataConclusao: "2026-01-01",
  aceitePrivacidade: true,
};

describe("validação de formulário", () => {
  it("normaliza telefone para somente dígitos", () => {
    expect(normalizeTelefone(valid.telefone)).toBe("11999990000");
  });

  it("valida formulário de lead válido", () => {
    const res = leadFormSchema.parse(valid);
    expect(res.estado).toBe("SP");
    expect(res.nome).toBe("Cliente Teste");
  });

  it("rejeita e-mail inválido", () => {
    expect(() => leadFormSchema.parse({ ...valid, email: "invalido" })).toThrow();
  });
});
