/**
 * Dados de contato da CIFRA.
 *
 * COMO EDITAR O NÚMERO DO WHATSAPP:
 * 1. Preferencial: defina NEXT_PUBLIC_WHATSAPP_NUMBER no ambiente de build
 *    (arquivo .env.local em desenvolvimento, ou "Secrets/Variables" no GitHub
 *    Actions) no formato internacional, somente dígitos: 55 + DDD + número.
 *    Exemplo: 5511999999999
 * 2. Alternativa rápida: substitua o fallback "55DDDNUMERO" abaixo.
 *
 * Enquanto o placeholder "55DDDNUMERO" estiver ativo, os botões de WhatsApp
 * continuam funcionando como links, mas apontam para um número inválido ,
 * o número nunca é exibido na interface.
 */
export const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "55DDDNUMERO";

/** true quando o número real (12–13 dígitos) foi configurado. */
export const IS_WHATSAPP_CONFIGURED = /^\d{12,13}$/.test(WHATSAPP_NUMBER);

/** E-mail comercial , se vazio, o site não exibe e-mail. */
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "";

/** Redes sociais , se vazias, os ícones não são exibidos. */
export const INSTAGRAM_URL = process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "";
export const FACEBOOK_URL = process.env.NEXT_PUBLIC_FACEBOOK_URL ?? "";
