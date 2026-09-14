import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export const dynamic = "force-static";

interface RouteConfig {
  url: string;
  changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority: number;
}

const routes: RouteConfig[] = [
  { url: "", changeFrequency: "weekly", priority: 1.0 },
  { url: "/servicos/", changeFrequency: "weekly", priority: 0.9 },
  { url: "/servicos/inss-de-obra/", changeFrequency: "monthly", priority: 0.8 },
  { url: "/servicos/cno/", changeFrequency: "monthly", priority: 0.8 },
  { url: "/servicos/sero/", changeFrequency: "monthly", priority: 0.8 },
  { url: "/servicos/afericao-de-obra/", changeFrequency: "monthly", priority: 0.8 },
  { url: "/servicos/planejamento-tributario/", changeFrequency: "monthly", priority: 0.8 },
  { url: "/sobre/", changeFrequency: "monthly", priority: 0.7 },
  { url: "/parceiros/", changeFrequency: "monthly", priority: 0.7 },
  { url: "/contato/", changeFrequency: "monthly", priority: 0.7 },
  { url: "/procuracao-eletronica/", changeFrequency: "monthly", priority: 0.7 },
  { url: "/politica-de-privacidade/", changeFrequency: "yearly", priority: 0.3 },
  { url: "/termos-de-uso/", changeFrequency: "yearly", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastMod = new Date().toISOString();
  return routes.map((route) => ({
    url: `${siteConfig.url}${route.url}`,
    lastModified: lastMod,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
