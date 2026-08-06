import { z } from "zod";
import {
  ORIGENS,
  SITUACOES_OBRA,
  TIPOS_CLIENTE,
  TIPOS_OBRA,
  UFS,
} from "../types/lead";
import { onlyDigits } from "./utils";

const obrigatorio = "Campo obrigatório.";
const selecioneUmaOpcao = "Selecione uma opção.";

export function normalizeTelefone(tel: string): string {
  return onlyDigits(tel);
}

/** Aceita "150", "150,5", "1.250,75" ou "1250.75" e exige valor positivo. */
const numeroPositivo = (value: string) => {
  const normalized = value.trim().replace(/\./g, "").replace(",", ".");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) && parsed > 0;
};

export const simulacaoSchema = z.object({
  nomeCliente: z.string().trim().min(2, "Informe o nome do cliente."),
  telefone: z.string().trim().min(1, obrigatorio),
  email: z.string().trim().email("Informe um e-mail válido.").or(z.literal("")),
  responsavel: z.enum(["pf", "pj"], { message: selecioneUmaOpcao }),
  uf: z.string().trim().transform((val) => val.toUpperCase()),
  tipo: z.enum([
    "residencial",
    "multifamiliar",
    "comercial",
    "industrial",
    "reforma",
    "demolicao",
    "piscina",
    "mista",
    "pavimentacao",
    "terraplenagem",
    "obraArte",
    "drenagem",
    "naoPredial",
  ]),
  material: z.enum(["alvenaria", "madeira", "mista"]).optional(),
  preMoldado: z.boolean().optional(),
  areaConstrucao: z.number().min(0),
  areaReforma: z.number().min(0).default(0),
  areaDemolicao: z.number().min(0).default(0),
  areaPiscina: z.number().min(0).default(0),
  concretoUsinado: z.boolean().default(false),
  dataInicio: z.string().min(1),
  dataFim: z.string().min(1),
  vauManual: z.number().min(0).optional(),
  percHonorarios: z.number().min(0).max(1).default(0.3),
  competenciaVau: z.string().optional(),
  observacoes: z.string().optional(),
});

export type SimulacaoSchemaValues = z.infer<typeof simulacaoSchema>;

export const leadFormSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(3, "Informe seu nome completo.")
    .max(120, "Nome muito longo."),

  telefone: z
    .string()
    .trim()
    .min(1, obrigatorio)
    .refine((v) => {
      const digits = onlyDigits(v);
      return digits.length === 10 || digits.length === 11;
    }, "Informe um telefone válido com DDD, ex.: (11) 91234-5678."),

  email: z
    .string()
    .trim()
    .email("Informe um e-mail válido.")
    .optional()
    .or(z.literal("")),

  cidade: z
    .string()
    .trim()
    .min(2, "Informe sua cidade.")
    .max(80, "Cidade muito longa."),

  estado: z.enum(UFS, { message: "Selecione o estado." }),

  tipoCliente: z.enum(TIPOS_CLIENTE, {
    message: selecioneUmaOpcao,
  }),

  situacaoObra: z.enum(SITUACOES_OBRA, {
    message: selecioneUmaOpcao,
  }),

  tipoObra: z.enum(TIPOS_OBRA, {
    message: selecioneUmaOpcao,
  }),

  area: z
    .string()
    .trim()
    .min(1, "Informe a área do projeto em m².")
    .refine(numeroPositivo, "Informe um número válido, ex.: 250"),

  origem: z.enum(ORIGENS, {
    message: selecioneUmaOpcao,
  }),

  dataInicio: z
    .string()
    .trim()
    .min(1, "Informe o mês/ano de início da obra.")
    .max(20, "Data muito longa."),
  dataConclusao: z
    .string()
    .trim()
    .min(1, "Informe o mês/ano previsto de conclusão da obra.")
    .max(20, "Data muito longa."),

  valorInss: z
    .string()
    .trim()
    .max(30, "Valor muito longo.")
    .optional()
    .refine(
      (v) => v === undefined || v === "" || numeroPositivo(v),
      "Informe um valor válido, ex.: 25.000,00",
    ),

  observacoes: z
    .string()
    .trim()
    .max(600, "Máximo de 600 caracteres.")
    .optional(),

  aceitePrivacidade: z
    .boolean()
    .refine(
      (v) => v === true,
      "É necessário aceitar a Política de Privacidade para continuar.",
    ),

  /** Honeypot anti-spam: deve permanecer vazio (humanos não veem o campo). */
  website: z.string().max(0, "Falha na validação.").optional().or(z.literal("")),
});

export type LeadFormValues = z.infer<typeof leadFormSchema>;
