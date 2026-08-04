/** Opções dos campos do formulário de análise inicial. */

export const TIPOS_CLIENTE = [
  "Proprietário",
  "Construtor",
  "Incorporadora",
  "Engenheiro",
  "Arquiteto",
  "Contador",
  "Empresa",
  "Outro",
] as const;
export type TipoCliente = (typeof TIPOS_CLIENTE)[number];

export const SITUACOES_OBRA = [
  "Ainda não iniciada",
  "Em andamento",
  "Concluída",
  "Aguardando regularização",
  "Já recebeu cálculo de INSS",
  "Precisa revisar uma aferição",
] as const;
export type SituacaoObra = (typeof SITUACOES_OBRA)[number];

export const TIPOS_OBRA = [
  "Residencial unifamiliar",
  "Residencial multifamiliar",
  "Comercial",
  "Industrial",
  "Reforma",
  "Ampliação",
  "Demolição",
  "Outro",
] as const;
export type TipoObra = (typeof TIPOS_OBRA)[number];

export const ORIGENS = [
  "Google",
  "Instagram",
  "Facebook",
  "Indicação",
  "WhatsApp",
  "Outro",
] as const;
export type Origem = (typeof ORIGENS)[number];

export const UFS = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS",
  "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC",
  "SP", "SE", "TO",
] as const;
export type UF = (typeof UFS)[number];

/** Dados do lead após validação (ver leadFormSchema em lib/validations). */
export interface Lead {
  nome: string;
  telefone: string;
  email?: string;
  cidade: string;
  estado: UF;
  tipoCliente: TipoCliente;
  situacaoObra: SituacaoObra;
  tipoObra: TipoObra;
  area: string;
  origem: Origem;
  dataInicio: string;
  dataConclusao: string;
  valorInss?: string;
  observacoes?: string;
}

/** Pré-preenchimento vindo da calculadora demonstrativa. */
export interface LeadPrefill {
  tipoObra?: TipoObra;
  situacaoObra?: SituacaoObra;
  area?: string;
  dataInicio?: string;
  dataConclusao?: string;
}

/** Chave usada no sessionStorage para transportar o pré-preenchimento. */
export const LEAD_PREFILL_STORAGE_KEY = "cifra-lead-prefill";
