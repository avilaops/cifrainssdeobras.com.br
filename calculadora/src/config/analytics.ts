/**
 * GTM/GA4 via Google Tag Manager. Carregam apenas depois do consentimento de
 * analytics (LGPD) — o gate de consentimento é quem decide, não a ausência de
 * configuração.
 *
 * Mesmo container do site principal (GTM-56HK6D2Q, cliente `cifra` no
 * TagFlow): a calculadora é uma etapa da mesma jornada, e separar containers
 * quebraria a sessão entre visitar o site e simular a obra. Ele já publica a
 * configuração do GA4 G-LSCEE28XTZ.
 */
export const ANALYTICS_CONFIG = {
  gtmId: process.env.NEXT_PUBLIC_GTM_ID ?? "GTM-56HK6D2Q",
} as const;

export const IS_GTM_CONFIGURED = /^GTM-[A-Z0-9]+$/.test(
  ANALYTICS_CONFIG.gtmId,
);
