import { z } from "zod";

const nonNegative = z.number().finite().min(0);

export const simulacaoSchema = z
  .object({
    nomeCliente: z.string().trim().min(2).max(120),
    telefone: z.string().trim().max(30).optional().default(""),
    email: z.union([z.literal(""), z.string().trim().email().max(160)]).optional().default(""),
    responsavel: z.enum(["pf", "pj"]),
    uf: z.string().trim().length(2).transform((value) => value.toUpperCase()),
    tipo: z.enum([
      "residencial", "multifamiliar", "comercial", "industrial", "reforma", "demolicao",
      "piscina", "mista", "pavimentacao", "terraplenagem", "obraArte", "drenagem", "naoPredial",
    ]),
    material: z.enum(["ALVENARIA", "MADEIRA", "MISTA"]).optional().default("ALVENARIA"),
    preMoldado: z.boolean().optional().default(false),
    areaConstrucao: nonNegative,
    areaReforma: nonNegative,
    areaDemolicao: nonNegative,
    areaPiscina: nonNegative,
    concretoUsinado: z.boolean(),
    dataInicio: z.string().date(),
    dataFim: z.string().date(),
    vauManual: nonNegative.optional(),
    percHonorarios: z.number().finite().min(0).max(1),
    competenciaVau: z.string().trim().max(7).optional().default(""),
    observacoes: z.string().trim().max(2000).optional().default(""),
  })
  .superRefine((data, ctx) => {
    const area = data.areaConstrucao + data.areaReforma + data.areaDemolicao + data.areaPiscina;
    if (area <= 0) ctx.addIssue({ code: "custom", message: "Informe ao menos uma área maior que zero." });
    if (new Date(data.dataFim) < new Date(data.dataInicio)) {
      ctx.addIssue({ code: "custom", path: ["dataFim"], message: "A data final deve ser posterior à data inicial." });
    }
  });

export function normalizeTelefone(value: string) {
  return value.replace(/\D/g, "");
}
