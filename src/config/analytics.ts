/**
 * GTM/GA4 diretos (via Google Tag Manager), independentes do Tagflow.
 * Inertes por padrão — só carregam se NEXT_PUBLIC_GTM_ID estiver definido,
 * e mesmo assim apenas depois do consentimento de analytics (LGPD).
 */
export const ANALYTICS_CONFIG = {
  gtmId: process.env.NEXT_PUBLIC_GTM_ID ?? "",
  metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "",
} as const;

export const IS_GTM_CONFIGURED = /^GTM-[A-Z0-9]+$/.test(
  ANALYTICS_CONFIG.gtmId,
);

export const IS_META_PIXEL_CONFIGURED = /^\d{10,20}$/.test(
  ANALYTICS_CONFIG.metaPixelId,
);
