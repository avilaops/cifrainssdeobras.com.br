/**
 * GTM/GA4 via Google Tag Manager. Carregam apenas depois do consentimento de
 * analytics (LGPD) , o gate de consentimento é quem decide, não a ausência de
 * configuração.
 *
 * O container GTM-56HK6D2Q foi criado pelo TagFlow (cliente `cifra`) e já
 * publica a configuração do GA4 G-LSCEE28XTZ. O ID vem embutido como padrão
 * porque `.env*` não é versionado: com o valor só no `.env` local, um build
 * feito em outra máquina publicaria o site sem medição nenhuma. Ele é público
 * , vai no HTML de qualquer jeito , e a variável continua sobrepondo.
 *
 * O Pixel segue só por variável: existem dois IDs em circulação para a CIFRA
 * (4179531978973222 no `.env.local` do site e 1318231299817845 no registro do
 * TagFlow) e embutir o errado mandaria conversão para a conta errada.
 */
export const ANALYTICS_CONFIG = {
  gtmId: process.env.NEXT_PUBLIC_GTM_ID ?? "GTM-56HK6D2Q",
  metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "",
} as const;

export const IS_GTM_CONFIGURED = /^GTM-[A-Z0-9]+$/.test(
  ANALYTICS_CONFIG.gtmId,
);

export const IS_META_PIXEL_CONFIGURED = /^\d{10,20}$/.test(
  ANALYTICS_CONFIG.metaPixelId,
);
