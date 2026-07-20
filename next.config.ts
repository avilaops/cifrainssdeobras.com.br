import type { NextConfig } from "next";

/**
 * Deploy: GitHub Pages (static export).
 *
 * Com domínio próprio (cifrainssdeobras.com.br) o site é servido na raiz e
 * NENHUM basePath é necessário. Se precisar publicar temporariamente em
 * https://avilaops.github.io/cifra (sem domínio próprio), defina a variável
 * NEXT_PUBLIC_BASE_PATH=/cifra no build.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    // Obrigatório em static export: não há servidor de otimização de imagens.
    unoptimized: true,
  },
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
};

export default nextConfig;
