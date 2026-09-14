import type { NextConfig } from "next";

/**
 * CIFRA , Website Institucional (cifrainssdeobras.com.br)
 * Exportação estática para máxima performance e segurança.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  poweredByHeader: false,
  images: {
    unoptimized: true,
  },
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
};

export default nextConfig;
