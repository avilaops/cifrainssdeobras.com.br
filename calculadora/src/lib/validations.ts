import { z } from "zod";
import {
  ORIGENS,
  SITUACOES_OBRA,
  TIPOS_CLIENTE,
  TIPOS_OBRA,
  UFS,
} from "@/types/lead";
import { onlyDigits } from "@/lib/utils";

const obrigatorio = "Campo obrigatório.";
const selecioneUmaOpcao = "Selecione uma opção.";

/** Aceita "150", "150,5", "1.250,75" ou "1250.75" e exige valor positivo. */
const numeroPositivo = (value: string) => {
  const normalized = value.trim().replace(/\./g, "").replace(",", ".");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) && parsed > 0;
};

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
