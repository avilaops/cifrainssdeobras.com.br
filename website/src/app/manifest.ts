import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CIFRA - Consultoria Tributária de Obra",
    short_name: "CIFRA",
    description: "Consultoria especializada em INSS e regularização tributária de obras.",
    start_url: `${basePath}/`,
    display: "standalone",
    background_color: "#f8faf6",
    theme_color: "#1f2919",
    icons: [
      { src: `${basePath}/web-app-manifest-192x192.png`, sizes: "192x192", type: "image/png" },
      { src: `${basePath}/web-app-manifest-512x512.png`, sizes: "512x512", type: "image/png" },
    ],
  };
}
