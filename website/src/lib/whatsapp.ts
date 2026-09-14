import { WHATSAPP_NUMBER } from "@/config/contact";
import { siteConfig } from "@/config/site";
import type { LeadFormValues } from "@/lib/validations";

/** Mensagem padrão dos botões diretos de WhatsApp (fora do formulário). */
export const DEFAULT_WHATSAPP_MESSAGE =
  "Olá, equipe CIFRA! Gostaria de solicitar uma análise inicial da minha obra.";

/** Monta a URL wa.me com a mensagem codificada. */
export function buildWhatsAppUrl(
  message: string = DEFAULT_WHATSAPP_MESSAGE,
  number: string = WHATSAPP_NUMBER,
): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

const naoInformado = (value?: string) =>
  value && value.trim() !== "" ? value.trim() : "Não informado";

/** Organiza os dados validados do formulário na mensagem enviada à CIFRA. */
export function buildLeadMessage(lead: LeadFormValues): string {
  return [
    "Olá, equipe CIFRA! Gostaria de solicitar uma análise inicial da minha obra.",
    "",
    `Nome: ${lead.nome}`,
    `WhatsApp: ${lead.telefone}`,
    `Cidade/UF: ${lead.cidade}/${lead.estado}`,
    `Tipo de cliente: ${lead.tipoCliente}`,
    `Situação da obra: ${lead.situacaoObra}`,
    `Tipo da obra: ${lead.tipoObra}`,
    `Área do projeto: ${lead.area} m²`,
    `Início da obra: ${lead.dataInicio}`,
    `Conclusão da obra: ${lead.dataConclusao}`,
    `Valor de INSS apresentado: ${naoInformado(lead.valorInss)}`,
    `Como conheceu a CIFRA: ${lead.origem}`,
    `Observações: ${naoInformado(lead.observacoes)}`,
    "",
    `Página de origem: ${siteConfig.domain}`,
  ].join("\n");
}
