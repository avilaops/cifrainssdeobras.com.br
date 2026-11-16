/**
 * Google usa a configuração gerenciada em public/measurement e a permissão
 * analytics da CMP existente. Esta configuração preserva o Pixel separado.
 *
 * O Pixel segue só por variável: existem dois IDs em circulação para a CIFRA
 * (4179531978973222 no `.env.local` do site e 1318231299817845 no registro do
 * TagFlow) e embutir o errado mandaria conversão para a conta errada.
 */
export const ANALYTICS_CONFIG = {
  metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "",
} as const;

export const IS_META_PIXEL_CONFIGURED = /^\d{10,20}$/.test(
  ANALYTICS_CONFIG.metaPixelId,
);
