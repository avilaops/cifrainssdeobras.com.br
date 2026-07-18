export const TAGFLOW_CONFIG = {
  enabled: process.env.NEXT_PUBLIC_TAGFLOW_ENABLED === "true",
  endpoint: process.env.NEXT_PUBLIC_TAGFLOW_ENDPOINT ?? "",
  siteId: process.env.NEXT_PUBLIC_TAGFLOW_SITE_ID ?? "cifra",
  debug: process.env.NEXT_PUBLIC_TAGFLOW_DEBUG === "true",
  siteDomain: "cifrainssdeobra.com.br",
  brand: "CIFRA",
  businessType: "consultoria_tributaria_de_obra",
} as const;

export const IS_TAGFLOW_CONFIGURED =
  TAGFLOW_CONFIG.enabled && /^https:\/\//.test(TAGFLOW_CONFIG.endpoint);
